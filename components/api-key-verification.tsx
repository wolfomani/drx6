"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Key, AlertTriangle, Clock, RefreshCw } from 'lucide-react'

interface ApiKeyStatus {
  service: string
  status: "checking" | "success" | "error" | "rate_limited" | "idle"
  message: string
  details?: any
  lastTested?: Date
  retryAfter?: number
}

export function APIKeyVerification() {
  const [keyStatuses, setKeyStatuses] = useState<ApiKeyStatus[]>([
    { service: "GROQ", status: "idle", message: "لم يتم الفحص بعد" },
    { service: "TOGETHER", status: "idle", message: "لم يتم الفحص بعد" },
    { service: "GEMINI", status: "idle", message: "لم يتم الفحص بعد" },
  ])

  const [isTestingAll, setIsTestingAll] = useState(false)

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const testApiKey = async (service: string, retryCount = 0) => {
    const maxRetries = 2

    setKeyStatuses((prev) =>
      prev.map((status) =>
        status.service === service
          ? {
              ...status,
              status: "checking",
              message:
                retryCount > 0 ? `جاري إعادة المحاولة (${retryCount + 1}/${maxRetries + 1})...` : "جاري الفحص...",
              lastTested: new Date(),
            }
          : status,
      ),
    )

    try {
      const endpoint = service.toLowerCase()
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "مرحبا، هذا اختبار بسيط للتأكد من عمل المفتاح",
        }),
      })

      const data = await response.json()

      if (response.ok && data.response && !data.error) {
        setKeyStatuses((prev) =>
          prev.map((status) =>
            status.service === service
              ? {
                  ...status,
                  status: "success",
                  message: "المفتاح يعمل بشكل صحيح ✅",
                  details: {
                    model: data.model,
                    modelUsed: data.modelUsed,
                    responseLength: data.response.length,
                    usage: data.usage,
                    responsePreview: data.response.substring(0, 100) + "...",
                  },
                  lastTested: new Date(),
                }
              : status,
          ),
        )
      } else if (response.status === 429 || data.error?.includes("rate limit") || data.error?.includes("حد المعدل")) {
        // معالجة خطأ حد المعدل
        const retryAfter = 60 // ثانية
        setKeyStatuses((prev) =>
          prev.map((status) =>
            status.service === service
              ? {
                  ...status,
                  status: "rate_limited",
                  message: `تم الوصول لحد المعدل - حاول مرة أخرى بعد ${retryAfter} ثانية`,
                  details: data,
                  retryAfter: retryAfter,
                  lastTested: new Date(),
                }
              : status,
          ),
        )

        // إعادة المحاولة تلقائياً بعد فترة انتظار
        if (retryCount < maxRetries) {
          console.log(`Rate limited for ${service}, retrying in ${retryAfter} seconds...`)
          await sleep(retryAfter * 1000)
          return testApiKey(service, retryCount + 1)
        }
      } else {
        setKeyStatuses((prev) =>
          prev.map((status) =>
            status.service === service
              ? {
                  ...status,
                  status: "error",
                  message: data.error || "خطأ غير معروف",
                  details: data,
                  lastTested: new Date(),
                }
              : status,
          ),
        )
      }
    } catch (error) {
      setKeyStatuses((prev) =>
        prev.map((status) =>
          status.service === service
            ? {
                ...status,
                status: "error",
                message: `خطأ في الاتصال: ${error}`,
                details: { error: error.toString() },
                lastTested: new Date(),
              }
            : status,
        ),
      )
    }
  }

  const testAllKeys = async () => {
    setIsTestingAll(true)

    // Reset all statuses
    setKeyStatuses((prev) =>
      prev.map((status) => ({
        ...status,
        status: "idle",
        message: "في انتظار الدور...",
      })),
    )

    // Test each service sequentially with longer delays
    for (let i = 0; i < keyStatuses.length; i++) {
      const status = keyStatuses[i]
      await testApiKey(status.service)

      // انتظار أطول بين الاختبارات لتجنب حدود المعدل
      if (i < keyStatuses.length - 1) {
        await sleep(5000) // 5 ثوان بين كل اختبار
      }
    }

    setIsTestingAll(false)
  }

  const retryService = async (service: string) => {
    await testApiKey(service)
  }

  const getStatusIcon = (status: ApiKeyStatus["status"]) => {
    switch (status) {
      case "checking":
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "rate_limited":
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Key className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: ApiKeyStatus["status"]) => {
    switch (status) {
      case "checking":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500">جاري الفحص</Badge>
      case "success":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500">يعمل</Badge>
      case "error":
        return <Badge className="bg-red-500/20 text-red-300 border-red-500">خطأ</Badge>
      case "rate_limited":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500">حد المعدل</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500">غير مفحوص</Badge>
    }
  }

  const successCount = keyStatuses.filter((s) => s.status === "success").length
  const errorCount = keyStatuses.filter((s) => s.status === "error").length
  const rateLimitedCount = keyStatuses.filter((s) => s.status === "rate_limited").length
  const totalCount = keyStatuses.length

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 rounded-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">فحص مفاتيح API</h2>
            <p className="text-sm text-gray-300 mt-1">التحقق من صحة وعمل جميع مفاتيح الخدمات</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ملخص الحالة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-700/20 rounded-xl border border-green-500/30">
            <div className="text-2xl font-bold text-green-400">{successCount}</div>
            <div className="text-sm text-gray-400">تعمل</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-red-500/10 to-red-700/20 rounded-xl border border-red-500/30">
            <div className="text-2xl font-bold text-red-400">{errorCount}</div>
            <div className="text-sm text-gray-400">خطأ</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-700/20 rounded-xl border border-yellow-500/30">
            <div className="text-2xl font-bold text-yellow-400">{rateLimitedCount}</div>
            <div className="text-sm text-gray-400">حد المعدل</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-700/20 rounded-xl border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-400">{totalCount}</div>
            <div className="text-sm text-gray-400">المجموع</div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex gap-3">
          <Button
            onClick={testAllKeys}
            disabled={isTestingAll}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex-1"
          >
            {isTestingAll ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري فحص جميع المفاتيح...
              </>
            ) : (
              <>
                <Key className="w-4 h-4 ml-2" />
                فحص جميع المفاتيح
              </>
            )}
          </Button>
        </div>

        {/* تفاصيل كل مفتاح */}
        <div className="space-y-4">
          {keyStatuses.map((keyStatus) => (
            <div
              key={keyStatus.service}
              className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(keyStatus.status)}
                  <div>
                    <h3 className="font-bold text-white text-lg">{keyStatus.service} API</h3>
                    <p className="text-sm text-gray-400">
                      {keyStatus.service === "GROQ" && "Llama3-8b-8192 Model"}
                      {keyStatus.service === "TOGETHER" && "Multiple Models (Auto-Fallback)"}
                      {keyStatus.service === "GEMINI" && "Gemini 2.5 Flash Model"}
                    </p>
                    {keyStatus.lastTested && (
                      <p className="text-xs text-gray-500">
                        آخر فحص: {keyStatus.lastTested.toLocaleTimeString("ar-SA")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(keyStatus.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      keyStatus.status === "rate_limited"
                        ? retryService(keyStatus.service)
                        : testApiKey(keyStatus.service)
                    }
                    disabled={keyStatus.status === "checking"}
                    className="bg-gray-700 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-600"
                  >
                    {keyStatus.status === "checking" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : keyStatus.status === "rate_limited" ? (
                      <RefreshCw className="w-4 h-4" />
                    ) : (
                      "فحص"
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-300 mb-2">
                <strong>الحالة:</strong> {keyStatus.message}
              </div>

              {keyStatus.details && keyStatus.status === "success" && (
                <div className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <div>
                      <strong>النموذج:</strong> {keyStatus.details.model}
                    </div>
                    {keyStatus.details.modelUsed && (
                      <div>
                        <strong>النموذج المستخدم:</strong> {keyStatus.details.modelUsed}
                      </div>
                    )}
                    <div>
                      <strong>طول الرد:</strong> {keyStatus.details.responseLength} حرف
                    </div>
                    {keyStatus.details.usage && (
                      <div>
                        <strong>الاستخدام:</strong> {JSON.stringify(keyStatus.details.usage)}
                      </div>
                    )}
                  </div>
                  {keyStatus.details.responsePreview && (
                    <div className="mt-2 p-2 bg-gray-800 rounded text-green-300">
                      <strong>معاينة الرد:</strong> {keyStatus.details.responsePreview}
                    </div>
                  )}
                </div>
              )}

              {keyStatus.details && (keyStatus.status === "error" || keyStatus.status === "rate_limited") && (
                <div
                  className={`text-xs p-3 rounded-lg border ${
                    keyStatus.status === "rate_limited"
                      ? "text-yellow-400 bg-yellow-900/20 border-yellow-500/30"
                      : "text-red-400 bg-red-900/20 border-red-500/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {keyStatus.status === "rate_limited" ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <strong>{keyStatus.status === "rate_limited" ? "معلومات حد المعدل:" : "تفاصيل الخطأ:"}</strong>
                  </div>
                  {keyStatus.status === "rate_limited" && keyStatus.details.suggestion && (
                    <div className="mb-2 text-yellow-300">
                      <strong>اقتراح:</strong> {keyStatus.details.suggestion}
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap text-xs overflow-x-auto">
                    {JSON.stringify(keyStatus.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* تحذيرات وملاحظات */}
        <div className="p-4 bg-yellow-900/20 rounded-xl border border-yellow-500/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <strong className="text-yellow-300">ملاحظات مهمة:</strong>
          </div>
          <ul className="text-sm text-yellow-200 space-y-1 list-disc list-inside">
            <li>تم تحسين Together AI لاستخدام نماذج متعددة مع آلية التبديل التلقائي</li>
            <li>في حالة الوصول لحد المعدل، سيتم إعادة المحاولة تلقائياً</li>
            <li>يتم انتظار 5 ثوان بين كل اختبار لتجنب حدود المعدل</li>
            <li>بعض الخدمات قد تحتاج وقت أطول للاستجابة</li>
            <li>المفاتيح محفوظة بشكل آمن في متغيرات البيئة</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// Also export as default for backward compatibility
export default APIKeyVerification
