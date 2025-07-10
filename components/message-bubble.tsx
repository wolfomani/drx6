"use client"
import { User, Bot, Copy, Check } from "lucide-react"
import { useState } from "react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  model?: string
  timestamp: Date
  isDiscussion?: boolean
}

interface MessageBubbleProps {
  message: Message
  isLast: boolean
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  const getModelIcon = (model?: string) => {
    if (!model) return null

    const modelName = model.toLowerCase()
    if (modelName.includes("deepseek") || modelName.includes("ديب سيك")) {
      return <div className="model-icon deepseek-icon">DS</div>
    }
    if (modelName.includes("gemini") || modelName.includes("جيمناي")) {
      return <div className="model-icon gemini-icon">GM</div>
    }
    if (modelName.includes("groq") || modelName.includes("جروك")) {
      return <div className="model-icon groq-icon">GQ</div>
    }
    return <div className="model-icon bg-gray-600">AI</div>
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="message-bubble user-message bg-blue-600 text-white rounded-2xl px-4 py-3 max-w-[80%]">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
            <span>{formatTime(message.timestamp)}</span>
            <User className="w-3 h-3" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="message-bubble ai-message glass-effect rounded-2xl px-4 py-3 max-w-[80%] group">
        {/* Model Header */}
        {message.model && (
          <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-700">
            {getModelIcon(message.model)}
            <span className="text-sm font-medium text-gray-300">{message.model}</span>
            {message.isDiscussion && <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">Discussion</span>}
          </div>
        )}

        {/* Message Content */}
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap break-words text-gray-100 leading-relaxed">{message.content}</p>
        </div>

        {/* Message Footer */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Bot className="w-3 h-3" />
            <span>{formatTime(message.timestamp)}</span>
          </div>

          <button
            onClick={copyToClipboard}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all duration-200"
            title="Copy message"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
          </button>
        </div>
      </div>
    </div>
  )
}
