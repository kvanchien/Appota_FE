import clsx from 'clsx'

/**
 * Single chat message bubble.
 *
 * @param {{ role: 'user'|'assistant', content: string, timestamp: string }} props
 */
export default function ChatBubble({ role, content, timestamp }) {
  const isUser = role === 'user'

  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div
      className={clsx(
        'flex items-end gap-2 animate-slide-up',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow',
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
        )}
      >
        {isUser ? 'U' : '🤖'}
      </div>

      <div className={clsx('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        {/* Bubble */}
        <div className={isUser ? 'bubble-user' : 'bubble-bot'}>
          {content || <span className="opacity-50 italic text-xs">Đang xử lý...</span>}
        </div>

        {/* Timestamp */}
        {time && (
          <span className="text-[11px] text-slate-400 px-1">{time}</span>
        )}
      </div>
    </div>
  )
}
