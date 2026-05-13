// API_BASE is used only for SSE streaming (chatApi) which needs an absolute URL.
// For regular JSON requests, we use a relative path so they go through
// the Vite dev-server proxy (/api → VITE_API_URL) and avoid CORS issues.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Generic fetch wrapper — throws on non-2xx or { success: false } response.
 *
 * Uses a RELATIVE path (e.g. "/api/conversations") so requests are proxied
 * by the Vite dev server and avoid cross-origin (CORS) errors.
 *
 * @param {string} path  — must start with "/" e.g. "/api/knowledge"
 * @param {RequestInit} options
 * @returns {Promise<{ success: boolean, data: any, message?: string }>}
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.message || `HTTP ${res.status}`)
  }

  return data
}

// Exported for chatApi SSE streaming (needs absolute URL for EventSource / fetch stream)
export { API_BASE }
