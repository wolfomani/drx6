"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Wand2, Settings, Download, Share } from "lucide-react"

interface StoryParams {
  theme: string
  length: number
  tone: string
  characters: string
  setting: string
  prompt: string
}

export function StoryGenerator() {
  const [storyParams, setStoryParams] = useState<StoryParams>({
    theme: "ai-future",
    length: 500,
    tone: "mysterious",
    characters: "scientist",
    setting: "2050",
    prompt: "",
  })
  const [generatedStory, setGeneratedStory] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("deepseek-r1")

  const themes = [
    { value: "ai-future", label: "مستقبل الذكاء الاصطناعي" },
    { value: "space-exploration", label: "استكشاف الفضاء" },
    { value: "time-travel", label: "السفر عبر الزمن" },
    { value: "cyberpunk", label: "السايبربانك" },
    { value: "post-apocalyptic", label: "ما بعد الكارثة" },
    { value: "virtual-reality", label: "الواقع الافتراضي" },
  ]

  const tones = [
    { value: "mysterious", label: "غامض" },
    { value: "optimistic", label: "متفائل" },
    { value: "dark", label: "مظلم" },
    { value: "humorous", label: "فكاهي" },
    { value: "philosophical", label: "فلسفي" },
  ]

  const characters = [
    { value: "scientist", label: "عالم" },
    { value: "ai-researcher", label: "باحث ذكاء اصطناعي" },
    { value: "robot", label: "روبوت" },
    { value: "hacker", label: "هاكر" },
    { value: "explorer", label: "مستكشف" },
    { value: "child", label: "طفل" },
  ]

  const settings = [
    { value: "2050", label: "عام 2050" },
    { value: "2100", label: "عام 2100" },
    { value: "mars", label: "المريخ" },
    { value: "space-station", label: "محطة فضائية" },
    { value: "underground", label: "تحت الأرض" },
    { value: "virtual-world", label: "عالم افتراضي" },
  ]

  const generateStory = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          params: storyParams,
        }),
      })
      const data = await response.json()
      setGeneratedStory(data.story)
    } catch (error) {
      console.error("Error generating story:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportStory = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedStory], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "generated-story.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Story Parameters */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            إعدادات القصة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Model Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">النموذج المستخدم</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek-r1">DeepSeek R1 (70B)</SelectItem>
                <SelectItem value="llama3">Llama3 (8B)</SelectItem>
                <SelectItem value="fine-tuned">النموذج المدرب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme */}
          <div>
            <label className="text-sm font-medium mb-2 block">موضوع القصة</label>
            <Select
              value={storyParams.theme}
              onValueChange={(value) => setStoryParams({ ...storyParams, theme: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Length */}
          <div>
            <label className="text-sm font-medium mb-2 block">طول القصة: {storyParams.length} كلمة</label>
            <Slider
              value={[storyParams.length]}
              onValueChange={(value) => setStoryParams({ ...storyParams, length: value[0] })}
              max={2000}
              min={100}
              step={50}
              className="w-full"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="text-sm font-medium mb-2 block">نبرة القصة</label>
            <Select value={storyParams.tone} onValueChange={(value) => setStoryParams({ ...storyParams, tone: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Characters */}
          <div>
            <label className="text-sm font-medium mb-2 block">الشخصية الرئيسية</label>
            <Select
              value={storyParams.characters}
              onValueChange={(value) => setStoryParams({ ...storyParams, characters: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {characters.map((character) => (
                  <SelectItem key={character.value} value={character.value}>
                    {character.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Setting */}
          <div>
            <label className="text-sm font-medium mb-2 block">مكان وزمان القصة</label>
            <Select
              value={storyParams.setting}
              onValueChange={(value) => setStoryParams({ ...storyParams, setting: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {settings.map((setting) => (
                  <SelectItem key={setting.value} value={setting.value}>
                    {setting.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="text-sm font-medium mb-2 block">إضافات مخصصة (اختياري)</label>
            <Textarea
              placeholder="أضف تفاصيل إضافية للقصة..."
              value={storyParams.prompt}
              onChange={(e) => setStoryParams({ ...storyParams, prompt: e.target.value })}
              className="min-h-[80px]"
            />
          </div>

          {/* Generate Button */}
          <Button onClick={generateStory} disabled={loading} className="w-full">
            <Wand2 className="w-4 h-4 mr-2" />
            {loading ? "جاري التوليد..." : "توليد القصة"}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Story */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              القصة المولدة
            </div>
            {generatedStory && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportStory}>
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
          <div className="min-h-[600px] p-4 bg-slate-50 rounded-lg border">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-slate-600">جاري توليد قصة مخصصة لك...</p>
                </div>
              </div>
            ) : generatedStory ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{themes.find((t) => t.value === storyParams.theme)?.label}</Badge>
                  <Badge variant="outline">{storyParams.length} كلمة</Badge>
                  <Badge variant="outline">{tones.find((t) => t.value === storyParams.tone)?.label}</Badge>
                </div>
                <div className="prose prose-slate max-w-none" dir="rtl">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg">{generatedStory}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div className="space-y-4">
                  <BookOpen className="w-16 h-16 text-slate-400 mx-auto" />
                  <p className="text-slate-500 text-lg">اختر إعدادات القصة واضغط "توليد القصة" لبدء الإبداع</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
