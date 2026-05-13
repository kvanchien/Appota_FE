const API_BASE = import.meta.env.VITE_API_URL

function getApiBaseUrl() {
  if (!API_BASE) {
    throw new Error('Thiếu cấu hình VITE_API_URL.')
  }

  return API_BASE.replace(/\/$/, '')
}

async function parseErrorMessage(response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    try {
      const data = await response.json()
      return data?.message || data?.error || `Lỗi ${response.status}`
    } catch {
      // Fallback to plain text parsing.
    }
  }

  try {
    const text = await response.text()
    if (text?.trim()) return text.trim()
  } catch {
    // Ignore text parse errors and fallback to status.
  }

  return `Lỗi ${response.status}`
}

/**
 * Create a new chat session.
 * POST /api/session
 * @returns {Promise<{ sessionId: string }>}
 */
export async function createSession() {
  const response = await fetch(`${getApiBaseUrl()}/api/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  const data = await response.json()
  const sessionId = data?.data?.sessionId

  if (!data?.success || !sessionId) {
    throw new Error(data?.message || 'Không nhận được sessionId hợp lệ từ server.')
  }

  return { sessionId }
}

/**
 * Send a message and open an SSE stream.
 * POST /api/chat
 *
 * @param {string} sessionId
 * @param {string} message
 * @param {AbortSignal} [signal]
 * @returns {Promise<Response>}
 */
export async function sendChatMessage(sessionId, message, signal) {
  const response = await fetch(`${getApiBaseUrl()}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message }),
    signal,
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  if (!response.body) {
    throw new Error('Không nhận được dữ liệu stream từ server.')
  }

  return response
}

/**
 * Get chat history for a session.
 * GET /api/chat/:sessionId
 * @param {string} sessionId
 */
export async function getChatHistory(sessionId) {
  const response = await fetch(`${getApiBaseUrl()}/api/chat/${sessionId}`)

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  const data = await response.json()

  if (!data?.success) {
    throw new Error(data?.message || 'Không thể lấy lịch sử hội thoại.')
  }

  return data.data
}
