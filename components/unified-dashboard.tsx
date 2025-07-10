"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Globe, User, Zap, ExternalLink, Github, Monitor, Server, Network } from "lucide-react"

interface Application {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  url: string
  github: string
  status: "active" | "development" | "maintenance"
  category: "ai" | "web" | "api" | "personal"
  technologies: string[]
  icon: React.ReactNode
  features: string[]
  featuresAr: string[]
}

const applications: Application[] = [
  {
    id: "drx6",
    name: "Advanced AI Platform",
    nameAr: "منصة الذكاء الاصطناعي المتقدمة",
    description: "Comprehensive AI integration platform with multi-model discussions",
    descriptionAr: "منصة شاملة لتكامل الذكاء الاصطناعي مع مناقشات متعددة النماذج",
    url: "https://drx6.vercel.app",
    github: "https://github.com/wolfomani/drx6",
    status: "active",
    category: "ai",
    technologies: ["Next.js 15", "TypeScript", "GROQ", "Gemini", "Together AI"],
    icon: <Brain className="w-6 h-6" />,
    features: [
      "Multi-model AI discussions",
      "Real-time health monitoring",
      "Advanced search capabilities",
      "Mind map generation",
      "Quality evaluation tools",
    ],
    featuresAr: [
      "مناقشات متعددة النماذج",
      "مراقبة الصحة في الوقت الفعلي",
      "قدرات بحث متقدمة",
      "إنشاء خرائط ذهنية",
      "أدوات تقييم الجودة",
    ],
  },
  {
    id: "drx",
    name: "Dr.X Platform",
    nameAr: "منصة دكتور إكس",
    description: "Advanced web application with comprehensive features",
    descriptionAr: "تطبيق ويب متقدم مع ميزات شاملة",
    url: "https://drxor.vercel.app",
    github: "https://github.com/wolfomani/dr.x",
    status: "active",
    category: "web",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "CSS"],
    icon: <Monitor className="w-6 h-6" />,
    features: [
      "Advanced web interface",
      "Database integration",
      "User management",
      "Responsive design",
      "Modern UI/UX",
    ],
    featuresAr: ["واجهة ويب متقدمة", "تكامل قاعدة البيانات", "إدارة المستخدمين", "تصميم متجاوب", "واجهة مستخدم حديثة"],
  },
  {
    id: "abdulaziz",
    name: "3bdulaziz Platform",
    nameAr: "منصة عبدالعزيز",
    description: "Personal portfolio and showcase platform",
    descriptionAr: "منصة شخصية لعرض الأعمال والمشاريع",
    url: "https://3bdulaziz.vercel.app",
    github: "https://github.com/wolfomani/3bdulaziz",
    status: "active",
    category: "personal",
    technologies: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    icon: <User className="w-6 h-6" />,
    features: ["Personal portfolio", "Project showcase", "Contact forms", "Blog integration", "Social media links"],
    featuresAr: ["محفظة شخصية", "عرض المشاريع", "نماذج التواصل", "تكامل المدونة", "روابط وسائل التواصل"],
  },
  {
    id: "3rb",
    name: "3RB Platform",
    nameAr: "منصة عرب",
    description: "Arabic-focused web platform",
    descriptionAr: "منصة ويب مخصصة للمحتوى العربي",
    url: "https://3rb.vercel.app",
    github: "https://github.com/wolfomani/3bdulaziz",
    status: "active",
    category: "web",
    technologies: ["Next.js", "Arabic RTL", "Tailwind CSS"],
    icon: <Globe className="w-6 h-6" />,
    features: [
      "Arabic RTL support",
      "Cultural content",
      "Community features",
      "Multi-language support",
      "Regional customization",
    ],
    featuresAr: ["دعم العربية من اليمين لليسار", "محتوى ثقافي", "ميزات المجتمع", "دعم متعدد اللغات", "تخصيص إقليمي"],
  },
  {
    id: "drx-api",
    name: "Dr.X API",
    nameAr: "واجهة برمجة تطبيقات دكتور إكس",
    description: "Comprehensive API backend services",
    descriptionAr: "خدمات واجهة برمجة التطبيقات الشاملة",
    url: "#",
    github: "https://github.com/wolfomani/dr.x_API",
    status: "development",
    category: "api",
    technologies: ["Node.js", "Express", "MongoDB", "JWT", "REST API"],
    icon: <Server className="w-6 h-6" />,
    features: [
      "RESTful API endpoints",
      "Authentication system",
      "Database management",
      "Rate limiting",
      "API documentation",
    ],
    featuresAr: ["نقاط نهاية API RESTful", "نظام المصادقة", "إدارة قاعدة البيانات", "تحديد المعدل", "توثيق API"],
  },
]

