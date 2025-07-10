"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Database, Download, Upload, FileText, BarChart3, CheckCircle } from "lucide-react"

interface Dataset {
  name: string
  description: string
  size: string
  type: string
  status: "available" | "downloading" | "processing" | "ready"
  progress?: number
  samples: number
}

export function DatasetManager() {
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      name: "SFGram Dataset",
      description: "مجموعة روايات وكتب خيال علمي في النطاق العام",
      size: "2.3 GB",
      type: "Science Fiction",
      status: "available",
      samples: 15420,
    },
    {
      name: "TinyStories",
      description: "قصص قصيرة مصنعة بواسطة GPT-3.5 وGPT-4",
      size: "45 MB",
      type: "Short Stories",
      status: "ready",
      samples: 2100000,
    },
    {
      name: "SciFi Stories Corpus",
      description: "مجموعة كبيرة من القصص الخيالية العلمية",
      size: "1.8 GB",
      type: "Science Fiction",
      status: "downloading",
      progress: 65,
      samples: 89000,
    },
    {
      name: "Arabic SciFi Collection",
      description: "مجموعة قصص خيال علمي عربية مخصصة",
      size: "890 MB",
      type: "Arabic SciFi",
      status: "processing",
      progress: 30,
      samples: 12500,
    },
  ])

  const [customDataset, setCustomDataset] = useState({
    name: "",
    description: "",
    file: null as File | null,
  })

  const downloadDataset = (datasetName: string) => {
    setDatasets((prev) =>
      prev.map((dataset) =>
        dataset.name === datasetName ? { ...dataset, status: "downloading", progress: 0 } : dataset,
      ),
    )

    // Simulate download progress
    const interval = setInterval(() => {
      setDatasets((prev) =>
        prev.map((dataset) => {
          if (dataset.name === datasetName && dataset.status === "downloading") {
            const newProgress = (dataset.progress || 0) + Math.random() * 15
            if (newProgress >= 100) {
              clearInterval(interval)
              return { ...dataset, status: "ready", progress: 100 }
            }
            return { ...dataset, progress: newProgress }
          }
          return dataset
        }),
      )
    }, 500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="outline">متاح للتحميل</Badge>
      case "downloading":
        return <Badge className="bg-blue-100 text-blue-800">جاري التحميل</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">جاري المعالجة</Badge>
      case "ready":
        return <Badge className="bg-green-100 text-green-800">جاهز للاستخدام</Badge>
      default:
        return <Badge variant="secondary">غير معروف</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "downloading":
        return <Download className="w-4 h-4 text-blue-500" />
      case "processing":
        return <BarChart3 className="w-4 h-4 text-yellow-500" />
      default:
        return <Database className="w-4 h-4 text-slate-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Dataset Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">إجمالي المجموعات</p>
                <p className="text-2xl font-bold">{datasets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-slate-600">جاهزة للاستخدام</p>
                <p className="text-2xl font-bold">{datasets.filter((d) => d.status === "ready").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600">إجمالي العينات</p>
                <p className="text-2xl font-bold">{datasets.reduce((sum, d) => sum + d.samples, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-slate-600">الحجم الإجمالي</p>
                <p className="text-2xl font-bold">5.0 GB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Datasets */}
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
                <div className="flex items-center gap-4">
                  {getStatusIcon(dataset.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold">{dataset.name}</h3>
                    <p className="text-sm text-slate-600">{dataset.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-500">{dataset.size}</span>
                      <span className="text-xs text-slate-500">{dataset.samples.toLocaleString()} عينة</span>
                      <Badge variant="outline" className="text-xs">
                        {dataset.type}
                      </Badge>
                    </div>
                    {dataset.status === "downloading" && dataset.progress !== undefined && (
                      <div className="mt-2">
                        <Progress value={dataset.progress} className="w-full" />
                        <p className="text-xs text-slate-500 mt-1">{Math.round(dataset.progress)}% مكتمل</p>
                      </div>
                    )}
                    {dataset.status === "processing" && dataset.progress !== undefined && (
                      <div className="mt-2">
                        <Progress value={dataset.progress} className="w-full" />
                        <p className="text-xs text-slate-500 mt-1">
                          معالجة البيانات... {Math.round(dataset.progress)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(dataset.status)}
                  {dataset.status === "available" && (
                    <Button size="sm" onClick={() => downloadDataset(dataset.name)}>
                      <Download className="w-4 h-4 mr-2" />
                      تحميل
                    </Button>
                  )}
                  {dataset.status === "ready" && (
                    <Button size="sm" variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      تحليل
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Custom Dataset */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            رفع مجموعة بيانات مخصصة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">اسم المجموعة</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="مثال: مجموعة قصصي الخاصة"
                  value={customDataset.name}
                  onChange={(e) => setCustomDataset({ ...customDataset, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الوصف</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="وصف مختصر للمجموعة"
                  value={customDataset.description}
                  onChange={(e) => setCustomDataset({ ...customDataset, description: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">ملف البيانات</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">اسحب وأفلت الملف هنا أو اضغط للاختيار</p>
                <p className="text-sm text-slate-500">يدعم: .txt, .json, .csv (حد أقصى 500 MB)</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  اختيار ملف
                </Button>
              </div>
            </div>
            <Button className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              رفع ومعالجة المجموعة
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
