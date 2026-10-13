import { corsSameOrigin, env, json, readBody, safeHmac, supabase } from "../_lib/barcode.js";
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // Webhooks are server-to-server. Do not use browser CORS to authenticate them.
  if (req.method !== "POST") return json(res, 405, { error: "method_not_allowed" });
  let raw;
  try { raw = await readBody(req, 1024 * 1024); }
  catch (e) { return json(res, e.status || 400, { error: "invalid_body" }); }
  const signature = req.headers["x-sfpy-signature"];
  const timestamp = req.headers["x-sfpy-timestamp"] || "";
  if (!safeHmac(env("SAFEPAY_WEBHOOK_SECRET"), raw, signature, timestamp)) {
    return json(res, 401, { error: "invalid_signature" });
  }
  let event;
  try { event = JSON.parse(raw); } catch { return json(res, 400, { error: "invalid_json" }); }
  const eventId = String(req.headers["x-sfpy-event-id"] || event.id || event.identifier || "");
  const eventType = String(req.headers["x-sfpy-event-type"] || event.type || event.webhook_event_type || "");
  if (!eventId || !eventType) return json(res, 400, { error: "missing_event_identity" });
  try {
    // Insert unique event ID first. A duplicate delivery is safe to acknowledge.
    const insert = await fetch(env("SUPABASE_URL").replace(/\/$/, "") + "/rest/v1/safepay_webhook_events", {
      method: "POST",
      headers: { ...({ apikey: env("SUPABASE_SERVICE_ROLE_KEY"), Authorization: "Bearer " + env("SUPABASE_SERVICE_ROLE_KEY"), "Content-Type": "application/json", Prefer: "return=minimal" }) },
      body: JSON.stringify({ event_id: eventId, event_type: eventType, payload: event })
    });
    if (insert.status === 409) return json(res, 200, { received: true, duplicate: true });
    if (!insert.ok) return json(res, 500, { error: "event_persistence_failed" });

    const data = event.data || event.payload || event;
    const reference = String(data.reference || event.reference || "");
    const subId = String(data.sub_id || data.subscription_id || data.subscription?.id || "");
    const lowerType = eventType.toLowerCase();
    const isSuccess = lowerType === "subscription.payment.succeeded" || lowerType === "subscription.payment_succeeded";
    const isFailure = lowerType === "subscription.payment.failed" || lowerType === "subscription.payment_failed";
    const isCancelled = lowerType === "subscription.cancelled" || lowerType === "subscription.canceled";
    if (reference && (isSuccess || isFailure || isCancelled)) {
      const intents = await fetch(env("SUPABASE_URL").replace(/\/$/, "") + "/rest/v1/barcode_subscription_intents?reference=eq." + encodeURIComponent(reference) + "&select=user_id", {
        headers: { apikey: env("SUPABASE_SERVICE_ROLE_KEY"), Authorization: "Bearer " + env("SUPABASE_SERVICE_ROLE_KEY") }
      });
      const rows = await intents.json();
      const userId = rows?.[0]?.user_id;
      if (userId) {
        const status = isSuccess ? "active" : isFailure ? "payment_failed" : "cancelled";
        const now = new Date();
        const patch = { subscription_status: status, updated_at: now.toISOString() };
        if (subId) patch.safepay_sub_id = subId;
        if (isSuccess) {
          patch.paid_used = 0;
          patch.paid_period_start = now.toISOString();
          patch.paid_period_end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        }
        const base = env("SUPABASE_URL").replace(/\/$/, "");
        const key = env("SUPABASE_SERVICE_ROLE_KEY");
        const update = await fetch(base + "/rest/v1/barcode_entitlements?user_id=eq." + encodeURIComponent(userId), {
          method: "PATCH",
          headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify(patch)
        });
        if (!update.ok) return json(res, 500, { error: "entitlement_update_failed" });
        await fetch(base + "/rest/v1/barcode_subscription_intents?reference=eq." + encodeURIComponent(reference), {
          method: "PATCH",
          headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ status, safepay_sub_id: subId || null, updated_at: now.toISOString() })
        });
      }
    }
    await supabase("/rest/v1/safepay_webhook_events?event_id=eq." + encodeURIComponent(eventId), {
      method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ processed_at: new Date().toISOString() })
    });
    return json(res, 200, { received: true });
  } catch (e) {
    return json(res, 500, { error: "webhook_processing_failed" });
  }
}
