import crypto from "node:crypto";
import { adminFetch, getAuthenticatedUser, json, requirePost, sendError } from "./_lib/supabase.js";

const MONTHLY_PRICE_PKR = 499;
const apiHost = () => process.env.SAFEPAY_HOST || "https://sandbox.api.getsafepay.com";
const checkoutHost = () => process.env.SAFEPAY_CHECKOUT_HOST || "https://sandbox.api.getsafepay.com";

export default async function handler(req, res) {
  try {
    if (!requirePost(req, res)) return;
    const user = await getAuthenticatedUser(req);
    const appUrl = process.env.APP_URL;
    const planId = process.env.SAFEPAY_PLAN_ID;
    const secret = process.env.SAFEPAY_SECRET_KEY;
    const env = process.env.SAFEPAY_ENV || "sandbox";

    if (env !== "sandbox") return json(res, 503, { error: "sandbox_only_until_live_launch_approval" });
    if (!appUrl || !planId || !secret) {
      return json(res, 503, { error: "Safepay Sandbox is not configured yet" });
    }

    const reference = `dt_${user.id.replace(/-/g, "").slice(0, 16)}_${crypto.randomUUID().replace(/-/g, "")}`;
    await adminFetch("barcode_subscriptions", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        reference,
        user_id: user.id,
        plan_id: planId,
        amount_pkr: MONTHLY_PRICE_PKR,
        status: "pending"
      })
    });

    const tokenResponse = await fetch(`${apiHost().replace(/\/$/, "")}/client/passport/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-SFPY-MERCHANT-SECRET": secret },
      body: "{}"
    });
    const tokenBody = await tokenResponse.json().catch(() => ({}));
    const token = tokenBody?.data?.data || tokenBody?.data;
    if (!tokenResponse.ok || typeof token !== "string" || !token) {
      console.error("[barcode-checkout] Safepay token request failed", tokenResponse.status);
      return json(res, 502, { error: "Could not start Safepay Sandbox checkout" });
    }

    const base = appUrl.replace(/\/$/, "");
    const params = new URLSearchParams({
      plan_id: planId,
      auth_token: token,
      env: "sandbox",
      redirect_url: `${base}/tools/barcode-generator?subscription=return`,
      cancel_url: `${base}/tools/barcode-generator?subscription=cancelled`,
      reference
    });
    return json(res, 200, { checkout_url: `${checkoutHost().replace(/\/$/, "")}/checkout/auth/login?${params}` });
  } catch (error) {
    return sendError(res, error);
  }
}
