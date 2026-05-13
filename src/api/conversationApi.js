import { apiFetch } from './baseApi'

/**
 * Get all conversations summary (admin view).
 * GET /api/conversations
 * @returns {Promise<ConversationSummary[]>}
 */
export async function getConversations() {
  const res = await apiFetch('/api/conversations')
  return res.data
}

/**
 * Get a single conversation detail by MongoDB _id.
 * GET /api/conversations/:id
 * @param {string} id  MongoDB ObjectId
 * @returns {Promise<ConversationDetail>}
 */
export async function getConversationById(id) {
  const res = await apiFetch(`/api/conversations/${id}`)
  return res.data
}
