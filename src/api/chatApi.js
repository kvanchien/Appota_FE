import { apiFetch, API_BASE } from './baseApi'

/**
 * Create a new chat session.
 * POST /api/session
 * @returns {Promise<{ sessionId: string }>}
 */
export async function createSession() {
  const res = await apiFetch('/api/session', { method: 'POST' })
  return res.data // { sessionId }
}

/**
 * Send a message and open an SSE stream.
 * POST /api/chat  →  Content-Type: text/event-stream
 *
 * @param {string} sessionId
 * @param {string} message
 * @returns {Promise<Response>}  — raw fetch Response (caller reads ReadableStream)
 */
export async function sendChatMessage(sessionId, message) {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message }),
  })
  return response
}

/**
 * Get chat history for a session.
 * GET /api/chat/:sessionId
 * @param {string} sessionId
 * @returns {Promise<{ sessionId, messages, createdAt, updatedAt }>}
 */
export async function getChatHistory(sessionId) {
  const res = await apiFetch(`/api/chat/${sessionId}`)
  return res.data
}
