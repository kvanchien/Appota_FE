import { useState, useEffect, useRef, useCallback } from 'react'
import { createSession, sendChatMessage } from '../api/chatApi'
import { parseSSEChunk } from '../utils/sseParser'

function isSessionNotFoundError(error) {
  return String(error?.message || error)
    .toLowerCase()
    .includes('session not found')
}

async function streamChatMessage(sessionId, message, signal, handlers) {
  const response = await sendChatMessage(sessionId, message, signal)
  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  let buffer = ''
  let didReceiveDone = false
  let shouldStop = false

  while (!shouldStop) {
    const { done, value } = await reader.read()

    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const parsed = parseSSEChunk(chunk, buffer)
    buffer = parsed.buffer

    for (const event of parsed.events) {
      if (event?.error) {
        throw new Error(event.error)
      }

      if (typeof event?.token === 'string') {
        handlers.onToken(event.token)
      }

      if (event?.done === true) {
        didReceiveDone = true
        handlers.onDone(event.sessionId)
        shouldStop = true
        break
      }
    }
  }

  if (!didReceiveDone) {
    const flushed = parseSSEChunk('\n\n', buffer)

    for (const event of flushed.events) {
      if (event?.error) {
        throw new Error(event.error)
      }

      if (typeof event?.token === 'string') {
        handlers.onToken(event.token)
      }

      if (event?.done === true) {
        didReceiveDone = true
        handlers.onDone(event.sessionId)
      }
    }
  }

  if (!didReceiveDone) {
    throw new Error('Kết nối stream bị gián đoạn trước khi hoàn tất phản hồi.')
  }
}

/**
 * Core chat hook: session lifecycle, message state, and SSE streaming.
 */
export function useChat() {
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState(null)

  const abortControllerRef = useRef(null)

  const ensureSession = useCallback(async () => {
    if (sessionId) return sessionId

    const { sessionId: createdSessionId } = await createSession()
    setSessionId(createdSessionId)
    return createdSessionId
  }, [sessionId])

  useEffect(() => {
    let cancelled = false

    async function initSession() {
      try {
        const { sessionId: createdSessionId } = await createSession()

        if (!cancelled) {
          setSessionId(createdSessionId)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Không thể khởi tạo session.')
        }
      } finally {
        if (!cancelled) {
          setIsConnecting(false)
        }
      }
    }

    initSession()

    return () => {
      cancelled = true
    }
  }, [])

  const sendMessage = useCallback(
    async (text) => {
      const trimmedMessage = text.trim()
      if (!trimmedMessage || isLoading) return

      let activeSessionId = sessionId
      let botMessageId = null
      let didReceiveToken = false

      setError(null)
      setIsLoading(true)

      const appendToken = (token) => {
        didReceiveToken = true
        setMessages((prev) =>
          prev.map((message) =>
            message.id === botMessageId
              ? { ...message, content: `${message.content}${token}` }
              : message
          )
        )
      }

      const handleDone = (nextSessionId) => {
        if (typeof nextSessionId === 'string' && nextSessionId) {
          setSessionId(nextSessionId)
        }
      }

      const sendWithSession = async (targetSessionId) => {
        const controller = new AbortController()
        abortControllerRef.current = controller

        await streamChatMessage(targetSessionId, trimmedMessage, controller.signal, {
          onToken: appendToken,
          onDone: handleDone,
        })
      }

      try {
        if (!activeSessionId) {
          activeSessionId = await ensureSession()
        }

        const timestamp = new Date().toISOString()
        botMessageId = `assistant-${Date.now()}-${Math.random().toString(16).slice(2)}`

        setMessages((prev) => [
          ...prev,
          { role: 'user', content: trimmedMessage, timestamp },
          { id: botMessageId, role: 'assistant', content: '', timestamp: new Date().toISOString() },
        ])

        try {
          await sendWithSession(activeSessionId)
        } catch (err) {
          if (
            isSessionNotFoundError(err) &&
            !didReceiveToken &&
            !abortControllerRef.current?.signal.aborted
          ) {
            const { sessionId: recreatedSessionId } = await createSession()
            activeSessionId = recreatedSessionId
            setSessionId(recreatedSessionId)
            await sendWithSession(recreatedSessionId)
            return
          }

          throw err
        }
      } catch (err) {
        if (!abortControllerRef.current?.signal.aborted) {
          setError(err.message || 'Đã xảy ra lỗi khi gửi tin nhắn.')
        }

        if (botMessageId && !didReceiveToken) {
          setMessages((prev) => prev.filter((message) => message.id !== botMessageId))
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [ensureSession, isLoading, sessionId]
  )

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return {
    messages,
    isLoading,
    isStreaming: isLoading,
    isConnecting,
    sendMessage,
    error,
    sessionId,
  }
}
