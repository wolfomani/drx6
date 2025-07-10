"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Map, Download, Share, Zap, Brain, Network } from "lucide-react"

interface MindMapNode {
  id: string
  text: string
  x: number
  y: number
  level: number
  children: string[]
  parent?: string
  color: string
}

interface MindMapData {
  nodes: MindMapNode[]
  connections: { from: string; to: string }[]
  title: string
}

export function MindMapGenerator() {
  const [inputText, setInputText] = useState("")
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null)
  const [loading, setLoading] = useState(false)
  const [mapStyle, setMapStyle] = useState("hierarchical")
  const [selectedModel, setSelectedModel] = useState("gemini-2.5")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const mapStyles = [
    { id: "hierarchical", name: "هرمي", description: "تنظيم هرمي تقليدي" },
    { id: "radial", name: "شعاعي", description: "من المركز إلى الخارج" },
    { id: "organic", name: "عضوي", description: "تدفق طبيعي" },
    { id: "network", name: "شبكي", description: "شبكة مترابطة" },
  ]

  const generateMindMap = async () => {
    if (!inputText.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/generate-mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          style: mapStyle,
          model: selectedModel,
        }),
      })

      const data = await response.json()
      setMindMapData(data.mindMap)
    } catch (error) {
      console.error("Error generating mind map:", error)
    } finally {
      setLoading(false)
    }
  }

  const drawMindMap = () => {
    if (!mindMapData || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 2
    mindMapData.connections.forEach((conn) => {
      const fromNode = mindMapData.nodes.find((n) => n.id === conn.from)
      const toNode = mindMapData.nodes.find((n) => n.id === conn.to)
      if (fromNode && toNode) {
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    mindMapData.nodes.forEach((node) => {
      // Draw node background
      ctx.fillStyle = node.color
      ctx.beginPath()
      ctx.roundRect(node.x - 60, node.y - 20, 120, 40, 20)
      ctx.fill()

      // Draw node text
      ctx.fillStyle = "#1e293b"
      ctx.font = `${14 - node.level}px Arial`
      ctx.textAlign = "center"
      ctx.fillText(node.text, node.x, node.y + 5)
    })
  }

  useEffect(() => {
    if (mindMapData) {
      drawMindMap()
    }
  }, [mindMapData])

  const exportMindMap = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = "mindmap.png"
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  const sampleTexts = [
    "الذكاء الاصطناعي وتطبيقاته في المستقبل: التعلم الآلي، الشبكات العصبية، معالجة اللغة الطبيعية، الرؤية الحاسوبية، والأتمتة الذكية",
    "خطة تطوير مشروع تقني: تحليل المتطلبات، التصميم، التطوير، الاختبار، النشر، والصيانة",
    "استراتيجية التسويق الرقمي: وسائل التواصل الاجتماعي، تحسين محركات البحث، الإعلانات المدفوعة، التسويق بالمحتوى",
  ]

  return (
    <div className="space-y-6">
      {/* Mind Map Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">خرائط مولدة</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-slate-600">متوسط العقد</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600">مستوى التعقيد</p>
                <p className="text-2xl font-bold">4.2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-slate-600">وقت التوليد</p>
                <p className="text-2xl font-bold">2.3s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              إعدادات الخريطة الذهنية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Model Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">النموذج</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-2.5">Gemini 2.5 Pro</SelectItem>
                  <SelectItem value="deepseek-r1">DeepSeek R1</SelectItem>
                  <SelectItem value="claude-3.5">Claude 3.5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Style Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">نمط الخريطة</label>
              <Select value={mapStyle} onValueChange={setMapStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mapStyles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name} - {style.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sample Texts */}
            <div>
              <label className="text-sm font-medium mb-2 block">نصوص تجريبية:</label>
              <div className="space-y-2">
                {sampleTexts.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputText(sample)}
                    className="w-full text-xs text-right h-auto p-2"
                  >
                    {sample.substring(0, 60)}...
                  </Button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">النص المراد تحويله:</label>
              <Textarea
                placeholder="أدخل النص هنا لتحويله إلى خريطة ذهنية تفاعلية..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px]"
                dir="rtl"
              />
            </div>

            <Button onClick={generateMindMap} disabled={loading || !inputText.trim()} className="w-full">
              <Map className="w-4 h-4 mr-2" />
              {loading ? "جاري التوليد..." : "توليد الخريطة الذهنية"}
            </Button>
          </CardContent>
        </Card>

        {/* Mind Map Display */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  الخريطة الذهنية التفاعلية
                </div>
                {mindMapData && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportMindMap}>
                      <Download className="w-4 h-4 mr-2" />
                      تصدير
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      مشاركة
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[500px] border rounded-lg bg-white relative overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-slate-600">جاري تحليل النص وإنشاء الخريطة الذهنية...</p>
                    </div>
                  </div>
                ) : mindMapData ? (
                  <div className="relative w-full h-full">
                    <canvas ref={canvasRef} width={800} height={500} className="w-full h-full" />
                    <div className="absolute top-4 left-4 space-y-2">
                      <Badge variant="secondary">{mindMapData.title}</Badge>
                      <div className="text-xs text-slate-600">
                        {mindMapData.nodes.length} عقدة • {mindMapData.connections.length} اتصال
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div className="space-y-4">
                      <Map className="w-16 h-16 text-slate-400 mx-auto" />
                      <p className="text-slate-500">أدخل النص واضغط "توليد الخريطة الذهنية" لبدء الإنشاء</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mind Map Analysis */}
          {mindMapData && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>تحليل الخريطة الذهنية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-semibold text-slate-700">المفاهيم الرئيسية</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {mindMapData.nodes.filter((n) => n.level === 1).length}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-semibold text-slate-700">المفاهيم الفرعية</div>
                    <div className="text-2xl font-bold text-green-600">
                      {mindMapData.nodes.filter((n) => n.level > 1).length}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-semibold text-slate-700">عمق الخريطة</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.max(...mindMapData.nodes.map((n) => n.level))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
