import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { model, params } = await request.json()

    // Build the story prompt based on parameters
    const storyPrompt = buildStoryPrompt(params)

    // Select the appropriate API endpoint
    const endpoint = model === "deepseek-r1" ? "/api/together" : "/api/groq"

    const response = await fetch(`${request.nextUrl.origin}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: storyPrompt }),
    })

    const data = await response.json()

    return NextResponse.json({
      story: data.response,
      model: data.model,
      usage: data.usage,
    })
  } catch (error) {
    console.error("Story generation error:", error)
    return NextResponse.json({ error: "فشل في توليد القصة" }, { status: 500 })
  }
}

function buildStoryPrompt(params: any): string {
  const themeMap: Record<string, string> = {
    "ai-future": "مستقبل الذكاء الاصطناعي",
    "space-exploration": "استكشاف الفضاء",
    "time-travel": "السفر عبر الزمن",
    cyberpunk: "السايبربانك",
    "post-apocalyptic": "ما بعد الكارثة",
    "virtual-reality": "الواقع الافتراضي",
  }

  const toneMap: Record<string, string> = {
    mysterious: "غامضة ومثيرة",
    optimistic: "متفائلة ومشرقة",
    dark: "مظلمة ودرامية",
    humorous: "فكاهية وخفيفة",
    philosophical: "فلسفية وعميقة",
  }

  const characterMap: Record<string, string> = {
    scientist: "عالم",
    "ai-researcher": "باحث في الذكاء الاصطناعي",
    robot: "روبوت",
    hacker: "هاكر",
    explorer: "مستكشف",
    child: "طفل",
  }

  const settingMap: Record<string, string> = {
    "2050": "عام 2050",
    "2100": "عام 2100",
    mars: "كوكب المريخ",
    "space-station": "محطة فضائية",
    underground: "مدينة تحت الأرض",
    "virtual-world": "عالم افتراضي",
  }

  const theme = themeMap[params.theme] || "الخيال العلمي"
  const tone = toneMap[params.tone] || "مثيرة"
  const character = characterMap[params.characters] || "شخص"
  const setting = settingMap[params.setting] || "المستقبل"

  const prompt = `اكتب قصة قصيرة ${tone} عن ${theme}. 

الشخصية الرئيسية: ${character}
المكان والزمان: ${setting}
طول القصة: حوالي ${params.length} كلمة

متطلبات القصة:
- ابدأ بمقدمة جذابة تشد انتباه القارئ
- طور الشخصية الرئيسية وأظهر دوافعها
- اربط الأحداث بموضوع ${theme} بطريقة إبداعية
- استخدم وصفاً حيوياً للمكان والزمان
- اجعل النهاية مؤثرة ومفكرة
- استخدم اللغة العربية الفصحى مع أسلوب سردي جميل

${params.prompt ? `تفاصيل إضافية: ${params.prompt}` : ""}

ابدأ القصة الآن:`

  return prompt
}
