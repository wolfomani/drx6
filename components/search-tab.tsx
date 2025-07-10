"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Clock, TrendingUp, Globe, BookOpen, FileText, Zap } from "lucide-react"

export function SearchTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const mockSearchResults = [
    {
      id: 1,
      title: "مقدمة في الذكاء الاصطناعي",
      content: "الذكاء الاصطناعي هو فرع من علوم الحاسوب يهدف إلى إنشاء آلات قادرة على التفكير والتعلم...",
      source: "Wikipedia",
      relevance: 95,
      type: "مقال",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "تطبيقات التعلم الآلي في الطب",
      content: "يستخدم التعلم الآلي في تشخيص الأمراض وتطوير العلاجات الجديدة...",
      source: "Nature Medicine",
      relevance: 89,
      type: "بحث علمي",
      date: "2024-01-12",
    },
    {
      id: 3,
      title: "مستقبل الذكاء الاصطناعي",
      content: "توقعات الخبراء حول تطور الذكاء الاصطناعي في العقد القادم...",
      source: "MIT Technology Review",
      relevance: 87,
      type: "تقرير",
      date: "2024-01-10",
    },
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // محاكاة البحث
    setTimeout(() => {
      setSearchResults(mockSearchResults)
      setIsSearching(false)
    }, 2000)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "مقال":
        return <FileText className="w-4 h-4" />
      case "بحث علمي":
        return <BookOpen className="w-4 h-4" />
      case "تقرير":
        return <Globe className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Search className="w-6 h-6 text-blue-400" />
            البحث الذكي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="search">البحث</TabsTrigger>
              <TabsTrigger value="history">السجل</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              {/* شريط البحث */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="ابحث عن أي موضوع..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-500">
                  {isSearching ? <Zap className="w-4 h-4 animate-pulse" /> : <Search className="w-4 h-4" />}
                  {isSearching ? "جاري البحث..." : "بحث"}
                </Button>
                <Button variant="outline" className="border-gray-600 bg-transparent">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* إحصائيات البحث */}
              {searchResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-400">النتائج</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{searchResults.length}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">الصلة</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(searchResults.reduce((acc, r) => acc + r.relevance, 0) / searchResults.length)}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-400">الوقت</span>
                      </div>
                      <div className="text-2xl font-bold text-white">0.8s</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">المصادر</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {new Set(searchResults.map((r) => r.source)).size}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* نتائج البحث */}
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <Card
                    key={result.id}
                    className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(result.type)}
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500">{result.type}</Badge>
                          <span className="text-xs text-gray-500">{result.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500/20 text-green-300 border-green-500">
                            {result.relevance}% صلة
                          </Badge>
                          <span className="text-xs text-gray-500">{result.date}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">{result.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{result.content}</p>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent text-gray-300">
                          قراءة المزيد
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent text-gray-300">
                          حفظ
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent text-gray-300">
                          مشاركة
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* رسالة عدم وجود نتائج */}
              {!isSearching && searchResults.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h3>
                  <p className="text-gray-400">جرب استخدام كلمات مفتاحية مختلفة</p>
                </div>
              )}

              {/* رسالة البحث الأولي */}
              {!searchQuery && searchResults.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">ابدأ البحث</h3>
                  <p className="text-gray-400">اكتب استفسارك في شريط البحث أعلاه</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    سجل البحث
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { query: "الذكاء الاصطناعي", results: 15, date: "منذ ساعة" },
                      { query: "التعلم الآلي", results: 23, date: "منذ 3 ساعات" },
                      { query: "معالجة اللغات الطبيعية", results: 18, date: "أمس" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{item.query}</h4>
                          <p className="text-sm text-gray-400">
                            {item.results} نتيجة • {item.date}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                          إعادة البحث
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    إعدادات البحث
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">عدد النتائج لكل صفحة</label>
                      <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">ترتيب النتائج</label>
                      <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                        <option>الأكثر صلة</option>
                        <option>الأحدث</option>
                        <option>الأقدم</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">نوع المحتوى</label>
                      <div className="mt-2 space-y-2">
                        {["مقالات", "أبحاث علمية", "تقارير", "كتب", "فيديوهات"].map((type) => (
                          <label key={type} className="flex items-center gap-2 text-white">
                            <input type="checkbox" defaultChecked className="rounded" />
                            {type}
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-500">حفظ الإعدادات</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
