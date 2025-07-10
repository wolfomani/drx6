"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Zap, Brain, Clock, CheckCircle, XCircle } from "lucide-react"

interface ModelResponse {
  response: string
  model: string
  usage?: any
  responseTime: number
  error?: string
}

export function ModelTesting() {
  const [prompt, setPrompt] = useState("اكتب قصة قصيرة عن الذكاء الاصطناعي في المستقبل")
  const [responses, setResponses] = useState<Record<string, ModelResponse>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [testMode, setTestMode] = useState<"single" | "compare">("compare")
  const [discussionMode, setDiscussionMode] = useState(false)
  const [discussionHistory, setDiscussionHistory] = useState<
    Array<{ model: string; message: string; timestamp: number }>
  >([])
  const [discussionRound, setDiscussionRound] = useState(0)

  const models = [
    { id: "together", name: "DeepSeek R1 (70B)", icon: Zap, color: "blue" },
    { id: "groq", name: "Llama3 (8B)", icon: MessageSquare, color: "green" },
    { id: "gemini", name: "Gemini 2.5 Flash", icon: Brain, color: "purple" },
  ]

  const testModel = async (modelId: string) => {
    setLoading((prev) => ({ ...prev, [modelId]: true }))
    const startTime = Date.now()

    try {
      const response = await fetch(`/api/${modelId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      const responseTime = Date.now() - startTime

      setResponses((prev) => ({
        ...prev,
        [modelId]: {
          response: data.response || "",
          model: data.model || modelId,
          usage: data.usage || null,
          responseTime,
          error: data.error || null,
        },
      }))
    } catch (error) {
      const responseTime = Date.now() - startTime
      setResponses((prev) => ({
        ...prev,
        [modelId]: {
          response: "",
          model: modelId,
          responseTime,
          error: `خطأ في الاتصال: ${error}`,
        },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, [modelId]: false }))
    }
  }

  const testAllModels = async () => {
    await Promise.all(models.map((model) => testModel(model.id)))
  }

  const samplePrompts = [
    "اكتب قصة قصيرة عن الذكاء الاصطناعي في المستقبل",
    "اشرح مفهوم التعلم العميق بطريقة بسيطة",
    "اكتب كود Python لتحليل البيانات",
    "ما هي أفضل الممارسات في تطوير الويب؟",
    "حل هذه المسألة: ما هو ناتج 15 × 23 + 47؟",
  ]

  const startDiscussion = async () => {
    if (!prompt.trim()) return

    setDiscussionHistory([])
    setDiscussionRound(0)

    // Start discussion with introductions
    const models = [
      { id: "together", name: "ديب سيك", intro: "أنا ديب سيك، نموذج متقدم للتفكير المنطقي والتحليل العميق" },
      { id: "gemini", name: "جيمناي", intro: "أنا جيمناي، متخصص في التفكير الإبداعي والحلول المبتكرة" },
      { id: "groq", name: "جروك", intro: "أنا أركز على السرعة والكفاءة في المعالجة" },
    ]

    for (let round = 0; round < 3; round++) {
      for (const model of models) {
        await discussionTurn(model, round)
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait between responses
      }
    }
  }

  const discussionTurn = async (model: any, round: number) => {
    try {
      let discussionPrompt = ""

      if (round === 0) {
        // Introduction round
        discussionPrompt = `${model.intro}. 

الموضوع للنقاش: ${prompt}

سأبدأ بتحليلي الأولي لهذا الموضوع:`
      } else {
        // Response to previous discussion
        const previousMessages = discussionHistory.slice(-6) // Last 6 messages
        const context = previousMessages.map((msg) => `${msg.model}: ${msg.message}`).join("\n\n")

        discussionPrompt = `أنا ${model.name}، بناءً على النقاش السابق:

${context}

الموضوع: ${prompt}

ردي على النقاش وإضافة وجهة نظري:`
      }

      const response = await fetch(`/api/${model.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: discussionPrompt }),
      })

      const data = await response.json()

      if (data.response && !data.error) {
        const message = {
          model: model.name,
          message: data.response,
          timestamp: Date.now(),
        }

        setDiscussionHistory((prev) => [...prev, message])
      }
    } catch (error) {
      console.error(`Error in discussion with ${model.name}:`, error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>لوحة التحكم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Mode */}
          <div className="flex gap-2">
            <Button
              variant={testMode === "compare" ? "default" : "outline"}
              onClick={() => setTestMode("compare")}
              className="flex-1"
            >
              مقارنة جميع النماذج
            </Button>
            <Button
              variant={testMode === "single" ? "default" : "outline"}
              onClick={() => setTestMode("single")}
              className="flex-1"
            >
              اختبار منفرد
            </Button>
            <Button
              variant={discussionMode ? "default" : "outline"}
              onClick={() => setDiscussionMode(!discussionMode)}
              className="flex-1"
            >
              نقاش تفاعلي
            </Button>
          </div>

          {/* Sample Prompts */}
          <div>
            <label className="text-sm font-medium mb-2 block">أمثلة سريعة:</label>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sample, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => setPrompt(sample)} className="text-xs">
                  {sample.substring(0, 30)}...
                </Button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">النص المراد اختباره:</label>
            <Textarea
              placeholder="اكتب النص هنا..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
              dir="rtl"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {testMode === "compare" ? (
              <Button
                onClick={testAllModels}
                disabled={Object.values(loading).some(Boolean) || !prompt.trim()}
                className="flex-1"
              >
                {Object.values(loading).some(Boolean) ? "جاري الاختبار..." : "اختبار جميع النماذج"}
              </Button>
            ) : (
              <div className="grid grid-cols-3 gap-2 w-full">
                {models.map((model) => (
                  <Button
                    key={model.id}
                    onClick={() => testModel(model.id)}
                    disabled={loading[model.id] || !prompt.trim()}
                    variant="outline"
                  >
                    <model.icon className="w-4 h-4 mr-2" />
                    {loading[model.id] ? "جاري..." : model.name.split(" ")[0]}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <model.icon className={`w-5 h-5 text-${model.color}-600`} />
                  {model.name}
                </div>
                {responses[model.id] && (
                  <div className="flex items-center gap-2">
                    {responses[model.id].error ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {responses[model.id].responseTime}ms
                    </Badge>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`min-h-[300px] p-4 bg-${model.color}-50 rounded-lg border`}>
                {loading[model.id] ? (
                  <div className="flex items-center justify-center h-full">
                    <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-${model.color}-600`}></div>
                  </div>
                ) : responses[model.id] ? (
                  <div className="space-y-3">
                    {responses[model.id].error ? (
                      <p className="text-red-600" dir="rtl">
                        {responses[model.id].error}
                      </p>
                    ) : (
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed" dir="rtl">
                        {responses[model.id].response}
                      </p>
                    )}
                    {responses[model.id].usage && (
                      <div className="text-xs text-slate-500 border-t pt-2">
                        <p>Tokens: {responses[model.id].usage.total_tokens || "N/A"}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center">نتائج {model.name} ستظهر هنا...</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Discussion Mode */}
      {discussionMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                النقاش التفاعلي بين النماذج
              </div>
              <Button onClick={startDiscussion} disabled={!prompt.trim()}>
                بدء النقاش
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {discussionHistory.map((entry, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    entry.model === "ديب سيك"
                      ? "bg-blue-50 border-l-blue-500"
                      : entry.model === "جيمناي"
                        ? "bg-purple-50 border-l-purple-500"
                        : "bg-green-50 border-l-green-500"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={
                        entry.model === "ديب سيك"
                          ? "text-blue-700"
                          : entry.model === "جيمناي"
                            ? "text-purple-700"
                            : "text-green-700"
                      }
                    >
                      {entry.model}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {new Date(entry.timestamp).toLocaleTimeString("ar-SA")}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed" dir="rtl">
                    {entry.message}
                  </p>
                </div>
              ))}

              {discussionHistory.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">النقاش سيبدأ هنا بين النماذج الثلاثة</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Comparison */}
      {Object.keys(responses).length > 1 && Object.values(responses).every((r) => r && !r.error) && (
        <Card>
          <CardHeader>
            <CardTitle>مقارنة الأداء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-lg font-semibold text-slate-700">الأسرع</div>
                <div className="text-2xl font-bold text-green-600">
                  {(() => {
                    const validResponses = Object.entries(responses).filter(
                      ([_, response]) => response && response.responseTime && !response.error,
                    )
                    if (validResponses.length === 0) return "N/A"

                    const fastest = validResponses.reduce((fastest, [id, response]) =>
                      !fastest || response.responseTime < fastest[1].responseTime ? [id, response] : fastest,
                    )

                    const modelNames = {
                      together: "DeepSeek",
                      groq: "Llama3",
                      gemini: "Gemini",
                    }

                    return modelNames[fastest[0]] || fastest[0]
                  })()}
                </div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-lg font-semibold text-slate-700">الأطول</div>
                <div className="text-2xl font-bold text-blue-600">
                  {(() => {
                    const validResponses = Object.entries(responses).filter(
                      ([_, response]) => response && response.response && !response.error,
                    )
                    if (validResponses.length === 0) return "N/A"

                    const longest = validResponses.reduce((longest, [id, response]) =>
                      !longest || response.response.length > longest[1].response.length ? [id, response] : longest,
                    )

                    const modelNames = {
                      together: "DeepSeek",
                      groq: "Llama3",
                      gemini: "Gemini",
                    }

                    return modelNames[longest[0]] || longest[0]
                  })()}
                </div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-lg font-semibold text-slate-700">متوسط الوقت</div>
                <div className="text-2xl font-bold text-purple-600">
                  {(() => {
                    const validResponses = Object.values(responses).filter((r) => r && r.responseTime && !r.error)
                    if (validResponses.length === 0) return "N/A"

                    const average = validResponses.reduce((sum, r) => sum + r.responseTime, 0) / validResponses.length
                    return Math.round(average) + "ms"
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
