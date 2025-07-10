"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, CheckCircle, XCircle, AlertCircle, RefreshCw, Clock, Zap, Brain } from "lucide-react"

interface ServiceStatus {
  name: string
  status: "healthy" | "degraded" | "down" | "checking"
  responseTime: number
  lastChecked: Date
  error?: string
  retries?: number
  icon: React.ReactNode
}

export function APIHealthStatus() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "GROQ",
      status: "checking",
      responseTime: 0,
      lastChecked: new Date(),
      icon: <Zap className="w-4 h-4" />,
    },
    {
      name: "Together AI",
      status: "checking",
      responseTime: 0,
      lastChecked: new Date(),
      icon: <Brain className="w-4 h-4" />,
    },
    {
      name: "Gemini",
      status: "checking",
      responseTime: 0,
      lastChecked: new Date(),
      icon: <Activity className="w-4 h-4" />,
    },
  ])

  const [isChecking, setIsChecking] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const checkServiceHealth = async (serviceName: string, endpoint: string) => {
    const startTime = Date.now()

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "اختبار سريع للحالة",
          config: { maxOutputTokens: 50 },
        }),
        signal: AbortSignal.timeout(15000), // 15 ثانية timeout
      })

      const responseTime = Date.now() - startTime
      const data = await response.json()

      if (response.ok && data.response) {
        return {
          status: "healthy" as const,
          responseTime,
          error: undefined,
          retries: data.retries || 0,
        }
      } else if (response.status === 503) {
        return {
          status: "degraded" as const,
          responseTime,
          error: "الخدمة محملة بشكل زائد",
          retries: data.retries || 0,
        }
      } else {
        return {
          status: "down" as const,
          responseTime,
          error: data.error || `خطأ HTTP ${response.status}`,
          retries: 0,
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      return {
        status: "down" as const,
        responseTime,
        error: error instanceof Error ? error.message : "خطأ في الاتصال",
        retries: 0,
      }
    }
  }

  const checkAllServices = async () => {
    setIsChecking(true)

    const endpoints = [
      { name: "GROQ", endpoint: "/api/groq" },
      { name: "Together AI", endpoint: "/api/together" },
      { name: "Gemini", endpoint: "/api/gemini" },
    ]

    const results = await Promise.allSettled(endpoints.map(({ name, endpoint }) => checkServiceHealth(name, endpoint)))

    setServices((prev) =>
      prev.map((service, index) => {
        const result = results[index]
        const now = new Date()

        if (result.status === "fulfilled") {
          return {
            ...service,
            ...result.value,
            lastChecked: now,
          }
        } else {
          return {
            ...service,
            status: "down" as const,
            responseTime: 0,
            error: "فشل في الفحص",
            lastChecked: now,
          }
        }
      }),
    )

    setLastUpdate(new Date())
    setIsChecking(false)
  }

  useEffect(() => {
    checkAllServices()

    // فحص تلقائي كل 5 دقائق
    const interval = setInterval(checkAllServices, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "down":
        return "bg-red-500"
      case "checking":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "degraded":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "down":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "checking":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return "يعمل بشكل طبيعي"
      case "degraded":
        return "يعمل مع تأخير"
      case "down":
        return "غير متاح"
      case "checking":
        return "جاري الفحص..."
      default:
        return "غير معروف"
    }
  }

  const overallHealth = services.every((s) => s.status === "healthy")
    ? "healthy"
    : services.some((s) => s.status === "healthy")
      ? "degraded"
      : "down"

  const healthyCount = services.filter((s) => s.status === "healthy").length
  const healthPercentage = (healthyCount / services.length) * 100

  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-blue-400" />
            <div>
              <CardTitle className="text-white">مراقبة صحة الخدمات</CardTitle>
              <CardDescription className="text-gray-400">حالة خدمات الذكاء الاصطناعي في الوقت الفعلي</CardDescription>
            </div>
          </div>
          <Button onClick={checkAllServices} disabled={isChecking} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
            تحديث
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* الحالة العامة */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">الحالة العامة</span>
            <Badge variant={overallHealth === "healthy" ? "default" : "destructive"}>
              {healthyCount}/{services.length} خدمات تعمل
            </Badge>
          </div>
          <Progress value={healthPercentage} className="h-2" />
        </div>

        {/* تفاصيل الخدمات */}
        <div className="grid gap-4">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {service.icon}
                  <span className="font-medium text-white">{service.name}</span>
                </div>
                {getStatusIcon(service.status)}
              </div>

              <div className="flex items-center gap-4 text-sm">
                {service.status !== "checking" && (
                  <>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      {service.responseTime}ms
                    </div>
                    {service.retries && service.retries > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {service.retries} محاولات
                      </Badge>
                    )}
                  </>
                )}
                <Badge variant="outline" className={`${getStatusColor(service.status)} text-white border-0`}>
                  {getStatusText(service.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* معلومات إضافية */}
        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>آخر تحديث: {lastUpdate.toLocaleTimeString("ar-SA")}</span>
            <span>التحديث التلقائي كل 5 دقائق</span>
          </div>

          {services.some((s) => s.error) && (
            <div className="mt-3 space-y-2">
              <h4 className="text-sm font-medium text-red-400">الأخطاء الحالية:</h4>
              {services
                .filter((s) => s.error)
                .map((service) => (
                  <div key={service.name} className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
                    <strong>{service.name}:</strong> {service.error}
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
