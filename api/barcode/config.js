import { corsSameOrigin, json } from "../_lib/barcode.js";
export default function handler(req, res) {
  if (!corsSameOrigin(req, res)) return;
  if (req.method !== "GET") return json(res, 405, { error: "method_not_allowed" });
  return json(res, 200, {
    pricePkr: 499,
    freeLimit: 50,
    paidMonthlyLimit: 1000,
    currency: "PKR",
    billingInterval: "month",
    authConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    billingConfigured: Boolean(process.env.SAFEPAY_PLAN_ID && process.env.SAFEPAY_SECRET_KEY && process.env.SAFEPAY_WEBHOOK_SECRET)
  });
}
