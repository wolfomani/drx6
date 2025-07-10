"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Users, Brain, Zap, Globe } from "lucide-react"

interface DiscussionMessage {
  model: string
  modelId: string
  message: string
  timestamp: number
  error?: boolean
}

export function AIDiscussion() {
  const [topic, setTopic] = useState("")
  const [discussionHistory, setDiscussionHistory] = useState<DiscussionMessage[]>([])
  const [isDiscussing, setIsDiscussing] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [progress, setProgress] = useState(0)

  const models = [
    { id: "together", name: "ديب سيك", icon: Brain, color: "blue", role: "المحلل المنطقي" },
    { id: "gemini", name: "جيمناي", icon: Zap, color: "purple", role: "المبدع المبتكر" },
    { id: "groq", name: "جروك", icon: Globe, color: "green", role: "المنفذ السريع" },
  ]

  const startDiscussion = async () => {
    if (!topic.trim()) return

    setIsDiscussing(true)
    setDiscussionHistory([])
    setCurrentRound(0)
    setProgress(0)

    const totalRounds = 3

    for (let round = 0; round < totalRounds; round++) {
      setCurrentRound(round + 1)
      setProgress(((round + 1) / totalRounds) * 100)

      try {
        const response = await fetch("/api/discussion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: topic,
            round,
            previousDiscussion: discussionHistory.slice(-6), // Last 6 messages for context
          }),
        })

        const data = await response.json()

        if (data.responses) {
          setDiscussionHistory((prev) => [...prev, ...data.responses])
        }

        // Wait between rounds
        if (round < totalRounds - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      } catch (error) {
        console.error("Discussion round error:", error)
      }
    }

    setIsDiscussing(false)
  }

  const getModelStyle = (modelId: string) => {
    const model = models.find((m) => m.id === modelId)
    if (!model) return { bg: "bg-slate-50", border: "border-l-slate-500", text: "text-slate-700" }

    return {
      bg: `bg-${model.color}-50`,
      border: `border-l-${model.color}-500`,
      text: `text-${model.color}-700`,
    }
  }

  const sampleTopics = [
    "كيف يمكن تطوير نظام ذكي لإدارة المدن المستدامة؟",
    "ما هي أفضل استراتيجية لتعليم البرمجة للأطفال؟",
    "كيف نحل مشكلة التغير المناخي باستخدام التكنولوجيا؟",
    "ما هو مستقبل العمل عن بُعد والذكاء الاصطناعي؟",
  ]

  return (
    <div className="space-y-6">
      {/* Discussion Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            نقاش تفاعلي بين النماذج الثلاثة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Model Participants */}
          <div>
            <label className="text-sm font-medium mb-2 block">المشاركون في النقاش:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {models.map((model) => (
                <div key={model.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <model.icon className={`w-6 h-6 text-${model.color}-600`} />
                  <div>
                    <div className="font-semibold">{model.name}</div>
                    <div className="text-xs text-slate-600">{model.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Topics */}
          <div>
            <label className="text-sm font-medium mb-2 block">مواضيع مقترحة:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sampleTopics.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopic(sample)}
                  className="text-xs text-right h-auto p-2"
                >
                  {sample}
                </Button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">موضوع النقاش:</label>
            <Textarea
              placeholder="أدخل الموضوع الذي تريد النماذج أن تتناقش حوله..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[100px]"
              dir="rtl"
            />
          </div>

          {/* Discussion Progress */}
          {isDiscussing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>جولة النقاش: {currentRound}/3</span>
                <span>{Math.round(progress)}% مكتمل</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button onClick={startDiscussion} disabled={isDiscussing || !topic.trim()} className="w-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            {isDiscussing ? "النقاش جاري..." : "بدء النقاش التفاعلي"}
          </Button>
        </CardContent>
      </Card>

      {/* Discussion History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            سجل النقاش
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {discussionHistory.map((entry, index) => {
              const style = getModelStyle(entry.modelId)
              return (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${style.bg} ${style.border}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={style.text}>
                      {entry.model}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {new Date(entry.timestamp).toLocaleTimeString("ar-SA")}
                    </span>
                    {entry.error && (
                      <Badge variant="destructive" className="text-xs">
                        خطأ
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap" dir="rtl">
                    {entry.message}
                  </p>
                </div>
              )
            })}

            {discussionHistory.length === 0 && !isDiscussing && (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">النقاش سيظهر هنا بين النماذج الثلاثة</p>
                <p className="text-xs text-slate-400 mt-2">كل نموذج سيعرف نفسه ويشارك في النقاش بشخصيته المميزة</p>
              </div>
            )}

            {isDiscussing && (
              <div className="text-center py-4">
                <div className="animate-pulse flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <p className="text-slate-500 mt-2">النماذج تتناقش...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Discussion Summary */}
      {discussionHistory.length > 0 && !isDiscussing && (
        <Card>
          <CardHeader>
            <CardTitle>ملخص النقاش</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {models.map((model) => {
                const modelMessages = discussionHistory.filter((msg) => msg.modelId === model.id)
                return (
                  <div key={model.id} className="text-center p-4 bg-slate-50 rounded-lg">
                    <model.icon className={`w-8 h-8 text-${model.color}-600 mx-auto mb-2`} />
                    <div className="font-semibold">{model.name}</div>
                    <div className="text-sm text-slate-600 mt-1">{model.role}</div>
                    <div className="text-2xl font-bold text-slate-800 mt-2">{modelMessages.length} مشاركة</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
