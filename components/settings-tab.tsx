"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Settings, Key, Palette, Globe, Shield, Database, Download } from "lucide-react"

export function SettingsTab() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-900/20 to-slate-900/20 border-gray-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Settings className="w-6 h-6 text-gray-400" />
            الإعدادات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800">
              <TabsTrigger value="general">عام</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="appearance">المظهر</TabsTrigger>
              <TabsTrigger value="privacy">الخصوصية</TabsTrigger>
              <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    الإعدادات العامة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">اللغة</label>
                    <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                      <option>العربية</option>
                      <option>English</option>
                      <option>Français</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">المنطقة الزمنية</label>
                    <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                      <option>توقيت الرياض (GMT+3)</option>
                      <option>توقيت القاهرة (GMT+2)</option>
                      <option>توقيت دبي (GMT+4)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">الحفظ التلقائي</label>
                      <p className="text-sm text-gray-400">حفظ العمل تلقائياً كل 30 ثانية</p>
                    </div>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">الإشعارات</label>
                      <p className="text-sm text-gray-400">تلقي إشعارات حول التحديثات والأنشطة</p>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    إعدادات API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "GROQ API", status: "متصل", usage: "45%" },
                      { name: "Together AI", status: "متصل", usage: "32%" },
                      { name: "Gemini API", status: "متصل", usage: "28%" },
                    ].map((api, index) => (
                      <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{api.name}</h4>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500">{api.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">الاستخدام الشهري</span>
                          <span className="text-white">{api.usage}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">حد الطلبات في الدقيقة</label>
                    <Input type="number" defaultValue="60" className="mt-1 bg-gray-900 border-gray-700 text-white" />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">مهلة الاستجابة (ثانية)</label>
                    <Input type="number" defaultValue="30" className="mt-1 bg-gray-900 border-gray-700 text-white" />
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-500">حفظ إعدادات API</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    المظهر والواجهة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">الوضع المظلم</label>
                      <p className="text-sm text-gray-400">استخدام الوضع المظلم للواجهة</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">نظام الألوان</label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {[
                        { name: "أزرق", color: "bg-blue-500" },
                        { name: "أخضر", color: "bg-green-500" },
                        { name: "بنفسجي", color: "bg-purple-500" },
                        { name: "برتقالي", color: "bg-orange-500" },
                      ].map((theme, index) => (
                        <button
                          key={index}
                          className={`${theme.color} h-12 rounded-lg border-2 border-transparent hover:border-white transition-colors`}
                          title={theme.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">حجم الخط</label>
                    <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                      <option>صغير</option>
                      <option>متوسط</option>
                      <option>كبير</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">كثافة الواجهة</label>
                    <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                      <option>مضغوطة</option>
                      <option>عادية</option>
                      <option>مريحة</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    الخصوصية والأمان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">تشفير البيانات</label>
                      <p className="text-sm text-gray-400">تشفير جميع البيانات المحفوظة محلياً</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">مشاركة البيانات التحليلية</label>
                      <p className="text-sm text-gray-400">مساعدة في تحسين الخدمة بمشاركة بيانات مجهولة</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">حفظ سجل المحادثات</label>
                      <p className="text-sm text-gray-400">حفظ سجل المحادثات مع نماذج الذكاء الاصطناعي</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">مدة الاحتفاظ بالبيانات</label>
                    <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                      <option>30 يوم</option>
                      <option>90 يوم</option>
                      <option>سنة واحدة</option>
                      <option>إلى الأبد</option>
                    </select>
                  </div>

                  <Button variant="destructive" className="w-full">
                    حذف جميع البيانات
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    النسخ الاحتياطي والاستعادة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">النسخ الاحتياطي التلقائي</label>
                      <p className="text-sm text-gray-400">إنشاء نسخة احتياطية تلقائياً كل يوم</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">تكرار النسخ الاحتياطي</label>
                    <select className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white">
                      <option>يومياً</option>
                      <option>أسبوعياً</option>
                      <option>شهرياً</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-medium">النسخ الاحتياطية المتاحة</h4>
                    {[
                      { date: "2024-01-15", size: "2.3 MB", type: "تلقائي" },
                      { date: "2024-01-14", size: "2.1 MB", type: "يدوي" },
                      { date: "2024-01-13", size: "1.9 MB", type: "تلقائي" },
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div>
                          <span className="text-white font-medium">{backup.date}</span>
                          <span className="text-gray-400 text-sm ml-2">({backup.size})</span>
                          <Badge className="ml-2 bg-blue-500/20 text-blue-300 border-blue-500">{backup.type}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                            استعادة
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-500">إنشاء نسخة احتياطية</Button>
                    <Button variant="outline" className="border-gray-600 bg-transparent">
                      استيراد نسخة احتياطية
                    </Button>
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
