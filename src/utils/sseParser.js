/**
 * Parse SSE chunk with carry-over buffer to tolerate split frames.
 *
 * @param {string} chunk
 * @param {string} buffer
 * @returns {{ events: Array<{ token?: string, done?: boolean, error?: string, sessionId?: string }>, buffer: string }}
 */
export function parseSSEChunk(chunk, buffer = '') {
  const events = []
  let working = `${buffer}${chunk ?? ''}`.replace(/\r\n/g, '\n')
  let boundaryIndex = working.indexOf('\n\n')

  while (boundaryIndex !== -1) {
    const rawEvent = working.slice(0, boundaryIndex)
    working = working.slice(boundaryIndex + 2)
    boundaryIndex = working.indexOf('\n\n')

    const dataLines = rawEvent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim())
      .filter(Boolean)

    if (dataLines.length === 0) continue

    const payload = dataLines.join('\n')

    try {
      events.push(JSON.parse(payload))
    } catch {
      // Ignore malformed SSE frame and continue with next frame.
    }
  }

  return { events, buffer: working }
}
