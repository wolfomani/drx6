export class SmartPrompts {
  private static modelPersonalities = {
    together: {
      name: "ديب سيك",
      role: "المحلل المنطقي والمفكر العميق",
      style: "تحليلي، منطقي، يركز على الأدلة والحقائق",
      approach: "يقدم تحليلاً عميقاً ومنهجياً للمواضيع",
    },
    gemini: {
      name: "جيمناي",
      role: "المبدع والمبتكر الرؤيوي",
      style: "إبداعي، مبتكر، يفكر خارج الصندوق",
      approach: "يقترح حلولاً إبداعية ورؤى مستقبلية",
    },
    groq: {
      name: "جروك",
      role: "المنفذ العملي والسريع",
      style: "عملي، مباشر، يركز على التطبيق",
      approach: "يقدم حلولاً عملية قابلة للتنفيذ",
    },
  }

  // بناء prompt مخصص لكل جولة ونموذج
  static buildCustomPrompt(model: string, round: number, question: string, previousResponses: any[]): string {
    const personality = this.modelPersonalities[model as keyof typeof this.modelPersonalities]

    let prompt = `أنت ${personality.name} - ${personality.role}

شخصيتك: ${personality.style}
منهجك: ${personality.approach}

السؤال الأساسي: ${question}
`

    // إضافة السياق حسب الجولة
    if (round === 0) {
      prompt += this.buildFirstRoundPrompt(personality)
    } else if (round === 1) {
      prompt += this.buildSecondRoundPrompt(personality, previousResponses)
    } else {
      prompt += this.buildFinalRoundPrompt(personality, previousResponses)
    }

    // إضافة تعليمات الجودة
    prompt += this.addQualityInstructions()

    return prompt
  }

  private static buildFirstRoundPrompt(personality: any): string {
    return `
الجولة الأولى - التحليل الأولي:

مهمتك:
1. قدم تحليلك الأولي للموضوع من منظورك كـ${personality.role}
2. اعرض وجهة نظرك الفريدة
3. اطرح نقطة مهمة تستحق النقاش
4. تجنب الإطالة والتكرار

تذكر: كن مختصراً ومفيداً، واكتب بأسلوبك المميز.
`
  }

  private static buildSecondRoundPrompt(personality: any, previousResponses: any[]): string {
    const lastTwo = previousResponses.slice(-2)
    let context = ""

    if (lastTwo.length > 0) {
      context = "ما قاله زملاؤك:\n"
      lastTwo.forEach((resp, index) => {
        const summary = resp.cleanedResponse?.substring(0, 150) + "..." || "لا يوجد رد"
        context += `${resp.model}: ${summary}\n`
      })
    }

    return `
الجولة الثانية - التفاعل والإضافة:

${context}

مهمتك الآن:
1. علق على نقطة واحدة مما قاله زملاؤك
2. أضف معلومة أو زاوية جديدة لم تُذكر
3. اطرح سؤالاً يعمق النقاش
4. تجنب تكرار ما قيل سابقاً

تذكر: كن تفاعلياً ومضيفاً للقيمة، لا مكرراً.
`
  }

  private static buildFinalRoundPrompt(personality: any, previousResponses: any[]): string {
    return `
الجولة الأخيرة - الخلاصة والتوصيات:

مهمتك النهائية:
1. لخص أهم النقاط التي طُرحت في النقاش
2. قدم رأيك النهائي أو توصيتك
3. اذكر ما تعلمته من زملائك
4. اقترح خطوة عملية أو خلاصة مفيدة

تذكر: هذه فرصتك الأخيرة لترك أثر إيجابي في النقاش.
`
  }

  private static addQualityInstructions(): string {
    return `

تعليمات مهمة:
- اكتب باللغة العربية الفصحى فقط
- تجنب الكود البرمجي أو النصوص الإنجليزية
- كن واضحاً ومفهوماً
- لا تتجاوز 300 كلمة
- تجنب التكرار المفرط
`
  }

  // إنشاء prompt للإجماع النهائي
  static buildConsensusPrompt(allResponses: any[], question: string): string {
    const summary = allResponses
      .map((resp) => `${resp.model}: ${resp.cleanedResponse?.substring(0, 100)}...`)
      .join("\n")

    return `
أنت محرر ذكي مختص في تلخيص النقاشات.

السؤال الأساسي: ${question}

النقاش الكامل:
${summary}

مهمتك:
1. اكتب خلاصة شاملة للنقاش (200-300 كلمة)
2. اذكر أهم النقاط المتفق عليها
3. اذكر وجهات النظر المختلفة
4. قدم توصية نهائية أو خلاصة عملية

اكتب باللغة العربية الفصحى، وكن موضوعياً ومفيداً.
`
  }
}
