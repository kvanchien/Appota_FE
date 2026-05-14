import { apiFetch } from './baseApi'

/**
 * Generate AI conversation analysis report.
 * POST /api/report/generate
 * Timeout: 120s — AI analysis of large datasets can take significant time.
 * @returns {Promise<import('./baseApi').ApiResponse>} The AI-generated report
 */
export async function generateAIReport() {
  const res = await apiFetch('/api/report/generate', {
    method: 'POST',
    timeoutMs: 180_000,
  })
  return res.data
}
