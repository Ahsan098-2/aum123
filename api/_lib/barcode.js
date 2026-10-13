import { timingSafeEqual, createHmac } from "node:crypto";

export const FREE_LIMIT = 50;
export const PAID_LIMIT = 1000;
export const MONTHLY_PRICE_PKR = 49900; // paisa: Rs 499.00

export function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify(body));
}
export function method(req, res, allowed = "POST") {
  if (req.method !== allowed) {
    res.setHeader("Allow", allowed);
    json(res, 405, { error: "method_not_allowed" });
    return false;
  }
  return true;
}
export function env(name) {
  const value = process.env[name];
  if (!value) throw new Error("Missing server environment variable: " + name);
  return value;
}
export function supabaseHeaders(extra = {}) {
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  return { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", ...extra };
}
export async function supabase(path, options = {}) {
  const base = env("SUPABASE_URL").replace(/\/$/, "");
  const response = await fetch(base + path, { ...options, headers: { ...supabaseHeaders(), ...(options.headers || {}) } });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!response.ok) {
    const err = new Error("Supabase request failed (" + response.status + "): " + (data?.message || text.slice(0, 200)));
    err.status = response.status;
    throw err;
  }
  return data;
}
export async function requireUser(req) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    const e = new Error("Sign in is required."); e.status = 401; throw e;
  }
  const base = env("SUPABASE_URL").replace(/\/$/, "");
  const anon = env("SUPABASE_ANON_KEY");
  const response = await fetch(base + "/auth/v1/user", {
    headers: { apikey: anon, Authorization: "Bearer " + match[1] }
  });
  if (!response.ok) {
    const e = new Error("Session is invalid or expired."); e.status = 401; throw e;
  }
  const user = await response.json();
  if (!user?.id) { const e = new Error("Authentication required."); e.status = 401; throw e; }
  return user;
}
export function readBody(req, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let raw = "", size = 0;
    req.on("data", chunk => {
      size += chunk.length;
      if (size > maxBytes) { reject(Object.assign(new Error("Request body too large"), { status: 413 })); req.destroy(); return; }
      raw += chunk.toString("utf8");
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}
export function safeHmac(secret, raw, signature, timestamp = "") {
  if (!signature) return false;
  const supplied = signature.replace(/^sha256=/i, "").trim().toLowerCase();
  const candidates = [createHmac("sha256", secret).update(raw).digest("hex")];
  // Some Safepay webhook versions sign "timestamp.rawBody"; support that format when timestamp exists.
  if (timestamp) candidates.push(createHmac("sha256", secret).update(timestamp + "." + raw).digest("hex"));
  return candidates.some(expected => {
    try {
      const a = Buffer.from(expected, "hex"), b = Buffer.from(supplied, "hex");
      return a.length === b.length && timingSafeEqual(a, b);
    } catch { return false; }
  });
}
export function corsSameOrigin(req, res) {
  const origin = req.headers.origin;
  const allowed = (process.env.BARCODE_ALLOWED_ORIGINS || "https://dailytoolkit.xyz").split(",").map(x => x.trim());
  if (origin && !allowed.includes(origin) && !/\.vercel\.app$/.test(new URL(origin).hostname)) {
    json(res, 403, { error: "origin_not_allowed" }); return false;
  }
  res.setHeader("Vary", "Origin");
  if (origin && (allowed.includes(origin) || /\.vercel\.app$/.test(new URL(origin).hostname))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return false; }
  return true;
}
