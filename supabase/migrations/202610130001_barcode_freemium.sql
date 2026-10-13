-- Daily Toolkit Barcode Generator freemium/subscription schema.
-- Apply this migration manually to the Supabase project used for the PREVIEW environment only.
create extension if not exists pgcrypto;

create table if not exists public.barcode_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  free_used integer not null default 0 check (free_used >= 0 and free_used <= 50),
  paid_used integer not null default 0 check (paid_used >= 0 and paid_used <= 1000),
  paid_period_start timestamptz,
  paid_period_end timestamptz,
  subscription_status text not null default 'free'
    check (subscription_status in ('free','pending','active','payment_failed','cancelled')),
  safepay_sub_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.barcode_subscription_intents (
  reference text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,
  status text not null default 'pending'
    check (status in ('pending','active','payment_failed','cancelled')),
  safepay_sub_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.safepay_webhook_events (
  event_id text primary key,
  event_type text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  payload jsonb not null
);

alter table public.barcode_entitlements enable row level security;
alter table public.barcode_subscription_intents enable row level security;
alter table public.safepay_webhook_events enable row level security;
-- No client policies: all writes/reads happen through server endpoints using the service role.
revoke all on public.barcode_entitlements from anon, authenticated;
revoke all on public.barcode_subscription_intents from anon, authenticated;
revoke all on public.safepay_webhook_events from anon, authenticated;

create or replace function public.claim_barcode_generations(p_user_id uuid, p_count integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare e public.barcode_entitlements%rowtype;
declare remaining integer;
begin
  if p_count is null or p_count < 1 or p_count > 500 then
    raise exception 'invalid_generation_count' using errcode = '22023';
  end if;

  insert into public.barcode_entitlements(user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  select * into e from public.barcode_entitlements
  where user_id = p_user_id for update;

  if e.subscription_status = 'active'
     and e.paid_period_end is not null
     and e.paid_period_end > now() then
    if e.paid_period_start is null or e.paid_period_start <= now() - interval '1 month' then
      update public.barcode_entitlements
      set paid_used = 0, paid_period_start = now(),
          paid_period_end = now() + interval '1 month', updated_at = now()
      where user_id = p_user_id returning * into e;
    end if;
    if e.paid_used + p_count > 1000 then
      return jsonb_build_object('allowed',false,'reason','paid_quota_exceeded','used',e.paid_used,'limit',1000,'remaining',greatest(0,1000-e.paid_used));
    end if;
    update public.barcode_entitlements set paid_used = paid_used + p_count, updated_at = now()
      where user_id = p_user_id returning * into e;
    return jsonb_build_object('allowed',true,'tier','pro','used',e.paid_used,'limit',1000,'remaining',1000-e.paid_used);
  end if;

  if e.free_used + p_count > 50 then
    return jsonb_build_object('allowed',false,'reason','free_quota_exceeded','used',e.free_used,'limit',50,'remaining',greatest(0,50-e.free_used));
  end if;
  update public.barcode_entitlements set free_used = free_used + p_count, updated_at = now()
    where user_id = p_user_id returning * into e;
  return jsonb_build_object('allowed',true,'tier','free','used',e.free_used,'limit',50,'remaining',50-e.free_used);
end;
$$;

revoke all on function public.claim_barcode_generations(uuid, integer) from public, anon, authenticated;
grant execute on function public.claim_barcode_generations(uuid, integer) to service_role;
