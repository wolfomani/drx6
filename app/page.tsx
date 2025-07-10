"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { APIKeyVerification } from "@/components/api-key-verification"
import { APIHealthStatus } from "@/components/api-health-status"
import { EnhancedDiscussionV3 } from "@/components/enhanced-discussion-v3"
import { AdvancedTools } from "@/components/advanced-tools"
import { ModelTesting } from "@/components/model-testing"
import { TrainingTab } from "@/components/training-tab"
import { DataTab } from "@/components/data-tab"
import { QualityEvaluator } from "@/components/quality-evaluator"
import { SettingsTab } from "@/components/settings-tab"
import { UnifiedDashboard } from "@/components/unified-dashboard"
import { AppLauncher } from "@/components/app-launcher"
import { Brain, Sparkles, Users, Heart, User, FileText, ExternalLink, Github, Globe } from 'lucide-react'
import Link from "next/link"

export default function Home() {
  const [showUnifiedDashboard, setShowUnifiedDashboard] = useState(false)

  if (showUnifiedDashboard) {
    return <UnifiedDashboard onBack={() => setShowUnifiedDashboard(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header with Personal Welcome */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Personal Introduction */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="/profile-photo.jpg"
                  alt="عبدالعزيز الحمداني"
                  className="w-16 h-16 rounded-full object-cover border-3 border-blue-500/30"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">👋 أهلاً بك، أنا عبدالعزيز الحمداني</h1>
                <p className="text-slate-300">مطور تطبيقات وواجهات أمامية | مطور ذكاء اصطناعي شغوف</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link href="/cv">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white">
                  <User className="w-4 h-4 mr-2" />
                  السيرة الذاتية
                </Button>
              </Link>
              <Button
                onClick={() => setShowUnifiedDashboard(true)}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                مركز التطبيقات الموحد
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Values Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">الشغف بالتكنولوجيا</h3>
              <p className="text-slate-300 text-sm">
                أعيش كل لحظة مع شغف تكنولوجيا الذكاء الاصطناعي والتطوير المستمر
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">التعاون والمشاركة</h3>
              <p className="text-slate-300 text-sm">
                أؤمن بأن التواصل والانفتاح مع الآخرين هما مفتاح النجاح
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">التطبيق العملي</h3>
              <p className="text-slate-300 text-sm">
                أؤمن بضرورة تطبيق ما تعلمته في مشاريع عملية لتحسين حياة الناس
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Platform */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">منصة الذكاء الاصطناعي المتقدمة</h2>
                  <p className="text-sm text-gray-300 mt-1">
                    منصة شاملة للتفاعل مع نماذج الذكاء الاصطناعي المتعددة مع أدوات متقدمة للمناقشة والتحليل
                  </p>
                </div>
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => window.open("https://drx6.vercel.app", "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  المشروع المباشر
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => window.open("https://github.com/wolfomani/drx6", "_blank")}
                >
                  <Github className="w-4 h-4 mr-2" />
                  الكود المصدري
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="verification" className="w-full" dir="rtl">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 bg-slate-700/50">
                <TabsTrigger value="verification" className="text-xs">تحقق</TabsTrigger>
                <TabsTrigger value="health" className="text-xs">صحة</TabsTrigger>
                <TabsTrigger value="discussion" className="text-xs">مناقشة</TabsTrigger>
                <TabsTrigger value="tools" className="text-xs">أدوات</TabsTrigger>
                <TabsTrigger value="testing" className="text-xs">اختبار</TabsTrigger>
                <TabsTrigger value="training" className="text-xs">تدريب</TabsTrigger>
                <TabsTrigger value="data" className="text-xs">بيانات</TabsTrigger>
                <TabsTrigger value="quality" className="text-xs">جودة</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">متقدم</TabsTrigger>
              </TabsList>

              <TabsContent value="verification" className="mt-6">
                <APIKeyVerification />
              </TabsContent>

              <TabsContent value="health" className="mt-6">
                <APIHealthStatus />
              </TabsContent>

              <TabsContent value="discussion" className="mt-6">
                <EnhancedDiscussionV3 />
              </TabsContent>

              <TabsContent value="tools" className="mt-6">
                <AdvancedTools />
              </TabsContent>

              <TabsContent value="testing" className="mt-6">
                <ModelTesting />
              </TabsContent>

              <TabsContent value="training" className="mt-6">
                <TrainingTab />
              </TabsContent>

              <TabsContent value="data" className="mt-6">
                <DataTab />
              </TabsContent>

              <TabsContent value="quality" className="mt-6">
                <QualityEvaluator />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <SettingsTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Floating App Launcher */}
      <AppLauncher />
    </div>
  )
}
