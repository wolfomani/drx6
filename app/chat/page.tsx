import { EnhancedDiscussionV3 } from "@/components/enhanced-discussion-v3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

// إصلاح viewport لـ Next.js 15
export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <MessageSquare className="w-6 h-6 text-blue-400" />
              المناقشة المتقدمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedDiscussionV3 />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
