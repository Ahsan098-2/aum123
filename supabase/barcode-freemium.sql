-- Apply in the Supabase SQL Editor for the preview project only.
-- Do not run against any production database until the preview has passed testing.

create table if not exists public.barcode_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  free_used integer not null default 0 check (free_used >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.barcode_subscriptions (
  reference text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,
  safepay_subscription_id text,
  amount_pkr integer not null default 499 check (amount_pkr = 499),
  status text not null default 'pending' check (status in ('pending','active','payment_failed','cancelled','ended')),
  period_start timestamptz,
  period_end timestamptz,
  last_transaction_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists barcode_subscriptions_user_status_idx
  on public.barcode_subscriptions(user_id, status, period_end desc);

create table if not exists public.barcode_monthly_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start timestamptz not null,
  used integer not null default 0 check (used >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, period_start)
);

create table if not exists public.safepay_webhook_events (
  event_id text primary key,
  event_type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);

alter table public.barcode_accounts enable row level security;
alter table public.barcode_subscriptions enable row level security;
alter table public.barcode_monthly_usage enable row level security;
alter table public.safepay_webhook_events enable row level security;
-- Intentionally no anon/authenticated policies. Browser clients cannot read/write quota or billing tables.
revoke all on public.barcode_accounts, public.barcode_subscriptions, public.barcode_monthly_usage, public.safepay_webhook_events from anon, authenticated;

create or replace function public.barcode_usage_status(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  a public.barcode_accounts%rowtype;
  s public.barcode_subscriptions%rowtype;
  m public.barcode_monthly_usage%rowtype;
  paid boolean := false;
  used_now integer := 0;
  limit_now integer := 50;
  left_now integer := 0;
  p_start timestamptz;
begin
  insert into public.barcode_accounts(user_id) values (p_user_id) on conflict (user_id) do nothing;
  select * into a from public.barcode_accounts where user_id = p_user_id;
  select * into s from public.barcode_subscriptions
   where user_id = p_user_id and status = 'active' and period_end > now()
   order by period_end desc limit 1;
  if found then
    paid := true;
    p_start := coalesce(s.period_start, date_trunc('month', now()));
    insert into public.barcode_monthly_usage(user_id, period_start) values (p_user_id, p_start)
      on conflict (user_id, period_start) do nothing;
    select * into m from public.barcode_monthly_usage where user_id = p_user_id and period_start = p_start;
    used_now := m.used;
    limit_now := 1000;
    left_now := greatest(0, limit_now - used_now);
  else
    used_now := a.free_used;
    limit_now := 50;
    left_now := greatest(0, limit_now - used_now);
  end if;
  return jsonb_build_object('authenticated', true, 'plan', case when paid then 'pro' else 'free' end,
    'used', used_now, 'limit', limit_now, 'remaining', left_now,
    'period_end', case when paid then s.period_end else null end);
end $$;

create or replace function public.consume_barcode_generations(p_user_id uuid, p_amount integer)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  a public.barcode_accounts%rowtype;
  s public.barcode_subscriptions%rowtype;
  m public.barcode_monthly_usage%rowtype;
  paid boolean := false;
  p_start timestamptz;
  used_now integer;
  limit_now integer;
  left_now integer;
begin
  if p_amount is null or p_amount < 1 or p_amount > 500 then
    raise exception 'amount must be between 1 and 500';
  end if;
  insert into public.barcode_accounts(user_id) values (p_user_id) on conflict (user_id) do nothing;
  select * into a from public.barcode_accounts where user_id = p_user_id for update;
  select * into s from public.barcode_subscriptions
   where user_id = p_user_id and status = 'active' and period_end > now()
   order by period_end desc limit 1;
  if found then
    paid := true;
    p_start := coalesce(s.period_start, date_trunc('month', now()));
    insert into public.barcode_monthly_usage(user_id, period_start) values (p_user_id, p_start)
      on conflict (user_id, period_start) do nothing;
    select * into m from public.barcode_monthly_usage where user_id = p_user_id and period_start = p_start for update;
    used_now := m.used;
    limit_now := 1000;
    left_now := greatest(0, limit_now - used_now);
    if p_amount > left_now then
      return jsonb_build_object('allowed', false, 'plan', 'pro', 'used', used_now, 'limit', limit_now, 'remaining', left_now);
    end if;
    update public.barcode_monthly_usage set used = used + p_amount, updated_at = now()
      where user_id = p_user_id and period_start = p_start returning used into used_now;
  else
    used_now := a.free_used;
    limit_now := 50;
    left_now := greatest(0, limit_now - used_now);
    if p_amount > left_now then
      return jsonb_build_object('allowed', false, 'plan', 'free', 'used', used_now, 'limit', limit_now, 'remaining', left_now);
    end if;
    update public.barcode_accounts set free_used = free_used + p_amount where user_id = p_user_id returning free_used into used_now;
  end if;
  return jsonb_build_object('allowed', true, 'plan', case when paid then 'pro' else 'free' end,
    'used', used_now, 'limit', limit_now, 'remaining', greatest(0, limit_now - used_now));
end $$;

create or replace function public.process_safepay_subscription_event(p_event_id text, p_event_type text, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  d jsonb := coalesce(p_payload->'data', '{}'::jsonb);
  ref text := coalesce(d->>'reference', p_payload->>'reference');
  sub_id text := coalesce(d->>'subscription_id', d->>'sub_id', d->>'id');
  p_start timestamptz;
  p_end timestamptz;
  txn text := coalesce(d->>'transaction_id', d->>'last_transaction_id');
  inserted_count integer;
begin
  if p_event_id is null or length(p_event_id) < 1 then raise exception 'missing event id'; end if;
  insert into public.safepay_webhook_events(event_id, event_type, payload)
  values (p_event_id, p_event_type, p_payload) on conflict (event_id) do nothing;
  get diagnostics inserted_count = row_count;
  if inserted_count = 0 then return jsonb_build_object('duplicate', true); end if;

  if d ? 'current_period_start_date' then
    p_start := to_timestamp(coalesce((d->'current_period_start_date'->>'seconds')::numeric, 0));
  end if;
  if d ? 'current_period_end_date' then
    p_end := to_timestamp(coalesce((d->'current_period_end_date'->>'seconds')::numeric, 0));
  end if;

  if p_event_type = 'subscription.created' then
    if ref is null then raise exception 'subscription.created missing reference'; end if;
    update public.barcode_subscriptions set
      safepay_subscription_id = coalesce(sub_id, safepay_subscription_id),
      status = 'pending', period_start = coalesce(p_start, period_start),
      period_end = coalesce(p_end, period_end), updated_at = now()
    where reference = ref;
    if not found then raise exception 'unknown subscription reference'; end if;
  elsif p_event_type = 'subscription.payment.succeeded' then
    if ref is null then raise exception 'subscription payment missing reference'; end if;
    update public.barcode_subscriptions set
      safepay_subscription_id = coalesce(sub_id, safepay_subscription_id),
      status = 'active', period_start = coalesce(p_start, period_start, now()),
      period_end = coalesce(p_end, period_end, now() + interval '1 month'),
      last_transaction_id = coalesce(txn, last_transaction_id), updated_at = now()
    where reference = ref;
    if not found then raise exception 'unknown subscription reference'; end if;
  elsif p_event_type = 'subscription.payment.failed' then
    if ref is null then raise exception 'failed payment missing reference'; end if;
    update public.barcode_subscriptions set status = 'payment_failed',
      safepay_subscription_id = coalesce(sub_id, safepay_subscription_id), updated_at = now()
      where reference = ref;
    if not found then raise exception 'unknown subscription reference'; end if;
  elsif p_event_type in ('subscription.cancelled','subscription.canceled') then
    if ref is null then raise exception 'cancellation missing reference'; end if;
    update public.barcode_subscriptions set status = 'cancelled',
      safepay_subscription_id = coalesce(sub_id, safepay_subscription_id), updated_at = now()
      where reference = ref;
    if not found then raise exception 'unknown subscription reference'; end if;
  elsif p_event_type = 'subscription.ended' then
    if ref is not null then
      update public.barcode_subscriptions set status = 'ended', updated_at = now() where reference = ref;
    end if;
  end if;
  return jsonb_build_object('processed', true, 'event_type', p_event_type);
end $$;

revoke all on function public.barcode_usage_status(uuid) from public, anon, authenticated;
revoke all on function public.consume_barcode_generations(uuid, integer) from public, anon, authenticated;
revoke all on function public.process_safepay_subscription_event(text, text, jsonb) from public, anon, authenticated;
grant execute on function public.barcode_usage_status(uuid) to service_role;
grant execute on function public.consume_barcode_generations(uuid, integer) to service_role;
grant execute on function public.process_safepay_subscription_event(text, text, jsonb) to service_role;
