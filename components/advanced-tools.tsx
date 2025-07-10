"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Zap, Globe, Search, BarChart3, FileText, Code, Sparkles, Heart, Atom } from "lucide-react"

interface ModelCapability {
  name: string
  icon: any
  description: string
  models: string[]
  features: string[]
}

export function AdvancedTools() {
  const [selectedModel, setSelectedModel] = useState("gemini-2.5")
  const [selectedTool, setSelectedTool] = useState("thinking")
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const models = [
    {
      id: "gemini-2.5",
      name: "Gemini 2.5 Pro",
      capabilities: ["thinking", "url-context", "code-execution", "multimodal", "cosmic-generator"],
    },
    {
      id: "deepseek-r1",
      name: "DeepSeek R1",
      capabilities: ["reasoning", "code-generation", "math", "quantum-poetry"],
    },
    {
      id: "llama3",
      name: "Llama3",
      capabilities: ["fast-inference", "text-generation", "analysis"],
    },
    {
      id: "claude-3.5",
      name: "Claude 3.5 Sonnet",
      capabilities: ["analysis", "writing", "reasoning", "metaphysical-analysis"],
    },
  ]

  const capabilities: ModelCapability[] = [
    {
      name: "التفكير المتقدم",
      icon: Brain,
      description: "تفكير عميق مع تصور بصري متقدم",
      models: ["gemini-2.5", "deepseek-r1"],
      features: ["رسوم بيانية", "مؤشرات الأداء", "تحليل متعمق"],
    },
    {
      name: "المولد الكوني",
      icon: Sparkles,
      description: "توليد محتوى كوني يدمج الرياضيات والعلوم",
      models: ["gemini-2.5"],
      features: ["معادلات كونية", "تحليل كمومي", "بصائر ميتافيزيقية"],
    },
    {
      name: "الشعر الكمومي",
      icon: Heart,
      description: "شعر مُلهم بالفيزياء الكمومية",
      models: ["deepseek-r1", "claude-3.5"],
      features: ["شعر عربي", "تحليل كمومي", "تصور بصري"],
    },
    {
      name: "التحليل المتقدم",
      icon: BarChart3,
      description: "تحليل شامل مع رسوم بيانية تفاعلية",
      models: ["gemini-2.5", "claude-3.5"],
      features: ["رسوم بيانية", "إحصائيات", "توقعات"],
    },
  ]

  const tools = [
    { id: "thinking", name: "التفكير المتقدم", model: "gemini-2.5", icon: Brain },
    { id: "cosmic-generator", name: "المولد الكوني", model: "gemini-2.5", icon: Sparkles },
    { id: "quantum-poetry", name: "الشعر الكمومي", model: "deepseek-r1", icon: Heart },
    { id: "analysis", name: "التحليل المتقدم", model: "claude-3.5", icon: BarChart3 },
    { id: "code-execution", name: "تنفيذ الكود", model: "gemini-2.5", icon: Code },
    { id: "url-search", name: "البحث في الويب", model: "gemini-2.5", icon: Globe },
    { id: "reasoning", name: "التفكير المنطقي", model: "deepseek-r1", icon: Atom },
    { id: "fast-generation", name: "التوليد السريع", model: "llama3", icon: Zap },
  ]

  const executeAdvancedTool = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/advanced-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          tool: selectedTool,
          prompt: prompt,
        }),
      })

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error("Error:", error)
      setResult("حدث خطأ في تنفيذ الأداة")
    } finally {
      setLoading(false)
    }
  }

  const selectedModelData = models.find((m) => m.id === selectedModel)
  const selectedToolData = tools.find((t) => t.id === selectedTool)

  return (
    <div className="space-y-6">
      {/* Model Capabilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {capabilities.map((capability, index) => (
          <Card
            key={index}
            className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <capability.icon className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-sm text-white">{capability.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-300">{capability.description}</p>
              <div className="flex flex-wrap gap-1">
                {capability.features.map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs border-blue-400 text-blue-300">
                    {feature}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-slate-400">متاح في: {capability.models.join(", ")}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Tool Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-yellow-400" />
              إعدادات الأدوات المتقدمة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Model Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-300">النموذج</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id} className="text-white hover:bg-slate-700">
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tool Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-300">الأداة</label>
              <Select value={selectedTool} onValueChange={setSelectedTool}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {tools
                    .filter(
                      (tool) =>
                        selectedModelData?.capabilities.includes(tool.id.split("-")[0]) ||
                        selectedModelData?.capabilities.includes(tool.id),
                    )
                    .map((tool) => (
                      <SelectItem key={tool.id} value={tool.id} className="text-white hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <tool.icon className="w-4 h-4" />
                          {tool.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model Capabilities */}
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-300">قدرات النموذج</label>
              <div className="flex flex-wrap gap-1">
                {selectedModelData?.capabilities.map((cap, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs bg-blue-600 text-white">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tool Info */}
            {selectedToolData && (
              <div className="space-y-3 p-3 bg-slate-800 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2">
                  <selectedToolData.icon className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-medium text-white">{selectedToolData.name}</h4>
                </div>
                <div className="text-xs text-slate-300">
                  {selectedTool === "cosmic-generator" && "يدمج الرياضيات والشعر والفيزياء الكمومية"}
                  {selectedTool === "quantum-poetry" && "شعر مُلهم بالمبادئ الكمومية"}
                  {selectedTool === "thinking" && "تفكير متقدم مع تصور بصري"}
                  {selectedTool === "analysis" && "تحليل شامل مع رسوم بيانية"}
                </div>
              </div>
            )}

            <Button
              onClick={executeAdvancedTool}
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري التنفيذ...
                </div>
              ) : (
                "تنفيذ الأداة"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Input and Output */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5 text-green-400" />
                المدخلات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="أدخل النص أو السؤال هنا..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[150px] bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                dir="rtl"
              />
              <div className="mt-2 text-xs text-slate-400">
                💡 نصائح: استخدم أسئلة مفصلة للحصول على نتائج أفضل مع تصور بصري متقدم
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                النتائج مع التصور البصري
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px] p-4 bg-slate-800 rounded-lg border border-slate-600">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                      <p className="text-slate-300">جاري تنفيذ الأداة المتقدمة مع التصور البصري...</p>
                      <div className="flex justify-center space-x-1">
                        <div className="animate-pulse w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div
                          className="animate-pulse w-2 h-2 bg-purple-400 rounded-full"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="animate-pulse w-2 h-2 bg-green-400 rounded-full"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <div className="prose prose-invert max-w-none" dir="rtl">
                      <div className="text-slate-100 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                        {result}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="w-16 h-16 text-slate-500 mx-auto" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-400">النتائج مع التصور البصري ستظهر هنا</p>
                        <p className="text-xs text-slate-500">📊 رسوم بيانية • 📈 إحصائيات • 🎨 تنسيق متقدم</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
              onClick={() => {
                setSelectedTool("thinking")
                setPrompt("حلل هذه المشكلة خطوة بخطوة: كيف يمكن تحسين كفاءة الطاقة في المدن الذكية؟")
              }}
            >
              <Brain className="w-4 h-4 mr-2" />
              تحليل متقدم
            </Button>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent"
              onClick={() => {
                setSelectedTool("cosmic-generator")
                setPrompt("الذوبان في الضوء اللامدرك")
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              مولد كوني
            </Button>
            <Button
              variant="outline"
              className="border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white bg-transparent"
              onClick={() => {
                setSelectedTool("quantum-poetry")
                setPrompt("تشابك الأرواح عبر المجرات")
              }}
            >
              <Heart className="w-4 h-4 mr-2" />
              شعر كمومي
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white bg-transparent"
              onClick={() => {
                setSelectedTool("code-execution")
                setPrompt("اكتب كود Python لتحليل بيانات المبيعات وإنشاء رسم بياني")
              }}
            >
              <Code className="w-4 h-4 mr-2" />
              تنفيذ كود
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
