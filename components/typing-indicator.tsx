"use client"

export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="glass-effect rounded-2xl px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <span className="text-sm text-gray-400">AI is thinking...</span>
        </div>
      </div>
    </div>
  )
}
