// Thin fetch wrapper for the Mana Avanigadda backend (server/). Attaches the JWT
// from localStorage automatically and normalizes error handling so callers can
// just `try { await api.post(...) } catch (err) { setError(err.message) }`.

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "md_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

// persist=true (Remember Me) keeps the session across browser restarts;
// persist=false clears when the tab/browser closes.
export function setToken(token, persist = true) {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  if (!token) return;
  (persist ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}

async function request(path, { method = "GET", body, headers } = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`Can't reach the server at ${API_BASE} — is the backend running?`);
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  del: (path) => request(path, { method: "DELETE" }),
};
