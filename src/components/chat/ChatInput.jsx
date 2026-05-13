import { useState, useRef, useCallback } from 'react'
import { SendOutlined } from '@ant-design/icons'

/**
 * Chat input box with textarea that auto-grows.
 *
 * @param {{ onSend: (text: string) => void, disabled: boolean }} props
 */
export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [text, disabled, onSend])

  const handleKeyDown = (e) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setText(e.target.value)
    // Auto-grow textarea
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }

  return (
    <div className="flex items-end gap-3 p-4 bg-white border-t border-slate-100">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Nhập câu hỏi của bạn... (Enter để gửi)"
          className="input-field resize-none overflow-hidden leading-6 py-3 pr-4 scrollbar-thin"
          style={{ minHeight: '48px', maxHeight: '140px' }}
        />
      </div>

      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="Gửi tin nhắn"
        className="flex-shrink-0 w-12 h-12 rounded-xl
                   bg-gradient-to-r from-blue-500 to-blue-600
                   text-white shadow-md
                   hover:from-blue-600 hover:to-blue-700
                   active:scale-95 transition-all duration-150
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                   flex items-center justify-center"
      >
        <SendOutlined className="text-lg" />
      </button>
    </div>
  )
}
