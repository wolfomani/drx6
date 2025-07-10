"use client"
import { X } from "lucide-react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-64 bg-black border-l border-gray-800 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-400">
            <p>WolfAI Genesis Platform</p>
            <p>Multi-Model AI Discussion</p>
          </div>
        </div>
      </div>
    </div>
  )
}
