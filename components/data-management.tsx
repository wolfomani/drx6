"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Upload, Download, BarChart3, Settings, Play } from "lucide-react"

export function DataManagement() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [isTraining, setIsTraining] = useState(false)

  const datasets = [
    {
      name: "Arabic Stories Dataset",
      size: "2.3 GB",
      samples: 15420,
      status: "ready",
      type: "Stories",
    },
    {
      name: "Technical Documentation",
      size: "890 MB",
      samples: 8500,
      status: "processing",
      type: "Technical",
    },
    {
      name: "Conversational Data",
      size: "1.2 GB",
      samples: 25000,
      status: "ready",
      type: "Chat",
    },
  ]

  const trainingJobs = [
    {
      name: "Story Generation Model",
      dataset: "Arabic Stories Dataset",
      progress: 75,
      status: "running",
      eta: "2h 15m",
    },
    {
      name: "Technical Assistant",
      dataset: "Technical Documentation",
      progress: 100,
      status: "completed",
      eta: "0m",
    },
  ]

  const startTraining = () => {
    setIsTraining(true)
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + Math.random() * 5
      })
    }, 1000)
  }

  const simulateUpload = () => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 500)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="datasets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="datasets">مجموعات البيانات</TabsTrigger>
          <TabsTrigger value="training">التدريب</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                رفع البيانات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">اسحب وأفلت الملفات هنا أو اضغط للاختيار</p>
                <p className="text-sm text-slate-500">يدعم: .txt, .json, .csv, .jsonl</p>
                <Button onClick={simulateUpload} className="mt-4">
                  اختيار ملفات
                </Button>
              </div>
              {uploadProgress > 0 && (
                <div>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-slate-500 mt-1">جاري الرفع... {Math.round(uploadProgress)}%</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Datasets List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                مجموعات البيانات المتاحة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {datasets.map((dataset, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{dataset.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-slate-600">{dataset.size}</span>
                        <span className="text-sm text-slate-600">{dataset.samples.toLocaleString()} عينة</span>
                        <Badge variant="outline">{dataset.type}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={dataset.status === "ready" ? "default" : "secondary"}
                        className={dataset.status === "ready" ? "bg-green-100 text-green-800" : ""}
                      >
                        {dataset.status === "ready" ? "جاهز" : "معالجة"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        تحميل
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          {/* Training Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                بدء تدريب جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">اسم النموذج</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="مثال: نموذج القصص" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">مجموعة البيانات</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Arabic Stories Dataset</option>
                    <option>Technical Documentation</option>
                    <option>Conversational Data</option>
                  </select>
                </div>
              </div>
              <Button onClick={startTraining} disabled={isTraining} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                {isTraining ? "جاري التدريب..." : "بدء التدريب"}
              </Button>
              {isTraining && (
                <div>
                  <Progress value={trainingProgress} className="w-full" />
                  <p className="text-sm text-slate-500 mt-1">التقدم: {Math.round(trainingProgress)}%</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Training Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>مهام التدريب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingJobs.map((job, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{job.name}</h3>
                      <Badge
                        variant={job.status === "completed" ? "default" : "secondary"}
                        className={
                          job.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }
                      >
                        {job.status === "completed" ? "مكتمل" : "قيد التشغيل"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">البيانات: {job.dataset}</p>
                    <Progress value={job.progress} className="w-full mb-2" />
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>التقدم: {job.progress}%</span>
                      <span>الوقت المتبقي: {job.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-slate-600">إجمالي البيانات</p>
                    <p className="text-2xl font-bold">4.4 GB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-slate-600">نماذج مدربة</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-slate-600">مهام نشطة</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-slate-600">ساعات تدريب</p>
                    <p className="text-2xl font-bold">247</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>أداء النماذج</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">رسم بياني لأداء النماذج</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
