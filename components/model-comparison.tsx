"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, BarChart3, Clock, CheckCircle, XCircle, Info } from "lucide-react"
import { ConnectionTest } from "@/components/connection-test"
import { ModelInfo } from "@/components/model-info"

interface ModelResponse {
  response: string
  model: string
  usage?: any
  responseTime: number
  error?: string
}

export function ModelComparison() {
  const [prompt, setPrompt] = useState("اكتب قصة قصيرة عن الذكاء الاصطناعي في المستقبل")
  const [togetherResponse, setTogetherResponse] = useState<ModelResponse | null>(null)
  const [groqResponse, setGroqResponse] = useState<ModelResponse | null>(null)
  const [geminiResponse, setGeminiResponse] = useState<ModelResponse | null>(null)
  const [loading, setLoading] = useState({ together: false, groq: false, gemini: false })
  const [testMode, setTestMode] = useState<"single" | "compare">("compare")
  const [showModelInfo, setShowModelInfo] = useState(false)

  const testModel = async (modelType: "together" | "groq" | "gemini") => {
    setLoading((prev) => ({ ...prev, [modelType]: true }))
    const startTime = Date.now()

    try {
      const endpoint = `/api/${modelType}`
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      const responseTime = Date.now() - startTime

      const result: ModelResponse = {
        response: data.response || data.error,
        model: data.model || modelType,
        usage: data.usage,
        responseTime,
        error: data.error,
      }

      if (modelType === "together") {
        setTogetherResponse(result)
      } else if (modelType === "groq") {
        setGroqResponse(result)
      } else {
        setGeminiResponse(result)
      }
    } catch (error) {
      const result: ModelResponse = {
        response: "",
        model: modelType,
        responseTime: Date.now() - startTime,
        error: `خطأ في الاتصال: ${error}`,
      }

      if (modelType === "together") {
        setTogetherResponse(result)
      } else if (modelType === "groq") {
        setGroqResponse(result)
      } else {
        setGeminiResponse(result)
      }
    } finally {
      setLoading((prev) => ({ ...prev, [modelType]: false }))
    }
  }

  const testAllModels = async () => {
    await Promise.all([testModel("together"), testModel("groq"), testModel("gemini")])
  }

  const clearResults = () => {
    setTogetherResponse(null)
    setGroqResponse(null)
    setGeminiResponse(null)
  }

  const samplePrompts = [
    "اكتب قصة قصيرة عن الذكاء الاصطناعي في المستقبل",
    "اشرح مفهوم التعلم العميق بطريقة بسيطة",
    "اكتب كود Python لتحليل البيانات",
    "ما هي أفضل الممارسات في تطوير الويب؟",
    "اكتب خطة عمل لشركة تقنية ناشئة",
    "حل هذه المسألة الرياضية: ما هو ناتج 15 × 23؟",
    "اكتب رسالة تحفيزية للطلاب",
  ]

  return (
    <div className="space-y-6">
      {/* Model Info Toggle */}
      <div className="text-center">
        <Button variant="outline" onClick={() => setShowModelInfo(!showModelInfo)} className="btn-secondary">
          <Info className="w-4 h-4 ml-2" />
          {showModelInfo ? "إخفاء" : "عرض"} معلومات النماذج
        </Button>
      </div>

      {/* Model Information */}
      {showModelInfo && <ModelInfo />}

      {/* Test Controls */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="w-5 h-5" />
            إعدادات الاختبار
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={testMode === "compare" ? "default" : "outline"}
              onClick={() => setTestMode("compare")}
              className={`flex-1 ${testMode === "compare" ? "btn-primary" : "btn-secondary"}`}
            >
              مقارنة النماذج
            </Button>
            <Button
              variant={testMode === "single" ? "default" : "outline"}
              onClick={() => setTestMode("single")}
              className={`flex-1 ${testMode === "single" ? "btn-primary" : "btn-secondary"}`}
            >
              اختبار منفرد
            </Button>
          </div>

          {/* Sample Prompts */}
          <div>
            <label className="text-sm font-medium mb-2 block text-white">أمثلة للاختبار:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {samplePrompts.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(sample)}
                  className="btn-secondary text-xs h-auto p-2 text-right"
                >
                  {sample.substring(0, 40)}...
                </Button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="text-sm font-medium mb-2 block text-white">النص المراد اختباره:</label>
            <Textarea
              placeholder="اكتب النص هنا..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="input-field min-h-[100px]"
              dir="rtl"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {testMode === "compare" ? (
              <Button
                onClick={testAllModels}
                disabled={loading.together || loading.groq || loading.gemini || !prompt.trim()}
                className="btn-primary flex-1"
              >
                {loading.together || loading.groq || loading.gemini ? (
                  <div className="flex items-center">
                    <div className="spinner ml-2"></div>
                    جاري الاختبار...
                  </div>
                ) : (
                  "اختبار النماذج معاً"
                )}
              </Button>
            ) : (
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button
                  onClick={() => testModel("together")}
                  disabled={loading.together || !prompt.trim()}
                  className="btn-secondary"
                >
                  {loading.together ? <div className="spinner"></div> : "DeepSeek R1"}
                </Button>
                <Button
                  onClick={() => testModel("groq")}
                  disabled={loading.groq || !prompt.trim()}
                  className="btn-secondary"
                >
                  {loading.groq ? <div className="spinner"></div> : "Llama3"}
                </Button>
                <Button
                  onClick={() => testModel("gemini")}
                  disabled={loading.gemini || !prompt.trim()}
                  className="btn-secondary"
                >
                  {loading.gemini ? <div className="spinner"></div> : "Gemini"}
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={clearResults} className="btn-secondary bg-transparent">
              مسح النتائج
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Test */}
      <ConnectionTest />

      {/* Results Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Together AI Results */}
        <Card className="card relative">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="model-icon deepseek-icon">DS</div>
                <span>DeepSeek R1 (70B)</span>
              </div>
              {togetherResponse && (
                <div className="flex items-center gap-2">
                  {togetherResponse.error ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  <Badge variant="outline" className="flex items-center gap-1 bg-blue-500/20 text-blue-300">
                    <Clock className="w-3 h-3" />
                    {togetherResponse.responseTime}ms
                  </Badge>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px] p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              {loading.together ? (
                <div className="flex items-center justify-center h-full">
                  <div className="spinner"></div>
                </div>
              ) : togetherResponse ? (
                <div className="space-y-3">
                  {togetherResponse.error ? (
                    <p className="text-red-400" dir="rtl">
                      {togetherResponse.error}
                    </p>
                  ) : (
                    <p className="text-gray-100 whitespace-pre-wrap leading-relaxed" dir="rtl">
                      {togetherResponse.response}
                    </p>
                  )}
                  {togetherResponse.usage && (
                    <div className="text-xs text-gray-400 border-t border-gray-600 pt-2">
                      <p>Tokens: {togetherResponse.usage.total_tokens}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-center">نتائج DeepSeek R1 ستظهر هنا...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Groq Results */}
        <Card className="card relative">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="model-icon groq-icon">GQ</div>
                <span>Llama3 (8B)</span>
              </div>
              {groqResponse && (
                <div className="flex items-center gap-2">
                  {groqResponse.error ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  <Badge variant="outline" className="flex items-center gap-1 bg-green-500/20 text-green-300">
                    <Clock className="w-3 h-3" />
                    {groqResponse.responseTime}ms
                  </Badge>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px] p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              {loading.groq ? (
                <div className="flex items-center justify-center h-full">
                  <div className="spinner"></div>
                </div>
              ) : groqResponse ? (
                <div className="space-y-3">
                  {groqResponse.error ? (
                    <p className="text-red-400" dir="rtl">
                      {groqResponse.error}
                    </p>
                  ) : (
                    <p className="text-gray-100 whitespace-pre-wrap leading-relaxed" dir="rtl">
                      {groqResponse.response}
                    </p>
                  )}
                  {groqResponse.usage && (
                    <div className="text-xs text-gray-400 border-t border-gray-600 pt-2">
                      <p>Tokens: {groqResponse.usage.total_tokens}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-center">نتائج Llama3 ستظهر هنا...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gemini Results */}
        <Card className="card relative">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="model-icon gemini-icon">GM</div>
                <span>Gemini 2.5</span>
              </div>
              {geminiResponse && (
                <div className="flex items-center gap-2">
                  {geminiResponse.error ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  <Badge variant="outline" className="flex items-center gap-1 bg-purple-500/20 text-purple-300">
                    <Clock className="w-3 h-3" />
                    {geminiResponse.responseTime}ms
                  </Badge>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px] p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              {loading.gemini ? (
                <div className="flex items-center justify-center h-full">
                  <div className="spinner"></div>
                </div>
              ) : geminiResponse ? (
                <div className="space-y-3">
                  {geminiResponse.error ? (
                    <p className="text-red-400" dir="rtl">
                      {geminiResponse.error}
                    </p>
                  ) : (
                    <p className="text-gray-100 whitespace-pre-wrap leading-relaxed" dir="rtl">
                      {geminiResponse.response}
                    </p>
                  )}
                  {geminiResponse.usage && (
                    <div className="text-xs text-gray-400 border-t border-gray-600 pt-2">
                      <p>Tokens: {geminiResponse.usage.total_tokens || "N/A"}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-center">نتائج Gemini ستظهر هنا...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Comparison */}
      {togetherResponse &&
        groqResponse &&
        geminiResponse &&
        !togetherResponse.error &&
        !groqResponse.error &&
        !geminiResponse.error && (
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5" />
                مقارنة الأداء المتقدمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-200">سرعة الاستجابة</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-400">DeepSeek R1</span>
                      <span className="font-mono text-sm text-white">{togetherResponse.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-400">Llama3</span>
                      <span className="font-mono text-sm text-white">{groqResponse.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-400">Gemini</span>
                      <span className="font-mono text-sm text-white">{geminiResponse.responseTime}ms</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {Math.min(togetherResponse.responseTime, groqResponse.responseTime, geminiResponse.responseTime) ===
                    togetherResponse.responseTime
                      ? "DeepSeek أسرع"
                      : Math.min(
                            togetherResponse.responseTime,
                            groqResponse.responseTime,
                            geminiResponse.responseTime,
                          ) === groqResponse.responseTime
                        ? "Llama3 أسرع"
                        : "Gemini أسرع"}
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-200">طول الاستجابة</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-400">DeepSeek R1</span>
                      <span className="font-mono text-sm text-white">{togetherResponse.response.length} حرف</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-400">Llama3</span>
                      <span className="font-mono text-sm text-white">{groqResponse.response.length} حرف</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-400">Gemini</span>
                      <span className="font-mono text-sm text-white">{geminiResponse.response.length} حرف</span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-200">حجم النموذج</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-400">DeepSeek R1</span>
                      <span className="font-mono text-sm text-white">70B</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-400">Llama3</span>
                      <span className="font-mono text-sm text-white">8B</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-400">Gemini</span>
                      <span className="font-mono text-sm text-white">Flash</span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-200">حالة الاستجابة</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-400">DeepSeek R1</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-400">Llama3</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-400">Gemini</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}
