"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Database, Upload, Download, FileText, BarChart3, Filter, Search, Trash2, RefreshCw, Plus } from "lucide-react"

export function DataTab() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const mockDatasets = [
    {
      id: 1,
      name: "Arabic Conversations",
      type: "نصوص محادثة",
      size: "125 MB",
      records: 15420,
      created: "2024-01-15",
      status: "نشط",
      quality: 94,
    },
    {
      id: 2,
      name: "Technical Documentation",
      type: "وثائق تقنية",
      size: "89 MB",
      records: 8750,
      created: "2024-01-10",
      status: "قيد المعالجة",
      quality: 87,
    },
    {
      id: 3,
      name: "Customer Support Logs",
      type: "سجلات دعم",
      size: "203 MB",
      records: 25680,
      created: "2024-01-08",
      status: "نشط",
      quality: 91,
    },
  ]

  const handleFileUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Database className="w-6 h-6 text-green-400" />
            إدارة البيانات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="datasets" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="datasets">مجموعات البيانات</TabsTrigger>
              <TabsTrigger value="upload">رفع البيانات</TabsTrigger>
              <TabsTrigger value="processing">المعالجة</TabsTrigger>
              <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            </TabsList>

            <TabsContent value="datasets" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    placeholder="البحث في مجموعات البيانات..."
                    className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                    <Filter className="w-4 h-4 ml-2" />
                    تصفية
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-500">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة جديد
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {mockDatasets.map((dataset) => (
                  <Card key={dataset.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-500/20 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{dataset.name}</h3>
                            <p className="text-sm text-gray-400">{dataset.type}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>{dataset.size}</span>
                              <span>{dataset.records.toLocaleString()} سجل</span>
                              <span>تم الإنشاء: {dataset.created}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className="text-sm text-gray-400">الجودة</div>
                            <div className="text-lg font-bold text-white">{dataset.quality}%</div>
                          </div>

                          <Badge
                            className={
                              dataset.status === "نشط"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-yellow-500/20 text-yellow-300"
                            }
                          >
                            {dataset.status}
                          </Badge>

                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    رفع البيانات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">اسحب الملفات هنا أو انقر للاختيار</h3>
                    <p className="text-gray-400 text-sm mb-4">يدعم: JSON, CSV, TXT, JSONL (حد أقصى 500 MB)</p>
                    <Button onClick={handleFileUpload} disabled={isUploading}>
                      {isUploading ? "جاري الرفع..." : "اختيار الملفات"}
                    </Button>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">جاري رفع البيانات...</span>
                        <span className="text-white">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-400">2.1GB</div>
                      <div className="text-sm text-gray-400">إجمالي البيانات</div>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">49,850</div>
                      <div className="text-sm text-gray-400">إجمالي السجلات</div>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-400">12</div>
                      <div className="text-sm text-gray-400">مجموعات البيانات</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    معالجة البيانات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "تنظيف النصوص", status: "مكتمل", progress: 100 },
                      { name: "استخراج الكلمات المفتاحية", status: "قيد التشغيل", progress: 67 },
                      { name: "تصنيف المشاعر", status: "في الانتظار", progress: 0 },
                      { name: "ترجمة النصوص", status: "في الانتظار", progress: 0 },
                    ].map((task, index) => (
                      <div key={index} className="p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{task.name}</span>
                          <Badge
                            className={
                              task.status === "مكتمل"
                                ? "bg-green-500/20 text-green-300"
                                : task.status === "قيد التشغيل"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-gray-500/20 text-gray-300"
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                        <div className="text-xs text-gray-400 mt-1">{task.progress}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">إجمالي السجلات</span>
                    </div>
                    <div className="text-2xl font-bold text-white">49,850</div>
                    <div className="text-xs text-green-400">+12% من الشهر الماضي</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-400">حجم البيانات</span>
                    </div>
                    <div className="text-2xl font-bold text-white">2.1 GB</div>
                    <div className="text-xs text-green-400">+8% من الشهر الماضي</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-400">متوسط الجودة</span>
                    </div>
                    <div className="text-2xl font-bold text-white">91.2%</div>
                    <div className="text-xs text-green-400">+3% من الشهر الماضي</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-400">قيد المعالجة</span>
                    </div>
                    <div className="text-2xl font-bold text-white">3</div>
                    <div className="text-xs text-yellow-400">مهام نشطة</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">توزيع أنواع البيانات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: "نصوص محادثة", percentage: 45, color: "bg-blue-500" },
                      { type: "وثائق تقنية", percentage: 30, color: "bg-green-500" },
                      { type: "سجلات دعم", percentage: 15, color: "bg-purple-500" },
                      { type: "أخرى", percentage: 10, color: "bg-gray-500" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-16 text-sm text-gray-400">{item.percentage}%</div>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }} />
                        </div>
                        <div className="text-sm text-white">{item.type}</div>
                      </div>
                    ))}
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
