import { EnhancedTextProcessor } from "./enhanced-text-processor"
import { SmartPrompts } from "./smart-prompts"

export interface EnhancedModelResponse {
  id: string
  model: string
  modelName: string
  response: string
  cleanedResponse: string
  thinking?: string
  timestamp: Date
  round: number
  role: string
  quality: { isValid: boolean; issues: string[]; score: number }
  processingTime: number
}

export class AdvancedDiscussionManager {
  private responses: EnhancedModelResponse[] = []
  private currentRound = 0
  private question = ""
  private startTime = 0

  private modelInfo = {
    together: { name: "ديب سيك", avatar: "🧠", color: "blue" },
    gemini: { name: "جيمناي", avatar: "✨", color: "purple" },
    groq: { name: "جروك", avatar: "⚡", color: "green" },
  }

  setQuestion(question: string) {
    this.question = question
    this.responses = []
    this.currentRound = 0
    this.startTime = Date.now()
  }

  // إضافة استجابة محسنة
  async addEnhancedResponse(model: string, rawResponse: string, thinking?: string): Promise<EnhancedModelResponse> {
    const processingStart = Date.now()

    // تنظيف النص بذكاء
    const cleanedResponse = EnhancedTextProcessor.smartCleanByModel(rawResponse, model)

    // إزالة التكرار
    const finalResponse = EnhancedTextProcessor.removeDuplication(cleanedResponse)

    // فحص الجودة
    const quality = EnhancedTextProcessor.validateTextQuality(finalResponse)

    const response: EnhancedModelResponse = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      model,
      modelName: this.modelInfo[model as keyof typeof this.modelInfo]?.name || model,
      response: rawResponse,
      cleanedResponse: finalResponse,
      thinking,
      timestamp: new Date(),
      round: this.currentRound,
      role: SmartPrompts["modelPersonalities"]?.[model]?.role || "مساعد ذكي",
      quality,
      processingTime: Date.now() - processingStart,
    }

    this.responses.push(response)
    return response
  }

  // بناء prompt ذكي
  buildSmartPrompt(model: string): string {
    return SmartPrompts.buildCustomPrompt(model, this.currentRound, this.question, this.responses)
  }

  // الانتقال للجولة التالية
  nextRound() {
    this.currentRound++
  }

  // إحصائيات متقدمة
  getAdvancedStats() {
    const totalResponses = this.responses.length
    const totalTime = Date.now() - this.startTime

    const modelStats = Object.keys(this.modelInfo).reduce(
      (acc, model) => {
        const modelResponses = this.responses.filter((r) => r.model === model)
        acc[model] = {
          count: modelResponses.length,
          avgQuality: modelResponses.reduce((sum, r) => sum + r.quality.score, 0) / modelResponses.length || 0,
          avgLength: modelResponses.reduce((sum, r) => sum + r.cleanedResponse.length, 0) / modelResponses.length || 0,
          issues: modelResponses.reduce((sum, r) => sum + r.quality.issues.length, 0),
        }
        return acc
      },
      {} as Record<string, any>,
    )

    const overallQuality = this.responses.reduce((sum, r) => sum + r.quality.score, 0) / totalResponses || 0

    return {
      totalResponses,
      rounds: this.currentRound + 1,
      totalTime: Math.round(totalTime / 1000),
      modelStats,
      overallQuality: Math.round(overallQuality),
      successfulResponses: this.responses.filter((r) => r.quality.isValid).length,
      avgResponseLength: Math.round(
        this.responses.reduce((sum, r) => sum + r.cleanedResponse.length, 0) / totalResponses,
      ),
    }
  }

  // إنشاء إجماع نهائي
  async generateConsensus(): Promise<string> {
    if (this.responses.length === 0) return "لا يوجد نقاش لتلخيصه"

    const consensusPrompt = SmartPrompts.buildConsensusPrompt(this.responses, this.question)

    // يمكن استخدام أي من النماذج لإنشاء الإجماع
    // هنا سنستخدم نموذج افتراضي أو الأفضل أداءً
    return consensusPrompt // في التطبيق الحقيقي، سيتم إرسال هذا لـ API
  }

  // تصدير محسن
  exportEnhancedDiscussion() {
    return {
      metadata: {
        question: this.question,
        startTime: new Date(this.startTime).toISOString(),
        endTime: new Date().toISOString(),
        totalDuration: Date.now() - this.startTime,
      },
      responses: this.responses,
      statistics: this.getAdvancedStats(),
      consensus: "سيتم إنشاؤه عند الطلب",
      exportVersion: "3.0",
      exportedAt: new Date().toISOString(),
    }
  }

  // مسح محسن
  clearDiscussion() {
    this.responses = []
    this.currentRound = 0
    this.question = ""
    this.startTime = 0
  }

  // الحصول على الردود مع فلترة
  getFilteredResponses(filter?: { round?: number; model?: string; minQuality?: number }) {
    let filtered = [...this.responses]

    if (filter?.round !== undefined) {
      filtered = filtered.filter((r) => r.round === filter.round)
    }

    if (filter?.model) {
      filtered = filtered.filter((r) => r.model === filter.model)
    }

    if (filter?.minQuality) {
      filtered = filtered.filter((r) => r.quality.score >= filter.minQuality)
    }

    return filtered
  }
}
