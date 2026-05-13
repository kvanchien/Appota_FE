import { apiFetch } from './baseApi'

/**
 * Get all Q&A pairs.
 * GET /api/knowledge
 * @returns {Promise<KnowledgeEntry[]>}
 */
export async function getKnowledge() {
  const res = await apiFetch('/api/knowledge')
  return res.data
}

/**
 * Create a new Q&A pair.
 * POST /api/knowledge
 * @param {{ question: string, answer: string, category?: string }} payload
 * @returns {Promise<KnowledgeEntry>}
 */
export async function createKnowledge(payload) {
  const res = await apiFetch('/api/knowledge', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

/**
 * Update a Q&A pair (partial update).
 * PUT /api/knowledge/:id
 * @param {string} id
 * @param {{ question?: string, answer?: string, category?: string }} payload
 * @returns {Promise<KnowledgeEntry>}
 */
export async function updateKnowledge(id, payload) {
  const res = await apiFetch(`/api/knowledge/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return res.data
}

/**
 * Delete a Q&A pair.
 * DELETE /api/knowledge/:id
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteKnowledge(id) {
  await apiFetch(`/api/knowledge/${id}`, { method: 'DELETE' })
}
