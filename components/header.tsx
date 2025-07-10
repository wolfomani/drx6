"use client"
import { Menu, Plus, MessageSquare } from "lucide-react"

interface HeaderProps {
  onNewChat: () => void
  onToggleSidebar: () => void
  isMobile: boolean
}

export function Header({ onNewChat, onToggleSidebar, isMobile }: HeaderProps) {
  return (
    <header className="h-[60px] bg-black border-b border-gray-800 flex items-center justify-between px-4 md:px-6 relative z-30">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {isMobile && (
          <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-white">AI Chat Platform</h1>
            <p className="text-xs text-gray-400">Multi-Model Discussion</p>
          </div>
        </div>
      </div>

      {/* Center Section */}
      <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
        <span>wolfai-genesis.vercel.app</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onNewChat}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 focus-glow"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>
    </header>
  )
}