const statusColors = {
  active: "bg-green-500",
  development: "bg-yellow-500",
  maintenance: "bg-red-500",
}

const statusLabels = {
  active: "نشط",
  development: "قيد التطوير",
  maintenance: "صيانة",
}

const categoryIcons = {
  ai: <Brain className="w-4 h-4" />,
  web: <Globe className="w-4 h-4" />,
  api: <Server className="w-4 h-4" />,
  personal: <User className="w-4 h-4" />,
}

export function UnifiedDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  const filteredApps =
    selectedCategory === "all" ? applications : applications.filter((app) => app.category === selectedCategory)

  const categories = [
    { id: "all", name: "الكل", nameEn: "All", icon: <Zap className="w-4 h-4" /> },
    { id: "ai", name: "ذكاء اصطناعي", nameEn: "AI", icon: <Brain className="w-4 h-4" /> },
    { id: "web", name: "تطبيقات ويب", nameEn: "Web Apps", icon: <Globe className="w-4 h-4" /> },
    { id: "api", name: "واجهات برمجية", nameEn: "APIs", icon: <Server className="w-4 h-4" /> },
    { id: "personal", name: "شخصي", nameEn: "Personal", icon: <User className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
              <Network className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              مركز التطبيقات الموحد
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            منصة شاملة تجمع جميع تطبيقاتي ومشاريعي في مكان واحد مع إمكانية الوصول السريع والإدارة المتقدمة
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 ${
                selectedCategory === category.id ? "bg-blue-600 hover:bg-blue-700" : "border-gray-600 hover:bg-gray-800"
              }`}
            >
              {category.icon}
              <span className="hidden sm:inline">{category.name}</span>
            </Button>
          ))}
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredApps.map((app) => (
            <Card
              key={app.id}
              className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedApp(app)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">{app.icon}</div>
                    <div>
                      <CardTitle className="text-white text-lg group-hover:text-blue-400 transition-colors">
                        {app.nameAr}
                      </CardTitle>
                      <p className="text-sm text-gray-400">{app.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[app.status]}`} />
                    <Badge variant="outline" className="text-xs">
                      {statusLabels[app.status]}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">{app.descriptionAr}</CardDescription>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {app.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs bg-gray-700">
                      {tech}
                    </Badge>
                  ))}
                  {app.technologies.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-700">
                      +{app.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {app.url !== "#" && (
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(app.url, "_blank")
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      زيارة
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-700 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(app.github, "_blank")
                    }}
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Details Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-gray-800 border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                      {selectedApp.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl">{selectedApp.nameAr}</CardTitle>
                      <p className="text-gray-400">{selectedApp.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {categoryIcons[selectedApp.category]}
                        <Badge variant="outline">{statusLabels[selectedApp.status]}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedApp(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                    <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                    <TabsTrigger value="features">المميزات</TabsTrigger>
                    <TabsTrigger value="tech">التقنيات</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">الوصف</h3>
                        <p className="text-gray-300">{selectedApp.descriptionAr}</p>
                        <p className="text-gray-400 text-sm mt-1">{selectedApp.description}</p>
                      </div>

                      <div className="flex gap-4">
                        {selectedApp.url !== "#" && (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => window.open(selectedApp.url, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            زيارة التطبيق
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="border-gray-600 hover:bg-gray-700 bg-transparent"
                          onClick={() => window.open(selectedApp.github, "_blank")}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          عرض الكود
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">المميزات العربية</h3>
                        <ul className="space-y-2">
                          {selectedApp.featuresAr.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-300">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">English Features</h3>
                        <ul className="space-y-2">
                          {selectedApp.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-300">
                              <div className="w-2 h-2 bg-purple-500 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tech" className="mt-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">التقنيات المستخدمة</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {selectedApp.technologies.map((tech) => (
                          <div key={tech} className="p-3 bg-gray-700 rounded-lg text-center">
                            <Badge variant="secondary" className="w-full">
                              {tech}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{applications.length}</div>
              <div className="text-sm text-gray-400">إجمالي التطبيقات</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {applications.filter((app) => app.status === "active").length}
              </div>
              <div className="text-sm text-gray-400">تطبيقات نشطة</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {applications.filter((app) => app.status === "development").length}
              </div>
              <div className="text-sm text-gray-400">قيد التطوير</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Array.from(new Set(applications.flatMap((app) => app.technologies))).length}
              </div>
              <div className="text-sm text-gray-400">تقنيات مختلفة</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
