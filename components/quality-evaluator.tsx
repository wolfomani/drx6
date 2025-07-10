"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, ThumbsUp, ThumbsDown, BarChart3, Target, BookOpen, Zap } from "lucide-react"

interface QualityMetrics {
  creativity: number
  coherence: number
  relevance: number
  language: number
  engagement: number
  overall: number
}

interface EvaluationResult {
  text: string
  metrics: QualityMetrics
  feedback: string
  suggestions: string[]
}

export function QualityEvaluator() {
  const [inputText, setInputText] = useState("")
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userFeedback, setUserFeedback] = useState("")

  const evaluateText = async () => {
    if (!inputText.trim()) return

    setLoading(true)
    try {
      // Simulate AI evaluation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResult: EvaluationResult = {
        text: inputText,
        metrics: {
          creativity: Math.random() * 30 + 70,
          coherence: Math.random() * 25 + 75,
          relevance: Math.random() * 20 + 80,
          language: Math.random() * 15 + 85,
          engagement: Math.random() * 25 + 75,
          overall: Math.random() * 20 + 80,
        },
        feedback:
          "النص يظهر إبداعاً جيداً في استخدام عناصر الخيال العلمي، مع تماسك منطقي في الأحداث. اللغة واضحة ومناسبة للجمهور المستهدف.",
        suggestions: [
          "إضافة المزيد من التفاصيل الوصفية للشخصيات",
          "تطوير الحبكة لتكون أكثر تعقيداً",
          "استخدام حوار أكثر طبيعية",
          "إضافة عنصر التشويق في البداية",
        ],
      }

      setEvaluationResult(mockResult)
    } catch (error) {
      console.error("Evaluation error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "ممتاز"
    if (score >= 80) return "جيد جداً"
    if (score >= 70) return "جيد"
    return "يحتاج تحسين"
  }

  const sampleTexts = [
    "في عام 2050، اكتشف العالم أحمد روبوتاً قديماً في مختبره المهجور...",
    "كانت سارة تحلم بالسفر إلى المريخ منذ طفولتها، ولكن لم تتوقع أن تجد هناك...",
    "عندما استيقظ كريم من النوم، وجد أن العالم قد تغير تماماً بسبب الذكاء الاصطناعي...",
  ]

  return (
    <div className="space-y-6">
      {/* Evaluation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">النصوص المقيمة</p>
                <p className="text-2xl font-bold">247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-slate-600">متوسط التقييم</p>
                <p className="text-2xl font-bold">8.4/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-slate-600">تقييمات إيجابية</p>
                <p className="text-2xl font-bold">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600">تحسن الجودة</p>
                <p className="text-2xl font-bold">+23%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Text Input for Evaluation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            تقييم جودة النص
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sample Texts */}
          <div>
            <label className="text-sm font-medium mb-2 block">نصوص تجريبية:</label>
            <div className="flex flex-wrap gap-2">
              {sampleTexts.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputText(sample)}
                  className="text-xs"
                >
                  {sample.substring(0, 40)}...
                </Button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">النص المراد تقييمه:</label>
            <Textarea
              placeholder="الصق النص هنا للحصول على تقييم شامل لجودته..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px]"
              dir="rtl"
            />
          </div>

          <Button onClick={evaluateText} disabled={loading || !inputText.trim()} className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            {loading ? "جاري التقييم..." : "تقييم النص"}
          </Button>
        </CardContent>
      </Card>

      {/* Evaluation Results */}
      {loading && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600">جاري تحليل النص وتقييم الجودة...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {evaluationResult && !loading && (
        <div className="space-y-6">
          {/* Quality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                معايير الجودة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">الإبداع</span>
                      <span className={`text-sm font-bold ${getScoreColor(evaluationResult.metrics.creativity)}`}>
                        {evaluationResult.metrics.creativity.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={evaluationResult.metrics.creativity} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">التماسك</span>
                      <span className={`text-sm font-bold ${getScoreColor(evaluationResult.metrics.coherence)}`}>
                        {evaluationResult.metrics.coherence.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={evaluationResult.metrics.coherence} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">الصلة بالموضوع</span>
                      <span className={`text-sm font-bold ${getScoreColor(evaluationResult.metrics.relevance)}`}>
                        {evaluationResult.metrics.relevance.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={evaluationResult.metrics.relevance} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">جودة اللغة</span>
                      <span className={`text-sm font-bold ${getScoreColor(evaluationResult.metrics.language)}`}>
                        {evaluationResult.metrics.language.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={evaluationResult.metrics.language} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">الجاذبية</span>
                      <span className={`text-sm font-bold ${getScoreColor(evaluationResult.metrics.engagement)}`}>
                        {evaluationResult.metrics.engagement.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={evaluationResult.metrics.engagement} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">التقييم العام</span>
                      <span className={`text-sm font-bold ${getScoreColor(evaluationResult.metrics.overall)}`}>
                        {evaluationResult.metrics.overall.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={evaluationResult.metrics.overall} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Badge
                  variant="secondary"
                  className={`text-lg px-4 py-2 ${getScoreColor(evaluationResult.metrics.overall)}`}
                >
                  {getScoreLabel(evaluationResult.metrics.overall)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* AI Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>تحليل مفصل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">التقييم العام:</h4>
                  <p className="text-slate-700 leading-relaxed" dir="rtl">
                    {evaluationResult.feedback}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">اقتراحات للتحسين:</h4>
                  <ul className="space-y-2">
                    {evaluationResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-slate-700" dir="rtl">
                          {suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>تقييمك للنتائج</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">ما رأيك في دقة التقييم؟</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className={`p-1 ${star <= userRating ? "text-yellow-500" : "text-slate-300"}`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">ملاحظات إضافية (اختياري):</label>
                  <Textarea
                    placeholder="شاركنا رأيك في التقييم..."
                    value={userFeedback}
                    onChange={(e) => setUserFeedback(e.target.value)}
                    className="min-h-[80px]"
                    dir="rtl"
                  />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    إرسال التقييم
                  </Button>
                  <Button variant="outline">
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    إبلاغ عن مشكلة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
