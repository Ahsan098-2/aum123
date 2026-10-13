import { corsSameOrigin, json, method, requireUser, supabase } from "../_lib/barcode.js";
export default async function handler(req, res) {
  if (!corsSameOrigin(req, res)) return;
  if (req.method === "GET") {
    try {
      const user = await requireUser(req);
      const rows = await supabase("/rest/v1/barcode_entitlements?user_id=eq." + encodeURIComponent(user.id) + "&select=free_used,paid_used,paid_period_end,subscription_status");
      const e = rows?.[0] || { free_used: 0, paid_used: 0, subscription_status: "free" };
      const active = e.subscription_status === "active" && e.paid_period_end && Date.parse(e.paid_period_end) > Date.now();
      return json(res, 200, {
        authenticated: true, email: user.email || null,
        tier: active ? "pro" : "free",
        used: active ? e.paid_used : e.free_used,
        limit: active ? 1000 : 50,
        remaining: Math.max(0, (active ? 1000 - e.paid_used : 50 - e.free_used)),
        subscriptionStatus: e.subscription_status
      });
    } catch (e) { return json(res, e.status || 500, { error: e.status === 401 ? "authentication_required" : "quota_unavailable", message: e.status ? e.message : "Could not load quota." }); }
  }
  if (!method(req, res, "POST")) return;
  try {
    const user = await requireUser(req);
    const body = typeof req.body === "object" && req.body ? req.body : {};
    const count = Number(body.count);
    if (!Number.isInteger(count) || count < 1 || count > 500) return json(res, 400, { error: "invalid_count", maxPerRequest: 500 });
    const result = await supabase("/rest/v1/rpc/claim_barcode_generations", {
      method: "POST", body: JSON.stringify({ p_user_id: user.id, p_count: count })
    });
    const quota = Array.isArray(result) ? result[0] : result;
    if (!quota?.allowed) return json(res, 402, { error: quota?.reason || "quota_exceeded", ...quota });
    return json(res, 200, quota);
  } catch (e) {
    return json(res, e.status || 500, { error: e.status === 401 ? "authentication_required" : "quota_unavailable", message: e.status ? e.message : "Could not reserve barcode quota." });
  }
}
