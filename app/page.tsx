"use client"

import { useState } from "react"
import { ApiKeyVerification } from "@/components/api-key-verification"
import { ConnectionTest } from "@/components/connection-test"
import { EnhancedDiscussionV3 } from "@/components/enhanced-discussion-v3"
import { AdvancedTools } from "@/components/advanced-tools"
import { TrainingTab } from "@/components/training-tab"
import { DataTab } from "@/components/data-tab"
import { EnvStatus } from "@/components/env-status"
import { APIHealthStatus } from "@/components/api-health-status"
import { UnifiedDashboard } from "@/components/unified-dashboard"
import { UnifiedNavbar } from "@/components/unified-navbar"
import { AppLauncher } from "@/components/app-launcher"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Brain,
  MessageSquare,
  Zap,
  Key,
  TestTube,
  Database,
  TrendingUp,
  Settings,
  BarChart3,
  Activity,
  Grid3X3,
} from "lucide-react"

export default function Home() {
  const [currentSection, setCurrentSection] = useState("dashboard")

  const handleNavigation = (section: string) => {
    setCurrentSection(section)
  }

  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return <UnifiedDashboard />

      case "verification":
        return (
          <div className="space-y-6">
            <ApiKeyVerification />
            <EnvStatus />
          </div>
        )

      case "health":
        return <APIHealthStatus />

      case "discussion":
        return <EnhancedDiscussionV3 />

      case "tools":
        return <AdvancedTools />

      case "testing":
        return <ConnectionTest />

      case "training":
        return <TrainingTab />

      case "data":
        return <DataTab />

      case "quality":
        return (
          <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                تقييم الجودة
              </CardTitle>
              <CardDescription className="text-gray-400">تحليل وتقييم جودة النماذج والاستجابات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">قريباً</h3>
                <p className="text-gray-400">سيتم إضافة أدوات تقييم الجودة قريباً</p>
              </div>
            </CardContent>
          </Card>
        )

      case "advanced":
        return (
          <Card className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Settings className="w-6 h-6 text-red-400" />
                الإعدادات المتقدمة
              </CardTitle>
              <CardDescription className="text-gray-400">إعدادات النظام والتكوين المتقدم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">قريباً</h3>
                <p className="text-gray-400">سيتم إضافة الإعدادات المتقدمة قريباً</p>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return <UnifiedDashboard />
    }
  }

  // If showing dashboard, render it directly without tabs
  if (currentSection === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <UnifiedNavbar currentApp="مركز التطبيقات الموحد" onNavigate={handleNavigation} />
        <UnifiedDashboard />
        <AppLauncher />
      </div>
    )
  }

  // For other sections, show the tabbed interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <UnifiedNavbar currentApp="منصة الذكاء الاصطناعي المتقدمة" onNavigate={handleNavigation} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentSection("dashboard")}
              className="text-gray-400 hover:text-white"
            >
              <Grid3X3 className="w-5 h-5 mr-2" />
              العودة للرئيسية
            </Button>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              منصة الذكاء الاصطناعي المتقدمة
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            منصة شاملة للتفاعل مع نماذج الذكاء الاصطناعي المتعددة مع أدوات متقدمة للمناقشة والتحليل
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={currentSection} onValueChange={setCurrentSection} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-9 bg-gray-800 border-gray-700">
            <TabsTrigger
              value="verification"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">المفاتيح</span>
            </TabsTrigger>
            <TabsTrigger
              value="health"
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">الصحة</span>
            </TabsTrigger>
            <TabsTrigger
              value="discussion"
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">المناقشة</span>
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">الأدوات</span>
            </TabsTrigger>
            <TabsTrigger
              value="testing"
              className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              <TestTube className="w-4 h-4" />
              <span className="hidden sm:inline">الاختبار</span>
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">التدريب</span>
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">البيانات</span>
            </TabsTrigger>
            <TabsTrigger
              value="quality"
              className="flex items-center gap-2 data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">الجودة</span>
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">متقدم</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">{renderContent()}</div>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>مركز التطبيقات الموحد - مدعوم بـ GROQ, Together AI, و Gemini</p>
          <p className="mt-1">جميع الخدمات تعمل بشكل صحيح ✅</p>
        </div>
      </div>

      <AppLauncher />
    </div>
  )
}
