const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify(body));
}

export function requirePost(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    json(res, 405, { error: "method_not_allowed" });
    return false;
  }
  return true;
}

function configured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_SERVICE_ROLE_KEY);
}

export async function getAuthenticatedUser(req) {
  if (!configured()) throw Object.assign(new Error("Server configuration is incomplete"), { statusCode: 503 });
  const auth = req.headers.authorization || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) throw Object.assign(new Error("Sign in to continue"), { statusCode: 401 });

  const response = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${match[1]}` }
  });
  if (!response.ok) throw Object.assign(new Error("Your session is invalid or expired"), { statusCode: 401 });
  const user = await response.json();
  if (!user || !user.id) throw Object.assign(new Error("Sign in to continue"), { statusCode: 401 });
  return { id: user.id, email: user.email || null };
}

export async function adminFetch(path, options = {}) {
  if (!configured()) throw Object.assign(new Error("Server configuration is incomplete"), { statusCode: 503 });
  const response = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${path.replace(/^\//, "")}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const body = await response.text();
  if (!response.ok) {
    const err = new Error(`Database request failed (${response.status})`);
    err.statusCode = 502;
    err.detail = body.slice(0, 300);
    throw err;
  }
  return body ? JSON.parse(body) : null;
}

export async function rpc(name, payload) {
  return adminFetch(`rpc/${name}`, { method: "POST", body: JSON.stringify(payload) });
}

export function sendError(res, error) {
  const status = Number(error?.statusCode) || 500;
  if (status >= 500) console.error("[barcode-api]", error?.message || "Unknown error", error?.detail || "");
  return json(res, status, { error: status >= 500 ? "server_error" : (error.message || "request_failed") });
}
