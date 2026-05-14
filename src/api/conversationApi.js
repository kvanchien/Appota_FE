import { apiFetch } from './baseApi'

/**
 * Get conversations summary with pagination (admin view).
 * GET /api/conversations?page=1&limit=15
 * @returns {Promise<{ conversations: ConversationSummary[], pagination: object }>}
 */
export async function getConversations({ page = 1, limit = 15 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  const res = await apiFetch(`/api/conversations?${params.toString()}`)
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
