"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Wifi, Key } from "lucide-react"

export function ConnectionTest() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runConnectionTest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-connection")
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      console.error("Connection test error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">متصل ✓</Badge>
      case "error":
        return <Badge variant="destructive">خطأ ✗</Badge>
      default:
        return <Badge variant="secondary">غير معروف</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="w-5 h-5" />
          اختبار الاتصال والمفاتيح
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runConnectionTest} disabled={loading} className="w-full">
          {loading ? "جاري اختبار الاتصال..." : "اختبار الاتصال مع جميع APIs"}
        </Button>

        {testResults && (
          <div className="space-y-4">
            {/* Together AI */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(testResults.together?.status)}
                <div>
                  <span className="font-medium">Together AI (DeepSeek R1)</span>
                  {testResults.together?.model && (
                    <p className="text-xs text-slate-500">{testResults.together.model}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">{getStatusBadge(testResults.together?.status)}</div>
            </div>

            {/* Groq */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(testResults.groq?.status)}
                <div>
                  <span className="font-medium">Groq (Llama3)</span>
                  {testResults.groq?.model && <p className="text-xs text-slate-500">{testResults.groq.model}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">{getStatusBadge(testResults.groq?.status)}</div>
            </div>

            {/* Gemini */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(testResults.gemini?.status)}
                <div>
                  <span className="font-medium">Gemini 2.5 Flash</span>
                  {testResults.gemini?.model && <p className="text-xs text-slate-500">{testResults.gemini.model}</p>}
                  {testResults.gemini?.details && (
                    <p className="text-xs text-slate-500">
                      Response: {testResults.gemini.details.responseLength} chars
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">{getStatusBadge(testResults.gemini?.status)}</div>
            </div>

            {/* Error Details */}
            {(testResults.together?.error || testResults.groq?.error || testResults.gemini?.error) && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-800">تفاصيل الأخطاء:</h4>
                </div>

                {testResults.together?.error && (
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-1">
                      Together AI
                    </Badge>
                    <p className="text-sm text-red-600">{testResults.together.error}</p>
                  </div>
                )}

                {testResults.groq?.error && (
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-1">
                      Groq
                    </Badge>
                    <p className="text-sm text-red-600">{testResults.groq.error}</p>
                  </div>
                )}

                {testResults.gemini?.error && (
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-1">
                      Gemini
                    </Badge>
                    <p className="text-sm text-red-600">{testResults.gemini.error}</p>
                    {testResults.gemini.error.includes("403") && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                        <div className="flex items-center gap-1 text-yellow-800">
                          <Key className="w-3 h-3" />
                          <span className="font-medium">نصيحة:</span>
                        </div>
                        <p className="text-yellow-700 mt-1">تحقق من أن مفتاح Gemini API صحيح وله الصلاحيات المطلوبة</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Success Summary */}
            {testResults.together?.status === "connected" &&
              testResults.groq?.status === "connected" &&
              testResults.gemini?.status === "connected" && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">جميع APIs تعمل بشكل صحيح!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    يمكنك الآن استخدام جميع الميزات المتقدمة والنقاش التفاعلي
                  </p>
                </div>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
