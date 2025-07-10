"use client"
import { useState } from "react"
import { MessageSquare, Trash2, Bot, Users, Zap, Calendar } from "lucide-react"

interface Chat {
  id: string
  title: string
  messages: any[]
  createdAt: Date
  category: string
}

interface SidebarProps {
  chats: Chat[]
  currentChat: Chat | null
  onSelectChat: (chat: Chat) => void
  onDeleteChat: (chatId: string) => void
  isOpen: boolean
  isMobile: boolean
}

export function Sidebar({ chats, currentChat, onSelectChat, onDeleteChat, isOpen, isMobile }: SidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = [
    { name: "All", icon: MessageSquare, count: chats.length },
    { name: "General", icon: Bot, count: chats.filter((c) => c.category === "General").length },
    { name: "Discussion", icon: Users, count: chats.filter((c) => c.category === "Discussion").length },
    { name: "Analysis", icon: Zap, count: chats.filter((c) => c.category === "Analysis").length },
  ]

  const filteredChats = selectedCategory === "All" ? chats : chats.filter((chat) => chat.category === selectedCategory)

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const sidebarClasses = `
    ${isMobile ? "fixed" : "relative"} 
    ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
    w-[280px] h-full bg-black border-r border-gray-800 flex flex-col transition-transform duration-300 z-50
  `

  return (
    <aside className={sidebarClasses}>
      {/* Categories */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Categories</h2>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category.name
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center space-x-3">
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </div>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Recent Chats</h2>

          {filteredChats.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No chats yet</p>
              <p className="text-gray-600 text-xs">Start a conversation to see your chat history</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentChat?.id === chat.id
                      ? "bg-gray-800 border border-gray-700"
                      : "hover:bg-gray-800 border border-transparent"
                  }`}
                  onClick={() => onSelectChat(chat)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate mb-1">{chat.title}</h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(chat.createdAt)}</span>
                        <span>•</span>
                        <span>{chat.messages.length} messages</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChat(chat.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-all duration-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {chat.messages.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      {chat.messages[chat.messages.length - 1].content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          <p>WolfAI Genesis Platform</p>
          <p className="mt-1">Multi-Model AI Discussion</p>
        </div>
      </div>
    </aside>
  )
}
