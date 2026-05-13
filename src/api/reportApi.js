import { apiFetch } from './baseApi'

/**
 * Generate AI conversation analysis report.
 * POST /api/report/generate
 * @returns {Promise<import('./baseApi').ApiResponse>} The AI-generated report
 */
export async function generateAIReport() {
  const res = await apiFetch('/api/report/generate', {
    method: 'POST',
  })
  return res.data
}
