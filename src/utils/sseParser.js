/**
 * Parse SSE (Server-Sent Events) raw text chunk into event objects.
 *
 * Each SSE event looks like:
 *   data: {"token":"hello"}\n\n
 *   data: {"done":true}\n\n
 *
 * @param {string} chunk  — raw text from ReadableStream decoder
 * @returns {Array<{ token?: string, done?: boolean, error?: string }>}
 */
export function parseSSEChunk(chunk) {
  const lines = chunk.split('\n')
  const events = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('data:')) continue

    const jsonStr = trimmed.slice(5).trim()
    if (!jsonStr) continue

    try {
      const parsed = JSON.parse(jsonStr)
      events.push(parsed)
    } catch {
      // Ignore malformed JSON lines in SSE stream
    }
  }

  return events
}
