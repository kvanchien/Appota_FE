import { Component } from 'react'
import clsx from 'clsx'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

class MarkdownErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

function SafeMarkdown({ content }) {
  return (
    <MarkdownErrorBoundary
      resetKey={content}
      fallback={<div className="whitespace-pre-wrap break-words">{content}</div>}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="markdown-content"
        urlTransform={(url) => {
          if (typeof url !== 'string') return ''
          return url
        }}
      >
        {content}
      </ReactMarkdown>
    </MarkdownErrorBoundary>
  )
}

/**
 * Single chat message bubble.
 *
 * @param {{ role: 'user'|'assistant', content: string, timestamp: string, isStreaming?: boolean }} props
 */
export default function ChatBubble({ role, content, timestamp, isStreaming = false }) {
  const isUser = role === 'user'
  const safeContent = typeof content === 'string' ? content : ''

  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div
      className={clsx(
        'flex items-end gap-1.5 sm:gap-2 animate-slide-up',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <div
        className={clsx(
          'flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-sm font-bold shadow',
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
        )}
      >
        {isUser ? 'U' : '🤖'}
      </div>

      <div className={clsx('flex flex-col gap-1 flex-1 min-w-0', isUser ? 'items-end' : 'items-start')}>
        <div className={clsx(isUser ? 'bubble-user' : 'bubble-bot', 'w-fit')}>
          {!safeContent && <span className="opacity-50 italic text-xs">Đang xử lý...</span>}

          {safeContent &&
            (isUser || isStreaming ? (
              <div className="break-words whitespace-pre-line">{safeContent}</div>
            ) : (
              <SafeMarkdown content={safeContent} />
            ))}
        </div>

        {time && <span className="text-[11px] text-slate-400 px-1">{time}</span>}
      </div>
    </div>
  )
}
