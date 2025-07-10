"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Brain, Play, Pause, Square, Settings, TrendingUp, Clock, Cpu } from "lucide-react"

interface TrainingJob {
  id: string
  name: string
  model: string
  dataset: string
  status: "running" | "paused" | "completed" | "failed"
  progress: number
  epoch: number
  totalEpochs: number
  loss: number
  accuracy: number
  timeRemaining: string
  startTime: string
}

export function TrainingDashboard() {
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([
    {
      id: "1",
      name: "DeepSeek R1 - SciFi Stories",
      model: "DeepSeek R1",
      dataset: "SFGram Dataset",
      status: "running",
      progress: 45,
      epoch: 3,
      totalEpochs: 10,
      loss: 0.234,
      accuracy: 87.5,
      timeRemaining: "2h 15m",
      startTime: "2024-01-15 14:30",
    },
    {
      id: "2",
      name: "Llama3 - Arabic Stories",
      model: "Llama3",
      dataset: "Arabic SciFi Collection",
      status: "completed",
      progress: 100,
      epoch: 5,
      totalEpochs: 5,
      loss: 0.156,
      accuracy: 92.3,
      timeRemaining: "0m",
      startTime: "2024-01-14 09:00",
    },
  ])

  const [newTraining, setNewTraining] = useState({
    name: "",
    model: "deepseek-r1",
    dataset: "sfgram",
    epochs: 5,
    learningRate: 0.0001,
    batchSize: 16,
  })

  const startTraining = () => {
    const newJob: TrainingJob = {
      id: Date.now().toString(),
      name: newTraining.name || `${newTraining.model} - Training`,
      model: newTraining.model,
      dataset: newTraining.dataset,
      status: "running",
      progress: 0,
      epoch: 0,
      totalEpochs: newTraining.epochs,
      loss: 1.0,
      accuracy: 0,
      timeRemaining: "Calculating...",
      startTime: new Date().toLocaleString(),
    }

    setTrainingJobs([...trainingJobs, newJob])

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingJobs((prev) =>
        prev.map((job) => {
          if (job.id === newJob.id && job.status === "running") {
            const newProgress = Math.min(job.progress + Math.random() * 5, 100)
            const newEpoch = Math.floor((newProgress / 100) * job.totalEpochs)
            const newLoss = Math.max(0.1, job.loss - Math.random() * 0.05)
            const newAccuracy = Math.min(95, job.accuracy + Math.random() * 2)

            if (newProgress >= 100) {
              clearInterval(interval)
              return { ...job, status: "completed", progress: 100, epoch: job.totalEpochs }
            }

            return {
              ...job,
              progress: newProgress,
              epoch: newEpoch,
              loss: newLoss,
              accuracy: newAccuracy,
            }
          }
          return job
        }),
      )
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">قيد التشغيل</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">متوقف مؤقتاً</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">مكتمل</Badge>
      case "failed":
        return <Badge variant="destructive">فشل</Badge>
      default:
        return <Badge variant="secondary">غير معروف</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Training Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">مهام التدريب النشطة</p>
                <p className="text-2xl font-bold">{trainingJobs.filter((j) => j.status === "running").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-slate-600">مهام مكتملة</p>
                <p className="text-2xl font-bold">{trainingJobs.filter((j) => j.status === "completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600">استخدام GPU</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-slate-600">الوقت المتبقي</p>
                <p className="text-2xl font-bold">2h 15m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Training Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            مهام التدريب الحالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{job.name}</h3>
                    <p className="text-sm text-slate-600">
                      {job.model} • {job.dataset} • بدأ في {job.startTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(job.status)}
                    {job.status === "running" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Square className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">التقدم</p>
                    <p className="text-lg font-bold">{Math.round(job.progress)}%</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">العصر الحالي</p>
                    <p className="text-lg font-bold">
                      {job.epoch}/{job.totalEpochs}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">الخسارة</p>
                    <p className="text-lg font-bold">{job.loss.toFixed(3)}</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">الدقة</p>
                    <p className="text-lg font-bold">{job.accuracy.toFixed(1)}%</p>
                  </div>
                </div>

                <Progress value={job.progress} className="w-full" />
                {job.status === "running" && (
                  <p className="text-sm text-slate-500 mt-2">الوقت المتبقي: {job.timeRemaining}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Training Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            بدء تدريب جديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">اسم المهمة</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="مثال: تدريب قصص الخيال العلمي"
                  value={newTraining.name}
                  onChange={(e) => setNewTraining({ ...newTraining, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">النموذج الأساسي</label>
                <Select
                  value={newTraining.model}
                  onValueChange={(value) => setNewTraining({ ...newTraining, model: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek-r1">DeepSeek R1 (70B)</SelectItem>
                    <SelectItem value="llama3">Llama3 (8B)</SelectItem>
                    <SelectItem value="custom">نموذج مخصص</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">مجموعة البيانات</label>
                <Select
                  value={newTraining.dataset}
                  onValueChange={(value) => setNewTraining({ ...newTraining, dataset: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sfgram">SFGram Dataset</SelectItem>
                    <SelectItem value="tinystories">TinyStories</SelectItem>
                    <SelectItem value="arabic-scifi">Arabic SciFi Collection</SelectItem>
                    <SelectItem value="custom">مجموعة مخصصة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">عدد العصور: {newTraining.epochs}</label>
                <Slider
                  value={[newTraining.epochs]}
                  onValueChange={(value) => setNewTraining({ ...newTraining, epochs: value[0] })}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">معدل التعلم: {newTraining.learningRate}</label>
                <Slider
                  value={[newTraining.learningRate * 10000]}
                  onValueChange={(value) => setNewTraining({ ...newTraining, learningRate: value[0] / 10000 })}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">حجم الدفعة: {newTraining.batchSize}</label>
                <Slider
                  value={[newTraining.batchSize]}
                  onValueChange={(value) => setNewTraining({ ...newTraining, batchSize: value[0] })}
                  max={64}
                  min={4}
                  step={4}
                  className="w-full"
                />
              </div>

              <Button onClick={startTraining} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                بدء التدريب
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
