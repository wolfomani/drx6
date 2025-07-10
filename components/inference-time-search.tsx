"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Zap, Target, BarChart3, CheckCircle, Clock, Brain } from "lucide-react"

interface SearchCandidate {
  id: string
  response: string
  score: number
  reasoning: string
  model: string
  timestamp: number
}

interface SearchResult {
  query: string
  candidates: SearchCandidate[]
  bestCandidate: SearchCandidate
  searchTime: number
  totalCandidates: number
  verificationScore: number
}

export function InferenceTimeSearch() {
  const [query, setQuery] = useState("")
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [candidateCount, setCandidateCount] = useState(50)
  const [selectedModels, setSelectedModels] = useState(["gemini-2.5", "deepseek-r1", "llama3"])
  const [verificationMode, setVerificationMode] = useState("self-verification")

  const models = [
    { id: "gemini-2.5", name: "Gemini 2.5 Pro", speed: "متوسط", quality: "عالي جداً" },
    { id: "deepseek-r1", name: "DeepSeek R1", speed: "متوسط", quality: "عالي" },
    { id: "llama3", name: "Llama3", speed: "سريع جداً", quality: "جيد" },
    { id: "claude-3.5", name: "Claude 3.5", speed: "متوسط", quality: "عالي جداً" },
  ]

  const verificationModes = [
    { id: "self-verification", name: "التحقق الذاتي", description: "النموذج يقيم إجاباته بنفسه" },
    { id: "cross-verification", name: "التحقق المتقاطع", description: "نماذج متعددة تقيم الإجابات" },
    { id: "consensus", name: "الإجماع", description: "اختيار الإجابة الأكثر تكراراً" },
    { id: "scoring", name: "التسجيل", description: "نظام تسجيل متقدم" },
  ]

  const performInferenceTimeSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/inference-time-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          candidateCount,
          models: selectedModels,
          verificationMode,
        }),
      })

      const data = await response.json()
      setSearchResult(data.result)
    } catch (error) {
      console.error("Error performing inference-time search:", error)
    } finally {
      setLoading(false)
    }
  }

  const sampleQueries = [
    "ما هي أفضل استراتيجية لتطوير تطبيق ذكي للهواتف المحمولة؟",
    "كيف يمكن تحسين كفاءة الطاقة في المباني الذكية؟",
    "اشرح تأثير الذكاء الاصطناعي على سوق العمل في المستقبل",
    "ما هي التحديات الأخلاقية للذكاء الاصطناعي؟",
  ]

  return (
    <div className="space-y-6">
      {/* Search Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">عمليات بحث</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-slate-600">دقة النتائج</p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600">متوسط الوقت</p>
                <p className="text-2xl font-bold">3.4s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-slate-600">متوسط المرشحين</p>
                <p className="text-2xl font-bold">67</p>
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
              <Brain className="w-5 h-5" />
              إعدادات البحث الذكي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Candidate Count */}
            <div>
              <label className="text-sm font-medium mb-2 block">عدد المرشحين: {candidateCount}</label>
              <Slider
                value={[candidateCount]}
                onValueChange={(value) => setCandidateCount(value[0])}
                max={200}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="text-xs text-slate-500 mt-1">المزيد من المرشحين = دقة أعلى + وقت أطول</div>
            </div>

            {/* Model Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">النماذج المشاركة</label>
              <div className="space-y-2">
                {models.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedModels.includes(model.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedModels([...selectedModels, model.id])
                          } else {
                            setSelectedModels(selectedModels.filter((m) => m !== model.id))
                          }
                        }}
                      />
                      <span className="text-sm font-medium">{model.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {model.speed}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {model.quality}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Mode */}
            <div>
              <label className="text-sm font-medium mb-2 block">نمط التحقق</label>
              <Select value={verificationMode} onValueChange={setVerificationMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {verificationModes.map((mode) => (
                    <SelectItem key={mode.id} value={mode.id}>
                      {mode.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-slate-500 mt-1">
                {verificationModes.find((m) => m.id === verificationMode)?.description}
              </div>
            </div>

            {/* Sample Queries */}
            <div>
              <label className="text-sm font-medium mb-2 block">استعلامات تجريبية:</label>
              <div className="space-y-1">
                {sampleQueries.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(sample)}
                    className="w-full text-xs text-right h-auto p-2"
                  >
                    {sample}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={performInferenceTimeSearch} disabled={loading || !query.trim()} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              {loading ? "جاري البحث..." : "بدء البحث الذكي"}
            </Button>
          </CardContent>
        </Card>

        {/* Search Interface and Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Query Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                الاستعلام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="أدخل سؤالك هنا للحصول على أفضل إجابة من مئات المرشحين..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[100px]"
                dir="rtl"
              />
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <Card>
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-slate-600">جاري توليد {candidateCount} مرشح وتحليل النتائج...</p>
                  <Progress value={Math.random() * 100} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          {searchResult && !loading && (
            <div className="space-y-6">
              {/* Best Result */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      أفضل إجابة
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        نقاط: {searchResult.bestCandidate.score.toFixed(1)}
                      </Badge>
                      <Badge variant="outline">{searchResult.bestCandidate.model}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="prose prose-slate max-w-none" dir="rtl">
                      <p className="text-slate-700 leading-relaxed">{searchResult.bestCandidate.response}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">التبرير:</h4>
                      <p className="text-blue-700 text-sm" dir="rtl">
                        {searchResult.bestCandidate.reasoning}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>تحليل البحث</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-semibold text-slate-700">إجمالي المرشحين</div>
                      <div className="text-2xl font-bold text-blue-600">{searchResult.totalCandidates}</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-semibold text-slate-700">وقت البحث</div>
                      <div className="text-2xl font-bold text-green-600">{searchResult.searchTime.toFixed(1)}s</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-semibold text-slate-700">نقاط التحقق</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {searchResult.verificationScore.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-semibold text-slate-700">النماذج المستخدمة</div>
                      <div className="text-2xl font-bold text-orange-600">{selectedModels.length}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Candidates */}
              <Card>
                <CardHeader>
                  <CardTitle>مرشحين بديلين</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {searchResult.candidates.slice(1, 4).map((candidate, index) => (
                      <div key={candidate.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">المرشح #{index + 2}</Badge>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{candidate.model}</Badge>
                            <Badge variant="outline">نقاط: {candidate.score.toFixed(1)}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700" dir="rtl">
                          {candidate.response.substring(0, 200)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
