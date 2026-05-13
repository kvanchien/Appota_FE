import { useState, useEffect, useRef, useCallback } from 'react'
import { createSession, sendChatMessage } from '../api/chatApi'
import { parseSSEChunk } from '../utils/sseParser'

/**
 * Core chat hook — manages session lifecycle, message state, and SSE streaming.
 *
 * Usage:
 *   const { messages, isStreaming, isConnecting, sendMessage, error } = useChat()
 */
export function useChat() {
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([]) // { role, content, timestamp }[]
  const [isStreaming, setIsStreaming] = useState(false)
  const [isConnecting, setIsConnecting] = useState(true) // true while creating session
  const [error, setError] = useState(null)

  // Ref to abort ongoing SSE stream when component unmounts
  const abortRef = useRef(null)

  // ── 1. Create session on mount ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function initSession() {
      try {
        const { sessionId: sid } = await createSession()
        if (!cancelled) {
          setSessionId(sid)
          setIsConnecting(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Không thể kết nối server. Vui lòng thử lại.')
          setIsConnecting(false)
        }
      }
    }

    initSession()
    return () => {
      cancelled = true
    }
  }, [])

  // ── 2. Send message + consume SSE stream ────────────────────────────────
  const sendMessage = useCallback(
    async (text) => {
      if (!sessionId || isStreaming || !text.trim()) return

      const userMsg = { role: 'user', content: text.trim(), timestamp: new Date().toISOString() }
      // Optimistically add user message
      setMessages((prev) => [...prev, userMsg])
      setError(null)
      setIsStreaming(true)

      // Placeholder bot message that will be filled token-by-token
      const botMsgId = Date.now()
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, role: 'assistant', content: '', timestamp: new Date().toISOString() },
      ])

      try {
        const response = await sendChatMessage(sessionId, text.trim())

        // Handle non-2xx before stream
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData.message || `Lỗi ${response.status}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        abortRef.current = reader

        // Stream reading loop
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const events = parseSSEChunk(chunk)

          for (const evt of events) {
            if (evt.token) {
              // Append token to the bot placeholder message
              setMessages((prev) =>
                prev.map((m) => (m.id === botMsgId ? { ...m, content: m.content + evt.token } : m))
              )
            }
            if (evt.done) {
              setIsStreaming(false)
            }
            if (evt.error) {
              throw new Error(evt.error)
            }
          }
        }
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi nhận phản hồi.')
        // Remove empty bot placeholder on error
        setMessages((prev) => prev.filter((m) => !(m.id === botMsgId && m.content === '')))
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [sessionId, isStreaming]
  )

  // ── 3. Cleanup on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      abortRef.current?.cancel?.()
    }
  }, [])

  return { messages, isStreaming, isConnecting, sendMessage, error, sessionId }
}
