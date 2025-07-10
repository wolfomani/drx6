"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, MessageSquare, Brain, Cpu } from "lucide-react"

export function ModelInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Together AI - DeepSeek R1
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">70B Parameters</Badge>
            <Badge variant="outline">Free Model</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-500" />
              <span>نموذج DeepSeek R1 المحسن</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>70 مليار معامل</span>
            </div>
            <p className="text-slate-600">
              نموذج متقدم للمحادثة والتفكير المنطقي، محسن للاستجابات العربية عالية الجودة
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Groq - Llama3
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">8B Parameters</Badge>
            <Badge variant="outline">Ultra Fast</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-green-500" />
              <span>نموذج Llama3 السريع</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-green-500" />
              <span>8 مليار معامل</span>
            </div>
            <p className="text-slate-600">نموذج سريع جداً مع معالجة فائقة السرعة، مثالي للاستجابات السريعة</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
