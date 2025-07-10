"use client"
import { useState, useEffect } from "react"
import { Brain, Clock } from "lucide-react"

interface ThinkingDisplayProps {
  isThinking: boolean
  thinkingText?: string
  thinkingTime?: number
  onThinkingComplete?: () => void
}

export function ThinkingDisplay({
  isThinking,
  thinkingText,
  thinkingTime = 0,
  onThinkingComplete,
}: ThinkingDisplayProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (isThinking && thinkingText) {
      setDisplayedText("")
      setCurrentTime(0)

      // Simulate typing effect for thinking text
      let index = 0
      const typingInterval = setInterval(() => {
        if (index < thinkingText.length) {
          setDisplayedText(thinkingText.slice(0, index + 1))
          index++
        } else {
          clearInterval(typingInterval)
          // Start countdown timer
          const startTime = Date.now()
          const timerInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000
            setCurrentTime(elapsed)

            if (elapsed >= thinkingTime) {
              clearInterval(timerInterval)
              onThinkingComplete?.()
            }
          }, 100)
        }
      }, 50)

      return () => {
        clearInterval(typingInterval)
      }
    }
  }, [isThinking, thinkingText, thinkingTime, onThinkingComplete])

  if (!isThinking) return null

  return (
    <div className="flex justify-start animate-fade-in mb-4">
      <div className="glass-effect rounded-2xl px-4 py-3 max-w-[80%] border border-purple-500/30">
        {/* Thinking Header */}
        <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-purple-500/20">
          <div className="model-icon bg-gradient-to-br from-purple-500 to-pink-500">
            <Brain className="w-4 h-4 text-white animate-pulse" />
          </div>
          <span className="text-sm font-medium text-purple-300">التفكير المنطقي</span>
          <div className="flex items-center space-x-1 text-xs text-purple-400">
            <Clock className="w-3 h-3" />
            <span>فكر لمدة {currentTime.toFixed(1)} ثانية</span>
          </div>
        </div>

        {/* Thinking Content */}
        <div className="space-y-2">
          <div className="text-sm text-purple-200 leading-relaxed" dir="rtl">
            {displayedText}
            {displayedText.length < (thinkingText?.length || 0) && <span className="animate-pulse">|</span>}
          </div>

          {displayedText === thinkingText && (
            <div className="flex items-center justify-center mt-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
