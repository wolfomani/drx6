"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Settings, BarChart3, Info, Brain } from "lucide-react"
import { EnhancedMessageBubble } from "./enhanced-message-bubble"
import { ConnectionTest } from "@/components/connection-test"
import { ModelInfo } from "@/components/model-info"

interface ModelResponse {
  response: string
  model: string
  usage?: any
  responseTime: number
  error?: string
  thinking?: {
    text: string
    duration: number
  }
}

export function EnhancedModelComparison() {
  const [prompt, setPrompt] = useState("اكتب قصة قصيرة عن الذكاء الاصطناعي في المستقبل")
  const [responses, setResponses] = useState<Record<string, ModelResponse>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [testMode, setTestMode] = useState<"single" | "compare" | "thinking">("thinking")
  const [showModelInfo, setShowModelInfo] = useState(false)
  const [messages, setMessages] = useState<any[]>([])

  const models = [
    { id: "together", name: "DeepSeek R1 (70B)", color: "blue" },
    { id: "groq", name: "Llama3 (8B)", color: "green" },
    { id: "gemini", name: "Gemini 2.5", color: "purple" },
  ]

  const generateThinkingText = (prompt: string, model: string) => {
    const thinkingTemplates = {
      together: `المستخدم يطلب مني كتابة قصة قصيرة عن الذكاء الاصطناعي في المستقبل. سأحتاج إلى:

1. تحديد الشخصيات الرئيسية
2. وضع إطار زمني مستقبلي
3. إنشاء حبكة مثيرة تتضمن تقنيات الذكاء الاصطناعي
4. التأكد من أن القصة تحمل رسالة إيجابية عن المستقبل

سأبدأ بشخصية عالم أو مهندس يعمل مع الذكاء الاصطناعي، وأضع القصة في عام 2050 تقريباً.`,

      groq: `تحليل الطلب: كتابة قصة خيال علمي عن الذكاء الاصطناعي.

العناصر المطلوبة:
- شخصيات واقعية
- تقنيات مستقبلية معقولة  
- حبكة مشوقة
- نهاية مؤثرة

سأركز على الجانب الإنساني للتكنولوجيا وكيف يمكن للذكاء الاصطناعي أن يساعد البشر.`,

      gemini: `أحتاج لإنشاء قصة إبداعية عن الذكاء الاصطناعي. دعني أفكر في العناصر:

الموضوع: العلاقة بين الإنسان والذكاء الاصطناعي
الزمان: المستقبل القريب (2040-2050)
المكان: مدينة ذكية متطورة
الشخصيات: عالم/ة + نظام ذكاء اصطناعي متقدم
الصراع: تحدي تقني أو أخلاقي
الحل: تعاون بين الذكاء البشري والاصطناعي

سأكتب قصة تُظهر الإمكانيات الإيجابية للتكنولوجيا.`,
    }

    return thinkingTemplates[model as keyof typeof thinkingTemplates] || "أفكر في أفضل طريقة للإجابة على هذا السؤال..."
  }

  const testModelWithThinking = async (modelType: "together" | "groq" | "gemini") => {
    setLoading((prev) => ({ ...prev, [modelType]: true }))

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: prompt,
      role: "user" as const,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Generate thinking text
    const thinkingText = generateThinkingText(prompt, modelType)
    const thinkingDuration = Math.random() * 3 + 2 // 2-5 seconds

    // Add AI message with thinking
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      content: "", // Will be filled after API call
      role: "assistant" as const,
      model: models.find((m) => m.id === modelType)?.name,
      timestamp: new Date(),
      thinking: {
        text: thinkingText,
        duration: thinkingDuration,
      },
    }

    setMessages((prev) => [...prev, aiMessage])

    // Wait for thinking duration, then make API call
    setTimeout(async () => {
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

        // Update the message with the actual response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id
              ? { ...msg, content: data.response || data.error || "عذراً، حدث خطأ في الاستجابة" }
              : msg,
          ),
        )

        const result: ModelResponse = {
          response: data.response || data.error,
          model: data.model || modelType,
          usage: data.usage,
          responseTime,
          error: data.error,
          thinking: {
            text: thinkingText,
            duration: thinkingDuration,
          },
        }

        setResponses((prev) => ({ ...prev, [modelType]: result }))
      } catch (error) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === aiMessage.id ? { ...msg, content: `خطأ في الاتصال: ${error}` } : msg)),
        )
      } finally {
        setLoading((prev) => ({ ...prev, [modelType]: false }))
      }
    }, thinkingDuration * 1000)
  }

  const clearConversation = () => {
    setMessages([])
    setResponses({})
  }

  const samplePrompts = [
    "اكتب قصة قصيرة عن الذكاء الاصطناعي في المستقبل",
    "اشرح مفهوم التعلم العميق بطريقة بسيطة",
    "اكتب كود Python لتحليل البيانات",
    "ما هي أفضل الممارسات في تطوير الويب؟",
    "كيف يمكن حل مشكلة التغير المناخي؟",
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
            إعدادات الاختبار مع التفكير المنطقي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={testMode === "thinking" ? "default" : "outline"}
              onClick={() => setTestMode("thinking")}
              className={`flex-1 ${testMode === "thinking" ? "btn-primary" : "btn-secondary"}`}
            >
              <Brain className="w-4 h-4 ml-2" />
              التفكير المنطقي
            </Button>
            <Button
              variant={testMode === "compare" ? "default" : "outline"}
              onClick={() => setTestMode("compare")}
              className={`flex-1 ${testMode === "compare" ? "btn-primary" : "btn-secondary"}`}
            >
              مقارنة سريعة
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
            {testMode === "thinking" ? (
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button
                  onClick={() => testModelWithThinking("together")}
                  disabled={loading.together || !prompt.trim()}
                  className="btn-secondary"
                >
                  {loading.together ? <div className="spinner"></div> : "DeepSeek R1"}
                </Button>
                <Button
                  onClick={() => testModelWithThinking("groq")}
                  disabled={loading.groq || !prompt.trim()}
                  className="btn-secondary"
                >
                  {loading.groq ? <div className="spinner"></div> : "Llama3"}
                </Button>
                <Button
                  onClick={() => testModelWithThinking("gemini")}
                  disabled={loading.gemini || !prompt.trim()}
                  className="btn-secondary"
                >
                  {loading.gemini ? <div className="spinner"></div> : "Gemini"}
                </Button>
              </div>
            ) : (
              <Button className="btn-primary flex-1">اختبار سريع (بدون تفكير)</Button>
            )}
            <Button variant="outline" onClick={clearConversation} className="btn-secondary bg-transparent">
              مسح المحادثة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Test */}
      <ConnectionTest />

      {/* Conversation Display */}
      {messages.length > 0 && (
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="w-5 h-5" />
              المحادثة مع التفكير المنطقي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {messages.map((message, index) => (
                <EnhancedMessageBubble
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1}
                  showThinking={testMode === "thinking"}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Stats */}
      {Object.keys(responses).length > 0 && (
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="w-5 h-5" />
              إحصائيات الأداء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(responses).map(([modelId, response]) => (
                <div key={modelId} className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-200 mb-2">
                    {models.find((m) => m.id === modelId)?.name}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">وقت التفكير:</span>
                      <span className="text-white">{response.thinking?.duration.toFixed(1)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">وقت الاستجابة:</span>
                      <span className="text-white">{response.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">طول النص:</span>
                      <span className="text-white">{response.response.length} حرف</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
