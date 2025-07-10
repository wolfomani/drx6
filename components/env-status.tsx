"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Key, RefreshCw, Eye, EyeOff } from "lucide-react"

interface EnvVariable {
  name: string
  service: string
  description: string
  isSet: boolean
  preview?: string
}

export function EnvStatus() {
  const [envVars, setEnvVars] = useState<EnvVariable[]>([])
  const [showKeys, setShowKeys] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkEnvironmentVariables()
  }, [])

  const checkEnvironmentVariables = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-keys")
      const data = await response.json()

      const variables: EnvVariable[] = [
        {
          name: "GROQ_API_KEY",
          service: "Groq",
          description: "مفتاح API لخدمة Groq (Llama Models)",
          isSet: !!data.keys?.GROQ_API_KEY,
          preview: data.keys?.GROQ_API_KEY ? `${data.keys.GROQ_API_KEY.substring(0, 8)}...` : undefined,
        },
        {
          name: "TOGETHER_API_KEY",
          service: "Together AI",
          description: "مفتاح API لخدمة Together AI (Multiple Models)",
          isSet: !!data.keys?.TOGETHER_API_KEY,
          preview: data.keys?.TOGETHER_API_KEY ? `${data.keys.TOGETHER_API_KEY.substring(0, 8)}...` : undefined,
        },
        {
          name: "GEMINI_API_KEY",
          service: "Google Gemini",
          description: "مفتاح API لخدمة Google Gemini",
          isSet: !!data.keys?.GEMINI_API_KEY,
          preview: data.keys?.GEMINI_API_KEY ? `${data.keys.GEMINI_API_KEY.substring(0, 8)}...` : undefined,
        },
        {
          name: "VERCEL_TOKEN",
          service: "Vercel",
          description: "رمز Vercel للنشر والإدارة",
          isSet: !!data.keys?.VERCEL_TOKEN,
          preview: data.keys?.VERCEL_TOKEN ? `${data.keys.VERCEL_TOKEN.substring(0, 8)}...` : undefined,
        },
        {
          name: "GITHUB_TOKEN",
          service: "GitHub",
          description: "رمز GitHub للتكامل مع المستودعات",
          isSet: !!data.keys?.GITHUB_TOKEN,
          preview: data.keys?.GITHUB_TOKEN ? `${data.keys.GITHUB_TOKEN.substring(0, 8)}...` : undefined,
        },
        {
          name: "GITHUB_WEBHOOK",
          service: "GitHub Webhooks",
          description: "رابط webhook لـ GitHub",
          isSet: !!data.keys?.GITHUB_WEBHOOK,
          preview: data.keys?.GITHUB_WEBHOOK ? `${data.keys.GITHUB_WEBHOOK.substring(0, 20)}...` : undefined,
        },
      ]

      setEnvVars(variables)
    } catch (error) {
      console.error("Error checking environment variables:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const setCount = envVars.filter((v) => v.isSet).length
  const totalCount = envVars.length

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 rounded-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">حالة متغيرات البيئة</h2>
              <p className="text-sm text-gray-300 mt-1">
                {setCount} من {totalCount} متغيرات مُعرَّفة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowKeys(!showKeys)}
              className="bg-gray-700 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-600"
            >
              {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showKeys ? "إخفاء" : "إظهار"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={checkEnvironmentVariables}
              disabled={isLoading}
              className="bg-gray-700 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-600"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              تحديث
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ملخص سريع */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-700/20 rounded-xl border border-green-500/30">
            <div className="text-2xl font-bold text-green-400">{setCount}</div>
            <div className="text-sm text-gray-400">متغيرات مُعرَّفة</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-red-500/10 to-red-700/20 rounded-xl border border-red-500/30">
            <div className="text-2xl font-bold text-red-400">{totalCount - setCount}</div>
            <div className="text-sm text-gray-400">متغيرات مفقودة</div>
          </div>
        </div>

        {/* قائمة المتغيرات */}
        <div className="space-y-3">
          {envVars.map((envVar) => (
            <div
              key={envVar.name}
              className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {envVar.isSet ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}

                  <div>
                    <h3 className="font-bold text-white">{envVar.name}</h3>
                    <p className="text-sm text-gray-400">{envVar.service}</p>
                    <p className="text-xs text-gray-500">{envVar.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {envVar.isSet ? (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500">مُعرَّف</Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500">مفقود</Badge>
                  )}
                </div>
              </div>

              {showKeys && envVar.preview && (
                <div className="mt-3 p-2 bg-gray-900/50 rounded text-xs text-gray-400 font-mono">
                  <strong>القيمة:</strong> {envVar.preview}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* تحذير إذا كانت هناك متغيرات مفقودة */}
        {setCount < totalCount && (
          <div className="p-4 bg-yellow-900/20 rounded-xl border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-yellow-400" />
              <strong className="text-yellow-300">تحذير:</strong>
            </div>
            <p className="text-sm text-yellow-200">
              بعض متغيرات البيئة مفقودة. قد لا تعمل بعض الميزات بشكل صحيح. تأكد من إضافة جميع المتغيرات المطلوبة في
              إعدادات النشر.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
