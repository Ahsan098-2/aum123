# Barcode Generator Freemium Preview

This branch adds the **50-free-generation paywall UI prototype** to `tools/barcode-generator.html`. It is intentionally not production-ready billing.

## What's in this preview
- Shows a 50-generation free allowance and progress bar.
- Counts single-generation clicks and estimates bulk/label generation usage in browser storage.
- Shows a lock/upgrade state after the allowance is reached.
- Makes it explicit that Safepay checkout is not connected and no payment is collected.

## Important security limitation
The current counter is stored in `localStorage` for visual testing only. Visitors can reset or edit browser storage, so **it is not secure quota enforcement**. Do not advertise this as a real paid lock or merge it to production as-is. A browser-only paywall can be bypassed.

## Production-ready integration required
Before the feature can charge customers or unlock paid access, implement and test all of the following on the server:
1. User identity (e.g. Supabase Auth magic-link login) so free usage and subscription status belong to an account.
2. A persistent database for usage, Safepay subscription references/status, and processed webhook event IDs.
3. A server-side generation/quota endpoint that enforces the 50-free limit and checks active subscription status. Never trust a browser counter.
4. Safepay Sandbox recurring monthly plan, hosted checkout URL generation with server-only credentials, and a per-user reference persisted before redirect.
5. A public HTTPS webhook endpoint that verifies the raw-body HMAC with the Safepay webhook secret, deduplicates events, and activates access only on `subscription.payment.succeeded`. Handle `subscription.payment.failed` and `subscription.cancelled` to update/revoke access. Never unlock based only on a success redirect.
6. Environment variables stored in Vercel Project Settings, not committed to Git:
   - `SAFEPAY_HOST`
   - `SAFEPAY_CHECKOUT_HOST`
   - `SAFEPAY_ENV`
   - `SAFEPAY_SECRET_KEY`
   - `SAFEPAY_WEBHOOK_SECRET`
   - Database/auth project URL and server-only secret key
   - A monthly `SAFEPAY_PLAN_ID` created in the Safepay Sandbox dashboard
7. Sandbox end-to-end tests for new subscription, successful first payment, failed renewal, cancellation, webhook retries/duplicates, logout/login, and usage on another device.

## Safepay references
- Official subscriptions integration guide: https://safepay-docs.netlify.app/build-your-integration/subscriptions/
- Pricing: https://safepay.pk/pricing
- Sandbox signup: https://safepay.pk/signup

Safepay states that subscription status should be driven by verified webhook events. Production credentials require merchant onboarding; sandbox is available for testing. Pricing and account approval are controlled by Safepay.

## Safety status
- Production website: unchanged by this branch.
- Automatic checkout: not yet connected.
- Server-side access verification: not yet implemented.
- Do not merge until the production-ready requirements above are complete and tested.
