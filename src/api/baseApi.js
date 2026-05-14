const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Generic fetch wrapper.
 * Uses API_BASE prefix so requests work both in dev (via Vite proxy) and in
 * production where no proxy exists.
 *
 * @param {string} path  e.g. '/api/conversations'
 * @param {RequestInit & { timeoutMs?: number }} options
 * @returns {Promise<{ success: boolean, data: any, message?: string }>}
 */
export async function apiFetch(path, options = {}) {
  const { timeoutMs = 30_000, ...fetchOptions } = options
  const url = `${API_BASE}${path}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...fetchOptions.headers },
      signal: controller.signal,
      ...fetchOptions,
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.message || `HTTP ${res.status}`)
    }

    return data
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Yêu cầu đã hết thời gian chờ. Vui lòng thử lại.')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

// Exported for chatApi SSE streaming (needs absolute URL for EventSource / fetch stream)
export { API_BASE }
