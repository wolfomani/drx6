export class TextProcessor {
  // إزالة الأحرف غير المرغوبة من DeepSeek
  static cleanDeepSeekOutput(text: string): string {
    return text
      .replace(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g, "") // حروف يابانية/صينية
      .replace(/[^\u0600-\u06FF\u0020-\u007E\s\n\r\t]/g, "") // رموز غريبة
      .replace(/\s+/g, " ") // تنظيف الفراغات المتعددة
      .trim()
  }

  // منع الكود غير المرغوب من Gemini
  static preventGeminiCode(text: string): string {
    if (text.includes("```") || text.includes("function") || text.includes("class ")) {
      const parts = text.split("```")
      return parts[0].trim() // حذف الكود والاحتفاظ بالنص فقط
    }
    return text
  }

  // تصحيح التشكيل من Groq
  static fixGroqFormatting(text: string): string {
    return text
      .replace(/[\u064B-\u0652]/g, "") // إزالة التشكيل
      .replace(/\s+/g, " ") // تنظيم الفراغات
      .replace(/([.!?])\s*([أ-ي])/g, "$1 $2") // تنظيم علامات الترقيم
      .trim()
  }

  // تنظيف شامل للنص حسب النموذج
  static cleanModelOutput(text: string, model: string): string {
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

    // تنظيف عام لجميع النماذج
    return cleanedText
      .replace(/\n{3,}/g, "\n\n") // تقليل الأسطر الفارغة المتعددة
      .replace(/^\s+|\s+$/g, "") // إزالة الفراغات من البداية والنهاية
      .replace(/([.!?])\s*([أ-ي])/g, "$1 $2") // تحسين التباعد
  }

  // التحقق من جودة النص
  static validateTextQuality(text: string): { isValid: boolean; issues: string[] } {
    const issues: string[] = []

    if (text.length < 10) {
      issues.push("النص قصير جداً")
    }

    if (text.length > 5000) {
      issues.push("النص طويل جداً")
    }

    if (!/[\u0600-\u06FF]/.test(text) && !/[a-zA-Z]/.test(text)) {
      issues.push("النص لا يحتوي على أحرف مفهومة")
    }

    if ((text.match(/[^\u0600-\u06FF\u0020-\u007E\s\n\r\t]/g) || []).length > 5) {
      issues.push("النص يحتوي على رموز غريبة كثيرة")
    }

    return {
      isValid: issues.length === 0,
      issues,
    }
  }
}
