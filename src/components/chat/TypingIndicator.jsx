/**
 * Animated typing indicator — 3 bouncing dots.
 * Shown while bot is streaming a response.
 */
export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-1.5 sm:gap-2 animate-fade-in">
      {/* Bot avatar */}
      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white text-[10px] sm:text-sm shadow">
        🤖
      </div>

      {/* Dot container */}
      <div className="bubble-bot flex items-center gap-1 !py-3 !px-4">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  )
}
