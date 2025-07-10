"use client"
import { useState } from "react"
import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Brain, Search, Zap, Globe, Code, Users } from "lucide-react"
import { AIDiscussion } from "@/components/ai-discussion"

export function AdvancedFeatures() {
  const [activeFeature, setActiveFeature] = useState("thinking")
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState({
    thinkingBudget: 8000,
    candidateCount: 50,
    useWebSearch: false,
    temperature: 0.7,
  })

  const features = [
    {
      id: "thinking",
      name: "التفكير المتقدم",
      icon: Brain,
      description: "تفكير عميق مع Gemini 2.5",
      model: "gemini",
    },
    {
      id: "discussion",
      name: "النقاش التفاعلي",
      icon: Users,
      description: "نقاش بين النماذج الثلاثة",
      model: "multiple",
    },
    {
      id: "inference-search",
      name: "البحث الذكي",
      icon: Search,
      description: "توليد مئات الإجابات واختيار الأفضل",
      model: "multiple",
    },
    {
      id: "web-search",
      name: "البحث في الويب",
      icon: Globe,
      description: "الوصول للمعلومات الحديثة",
      model: "gemini",
    },
    {
      id: "code-execution",
      name: "تنفيذ الكود",
      icon: Code,
      description: "تشغيل وتحليل الكود",
      model: "gemini",
    },
  ]

  const executeFeature = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    try {
      let endpoint = ""
      const body: any = { prompt }

      switch (activeFeature) {
        case "thinking":
          endpoint = "/api/gemini"
          body.config = {
            thinkingBudget: config.thinkingBudget,
            temperature: config.temperature,
          }
          break
        case "inference-search":
          endpoint = "/api/inference-search"
          body.candidateCount = config.candidateCount
          break
        case "web-search":
          endpoint = "/api/gemini"
          body.config = {
            useUrlContext: true,
            temperature: config.temperature,
          }
          break
        case "code-execution":
          endpoint = "/api/gemini"
          body.config = {
            temperature: 0.1, // Lower temperature for code
          }
          body.prompt = `Execute this code and provide results:\n${prompt}`
          break
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      setResult(data.response || data.result || data.error)
    } catch (error) {
      setResult(`خطأ: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const samplePrompts = {
    thinking: [
      "حلل هذه المشكلة خطوة بخطوة: كيف يمكن تحسين كفاءة الطاقة في المدن الذكية؟",
      "ما هي الاستراتيجية المثلى لتطوير تطبيق ذكي للهواتف المحمولة؟",
    ],
    "inference-search": ["ما هي أفضل طريقة لتعلم البرمجة للمبتدئين؟", "كيف يؤثر الذكاء الاصطناعي على سوق العمل؟"],
    "web-search": ["ما هي آخر التطورات في الذكاء الاصطناعي لعام 2024؟", "أحدث الأخبار حول تقنيات الطاقة المتجددة"],
    "code-execution": [
      "import pandas as pd\ndata = {'name': ['أحمد', 'فاطمة'], 'age': [25, 30]}\ndf = pd.DataFrame(data)\nprint(df)",
      "def fibonacci(n):\n    if n <= 1: return n\n    return fibonacci(n-1) + fibonacci(n-2)\nprint([fibonacci(i) for i in range(10)])",
    ],
  }

  return (
    <div className="space-y-6">
      {/* Feature Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className={`cursor-pointer transition-all ${
              activeFeature === feature.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-slate-50"
            }`}
            onClick={() => setActiveFeature(feature.id)}
          >
            <CardContent className="p-4 text-center">
              <feature.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold text-sm">{feature.name}</h3>
              <p className="text-xs text-slate-600 mt-1">{feature.description}</p>
              <Badge variant="outline" className="mt-2 text-xs">
                {feature.model === "multiple" ? "متعدد" : feature.model}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              إعدادات {features.find((f) => f.id === activeFeature)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Feature-specific configs */}
            {activeFeature === "thinking" && (
              <div>
                <label className="text-sm font-medium mb-2 block">ميزانية التفكير: {config.thinkingBudget}</label>
                <Slider
                  value={[config.thinkingBudget]}
                  onValueChange={(value) => setConfig({ ...config, thinkingBudget: value[0] })}
                  max={10000}
                  min={1000}
                  step={500}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">المزيد = تفكير أعمق + وقت أطول</p>
              </div>
            )}

            {activeFeature === "inference-search" && (
              <div>
                <label className="text-sm font-medium mb-2 block">عدد المرشحين: {config.candidateCount}</label>
                <Slider
                  value={[config.candidateCount]}
                  onValueChange={(value) => setConfig({ ...config, candidateCount: value[0] })}
                  max={200}
                  min={10}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">المزيد = دقة أعلى + وقت أطول</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">درجة الحرارة: {config.temperature}</label>
              <Slider
                value={[config.temperature]}
                onValueChange={(value) => setConfig({ ...config, temperature: value[0] })}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Sample Prompts */}
            <div>
              <label className="text-sm font-medium mb-2 block">أمثلة:</label>
              <div className="space-y-2">
                {samplePrompts[activeFeature]?.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(sample)}
                    className="w-full text-xs text-right h-auto p-2"
                  >
                    {sample}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={executeFeature} disabled={loading || !prompt.trim()} className="w-full">
              {loading ? "جاري التنفيذ..." : `تنفيذ ${features.find((f) => f.id === activeFeature)?.name}`}
            </Button>
          </CardContent>
        </Card>

        {/* Input and Output */}
        <div className="lg:col-span-2 space-y-6">
          {activeFeature === "discussion" ? (
            <AIDiscussion />
          ) : (
            <>
              {/* Input */}
              <Card>
                <CardHeader>
                  <CardTitle>المدخلات</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={`أدخل النص للاستفادة من ${features.find((f) => f.id === activeFeature)?.name}...`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[150px]"
                    dir="rtl"
                  />
                </CardContent>
              </Card>

              {/* Output */}
              <Card>
                <CardHeader>
                  <CardTitle>النتائج</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[400px] p-4 bg-slate-50 rounded-lg border">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-4">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="text-slate-600">
                            جاري تنفيذ {features.find((f) => f.id === activeFeature)?.name}...
                          </p>
                        </div>
                      </div>
                    ) : result ? (
                      <div className="prose prose-slate max-w-none" dir="rtl">
                        <pre className="text-slate-700 whitespace-pre-wrap leading-relaxed">{result}</pre>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center">
                        <div className="space-y-4">
                          {React.createElement(features.find((f) => f.id === activeFeature)?.icon || Brain, {
                            className: "w-16 h-16 text-slate-400 mx-auto",
                          })}
                          <p className="text-slate-500">النتائج ستظهر هنا بعد التنفيذ</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
