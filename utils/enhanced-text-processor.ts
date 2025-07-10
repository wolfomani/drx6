export class EnhancedTextProcessor {
  // تنظيف متقدم لـ DeepSeek
  static cleanDeepSeekOutput(text: string): string {
    return (
      text
        // إزالة الأحرف الصينية واليابانية
        .replace(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g, "")
        // إزالة الرموز الغريبة
        .replace(/[^\u0600-\u06FF\u0020-\u007E\s\n\r\t\u060C\u061B\u061F]/g, "")
        // تنظيف الفراغات المتعددة
        .replace(/\s+/g, " ")
        // إزالة الأسطر الفارغة المتعددة
        .replace(/\n{3,}/g, "\n\n")
        // تحسين علامات الترقيم
        .replace(/([.!?])\s*([أ-ي])/g, "$1 $2")
        .trim()
    )
  }

  // منع الكود والنصوص الإنجليزية من Gemini
  static preventGeminiCode(text: string): string {
    let cleanText = text

    // إزالة كتل الكود
    if (cleanText.includes("```")) {
      const parts = cleanText.split("```")
      cleanText = parts[0].trim()
    }

    // إزالة الكود المضمن
    cleanText = cleanText.replace(/`[^`]+`/g, "")

    // إزالة الكلمات الإنجليزية الطويلة (أكثر من 3 أحرف)
    cleanText = cleanText.replace(/\b[a-zA-Z]{4,}\b/g, "")

    // إزالة function, class, etc
    cleanText = cleanText.replace(/\b(function|class|const|let|var|if|else|for|while)\b/gi, "")

    return cleanText.trim()
  }

  // تصحيح شامل لـ Groq
  static fixGroqFormatting(text: string): string {
    return (
      text
        // إزالة التشكيل الزائد
        .replace(/[\u064B-\u0652]/g, "")
        // تنظيم الفراغات
        .replace(/\s+/g, " ")
        // تحسين علامات الترقيم العربية
        .replace(/([.!?])\s*([أ-ي])/g, "$1 $2")
        // إزالة التكرار
        .replace(/(.{10,}?)\1+/g, "$1")
        .trim()
    )
  }

  // تنظيف ذكي حسب النموذج
  static smartCleanByModel(text: string, model: string): string {
    let cleanedText = text

    switch (model.toLowerCase()) {
      case "together":
      case "deepseek":
        cleanedText = this.cleanDeepSeekOutput(cleanedText)
        break
      case "gemini":
        cleanedText = this.preventGeminiCode(cleanedText)
        break
      case "groq":
        cleanedText = this.fixGroqFormatting(cleanedText)
        break
    }

    // تنظيف عام إضافي
    return this.finalCleanup(cleanedText)
  }

  // تنظيف نهائي شامل
  private static finalCleanup(text: string): string {
    return (
      text
        // إزالة الأسطر الفارغة المتعددة
        .replace(/\n{3,}/g, "\n\n")
        // تحسين التباعد
        .replace(/([.!?])\s*([أ-ي])/g, "$1 $2")
        // إزالة الفراغات من البداية والنهاية
        .trim() ||
      // التأكد من وجود محتوى
      "عذراً، لم أتمكن من تقديم رد مناسب في هذه المرة."
    )
  }

  // فحص جودة النص المحسن
  static validateTextQuality(text: string): { isValid: boolean; issues: string[]; score: number } {
    const issues: string[] = []
    let score = 100

    // فحص الطول
    if (text.length < 20) {
      issues.push("النص قصير جداً")
      score -= 30
    }

    if (text.length > 3000) {
      issues.push("النص طويل جداً")
      score -= 10
    }

    // فحص المحتوى العربي
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length
    const totalChars = text.length
    const arabicRatio = arabicChars / totalChars

    if (arabicRatio < 0.3) {
      issues.push("نسبة النص العربي قليلة")
      score -= 20
    }

    // فحص الرموز الغريبة
    const strangeChars = (text.match(/[^\u0600-\u06FF\u0020-\u007E\s\n\r\t]/g) || []).length
    if (strangeChars > 5) {
      issues.push("يحتوي على رموز غريبة")
      score -= 15
    }

    // فحص التكرار
    const words = text.split(/\s+/)
    const uniqueWords = new Set(words)
    const repetitionRatio = uniqueWords.size / words.length

    if (repetitionRatio < 0.7) {
      issues.push("يحتوي على تكرار كثير")
      score -= 10
    }

    return {
      isValid: issues.length === 0 && score >= 70,
      issues,
      score: Math.max(0, score),
    }
  }

  // إزالة التكرار الذكي
  static removeDuplication(text: string): string {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10)
    const uniqueSentences = []
    const seen = new Set()

    for (const sentence of sentences) {
      const normalized = sentence.trim().toLowerCase().replace(/\s+/g, " ")
      if (!seen.has(normalized)) {
        seen.add(normalized)
        uniqueSentences.push(sentence.trim())
      }
    }

    return uniqueSentences.join(". ") + "."
  }
}
