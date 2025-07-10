"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function APIDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-keys")
      const data = await response.json()
      setDiagnostics(data)
    } catch (error) {
      console.error("Diagnostics error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          تشخيص مفاتيح API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostics} disabled={loading} className="w-full">
          {loading ? "جاري التشخيص..." : "فحص مفاتيح API"}
        </Button>

        {diagnostics && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">Together AI</span>
              <div className="flex items-center gap-2">
                {diagnostics.together.hasKey ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <Badge variant="outline">
                  {diagnostics.together.hasKey ? `${diagnostics.together.keyLength} chars` : "غير موجود"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">Groq</span>
              <div className="flex items-center gap-2">
                {diagnostics.groq.hasKey ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <Badge variant="outline">
                  {diagnostics.groq.hasKey ? `${diagnostics.groq.keyLength} chars` : "غير موجود"}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
