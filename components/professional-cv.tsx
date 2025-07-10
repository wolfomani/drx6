"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Github,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Code,
  Database,
  Server,
  Brain,
  Zap,
  Users,
  Award,
  ExternalLink,
  Download,
} from "lucide-react"

export default function ProfessionalCV() {
  const skills = [
    { name: "TypeScript", level: 95, category: "Frontend" },
    { name: "Next.js", level: 90, category: "Frontend" },
    { name: "React", level: 88, category: "Frontend" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "AI Integration", level: 92, category: "AI/ML" },
    { name: "Database Design", level: 87, category: "Database" },
    { name: "API Development", level: 89, category: "Backend" },
    { name: "UI/UX Design", level: 83, category: "Design" },
    { name: "Arabic Localization", level: 95, category: "Localization" },
    { name: "Cloud Deployment", level: 86, category: "DevOps" },
  ]

  const projects = [
    {
      title: "منصة الذكاء الاصطناعي المتقدمة (DRX6)",
      description: "منصة شاملة للذكاء الاصطناعي تدعم متعدد النماذج مع واجهة عربية متقدمة",
      technologies: ["Next.js", "TypeScript", "AI SDK", "Neon DB", "Vercel"],
      features: [
        "تكامل مع 5+ نماذج ذكاء اصطناعي (OpenAI, Groq, Together, Gemini)",
        "نظام محادثة متقدم مع دعم الملفات والمرفقات",
        "لوحة تحكم شاملة لإدارة المفاتيح والاختبارات",
        "نظام تقييم جودة الاستجابات",
        "أدوات متقدمة لتوليد المحتوى والخرائط الذهنية",
        "دعم كامل للغة العربية مع RTL",
        "نظام مصادقة وإدارة المستخدمين",
        "قاعدة بيانات متقدمة مع Neon PostgreSQL",
      ],
      liveUrl: "https://drx6.vercel.app",
      githubUrl: "https://github.com/wolfomani/drx6",
      status: "مُنشر ومُفعل",
    },
  ]

  const achievements = [
    "تطوير منصة ذكاء اصطناعي متكاملة بواجهة عربية",
    "تكامل ناجح مع 5+ نماذج ذكاء اصطناعي مختلفة",
    "تصميم قاعدة بيانات معقدة مع 15+ جدول",
    "تطوير نظام محادثة متقدم مع دعم الملفات",
    "إنشاء واجهة مستخدم متجاوبة ومتقدمة",
    "تطبيق أفضل الممارسات في الأمان والأداء",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-photo.jpg-MrMB1D1L6o5mHYTPq5qyDfVBkNVXRb.jpeg"
                  alt="أحمد علي درويش"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
              </div>

              <div className="text-center md:text-right flex-1">
                <h1 className="text-4xl font-bold mb-2">أحمد علي درويش</h1>
                <h2 className="text-xl mb-4 opacity-90">مطور تطبيقات الذكاء الاصطناعي | Full-Stack Developer</h2>
                <p className="text-lg opacity-80 max-w-2xl">
                  مطور متخصص في تطبيقات الذكاء الاصطناعي مع خبرة في تطوير المنصات المتقدمة والتكامل مع نماذج الذكاء
                  الاصطناعي المتعددة
                </p>

                <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-6">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Mail className="w-4 h-4" />
                    التواصل عبر البريد
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Github className="w-4 h-4" />
                    GitHub Profile
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    تحميل السيرة الذاتية
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  معلومات التواصل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">ahmed@drx6.dev</span>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="w-4 h-4 text-gray-800" />
                  <span className="text-sm">github.com/wolfomani</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-green-600" />
                  <span className="text-sm">drx6.vercel.app</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="text-sm">الشرق الأوسط</span>
                </div>
              </CardContent>
            </Card>

            {/* Technical Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  المهارات التقنية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {skill.category}
                      </Badge>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                    <span className="text-xs text-gray-500">{skill.level}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  اللغات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>العربية</span>
                  <Badge>لغة أم</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>English</span>
                  <Badge variant="secondary">متقدم</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Technical English</span>
                  <Badge variant="secondary">خبير</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  الملخص المهني
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  مطور تطبيقات ذكاء اصطناعي متخصص مع خبرة عملية في تطوير منصات متقدمة تدعم التكامل مع نماذج الذكاء
                  الاصطناعي المتعددة. أتمتع بخبرة واسعة في تطوير التطبيقات الحديثة باستخدام Next.js وTypeScript، مع
                  التركيز على تطوير واجهات المستخدم المتقدمة والتكامل مع APIs الذكاء الاصطناعي. لدي خبرة خاصة في تطوير
                  التطبيقات التي تدعم اللغة العربية مع تصميم RTL متقدم.
                </p>
              </CardContent>
            </Card>

            {/* Main Project */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  المشاريع الرئيسية
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projects.map((project, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-blue-600">{project.title}</h3>
                        <p className="text-gray-600 mt-1">{project.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                          <ExternalLink className="w-4 h-4" />
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            عرض المشروع
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                          <Github className="w-4 h-4" />
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            الكود المصدري
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">الميزات الرئيسية:</h4>
                      <ul className="space-y-2">
                        {project.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-600">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Technical Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  الإنجازات التقنية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-sm text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Database Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  معمارية قاعدة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">15+</div>
                    <div className="text-sm text-gray-600">جداول البيانات</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">5+</div>
                    <div className="text-sm text-gray-600">نماذج AI</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">10+</div>
                    <div className="text-sm text-gray-600">API Routes</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">50+</div>
                    <div className="text-sm text-gray-600">مكونات UI</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h4 className="font-semibold">التقنيات المستخدمة في قاعدة البيانات:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Neon PostgreSQL</Badge>
                    <Badge variant="outline">Drizzle ORM</Badge>
                    <Badge variant="outline">JSON/JSONB</Badge>
                    <Badge variant="outline">UUID Primary Keys</Badge>
                    <Badge variant="outline">Timestamps</Badge>
                    <Badge variant="outline">Relations</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm text-gray-600">آخر تحديث: {new Date().toLocaleDateString("ar-SA")}</span>
              </div>
              <p className="text-sm text-gray-500">
                هذه السيرة الذاتية تم إنشاؤها تلقائياً بناءً على تحليل المشاريع والقدرات التقنية
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <ExternalLink className="w-4 h-4" />
                  عرض المشروع المباشر
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Github className="w-4 h-4" />
                  عرض الكود المصدري
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
