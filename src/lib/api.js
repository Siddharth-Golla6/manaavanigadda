// Thin fetch wrapper for the Mana Avanigadda backend (server/). Attaches the JWT
// from localStorage automatically and normalizes error handling so callers can
// just `try { await api.post(...) } catch (err) { setError(err.message) }`.

import { translations } from "../i18n";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "md_token";

// The backend always replies in English. Translate known messages verbatim
// against the current UI language so nothing English leaks through when the
// user is in Telugu mode; unmapped/dynamic text falls back to raw English.
const OTP_SENT_RE = /^A verification code was sent to the number ending (\d+)\.$/;
const RESET_SENT_RE = /^Password reset instructions sent to the number ending (\d+)\.$/;

function translateApiMessage(message) {
  const lang = localStorage.getItem("md_lang") === "te" ? "te" : "en";
  const dict = translations[lang] || translations.en;

  const otpMatch = message.match(OTP_SENT_RE);
  if (otpMatch) return dict["api.otpSent"].replaceAll("{last4}", otpMatch[1]);

  const resetMatch = message.match(RESET_SENT_RE);
  if (resetMatch) return dict["api.resetSent"].replaceAll("{last4}", resetMatch[1]);

  return dict[`api.${message}`] ?? message;
}

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
    const lang = localStorage.getItem("md_lang") === "te" ? "te" : "en";
    throw new Error((translations[lang] || translations.en)["api.cantReachServer"]);
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const lang = localStorage.getItem("md_lang") === "te" ? "te" : "en";
    const rawMessage = data?.error || `Request failed (${res.status})`;
    const message = data?.error
      ? translateApiMessage(data.error)
      : (translations[lang] || translations.en)["api.requestFailed"].replaceAll("{status}", res.status);
    const err = new Error(message);
    err.rawMessage = rawMessage;
    throw err;
  }
  if (data && typeof data.message === "string") {
    data.message = translateApiMessage(data.message);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  del: (path) => request(path, { method: "DELETE" }),
};
