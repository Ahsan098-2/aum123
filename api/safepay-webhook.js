import crypto from "node:crypto";
import { json, rpc, sendError } from "./_lib/supabase.js";

function validSignature(secret, rawBody, received) {
  if (!secret || !received || !/^[a-f0-9]{64}$/i.test(received)) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest();
  const actual = Buffer.from(received, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(expected, actual);
}

export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "method_not_allowed" });
  }
  try {
    const secret = process.env.SAFEPAY_WEBHOOK_SECRET;
    const raw = await readRawBody(req);
    const signature = req.headers["x-sfpy-signature"];
    if (!validSignature(secret, raw, Array.isArray(signature) ? signature[0] : signature)) {
      return json(res, 401, { error: "invalid_signature" });
    }
    let event;
    try { event = JSON.parse(raw.toString("utf8")); }
    catch { return json(res, 400, { error: "invalid_json" }); }

    const eventId = event?.token || event?.id;
    if (!eventId || typeof event.type !== "string" || !event.data) {
      return json(res, 400, { error: "invalid_event_shape" });
    }

    // One database transaction handles event deduplication and subscription mutation.
    await rpc("process_safepay_subscription_event", {
      p_event_id: String(eventId),
      p_event_type: event.type,
      p_payload: event
    });
    return json(res, 200, { received: true });
  } catch (error) {
    return sendError(res, error);
  }
}
