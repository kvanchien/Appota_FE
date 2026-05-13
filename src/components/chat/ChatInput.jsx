import { useState, useRef, useCallback } from 'react'
import { SendOutlined } from '@ant-design/icons'

const QUICK_PROMPTS = {
  mechanic:
    'Giải thích cơ chế game này theo cách dễ hiểu cho người mới: [Tên cơ chế]. Vui lòng nêu luật chơi, cách tính điểm/phần thưởng và mẹo tối ưu.',
  event:
    'Cho mình thông tin về sự kiện game: [Tên sự kiện]. Vui lòng tóm tắt thời gian, điều kiện tham gia, phần thưởng và các lưu ý quan trọng.',
}

const DEFAULT_TICKET_FORM = {
  gameName: '',
  feature: '',
  summary: '',
  steps: '',
  actual: '',
  expected: '',
  device: '',
}

/**
 * Chat input box with textarea that auto-grows.
 *
 * @param {{ onSend: (text: string) => void, disabled: boolean }} props
 */
export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [ticketForm, setTicketForm] = useState(DEFAULT_TICKET_FORM)
  const textareaRef = useRef(null)

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [text, disabled, onSend])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setText(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }

  const resizeAndFocusTextArea = () => {
    if (!textareaRef.current) return
    textareaRef.current.focus()
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`
  }

  const applyQuickPrompt = (prompt) => {
    if (disabled) return
    setText(prompt)
    resizeAndFocusTextArea()
  }

  const updateTicketField = (field, value) => {
    setTicketForm((prev) => ({ ...prev, [field]: value }))
  }

  const buildTicketPrompt = () => {
    const gameName = ticketForm.gameName.trim() || '[Tên game]'
    const feature = ticketForm.feature.trim() || '[Tính năng/sự kiện]'
    const summary = ticketForm.summary.trim() || '[Mô tả lỗi]'
    const steps = ticketForm.steps.trim() || '[Các bước tái hiện]'
    const actual = ticketForm.actual.trim() || '[Kết quả thực tế]'
    const expected = ticketForm.expected.trim() || '[Kết quả mong đợi]'
    const device = ticketForm.device.trim() || '[Thiết bị/OS]'

    return [
      'Hãy viết giúp tôi ticket báo lỗi game theo chuẩn QA với thông tin sau:',
      `- Tên game: ${gameName}`,
      `- Tính năng/Sự kiện: ${feature}`,
      `- Tóm tắt lỗi: ${summary}`,
      `- Các bước tái hiện: ${steps}`,
      `- Kết quả thực tế: ${actual}`,
      `- Kết quả mong đợi: ${expected}`,
      `- Thiết bị/OS: ${device}`,
      '',
      'Trả về ticket ngắn gọn, chuyên nghiệp, gồm: Title, Description, Steps to Reproduce, Actual Result, Expected Result, Severity đề xuất.',
    ].join('\n')
  }

  const handleCreateTicketPrompt = () => {
    if (disabled) return
    setText(buildTicketPrompt())
    setShowTicketForm(false)
    setTicketForm(DEFAULT_TICKET_FORM)
    resizeAndFocusTextArea()
  }

  return (
    <div className="p-4 bg-white border-t border-slate-100 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => applyQuickPrompt(QUICK_PROMPTS.mechanic)}
          className="px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hỏi đáp cơ chế game
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => applyQuickPrompt(QUICK_PROMPTS.event)}
          className="px-3 py-1.5 rounded-full text-xs font-medium border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hỏi đáp sự kiện game
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowTicketForm((prev) => !prev)}
          className="px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Viết ticket báo lỗi game
        </button>
      </div>

      {showTicketForm && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={ticketForm.gameName}
              onChange={(e) => updateTicketField('gameName', e.target.value)}
              placeholder="Tên game"
              disabled={disabled}
              className="input-field py-2 text-sm"
            />
            <input
              type="text"
              value={ticketForm.feature}
              onChange={(e) => updateTicketField('feature', e.target.value)}
              placeholder="Tính năng/Sự kiện"
              disabled={disabled}
              className="input-field py-2 text-sm"
            />
          </div>
          <input
            type="text"
            value={ticketForm.summary}
            onChange={(e) => updateTicketField('summary', e.target.value)}
            placeholder="Mô tả lỗi ngắn"
            disabled={disabled}
            className="input-field py-2 text-sm"
          />
          <textarea
            rows={2}
            value={ticketForm.steps}
            onChange={(e) => updateTicketField('steps', e.target.value)}
            placeholder="Các bước tái hiện"
            disabled={disabled}
            className="input-field py-2 text-sm resize-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <textarea
              rows={2}
              value={ticketForm.actual}
              onChange={(e) => updateTicketField('actual', e.target.value)}
              placeholder="Kết quả thực tế"
              disabled={disabled}
              className="input-field py-2 text-sm resize-none"
            />
            <textarea
              rows={2}
              value={ticketForm.expected}
              onChange={(e) => updateTicketField('expected', e.target.value)}
              placeholder="Kết quả mong đợi"
              disabled={disabled}
              className="input-field py-2 text-sm resize-none"
            />
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              type="text"
              value={ticketForm.device}
              onChange={(e) => updateTicketField('device', e.target.value)}
              placeholder="Thiết bị/OS"
              disabled={disabled}
              className="input-field py-2 text-sm flex-1"
            />
            <button
              type="button"
              disabled={disabled}
              onClick={handleCreateTicketPrompt}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tạo prompt ticket
            </button>
          </div>
        </div>
      )}

      <div className="flex items-end gap-3">
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
    </div>
  )
}
