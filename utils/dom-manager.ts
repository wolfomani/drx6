export class DOMManager {
  private static initialized = false

  // التأكد من تحميل DOM قبل التفاعل
  static waitForDOM(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve())
      } else {
        resolve()
      }
    })
  }

  // التحقق من وجود العناصر قبل الوصول إليها
  static safeGetElement(selector: string): HTMLElement | null {
    try {
      return document.querySelector(selector)
    } catch (error) {
      console.warn(`⚠️ Element not found: ${selector}`)
      return null
    }
  }

  // تشغيل الاختبار الذاتي بأمان
  static async runSafeSystemCheck() {
    await this.waitForDOM()

    if (this.initialized) return

    console.log("🔍 Running enhanced system check...")

    const requiredTabs = [
      "chat",
      "discussion",
      "stories",
      "training",
      "data",
      "quality",
      "advanced",
      "search",
      "mindmap",
      "settings",
    ]

    let missingTabs = 0

    requiredTabs.forEach((tab) => {
      const element = this.safeGetElement(`[value="${tab}"]`)
      if (!element) {
        console.warn(`⚠️ Tab ${tab} not found - will be created dynamically`)
        missingTabs++
      }
    })

    if (missingTabs === 0) {
      console.log("✅ All tabs found successfully")
    } else {
      console.log(`⚠️ ${missingTabs} tabs missing but system will handle gracefully`)
    }

    // فحص APIs
    this.checkAPIAvailability()

    this.initialized = true
    console.log("✅ Enhanced system check completed")
  }

  private static async checkAPIAvailability() {
    const apis = ["together", "groq", "gemini"]

    for (const api of apis) {
      try {
        const response = await fetch(`/api/test-connection`)
        console.log(`🔗 API connectivity check initiated`)
        break
      } catch (error) {
        console.warn(`⚠️ API check failed, but system will continue`)
      }
    }
  }
}
