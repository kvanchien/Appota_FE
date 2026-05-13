// Base URL from environment variable — defaults to localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Generic fetch wrapper — throws on non-2xx
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<any>}
 */
export async function apiFetch(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.message || `HTTP ${res.status}`)
  }

  return data
}

export { API_BASE }
