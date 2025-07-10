"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MessageSquare,
  Users,
  Brain,
  Zap,
  Globe,
  ThumbsUp,
  ThumbsDown,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react"
import { DiscussionManager, type ModelResponse } from "@/utils/discussion-manager"

export function EnhancedDiscussionUI() {
  const [topic, setTopic] = useState("")
  const [discussionManager] = useState(() => new DiscussionManager())
  const [responses, setResponses] = useState<ModelResponse[]>([])
  const [isDiscussing, setIsDiscussing] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeModel, setActiveModel] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const discussionRef = useRef<HTMLDivElement>(null)

  const models = [
    {
      id: "together",
      name: "ديب سيك",
      icon: Brain,
      color: "blue",
      role: "المحلل المنطقي",
      avatar: "🧠",
    },
    {
      id: "gemini",
      name: "جيمناي",
      icon: Zap,
      color: "purple",
      role: "المبدع المبتكر",
      avatar: "✨",
    },
    {
      id: "groq",
      name: "جروك",
      icon: Globe,
      color: "green",
      role: "المنفذ العملي",
      avatar: "⚡",
    },
  ]

  // تمرير تلقائي للأسفل
  useEffect(() => {
    if (discussionRef.current) {
      discussionRef.current.scrollTop = discussionRef.current.scrollHeight
    }
  }, [responses])

  // بدء النقاش
  const startDiscussion = async () => {
    if (!topic.trim()) return

    setIsDiscussing(true)
    setResponses([])
    setCurrentRound(0)
    setProgress(0)
    setStats(null)

    discussionManager.setQuestion(topic.trim())

    const totalRounds = 3
    const totalSteps = models.length * totalRounds

    let stepCount = 0

    try {
      for (let round = 0; round < totalRounds; round++) {
        setCurrentRound(round)

        for (const model of models) {
          setActiveModel(model.id)

          // بناء السياق الديناميكي
          const context = discussionManager.buildDynamicContext(model.id, round)

          try {
            // محاكاة التفكير
            await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

            // استدعاء API
            const response = await fetch(`/api/${model.id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                prompt: context,
                config: {
                  temperature: 0.7,
                  maxOutputTokens: 1000,
                },
              }),
            })

            const data = await response.json()

            if (data.response && !data.error) {
              // إضافة الاستجابة مع التنظيف
              const modelResponse = await discussionManager.addResponse(
                model.id,
                data.response,
                `تفكير ${model.name}: تحليل السؤال وبناء الرد المناسب للجولة ${round + 1}`,
              )

              setResponses((prev) => [...prev, modelResponse])
            } else {
              // إضافة رسالة خطأ
              const errorResponse = await discussionManager.addResponse(
                model.id,
                `عذراً، واجهت مشكلة تقنية في هذه الجولة: ${data.error || "خطأ غير معروف"}`,
                "تحليل المشكلة والبحث عن حل بديل",
              )
              setResponses((prev) => [...prev, errorResponse])
            }
          } catch (error) {
            console.error(`خطأ مع ${model.name}:`, error)
            const errorResponse = await discussionManager.addResponse(
              model.id,
              `عذراً، لا أستطيع المشاركة في هذه الجولة بسبب مشكلة في الاتصال.`,
              "محاولة حل مشكلة الاتصال",
            )
            setResponses((prev) => [...prev, errorResponse])
          }

          stepCount++
          setProgress((stepCount / totalSteps) * 100)

          // انتظار بين الردود
          await new Promise((resolve) => setTimeout(resolve, 1500))
        }

        discussionManager.nextRound()

        // انتظار بين الجولات
        if (round < totalRounds - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }

      // حساب الإحصائيات النهائية
      setStats(discussionManager.getDiscussionStats())
    } catch (error) {
      console.error("خطأ في النقاش:", error)
    } finally {
      setIsDiscussing(false)
      setActiveModel(null)
    }
  }

  // تصدير النقاش
  const exportDiscussion = () => {
    const discussionData = discussionManager.exportDiscussion()
    const blob = new Blob([JSON.stringify(discussionData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `discussion-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // مسح النقاش
  const clearDiscussion = () => {
    discussionManager.clearDiscussion()
    setResponses([])
    setStats(null)
    setCurrentRound(0)
    setProgress(0)
  }

  // تقييم الاستجابة
  const rateResponse = (responseId: string, rating: "up" | "down") => {
    // يمكن إضافة منطق التقييم هنا
    console.log(`تقييم ${rating} للاستجابة ${responseId}`)
  }

  const sampleTopics = [
    "كيف يمكن تطوير نظام ذكي لإدارة المدن المستدامة؟",
    "ما هي أفضل استراتيجية لتعليم البرمجة للأطفال؟",
    "كيف نحل مشكلة التغير المناخي باستخدام التكنولوجيا؟",
    "ما هو مستقبل العمل عن بُعد والذكاء الاصطناعي؟",
    "كيف يمكن تحسين التعليم الإلكتروني باستخدام الذكاء الاصطناعي؟",
  ]

  return (
    <div className="space-y-6">
      {/* إعداد النقاش */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" />
            نقاش تفاعلي محسن بين النماذج الثلاثة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* المشاركون */}
          <div>
            <label className="text-sm font-medium mb-2 block text-white">المشاركون في النقاش:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                    activeModel === model.id
                      ? `border-${model.color}-500 bg-${model.color}-500/10`
                      : "border-gray-600 bg-gray-800/50"
                  }`}
                >
                  <div className="text-2xl">{model.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{model.name}</div>
                    <div className="text-xs text-gray-400">{model.role}</div>
                  </div>
                  {activeModel === model.id && (
                    <div className="ml-auto">
                      <div className="animate-pulse text-xs text-gray-300">يفكر...</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* مواضيع مقترحة */}
          <div>
            <label className="text-sm font-medium mb-2 block text-white">مواضيع مقترحة:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sampleTopics.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopic(sample)}
                  className="btn-secondary text-xs text-right h-auto p-2"
                  disabled={isDiscussing}
                >
                  {sample}
                </Button>
              ))}
            </div>
          </div>

          {/* إدخال الموضوع */}
          <div>
            <label className="text-sm font-medium mb-2 block text-white">موضوع النقاش:</label>
            <Textarea
              placeholder="أدخل الموضوع الذي تريد النماذج أن تتناقش حوله..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="input-field min-h-[100px]"
              dir="rtl"
              disabled={isDiscussing}
            />
          </div>

          {/* شريط التقدم */}
          {isDiscussing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>جولة النقاش: {currentRound + 1}/3</span>
                <span>{Math.round(progress)}% مكتمل</span>
              </div>
              <Progress value={progress} className="w-full" />
              {activeModel && (
                <div className="text-center text-sm text-gray-300">
                  {models.find((m) => m.id === activeModel)?.name} يفكر ويكتب...
                </div>
              )}
            </div>
          )}

          {/* أزرار التحكم */}
          <div className="flex gap-2">
            <Button onClick={startDiscussion} disabled={isDiscussing || !topic.trim()} className="btn-primary flex-1">
              <MessageSquare className="w-4 h-4 ml-2" />
              {isDiscussing ? "النقاش جاري..." : "بدء النقاش التفاعلي"}
            </Button>

            {responses.length > 0 && (
              <>
                <Button
                  onClick={exportDiscussion}
                  variant="outline"
                  className="btn-secondary bg-transparent"
                  disabled={isDiscussing}
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
                <Button
                  onClick={clearDiscussion}
                  variant="outline"
                  className="btn-secondary bg-transparent"
                  disabled={isDiscussing}
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  مسح
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* عرض النقاش */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5" />
            سجل النقاش المحسن
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={discussionRef} className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {responses.map((response, index) => {
              const model = models.find((m) => m.id === response.model)
              return (
                <div
                  key={response.id}
                  className={`p-4 rounded-lg border-l-4 bg-${model?.color}-500/5 border-l-${model?.color}-500 animate-fade-in`}
                >
                  {/* رأس الرسالة */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{model?.avatar}</span>
                      <div>
                        <Badge variant="outline" className={`text-${model?.color}-300 border-${model?.color}-500`}>
                          {model?.name} - الجولة {response.round + 1}
                        </Badge>
                        <div className="text-xs text-gray-400 mt-1">{response.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* مؤشر الجودة */}
                      {response.quality?.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" title={response.quality?.issues.join(", ")} />
                      )}

                      {/* وقت الاستجابة */}
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{response.timestamp.toLocaleTimeString("ar-SA")}</span>
                      </div>
                    </div>
                  </div>

                  {/* التفكير */}
                  {response.thinking && (
                    <div className="mb-3 p-2 bg-gray-800/30 rounded text-sm text-gray-300 border-l-2 border-gray-600">
                      <div className="flex items-center gap-1 mb-1">
                        <Brain className="w-3 h-3" />
                        <span className="font-medium">التفكير:</span>
                      </div>
                      <p className="text-xs">{response.thinking}</p>
                    </div>
                  )}

                  {/* محتوى الاستجابة */}
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-100 leading-relaxed whitespace-pre-wrap" dir="rtl">
                      {response.cleanedResponse || response.response}
                    </p>
                  </div>

                  {/* أزرار التفاعل */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-600">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => rateResponse(response.id, "up")}
                        className="p-1 hover:bg-green-600/20 rounded transition-colors"
                        title="إعجاب"
                      >
                        <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-green-400" />
                      </button>
                      <button
                        onClick={() => rateResponse(response.id, "down")}
                        className="p-1 hover:bg-red-600/20 rounded transition-colors"
                        title="عدم إعجاب"
                      >
                        <ThumbsDown className="w-3 h-3 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>

                    <div className="text-xs text-gray-500">
                      {(response.cleanedResponse || response.response).length} حرف
                    </div>
                  </div>
                </div>
              )
            })}

            {responses.length === 0 && !isDiscussing && (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">النقاش سيظهر هنا بين النماذج الثلاثة</p>
                <p className="text-xs text-gray-400 mt-2">كل نموذج سيعرف نفسه ويشارك في النقاش بشخصيته المميزة</p>
              </div>
            )}

            {isDiscussing && responses.length === 0 && (
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
                <p className="text-gray-500 mt-2">النماذج تستعد للنقاش...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات النقاش */}
      {stats && (
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="w-5 h-5" />
              إحصائيات النقاش
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{stats.totalResponses}</div>
                <div className="text-sm text-gray-400">إجمالي الردود</div>
              </div>

              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{stats.rounds}</div>
                <div className="text-sm text-gray-400">عدد الجولات</div>
              </div>

              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{stats.avgResponseLength}</div>
                <div className="text-sm text-gray-400">متوسط طول الرد</div>
              </div>

              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">{stats.successRate}%</div>
                <div className="text-sm text-gray-400">معدل النجاح</div>
              </div>
            </div>

            {/* تفاصيل مشاركة النماذج */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {models.map((model) => (
                <div key={model.id} className="text-center p-3 bg-gray-800/30 rounded-lg">
                  <div className="text-xl mb-1">{model.avatar}</div>
                  <div className="font-semibold text-white">{model.name}</div>
                  <div className="text-sm text-gray-400">{stats.modelCounts[model.id] || 0} مشاركة</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
