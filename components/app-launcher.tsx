"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Monitor, User, Globe, Server, Grid3X3, ExternalLink, Github } from "lucide-react"

interface QuickApp {
  id: string
  name: string
  nameAr: string
  url: string
  github: string
  icon: React.ReactNode
  color: string
  status: "active" | "development" | "maintenance"
}

const quickApps: QuickApp[] = [
  {
    id: "drx6",
    name: "AI Platform",
    nameAr: "منصة الذكاء الاصطناعي",
    url: "https://drx6.vercel.app",
    github: "https://github.com/wolfomani/drx6",
    icon: <Brain className="w-5 h-5" />,
    color: "from-blue-500 to-purple-500",
    status: "active",
  },
  {
    id: "drx",
    name: "Dr.X Platform",
    nameAr: "منصة دكتور إكس",
    url: "https://drxor.vercel.app",
    github: "https://github.com/wolfomani/dr.x",
    icon: <Monitor className="w-5 h-5" />,
    color: "from-green-500 to-teal-500",
    status: "active",
  },
  {
    id: "abdulaziz",
    name: "3bdulaziz",
    nameAr: "عبدالعزيز",
    url: "https://3bdulaziz.vercel.app",
    github: "https://github.com/wolfomani/3bdulaziz",
    icon: <User className="w-5 h-5" />,
    color: "from-orange-500 to-red-500",
    status: "active",
  },
  {
    id: "3rb",
    name: "3RB Platform",
    nameAr: "منصة عرب",
    url: "https://3rb.vercel.app",
    github: "https://github.com/wolfomani/3bdulaziz",
    icon: <Globe className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
    status: "active",
  },
  {
    id: "api",
    name: "Dr.X API",
    nameAr: "واجهة برمجية",
    url: "#",
    github: "https://github.com/wolfomani/dr.x_API",
    icon: <Server className="w-5 h-5" />,
    color: "from-gray-500 to-gray-700",
    status: "development",
  },
]

export function AppLauncher() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Access Grid */}
      {isOpen && (
        <div className="mb-4 grid grid-cols-2 gap-3 p-4 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl">
          {quickApps.map((app) => (
            <Card
              key={app.id}
              className="bg-gray-700/50 border-gray-600 hover:border-gray-500 transition-all duration-200 cursor-pointer group min-w-[120px]"
            >
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`p-2 bg-gradient-to-r ${app.color} rounded-lg group-hover:scale-110 transition-transform`}
                  >
                    {app.icon}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">{app.nameAr}</div>
                    <div className="text-xs text-gray-400">{app.name}</div>
                  </div>
                  <div className="flex gap-1">
                    {app.url !== "#" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-blue-600"
                        onClick={() => window.open(app.url, "_blank")}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-gray-600"
                      onClick={() => window.open(app.github, "_blank")}
                    >
                      <Github className="w-3 h-3" />
                    </Button>
                  </div>
                  <Badge variant={app.status === "active" ? "default" : "secondary"} className="text-xs">
                    {app.status === "active" ? "نشط" : "تطوير"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Launcher Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen ? "rotate-45" : ""
        }`}
      >
        <Grid3X3 className="w-6 h-6" />
      </Button>
    </div>
  )
}
