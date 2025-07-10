import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

// إصلاح viewport لـ Next.js 15
export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
        <CardHeader className="text-center">
          <div className="text-6xl font-bold text-red-400 mb-4">404</div>
          <CardTitle className="text-white text-2xl">الصفحة غير موجودة</CardTitle>
          <CardDescription className="text-gray-400">عذراً، لا يمكن العثور على الصفحة التي تبحث عنها</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                العودة للصفحة الرئيسية
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/chat" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                الذهاب للمحادثة
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
