"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Database, TrendingUp, Settings, Play, Pause, Square, BarChart3, Zap } from "lucide-react"

export function TrainingTab() {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)

  const mockTrainingData = {
    currentEpoch: 15,
    totalEpochs: 100,
    loss: 0.234,
    accuracy: 0.892,
    learningRate: 0.001,
    batchSize: 32,
    datasetSize: 10000,
    estimatedTimeRemaining: "2h 34m",
  }

  const startTraining = () => {
    setIsTraining(true)
    // محاكاة التدريب
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + 1
      })
    }, 100)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Brain className="w-6 h-6 text-purple-400" />
            تدريب النماذج
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="datasets">البيانات</TabsTrigger>
              <TabsTrigger value="models">النماذج</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-400">الدقة</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{(mockTrainingData.accuracy * 100).toFixed(1)}%</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-gray-400">الخسارة</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{mockTrainingData.loss.toFixed(3)}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">معدل التعلم</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{mockTrainingData.learningRate}</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>حالة التدريب</span>
                    <Badge className={isTraining ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}>
                      {isTraining ? "قيد التدريب" : "متوقف"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">التقدم</span>
                      <span className="text-white">{trainingProgress}%</span>
                    </div>
                    <Progress value={trainingProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">العصر الحالي:</span>
                      <div className="text-white font-bold">{mockTrainingData.currentEpoch}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">إجمالي العصور:</span>
                      <div className="text-white font-bold">{mockTrainingData.totalEpochs}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">حجم الدفعة:</span>
                      <div className="text-white font-bold">{mockTrainingData.batchSize}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">الوقت المتبقي:</span>
                      <div className="text-white font-bold">{mockTrainingData.estimatedTimeRemaining}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={startTraining} disabled={isTraining} className="bg-green-600 hover:bg-green-500">
                      <Play className="w-4 h-4 ml-2" />
                      بدء التدريب
                    </Button>
                    <Button
                      disabled={!isTraining}
                      variant="outline"
                      className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
                    >
                      <Pause className="w-4 h-4 ml-2" />
                      إيقاف مؤقت
                    </Button>
                    <Button
                      disabled={!isTraining}
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      <Square className="w-4 h-4 ml-2" />
                      إيقاف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="datasets" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    مجموعات البيانات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Arabic Text Dataset", size: "50MB", samples: "10,000", status: "جاهز" },
                      { name: "Conversation Dataset", size: "120MB", samples: "25,000", status: "قيد المعالجة" },
                      { name: "Technical Documentation", size: "80MB", samples: "15,000", status: "جاهز" },
                    ].map((dataset, index) => (
                      <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{dataset.name}</h4>
                            <p className="text-sm text-gray-400">
                              {dataset.size} • {dataset.samples} عينة
                            </p>
                          </div>
                          <Badge
                            className={
                              dataset.status === "جاهز"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-yellow-500/20 text-yellow-300"
                            }
                          >
                            {dataset.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="models" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    النماذج المتاحة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "GPT-3.5 Fine-tuned", type: "Text Generation", status: "مدرب", accuracy: "94.2%" },
                      { name: "BERT Arabic", type: "Text Classification", status: "قيد التدريب", accuracy: "89.1%" },
                      { name: "Custom Transformer", type: "Conversation", status: "جديد", accuracy: "N/A" },
                    ].map((model, index) => (
                      <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{model.name}</h4>
                            <p className="text-sm text-gray-400">{model.type}</p>
                          </div>
                          <div className="text-left">
                            <Badge
                              className={
                                model.status === "مدرب"
                                  ? "bg-green-500/20 text-green-300"
                                  : model.status === "قيد التدريب"
                                    ? "bg-blue-500/20 text-blue-300"
                                    : "bg-gray-500/20 text-gray-300"
                              }
                            >
                              {model.status}
                            </Badge>
                            <p className="text-sm text-gray-400 mt-1">دقة: {model.accuracy}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    إعدادات التدريب
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">معدل التعلم</label>
                        <input
                          type="number"
                          step="0.0001"
                          defaultValue="0.001"
                          className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">حجم الدفعة</label>
                        <input
                          type="number"
                          defaultValue="32"
                          className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">عدد العصور</label>
                        <input
                          type="number"
                          defaultValue="100"
                          className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">نوع المحسن</label>
                        <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                          <option>Adam</option>
                          <option>SGD</option>
                          <option>AdamW</option>
                        </select>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-500">حفظ الإعدادات</Button>
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
