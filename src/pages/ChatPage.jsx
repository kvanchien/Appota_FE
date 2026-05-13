import { useEffect, useRef } from 'react'
import { Alert, Spin } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import { useChat } from '../hooks/useChat'
import ChatBubble from '../components/chat/ChatBubble'
import ChatInput from '../components/chat/ChatInput'
import TypingIndicator from '../components/chat/TypingIndicator'

/**
 * Player-facing Chat Page — "/"
 *
 * Features:
 *  - Tự tạo session khi mount
 *  - SSE streaming token-by-token
 *  - Typing indicator khi đang nhận stream
 *  - Auto-scroll xuống cuối khi có tin nhắn mới
 */
export default function ChatPage() {
  const { messages, isLoading, isConnecting, sendMessage, error } = useChat()
  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)

  // Robust auto-scroll to bottom
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  // Effect for initial scroll and on messages change
  useEffect(() => {
    // If it's a very fast update (streaming), instant scroll is often better
    // but smooth is nicer for new messages. Let's try smooth first.
    scrollToBottom(isLoading ? 'auto' : 'smooth')
  }, [messages, isLoading])

  // Effect for loading state changes (typing indicator appearing)
  useEffect(() => {
    if (isLoading) {
      scrollToBottom('smooth')
    }
  }, [isLoading])

  return (
    <div className="flex flex-col h-screen bg-hero-gradient overflow-hidden">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="flex-shrink-0 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm z-20">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200/50">
              <RobotOutlined className="text-white text-base sm:text-xl" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 text-base sm:text-lg leading-tight tracking-tight">
                Appota Chat AI
              </h1>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                  Trực tuyến
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isConnecting && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-50 border border-amber-100">
                <Spin size="small" />
                <span className="text-[10px] sm:text-xs font-medium text-amber-700">
                  Đang đồng bộ...
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Messages Area ────────────────────────────────────── */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scroll-smooth pt-2 sm:pt-4 pb-6 sm:pb-10"
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 flex flex-col gap-3 sm:gap-6">
          {/* Welcome message */}
          {messages.length === 0 && !isConnecting && (
            <div className="flex flex-col items-center justify-center py-10 sm:py-20 animate-fade-in">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-200/50 mb-4 sm:mb-8 transform hover:scale-110 transition-transform duration-500">
                <RobotOutlined className="text-white text-3xl sm:text-5xl" />
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-800 mb-2 sm:mb-4 tracking-tight text-center">
                Xin chào, tôi là Appota AI
              </h2>
              <p className="text-slate-500 text-center max-w-md text-sm sm:text-base leading-relaxed px-4 sm:px-0">
                Tôi có thể giúp bạn giải đáp thắc mắc về game, hỗ trợ kỹ thuật hoặc hướng dẫn các sự
                kiện đang diễn ra. Hãy đặt câu hỏi bên dưới nhé!
              </p>
            </div>
          )}

          {/* Connecting skeleton */}
          {isConnecting && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Spin size="large" />
              <p className="text-slate-400 font-medium animate-pulse">Khởi tạo phiên làm việc...</p>
            </div>
          )}

          {/* Messages List */}
          <div className="flex flex-col gap-3 sm:gap-6 w-full">
            {messages.map((msg, idx) => (
              <ChatBubble
                key={msg.id || idx}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                isStreaming={isLoading && idx === messages.length - 1 && msg.role === 'assistant'}
              />
            ))}

            {/* Typing indicator */}
            {isLoading &&
              messages[messages.length - 1]?.role === 'assistant' &&
              !messages[messages.length - 1]?.content && (
                <div className="animate-fade-in pl-2">
                  <TypingIndicator />
                </div>
              )}
          </div>

          {/* Error alert */}
          {error && (
            <div className="max-w-md mx-auto w-full animate-bounce">
              <Alert
                type="error"
                message={error}
                showIcon
                className="rounded-2xl shadow-lg border-red-100"
              />
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} className="h-4 w-full" />
        </div>
      </main>

      {/* ── Input Bar ────────────────────────────────────────── */}
      <div className="flex-shrink-0 w-full bg-gradient-to-t from-white via-white/80 to-transparent pt-3 sm:pt-6 pb-[env(safe-area-inset-bottom,8px)]">
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <ChatInput onSend={sendMessage} disabled={isConnecting || isLoading} />
        </div>
      </div>
    </div>
  )
}
