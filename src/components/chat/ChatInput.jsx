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
    adjustHeight()
  }

  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 180)
      textareaRef.current.style.height = `${newHeight}px`
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > 180 ? 'auto' : 'hidden'
    }
  }, [])

  const resizeAndFocusTextArea = () => {
    if (!textareaRef.current) return
    textareaRef.current.focus()
    setTimeout(adjustHeight, 0)
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
    <div className="p-2 sm:p-4 bg-transparent space-y-2 sm:space-y-4">
      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
        <button
          type="button"
          disabled={disabled}
          onClick={() => applyQuickPrompt(QUICK_PROMPTS.mechanic)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold border border-blue-100 text-blue-600 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-blue-300 transition-all disabled:opacity-50"
        >
          💡 Cơ chế game
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => applyQuickPrompt(QUICK_PROMPTS.event)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold border border-purple-100 text-purple-600 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-purple-300 transition-all disabled:opacity-50"
        >
          🎁 Sự kiện game
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowTicketForm((prev) => !prev)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold border border-emerald-100 text-emerald-600 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-emerald-300 transition-all disabled:opacity-50"
        >
          🐞 Báo lỗi QA
        </button>
      </div>

      {showTicketForm && (
        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md p-3 sm:p-4 space-y-2 sm:space-y-3 shadow-xl animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={ticketForm.gameName}
              onChange={(e) => updateTicketField('gameName', e.target.value)}
              placeholder="Tên game"
              disabled={disabled}
              className="input-field bg-slate-50/50"
            />
            <input
              type="text"
              value={ticketForm.feature}
              onChange={(e) => updateTicketField('feature', e.target.value)}
              placeholder="Tính năng/Sự kiện"
              disabled={disabled}
              className="input-field bg-slate-50/50"
            />
          </div>
          <input
            type="text"
            value={ticketForm.summary}
            onChange={(e) => updateTicketField('summary', e.target.value)}
            placeholder="Mô tả lỗi ngắn"
            disabled={disabled}
            className="input-field bg-slate-50/50"
          />
          <textarea
            rows={2}
            value={ticketForm.steps}
            onChange={(e) => updateTicketField('steps', e.target.value)}
            placeholder="Các bước tái hiện"
            disabled={disabled}
            className="input-field bg-slate-50/50 resize-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <textarea
              rows={2}
              value={ticketForm.actual}
              onChange={(e) => updateTicketField('actual', e.target.value)}
              placeholder="Kết quả thực tế"
              disabled={disabled}
              className="input-field bg-slate-50/50 resize-none"
            />
            <textarea
              rows={2}
              value={ticketForm.expected}
              onChange={(e) => updateTicketField('expected', e.target.value)}
              placeholder="Kết quả mong đợi"
              disabled={disabled}
              className="input-field bg-slate-50/50 resize-none"
            />
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={ticketForm.device}
              onChange={(e) => updateTicketField('device', e.target.value)}
              placeholder="Thiết bị/OS"
              disabled={disabled}
              className="input-field bg-slate-50/50 flex-1"
            />
            <button
              type="button"
              disabled={disabled}
              onClick={handleCreateTicketPrompt}
              className="btn-primary"
            >
              Tạo prompt ticket
            </button>
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="relative max-w-4xl mx-auto w-full">
        <div
          className="
      flex items-end gap-1.5 sm:gap-2
      bg-white
      rounded-2xl sm:rounded-3xl
      border border-slate-200/80
      px-3 sm:px-4 py-1.5 sm:py-2
      shadow-sm
      transition-all duration-200
      focus-within:border-slate-300
    "
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Hỏi Appota AI bất cứ điều gì..."
            className="
        flex-1
        bg-transparent
        border-none
        outline-none
        focus:outline-none
        focus:ring-0
        resize-none
        py-3
        text-slate-800
        placeholder:text-slate-400
        text-sm
        leading-6
        scrollbar-thin
      "
            style={{ minHeight: '24px', maxHeight: '180px' }}
          />

          <button
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            className="mb-1 mr-0.5 sm:mr-1 flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-20 disabled:grayscale disabled:scale-100 flex items-center justify-center"
          >
            {' '}
            <SendOutlined className="text-base" />{' '}
          </button>
        </div>
      </div>
      <p className="text-[10px] text-center text-slate-400 mt-2">
        AI có thể đưa ra câu trả lời không chính xác. Hãy kiểm tra lại các thông tin quan trọng.
      </p>
    </div>
  )
}
