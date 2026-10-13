import { randomUUID } from "node:crypto";
import { corsSameOrigin, env, json, method, requireUser, supabase } from "../_lib/barcode.js";
export default async function handler(req, res) {
  if (!corsSameOrigin(req, res)) return;
  if (!method(req, res, "POST")) return;
  try {
    const user = await requireUser(req);
    const planId = env("SAFEPAY_PLAN_ID");
    const host = (process.env.SAFEPAY_HOST || "https://sandbox.api.getsafepay.com").replace(/\/$/, "");
    const checkoutHost = (process.env.SAFEPAY_CHECKOUT_HOST || "https://sandbox.api.getsafepay.com").replace(/\/$/, "");
    const appUrl = env("APP_URL").replace(/\/$/, "");
    const reference = "dtbc_" + randomUUID().replace(/-/g, "");
    await supabase("/rest/v1/barcode_subscription_intents", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ reference, user_id: user.id, plan_id: planId, status: "pending" })
    });
    const authResponse = await fetch(host + "/client/passport/v1/token", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-SFPY-MERCHANT-SECRET": env("SAFEPAY_SECRET_KEY") },
      body: "{}"
    });
    const authText = await authResponse.text();
    let authData = null; try { authData = authText ? JSON.parse(authText) : null; } catch {}
    if (!authResponse.ok) throw new Error("Safepay Sandbox token request failed (" + authResponse.status + ").");
    const token = authData?.data?.token || authData?.data;
    if (typeof token !== "string" || !token) throw new Error("Safepay did not return an auth token.");
    const url = new URL("/checkout/auth/login", checkoutHost);
    url.searchParams.set("plan_id", planId);
    url.searchParams.set("auth_token", token);
    url.searchParams.set("env", process.env.SAFEPAY_ENV || "sandbox");
    url.searchParams.set("redirect_url", appUrl + "/tools/barcode-generator?billing=return");
    url.searchParams.set("cancel_url", appUrl + "/tools/barcode-generator?billing=cancel");
    url.searchParams.set("reference", reference);
    return json(res, 200, { checkoutUrl: url.toString(), reference });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status === 401 ? "authentication_required" : "checkout_unavailable", message: e.status ? e.message : "Could not start Safepay checkout. Check preview environment configuration." });
  }
}
