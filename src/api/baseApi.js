const API_BASE = import.meta.env.VITE_API_URL

/**
 * Generic fetch wrapper
 * @param {string} url
>>>>>>> main
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
