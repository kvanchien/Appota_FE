
const API_BASE = import.meta.env.VITE_API_URL

/**
 * Generic fetch wrapper
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
