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
  const bottomRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-screen bg-hero-gradient">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <RobotOutlined className="text-white text-lg" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-base leading-tight">
                Appota Chatbot QA
              </h1>
              <p className="text-xs text-slate-400">Hỗ trợ game players 24/7</p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {isConnecting ? (
              <span className="text-amber-500 flex items-center gap-1">
                <Spin size="small" /> Đang kết nối...
              </span>
            ) : (
              <span className="text-emerald-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Đang hoạt động
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── Messages Area ────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
          {/* Welcome message */}
          {messages.length === 0 && !isConnecting && (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-card-lg mb-4">
                <RobotOutlined className="text-white text-4xl" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Xin chào! 👋</h2>
              <p className="text-slate-500 text-center max-w-sm text-sm leading-relaxed">
                Tôi là chatbot hỗ trợ của Appota. Bạn có thể hỏi tôi về{' '}
                <span className="text-blue-600 font-medium">nạp tiền</span>,{' '}
                <span className="text-purple-600 font-medium">tài khoản</span>,{' '}
                <span className="text-emerald-600 font-medium">gameplay</span> và các vấn đề khác.
              </p>
            </div>
          )}

          {/* Connecting skeleton */}
          {isConnecting && (
            <div className="flex justify-center py-16">
              <Spin size="large" tip="Đang khởi tạo session..." />
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <ChatBubble
              key={msg.id || idx}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}

          {/* Typing indicator — show when streaming but last bot msg is still getting tokens */}
          {isLoading &&
            messages[messages.length - 1]?.role === 'assistant' &&
            !messages[messages.length - 1]?.content && <TypingIndicator />}

          {/* Error alert */}
          {error && (
            <Alert type="error" message={error} showIcon className="rounded-xl animate-fade-in" />
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* ── Input Bar ────────────────────────────────────────── */}
      <div className="flex-shrink-0 max-w-3xl w-full mx-auto">
        <ChatInput onSend={sendMessage} disabled={isConnecting || isLoading} />
      </div>
    </div>
  )
}
