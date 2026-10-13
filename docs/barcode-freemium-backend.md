# Barcode Generator: secure freemium backend (preview branch only)

## Fixed offer
- Free: 50 barcode units per account (lifetime allowance).
- Pro: Rs 499/month, 1,000 barcode units per billing period.
- Safepay: Sandbox only until end-to-end tests pass and merchant live onboarding is completed.

## Current implementation status
This branch adds API endpoint code and a Supabase SQL migration. It is **not launch-ready yet**: the existing HTML still contains a localStorage prototype. Do not merge or advertise secure limits until the frontend is changed to sign in and reserve quota through these endpoints and all Sandbox webhook payload/signature details are verified against the actual Safepay dashboard.

## Architecture
- Vercel Node functions: `/api/barcode/config`, `/api/barcode/quota`, `/api/barcode/checkout`, `/api/webhooks/safepay`.
- Supabase Auth identifies the account using the bearer access token and `/auth/v1/user`.
- Supabase Postgres stores free usage, paid usage, subscription intents and webhook event IDs.
- `claim_barcode_generations` is a row-locked PostgreSQL function so simultaneous requests cannot overrun a quota.
- Only a verified webhook should activate an entitlement. Redirects are UX only.
- The current API reserves usage before generation; a failed generation can consume a unit. Add reservation/refund semantics or idempotency before public launch if required.

## Preview environment variables (Vercel Preview scope only)
Set these in Project Settings > Environment Variables and select **Preview**, not Production:
- `APP_URL` = exact Vercel preview origin (e.g. your current preview deployment URL)
- `BARCODE_ALLOWED_ORIGINS` = exact preview origin, comma-separated if multiple
- `SUPABASE_URL` = preview Supabase project URL
- `SUPABASE_ANON_KEY` = preview Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = preview-only service role secret; never expose to browser
- `SAFEPAY_ENV` = `sandbox`
- `SAFEPAY_HOST` = `https://sandbox.api.getsafepay.com`
- `SAFEPAY_CHECKOUT_HOST` = `https://sandbox.api.getsafepay.com`
- `SAFEPAY_SECRET_KEY` = Sandbox merchant server secret
- `SAFEPAY_WEBHOOK_SECRET` = Sandbox webhook HMAC secret
- `SAFEPAY_PLAN_ID` = monthly recurring Sandbox plan ID for PKR 499

Never put service-role keys or Safepay secrets in HTML, client JavaScript, Git, or Production variables for preview testing. Create a separate Supabase project for Preview; do not run this migration on Production.

## Database setup
1. Create a separate Supabase project for Preview.
2. In its SQL Editor, run `supabase/migrations/202610130001_barcode_freemium.sql`.
3. Confirm the tables and function exist; do not apply to the production database.
4. Enable email magic-link auth in Supabase Auth settings and configure its redirect URL to the exact Vercel Preview origin. Frontend login UI is still a required follow-up.

## Safepay Sandbox setup
1. Create/use a Safepay Sandbox merchant account.
2. In its Subscriptions dashboard, create a recurring plan: Rs 499 PKR, interval MONTH, interval_count 1, billing cycles indefinite.
3. Copy the plan ID and Sandbox server secret into **Preview-only** Vercel variables.
4. Register webhook URL `https://YOUR-PREVIEW-ORIGIN/api/webhooks/safepay` and subscribe to `subscription.created`, `subscription.payment.succeeded`, `subscription.payment.failed`, `subscription.cancelled`.
5. Verify actual webhook signature format and payload fields with a Sandbox test delivery before granting access. Safepay docs can differ by API/webhook version; this handler accepts raw-body HMAC and timestamp + dot + raw-body HMAC variants, but must be tested against the configured version.
6. Verify whether Safepay sends the merchant `reference` back in each subscription event; the app must persist and correlate the reference before redirect.

## API contract
- `GET /api/barcode/config`: public pricing and setup status.
- `GET /api/barcode/quota`: requires `Authorization: Bearer <Supabase access token>`.
- `POST /api/barcode/quota`: requires auth and JSON `{ "count": 1..500 }`; atomically reserves units.
- `POST /api/barcode/checkout`: requires auth; returns a hosted Sandbox checkout URL.
- `POST /api/webhooks/safepay`: raw body, signature verification, unique event ID and webhook-driven entitlement update.

## Required frontend follow-up before merge
- Replace localStorage counter and click interceptors with Supabase Auth UI and calls to `/api/barcode/quota`.
- Require a valid session before reserving usage; for each single barcode reserve 1, for bulk/labels reserve the number of valid outputs before generating/printing/downloading.
- If quota endpoint returns 402, show upgrade card and call checkout endpoint only after the user clicks.
- Redirect to returned checkout URL. Success/cancel query strings must only show status; they must never unlock access.
- Refresh entitlement from server after redirect/login.
- Handle network failure by failing closed: do not generate without a successful quota reservation.
- Add rate limiting, CSRF/origin policy review, request idempotency, webhook event retry/reconciliation, subscription renewal period logic, cancellation semantics and logging before production.
- Verify all event names, payload fields, amount/currency/plan and reference association from actual Safepay Sandbox events. Do not trust a client-supplied user ID.

## Acceptance tests
1. Unauthenticated quota and checkout requests return 401.
2. New account can reserve exactly 50 lifetime free units; unit 51 is rejected.
3. Concurrent requests cannot exceed 50.
4. Bulk count > 500 and count <= 0 are rejected.
5. Active paid subscription can reserve exactly 1,000 units in its current billing period; unit 1,001 is rejected.
6. Invalid signature returns 401 and does not write entitlements.
7. Replayed webhook event ID is idempotently acknowledged.
8. Only verified successful subscription payment grants Pro; redirects alone do not.
9. Failed renewal/cancellation removes paid access according to the documented business policy.
10. Test a second device/browser and reset localStorage: quota remains server-side.
11. Test generation errors and avoid losing quota if generation fails.
12. Confirm no Production environment variables, database, deployment, or branch have been modified.

Official references:
- https://safepay-docs.netlify.app/build-your-integration/subscriptions/
- https://apidocs.getsafepay.com/
