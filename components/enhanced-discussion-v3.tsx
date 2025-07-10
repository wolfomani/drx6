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
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Copy,
  Volume2,
  Expand,
  Filter,
  TrendingUp,
} from "lucide-react"
import { AdvancedDiscussionManager, type EnhancedModelResponse } from "@/utils/advanced-discussion-manager"
import { DOMManager } from "@/utils/dom-manager"

export function EnhancedDiscussionV3() {
  const [topic, setTopic] = useState("")
  const [discussionManager] = useState(() => new AdvancedDiscussionManager())
  const [responses, setResponses] = useState<EnhancedModelResponse[]>([])
  const [isDiscussing, setIsDiscussing] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeModel, setActiveModel] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [filterOptions, setFilterOptions] = useState({ minQuality: 0, round: -1 })
  const discussionRef = useRef<HTMLDivElement>(null)

  const models = [
    {
      id: "together",
      name: "ديب سيك",
      icon: Brain,
      color: "blue",
      role: "المحلل المنطقي",
      avatar: "🧠",
      gradient: "from-blue-500/10 to-blue-700/20",
      borderColor: "border-blue-500",
    },
    {
      id: "gemini",
      name: "جيمناي",
      icon: Zap,
      color: "purple",
      role: "المبدع المبتكر",
      avatar: "✨",
      gradient: "from-purple-500/10 to-purple-700/20",
      borderColor: "border-purple-500",
    },
    {
      id: "groq",
      name: "جروك",
      icon: Globe,
      color: "green",
      role: "المنفذ العملي",
      avatar: "⚡",
      gradient: "from-green-500/10 to-green-700/20",
      borderColor: "border-green-500",
    },
  ]

  // تهيئة النظام عند التحميل
  useEffect(() => {
    DOMManager.runSafeSystemCheck()
  }, [])

  // تمرير تلقائي محسن
  useEffect(() => {
    if (discussionRef.current) {
      const element = discussionRef.current
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [responses])

  // بدء النقاش المحسن
  const startEnhancedDiscussion = async () => {
    if (!topic.trim()) return

    setIsDiscussing(true)
    setResponses([])
    setCurrentRound(0)
    setProgress(0)
    setStats(null)
    setExpandedCards(new Set())

    discussionManager.setQuestion(topic.trim())

    const totalRounds = 3
    const totalSteps = models.length * totalRounds

    let stepCount = 0

    try {
      for (let round = 0; round < totalRounds; round++) {
        setCurrentRound(round)

        for (const model of models) {
          setActiveModel(model.id)

          // محاكاة التفكير مع رسوم متحركة
          for (let i = 0; i < 5; i++) {
            setProgress((prev) => prev + 100 / (totalSteps * 5))
            await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))
          }

          // استدعاء API مع معالجة محسنة للأخطاء
          try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout

            const response = await fetch(`/api/${model.id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                prompt: discussionManager.buildSmartPrompt(model.id),
                config: {
                  temperature: 0.7 + round * 0.1,
                  maxOutputTokens: model.id === "gemini" ? 1200 : 800, // Reduced for Gemini
                },
              }),
              signal: controller.signal,
            })

            clearTimeout(timeoutId)
            const data = await response.json()

            if (data.response && !data.error) {
              const modelResponse = await discussionManager.addEnhancedResponse(
                model.id,
                data.response,
                `${model.name} يفكر في الجولة ${round + 1}: تحليل السؤال وبناء رد متميز يضيف قيمة للنقاش`,
              )

              // Add retry info if available
              if (data.attempt && data.attempt > 1) {
                modelResponse.metadata = {
                  ...modelResponse.metadata,
                  retries: data.attempt - 1,
                  note: `نجح بعد ${data.attempt - 1} محاولة إضافية`,
                }
              }

              setResponses((prev) => [...prev, modelResponse])
            } else {
              // Handle API errors with more specific messages
              let errorMessage = `عذراً، واجهت تحدياً تقنياً في هذه الجولة.`

              if (data.error) {
                if (data.error.includes("محملة بشكل زائد") || data.error.includes("overloaded")) {
                  errorMessage = `الخدمة محملة حالياً، سأحاول في الجولة القادمة.`
                } else if (data.error.includes("حد الطلبات") || data.error.includes("rate limit")) {
                  errorMessage = `أحتاج لاستراحة قصيرة، سأعود في الجولة القادمة.`
                } else if (data.error.includes("انتهت مهلة") || data.error.includes("timeout")) {
                  errorMessage = `استغرق الرد وقتاً أطول من المتوقع، سأحاول مرة أخرى.`
                }
              }

              const errorResponse = await discussionManager.addEnhancedResponse(
                model.id,
                errorMessage,
                "تحليل المشكلة والتخطيط للحل في الجولة القادمة",
              )

              errorResponse.metadata = {
                ...errorResponse.metadata,
                error: true,
                errorType: data.lastErrorCode || "unknown",
                retries: data.retries || 0,
              }

              setResponses((prev) => [...prev, errorResponse])
            }
          } catch (error: any) {
            console.error(`خطأ مع ${model.name}:`, error)

            let errorMessage = `أعتذر، لا أستطيع المشاركة في هذه الجولة.`

            if (error.name === "AbortError") {
              errorMessage = `انتهت مهلة الانتظار، سأحاول في الجولة القادمة.`
            } else if (error.message?.includes("fetch")) {
              errorMessage = `مشكلة في الاتصال، سأعود قريباً!`
            }

            const errorResponse = await discussionManager.addEnhancedResponse(
              model.id,
              errorMessage,
              "محاولة إعادة الاتصال وحل المشكلة",
            )

            errorResponse.metadata = {
              ...errorResponse.metadata,
              error: true,
              errorType: error.name || "network_error",
            }

            setResponses((prev) => [...prev, errorResponse])
          }

          stepCount++
          setProgress((stepCount / totalSteps) * 100)

          // انتظار ديناميكي بين الردود
          await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
        }

        discussionManager.nextRound()

        // انتظار أطول بين الجولات
        if (round < totalRounds - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2500))
        }
      }

      // حساب الإحصائيات المحسنة
      setStats(discussionManager.getAdvancedStats())
    } catch (error) {
      console.error("خطأ في النقاش:", error)
    } finally {
      setIsDiscussing(false)
      setActiveModel(null)
    }
  }

  // نسخ النص
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // يمكن إضافة إشعار هنا
    } catch (error) {
      console.error("فشل في النسخ:", error)
    }
  }

  // قراءة النص (محاكاة)
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "ar-SA"
      speechSynthesis.speak(utterance)
    }
  }

  // توسيع/تصغير البطاقة
  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId)
    } else {
      newExpanded.add(cardId)
    }
    setExpandedCards(newExpanded)
  }

  // تصدير محسن
  const exportEnhancedDiscussion = () => {
    const discussionData = discussionManager.exportEnhancedDiscussion()
    const blob = new Blob([JSON.stringify(discussionData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `enhanced-discussion-${Date.now()}.json`
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
    setExpandedCards(new Set())
  }

  // فلترة الردود
  const filteredResponses = responses.filter((response) => {
    if (filterOptions.minQuality > 0 && response.quality.score < filterOptions.minQuality) {
      return false
    }
    if (filterOptions.round >= 0 && response.round !== filterOptions.round) {
      return false
    }
    return true
  })

  const sampleTopics = [
    "كيف يمكن تطوير نظام ذكي لإدارة المدن المستدامة؟",
    "ما هي أفضل استراتيجية لتعليم البرمجة للأطفال؟",
    "كيف نحل مشكلة التغير المناخي باستخدام التكنولوجيا؟",
    "ما هو مستقبل العمل عن بُعد والذكاء الاصطناعي؟",
    "كيف يمكن تحسين التعليم الإلكتروني باستخدام الذكاء الاصطناعي؟",
    "ما هي التحديات الأخلاقية للذكاء الاصطناعي في المستقبل؟",
  ]

  return (
    <div className="space-y-6">
      {/* إعداد النقاش المحسن */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 rounded-xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">نقاش تفاعلي محسن V3</h1>
              <p className="text-sm text-gray-300 mt-1">تنظيف ذكي ومعالجة متقدمة للاستجابات</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* المشاركون مع تصميم جديد */}
          <div>
            <label className="text-sm font-medium mb-2 block text-white">المشاركون في النقاش:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                    activeModel === model.id
                      ? `${model.borderColor} bg-gradient-to-r ${model.gradient} shadow-lg scale-105`
                      : "border-gray-700 bg-gray-800/50 hover:bg-gray-800/70"
                  }`}
                >
                  <div className="text-3xl">{model.avatar}</div>
                  <div className="flex-1">
                    <div className="font-bold text-white text-lg">{model.name}</div>
                    <div className="text-xs text-gray-300">{model.role}</div>
                    {stats?.modelStats?.[model.id] && (
                      <div className="text-xs text-gray-400 mt-1">
                        جودة: {Math.round(stats.modelStats[model.id].avgQuality)}%
                      </div>
                    )}
                  </div>
                  {activeModel === model.id && (
                    <div className="flex flex-col items-center">
                      <div className="animate-pulse text-xs text-gray-300 mb-1">يفكر...</div>
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* مواضيع مقترحة مع تصميم جديد */}
          <div>
            <label className="text-sm font-medium mb-2 block text-white">مواضيع مقترحة للنقاش:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleTopics.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopic(sample)}
                  className="bg-gray-800/50 border-gray-700 text-gray-200 hover:text-white hover:bg-gray-700/50 text-xs text-right h-auto p-3 hover:scale-[1.02] transition-all"
                  disabled={isDiscussing}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 rounded-lg">
                      <span className="text-lg">💡</span>
                    </div>
                    <span className="flex-1 text-right">{sample}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* إدخال الموضوع بتصميم جديد */}
          <div className="relative">
            <label className="text-sm font-medium mb-2 block text-white">موضوع النقاش:</label>
            <Textarea
              placeholder="أدخل الموضوع الذي تريد النماذج أن تتناقش حوله بذكاء وعمق..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-gray-200 text-lg min-h-[120px] backdrop-blur-sm"
              dir="rtl"
              disabled={isDiscussing}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg pointer-events-none -z-10"></div>
          </div>

          {/* شريط التقدم بتصميم جديد */}
          {isDiscussing && (
            <div className="space-y-3 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700">
              <div className="flex justify-between text-sm text-white">
                <span>جولة النقاش: {currentRound + 1}/3</span>
                <span>{Math.round(progress)}% مكتمل</span>
              </div>
              <Progress
                value={progress}
                className="w-full h-2 bg-gray-700"
                indicatorColor="bg-gradient-to-r from-blue-500 to-purple-500"
              />

              {activeModel && (
                <div className="flex flex-col items-center mt-4">
                  <div className="text-sm text-gray-300 mb-3">
                    {models.find((m) => m.id === activeModel)?.name} يحضر رداً متميزاً...
                  </div>
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* أزرار التحكم بتصميم جديد */}
          <div className="flex gap-3">
            <Button
              onClick={startEnhancedDiscussion}
              disabled={isDiscussing || !topic.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex-1 text-lg py-3 px-6 rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-center">
                <MessageSquare className="w-5 h-5 ml-2" />
                {isDiscussing ? "النقاش المحسن جاري..." : "بدء النقاش المحسن V3"}
              </div>
            </Button>

            {responses.length > 0 && (
              <>
                <Button
                  onClick={exportEnhancedDiscussion}
                  className="bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl"
                  disabled={isDiscussing}
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
                <Button
                  onClick={clearDiscussion}
                  className="bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl"
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

      {/* فلترة الردود بتصميم جديد */}
      {responses.length > 0 && (
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 rounded-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Filter className="w-5 h-5" />
              </div>
              فلترة وتنظيم الردود
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg">
                <label className="text-sm text-white">الحد الأدنى للجودة:</label>
                <select
                  value={filterOptions.minQuality}
                  onChange={(e) => setFilterOptions({ ...filterOptions, minQuality: Number(e.target.value) })}
                  className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                >
                  <option value={0}>الكل</option>
                  <option value={70}>70%+</option>
                  <option value={80}>80%+</option>
                  <option value={90}>90%+</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg">
                <label className="text-sm text-white">الجولة:</label>
                <select
                  value={filterOptions.round}
                  onChange={(e) => setFilterOptions({ ...filterOptions, round: Number(e.target.value) })}
                  className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                >
                  <option value={-1}>الكل</option>
                  <option value={0}>الأولى</option>
                  <option value={1}>الثانية</option>
                  <option value={2}>الثالثة</option>
                </select>
              </div>

              <div className="text-sm text-gray-300 bg-gray-800/50 p-2 rounded-lg">
                عرض {filteredResponses.length} من {responses.length} رد
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* عرض النقاش بتصميم جديد مذهل */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 rounded-xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            سجل النقاش المحسن V3
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={discussionRef} className="space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar pb-4">
            {filteredResponses.map((response, index) => {
              const model = models.find((m) => m.id === response.model)
              const isExpanded = expandedCards.has(response.id)
              const displayText = isExpanded
                ? response.cleanedResponse
                : response.cleanedResponse.substring(0, 250) + (response.cleanedResponse.length > 250 ? "..." : "")

              return (
                <div
                  key={response.id}
                  className={`p-5 rounded-xl border-l-4 ${model?.borderColor} bg-gradient-to-r ${model?.gradient} animate-fade-in transition-all duration-300 hover:shadow-lg`}
                >
                  {/* رأس الرسالة بتصميم جديد */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl bg-gray-900/50 p-2 rounded-lg">{model?.avatar}</div>
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            className={`bg-${model?.color}-500/20 text-${model?.color}-300 border-${model?.color}-500`}
                          >
                            {model?.name} - الجولة {response.round + 1}
                          </Badge>
                          <Badge
                            className={`${
                              response.quality.score >= 80
                                ? "bg-green-500/20 text-green-300 border-green-500"
                                : response.quality.score >= 60
                                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500"
                                  : "bg-red-500/20 text-red-300 border-red-500"
                            }`}
                          >
                            جودة: {response.quality.score}%
                          </Badge>
                          {response.metadata?.retries && response.metadata.retries > 0 && (
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500">
                              {response.metadata.retries} إعادة محاولة
                            </Badge>
                          )}

                          {response.metadata?.error && (
                            <Badge className="bg-red-500/20 text-red-300 border-red-500">خطأ مؤقت</Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-300 mt-1">{response.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* مؤشر الجودة */}
                      {response.quality.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" title={response.quality.issues.join(", ")} />
                      )}
                      {/* وقت المعالجة */}
                      <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-900/30 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" />
                        <span>{response.processingTime}ms</span>
                      </div>
                    </div>
                  </div>

                  {/* التفكير بتصميم جديد */}
                  {response.thinking && (
                    <div className="mb-4 p-3 bg-gray-900/50 rounded-lg text-sm text-gray-300 border-l-2 border-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-1 rounded">
                          <Brain className="w-4 h-4" />
                        </div>
                        <span className="font-medium">عملية التفكير:</span>
                      </div>
                      <p className="text-sm leading-relaxed">{response.thinking}</p>
                    </div>
                  )}

                  {/* ملاحظات إضافية */}
                  {response.metadata?.note && (
                    <div className="mb-4 p-3 bg-orange-900/30 rounded-lg text-sm text-orange-200 border-l-2 border-orange-500">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">ملاحظة:</span>
                      </div>
                      <p className="text-sm">{response.metadata.note}</p>
                    </div>
                  )}

                  {/* محتوى الاستجابة بتصميم جديد */}
                  <div className="bg-gray-900/30 p-4 rounded-lg">
                    <p className="text-gray-100 leading-relaxed whitespace-pre-wrap text-lg" dir="rtl">
                      {displayText}
                    </p>
                  </div>

                  {/* أزرار التفاعل بتصميم جديد */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyText(response.cleanedResponse)}
                        className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors"
                        title="نسخ النص"
                      >
                        <Copy className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                      </button>

                      <button
                        onClick={() => speakText(response.cleanedResponse)}
                        className="p-2 hover:bg-green-600/20 rounded-lg transition-colors"
                        title="قراءة النص"
                      >
                        <Volume2 className="w-4 h-4 text-gray-400 hover:text-green-400" />
                      </button>

                      <button
                        onClick={() => toggleCardExpansion(response.id)}
                        className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
                        title={isExpanded ? "تصغير" : "توسيع"}
                      >
                        <Expand className="w-4 h-4 text-gray-400 hover:text-purple-400" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{response.cleanedResponse.length} حرف</span>
                      <span>{new Date(response.timestamp).toLocaleTimeString("ar-SA")}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredResponses.length === 0 && responses.length > 0 && (
              <div className="text-center py-10">
                <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا توجد ردود تطابق معايير الفلترة</p>
                <p className="text-xs text-gray-400 mt-2">جرب تغيير إعدادات الفلترة</p>
              </div>
            )}

            {responses.length === 0 && !isDiscussing && (
              <div className="text-center py-10">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">النقاش المحسن سيظهر هنا</p>
                <p className="text-xs text-gray-400 mt-2">مع تنظيف ذكي للنصوص ومعالجة متقدمة للجودة</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات متقدمة بتصميم جديد */}
      {stats && (
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 rounded-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5" />
              </div>
              إحصائيات النقاش المتقدمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* إحصائيات عامة */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-700/20 rounded-xl border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">{stats.totalResponses}</div>
                <div className="text-sm text-gray-400">إجمالي الردود</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-700/20 rounded-xl border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">{stats.overallQuality}%</div>
                <div className="text-sm text-gray-400">الجودة العامة</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-700/20 rounded-xl border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">{stats.avgResponseLength}</div>
                <div className="text-sm text-gray-400">متوسط طول الرد</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-700/20 rounded-xl border border-orange-500/30">
                <div className="text-2xl font-bold text-orange-400">{stats.totalTime}s</div>
                <div className="text-sm text-gray-400">مدة النقاش</div>
              </div>
            </div>

            {/* إحصائيات النماذج */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {models.map((model) => {
                const modelStats = stats.modelStats[model.id]
                return (
                  <div
                    key={model.id}
                    className={`p-4 rounded-xl border ${model.borderColor}/30 bg-gradient-to-br ${model.gradient}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{model.avatar}</span>
                      <div>
                        <div className="font-bold text-white text-lg">{model.name}</div>
                        <div className="text-xs text-gray-300">{model.role}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">المشاركات:</span>
                        <span className="text-white font-medium">{modelStats.count}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">متوسط الجودة:</span>
                        <span
                          className={`font-bold text-lg ${
                            modelStats.avgQuality >= 80
                              ? "text-green-400"
                              : modelStats.avgQuality >= 60
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {Math.round(modelStats.avgQuality)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">متوسط الطول:</span>
                        <span className="text-white font-medium">{Math.round(modelStats.avgLength)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">المشاكل:</span>
                        <span
                          className={`font-medium ${modelStats.issues === 0 ? "text-green-400" : "text-yellow-400"}`}
                        >
                          {modelStats.issues}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* مؤشر النجاح العام بتصميم جديد */}
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-2 rounded">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-bold text-white text-lg">معدل النجاح العام</span>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                  {Math.round((stats.successfulResponses / stats.totalResponses) * 100)}%
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {stats.successfulResponses} من {stats.totalResponses} ردود عالية الجودة
              </div>
              <Progress
                value={(stats.successfulResponses / stats.totalResponses) * 100}
                className="w-full h-3 mt-3 bg-gray-700"
                indicatorColor="bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
