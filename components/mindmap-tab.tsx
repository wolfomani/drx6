"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranch, Plus, Download, Share, Zap, Brain, Settings, Palette } from "lucide-react"

export function MindmapTab() {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [mindmapData, setMindmapData] = useState(null)

  const mockMindmapData = {
    central: "الذكاء الاصطناعي",
    branches: [
      {
        title: "التعلم الآلي",
        color: "blue",
        subbranches: ["التعلم المراقب", "التعلم غير المراقب", "التعلم المعزز"],
      },
      {
        title: "معالجة اللغات الطبيعية",
        color: "green",
        subbranches: ["تحليل المشاعر", "الترجمة الآلية", "توليد النصوص"],
      },
      {
        title: "الرؤية الحاسوبية",
        color: "purple",
        subbranches: ["تمييز الصور", "كشف الأشياء", "التعرف على الوجوه"],
      },
      {
        title: "الروبوتات",
        color: "orange",
        subbranches: ["الروبوتات الصناعية", "الروبوتات الطبية", "الروبوتات المنزلية"],
      },
    ],
  }

  const generateMindmap = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    // محاكاة توليد الخريطة الذهنية
    setTimeout(() => {
      setMindmapData(mockMindmapData)
      setIsGenerating(false)
    }, 3000)
  }

  const getColorClass = (color: string) => {
    const colors = {
      blue: "bg-blue-500/20 text-blue-300 border-blue-500",
      green: "bg-green-500/20 text-green-300 border-green-500",
      purple: "bg-purple-500/20 text-purple-300 border-purple-500",
      orange: "bg-orange-500/20 text-orange-300 border-orange-500",
      red: "bg-red-500/20 text-red-300 border-red-500",
      yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <GitBranch className="w-6 h-6 text-purple-400" />
            مولد الخرائط الذهنية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="generator">المولد</TabsTrigger>
              <TabsTrigger value="templates">القوالب</TabsTrigger>
              <TabsTrigger value="gallery">المعرض</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-4">
              {/* إدخال الموضوع */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="أدخل موضوع الخريطة الذهنية..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && generateMindmap()}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button onClick={generateMindmap} disabled={isGenerating} className="bg-purple-600 hover:bg-purple-500">
                  {isGenerating ? <Zap className="w-4 h-4 animate-pulse" /> : <Brain className="w-4 h-4" />}
                  {isGenerating ? "جاري التوليد..." : "توليد"}
                </Button>
              </div>

              {/* عرض الخريطة الذهنية */}
              {mindmapData && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>الخريطة الذهنية: {mindmapData.central}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                          <Download className="w-4 h-4 ml-2" />
                          تحميل
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                          <Share className="w-4 h-4 ml-2" />
                          مشاركة
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* العقدة المركزية */}
                      <div className="flex justify-center mb-8">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
                          {mindmapData.central}
                        </div>
                      </div>

                      {/* الفروع الرئيسية */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mindmapData.branches.map((branch, index) => (
                          <div key={index} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className={`px-4 py-2 rounded-lg border ${getColorClass(branch.color)}`}>
                                <span className="font-medium">{branch.title}</span>
                              </div>
                            </div>

                            {/* الفروع الفرعية */}
                            <div className="ml-6 space-y-2">
                              {branch.subbranches.map((subbranch, subIndex) => (
                                <div key={subIndex} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-gray-300 text-sm">{subbranch}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* أدوات التحكم */}
                      <div className="flex justify-center gap-2 mt-8">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                          <Plus className="w-4 h-4 ml-2" />
                          إضافة فرع
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                          <Palette className="w-4 h-4 ml-2" />
                          تغيير الألوان
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                          <Settings className="w-4 h-4 ml-2" />
                          تخصيص
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* رسالة البداية */}
              {!mindmapData && !isGenerating && (
                <div className="text-center py-12">
                  <GitBranch className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">أنشئ خريطتك الذهنية</h3>
                  <p className="text-gray-400">أدخل موضوعاً وسنقوم بتوليد خريطة ذهنية شاملة له</p>
                </div>
              )}

              {/* رسالة التوليد */}
              {isGenerating && (
                <div className="text-center py-12">
                  <Zap className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-white mb-2">جاري توليد الخريطة الذهنية</h3>
                  <p className="text-gray-400">يتم تحليل الموضوع وإنشاء الفروع...</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "خريطة تعليمية", description: "للمواضيع الأكاديمية", color: "blue" },
                  { name: "خريطة عمل", description: "لإدارة المشاريع", color: "green" },
                  { name: "خريطة إبداعية", description: "للعصف الذهني", color: "purple" },
                  { name: "خريطة تقنية", description: "للمفاهيم التقنية", color: "orange" },
                  { name: "خريطة شخصية", description: "للأهداف الشخصية", color: "pink" },
                  { name: "خريطة استراتيجية", description: "للتخطيط الاستراتيجي", color: "red" },
                ].map((template, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-4 h-4 rounded-full bg-${template.color}-500`}></div>
                        <h3 className="text-white font-medium">{template.name}</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                      <Button size="sm" className="w-full bg-gray-700 hover:bg-gray-600">
                        استخدام القالب
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "الذكاء الاصطناعي", branches: 4, created: "منذ يوم" },
                  { title: "التسويق الرقمي", branches: 6, created: "منذ 3 أيام" },
                  { title: "إدارة المشاريع", branches: 5, created: "منذ أسبوع" },
                  { title: "تطوير البرمجيات", branches: 7, created: "منذ أسبوعين" },
                ].map((item, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500">
                          {item.branches} فروع
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">تم الإنشاء {item.created}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-500">
                          فتح
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                          تحرير
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                          نسخ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    إعدادات الخرائط الذهنية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">نمط الخريطة الافتراضي</label>
                      <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                        <option>شعاعي</option>
                        <option>هرمي</option>
                        <option>شبكي</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">عدد الفروع الافتراضي</label>
                      <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                        <option>3-5 فروع</option>
                        <option>5-7 فروع</option>
                        <option>7-10 فروع</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">نظام الألوان</label>
                      <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                        <option>ألوان متدرجة</option>
                        <option>ألوان متباينة</option>
                        <option>أحادي اللون</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-white text-sm">حفظ تلقائي</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-white text-sm">إظهار الأيقونات</label>
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-500">حفظ الإعدادات</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
