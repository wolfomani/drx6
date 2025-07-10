import { TextProcessor } from "./text-processor"

export interface ModelResponse {
  id: string
  model: string
  response: string
  thinking?: string
  timestamp: Date
  round: number
  role: string
  cleanedResponse?: string
  quality?: { isValid: boolean; issues: string[] }
}

export class DiscussionManager {
  private responses: ModelResponse[] = []
  private currentRound = 0
  private question = ""

  // أدوار النماذج
  private modelRoles = {
    together: "المحلل المنطقي والمفكر العميق",
    gemini: "المبتكر وصاحب الرؤية الإبداعية",
    groq: "المنفذ العملي والسريع",
  }

  // أسماء عرض النماذج
  private modelDisplayNames = {
    together: "ديب سيك",
    gemini: "جيمناي",
    groq: "جروك",
  }

  setQuestion(question: string) {
    this.question = question
    this.responses = []
    this.currentRound = 0
  }

  getModelRole(model: string): string {
    return this.modelRoles[model as keyof typeof this.modelRoles] || "مساعد ذكي"
  }

  getModelDisplayName(model: string): string {
    return this.modelDisplayNames[model as keyof typeof this.modelDisplayNames] || model
  }

  // بناء السياق الديناميكي للنقاش
  buildDynamicContext(model: string, round: number): string {
    const lastResponses = this.responses.slice(-2)
    const modelRole = this.getModelRole(model)

    let context = `أنت ${this.getModelDisplayName(model)} - ${modelRole}

السؤال الأساسي: ${this.question}
الجولة الحالية: ${round + 1}

`

    if (lastResponses.length > 0) {
      context += `النقاش السابق:\n`
      lastResponses.forEach((resp, index) => {
        context += `${this.getModelDisplayName(resp.model)}: ${resp.cleanedResponse || resp.response}\n\n`
      })
    }

    // تعليمات خاصة حسب الجولة
    if (round === 0) {
      context += `مهمتك في هذه الجولة الأولى:
- قدم تحليلك الأولي للموضوع
- اعرض وجهة نظرك الخاصة
- اطرح نقطة مهمة للنقاش`
    } else if (round === 1) {
      context += `مهمتك في هذه الجولة:
- علق على رأي زميلك السابق
- أضف معلومة أو زاوية جديدة
- اطرح سؤالاً يحفز النقاش`
    } else {
      context += `مهمتك في هذه الجولة الأخيرة:
- لخص النقاش وقدم رأيك النهائي
- اذكر النقاط المهمة التي تم طرحها
- اقترح خلاصة أو توصية`
    }

    context += `\n\nتذكر: اكتب باللغة العربية الفصحى، كن واضحاً ومفيداً، ولا تكرر ما قاله الآخرون.`

    return context
  }

  // إضافة استجابة جديدة
  async addResponse(model: string, rawResponse: string, thinking?: string): Promise<ModelResponse> {
    // تنظيف النص
    const cleanedResponse = TextProcessor.cleanModelOutput(rawResponse, model)

    // التحقق من الجودة
    const quality = TextProcessor.validateTextQuality(cleanedResponse)

    const response: ModelResponse = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      model,
      response: rawResponse,
      cleanedResponse,
      thinking,
      timestamp: new Date(),
      round: this.currentRound,
      role: this.getModelRole(model),
      quality,
    }

    this.responses.push(response)
    return response
  }

  // الحصول على جميع الاستجابات
  getAllResponses(): ModelResponse[] {
    return [...this.responses]
  }

  // الحصول على استجابات الجولة الحالية
  getCurrentRoundResponses(): ModelResponse[] {
    return this.responses.filter((r) => r.round === this.currentRound)
  }

  // الانتقال للجولة التالية
  nextRound() {
    this.currentRound++
  }

  // إحصائيات النقاش
  getDiscussionStats() {
    const totalResponses = this.responses.length
    const modelCounts = this.responses.reduce(
      (acc, resp) => {
        acc[resp.model] = (acc[resp.model] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const avgResponseLength =
      this.responses.reduce((sum, resp) => sum + (resp.cleanedResponse || resp.response).length, 0) / totalResponses

    const qualityIssues = this.responses.filter((r) => !r.quality?.isValid).length

    return {
      totalResponses,
      rounds: this.currentRound + 1,
      modelCounts,
      avgResponseLength: Math.round(avgResponseLength),
      qualityIssues,
      successRate: Math.round(((totalResponses - qualityIssues) / totalResponses) * 100),
    }
  }

  // تصدير النقاش
  exportDiscussion() {
    return {
      question: this.question,
      responses: this.responses,
      stats: this.getDiscussionStats(),
      exportedAt: new Date().toISOString(),
    }
  }

  // مسح النقاش
  clearDiscussion() {
    this.responses = []
    this.currentRound = 0
    this.question = ""
  }
}
