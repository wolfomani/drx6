"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Send, Sparkles, Users, Zap, Globe } from "lucide-react"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  model?: string
  timestamp: Date
  isDiscussion?: boolean
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  category: string
}

interface ChatAreaProps {
  currentChat: Chat | null
  onSendMessage: (content: string, isDiscussion?: boolean) => void
  isLoading: boolean
}

export function ChatArea({ currentChat, onSendMessage, isLoading }: ChatAreaProps) {
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const suggestions = [
    {
      text: "What are the benefits of using Next.js?",
      icon: Zap,
      category: "Development",
    },
    {
      text: "Write code to explain the Dijkstra algorithm.",
      icon: Sparkles,
      category: "Algorithm",
    },
    {
      text: "Help me write an essay about Silicon Valley.",
      icon: Globe,
      category: "Writing",
    },
    {
      text: "What is the weather like in San Francisco?",
      icon: Globe,
      category: "Information",
    },
  ]

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentChat?.messages, isLoading])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSend = (content: string, isDiscussion = false) => {
    if (content.trim()) {
      onSendMessage(content.trim(), isDiscussion)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend(message)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  const startDiscussion = () => {
    if (message.trim()) {
      handleSend(message, true)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        {!currentChat || currentChat.messages.length === 0 ? (
          // Welcome Screen
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
            <div className="animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Hello! How can I help you today?</h1>

              <p className="text-gray-400 text-lg mb-8">
                Choose a suggestion below or type your own message to get started
              </p>

              {/* Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="suggestion-btn p-4 rounded-xl text-left transition-all duration-300 group animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                        <suggestion.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{suggestion.text}</p>
                        <span className="text-xs text-gray-500">{suggestion.category}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Messages
          <div className="max-w-4xl mx-auto space-y-6">
            {currentChat.messages.map((msg, index) => (
              <MessageBubble key={msg.id} message={msg} isLast={index === currentChat.messages.length - 1} />
            ))}

            {isLoading && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Send message..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 resize-none focus-glow transition-all duration-200 min-h-[48px] max-h-32"
                  rows={1}
                  disabled={isLoading}
                />

                <button
                  onClick={() => handleSend(message)}
                  disabled={!message.trim() || isLoading}
                  className="absolute right-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Discussion Button */}
              <button
                onClick={startDiscussion}
                disabled={!message.trim() || isLoading}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl flex items-center space-x-2 transition-colors"
                title="Start AI Discussion"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Discuss</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line • Use "Discuss" for multi-model conversation
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
