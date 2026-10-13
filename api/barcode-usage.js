import { getAuthenticatedUser, json, requirePost, rpc, sendError } from "./_lib/supabase.js";

export default async function handler(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (req.method === "GET") {
      const status = await rpc("barcode_usage_status", { p_user_id: user.id });
      return json(res, 200, status);
    }
    if (!requirePost(req, res)) return;
    const amount = Number(req.body?.amount);
    if (!Number.isInteger(amount) || amount < 1 || amount > 500) {
      return json(res, 400, { error: "amount_must_be_integer_1_to_500" });
    }
    const result = await rpc("consume_barcode_generations", {
      p_user_id: user.id,
      p_amount: amount
    });
    return json(res, result?.allowed ? 200 : 402, result);
  } catch (error) {
    return sendError(res, error);
  }
}
