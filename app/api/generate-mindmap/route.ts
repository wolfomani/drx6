import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, style, model } = await request.json()

    // Simulate mind map generation
    const mindMap = generateMindMapData(text, style)

    return NextResponse.json({ mindMap })
  } catch (error) {
    console.error("Mind map generation error:", error)
    return NextResponse.json({ error: "فشل في توليد الخريطة الذهنية" }, { status: 500 })
  }
}

function generateMindMapData(text: string, style: string) {
  // Extract key concepts from text (simplified)
  const concepts = extractConcepts(text)
  const nodes = []
  const connections = []

  // Create central node
  const centralNode = {
    id: "central",
    text: "الموضوع الرئيسي",
    x: 400,
    y: 250,
    level: 0,
    children: [],
    color: "#3b82f6",
  }
  nodes.push(centralNode)

  // Create main concept nodes
  concepts.forEach((concept, index) => {
    const angle = (index * 2 * Math.PI) / concepts.length
    const radius = 150
    const x = 400 + radius * Math.cos(angle)
    const y = 250 + radius * Math.sin(angle)

    const node = {
      id: `concept-${index}`,
      text: concept,
      x,
      y,
      level: 1,
      children: [],
      parent: "central",
      color: "#10b981",
    }
    nodes.push(node)
    connections.push({ from: "central", to: node.id })

    // Add sub-concepts
    const subConcepts = generateSubConcepts(concept)
    subConcepts.forEach((subConcept, subIndex) => {
      const subAngle = angle + (subIndex - 1) * 0.5
      const subRadius = 80
      const subX = x + subRadius * Math.cos(subAngle)
      const subY = y + subRadius * Math.sin(subAngle)

      const subNode = {
        id: `sub-${index}-${subIndex}`,
        text: subConcept,
        x: subX,
        y: subY,
        level: 2,
        children: [],
        parent: node.id,
        color: "#f59e0b",
      }
      nodes.push(subNode)
      connections.push({ from: node.id, to: subNode.id })
    })
  })

  return {
    nodes,
    connections,
    title: "خريطة ذهنية تفاعلية",
  }
}

function extractConcepts(text: string): string[] {
  // Simplified concept extraction
  const words = text.split(/\s+/)
  const concepts = []

  // Extract key terms (simplified)
  if (text.includes("ذكاء اصطناعي") || text.includes("AI")) {
    concepts.push("الذكاء الاصطناعي", "التعلم الآلي", "الشبكات العصبية", "معالجة اللغة")
  }
  if (text.includes("تطوير") || text.includes("مشروع")) {
    concepts.push("التخطيط", "التصميم", "التطوير", "الاختبار")
  }
  if (text.includes("تسويق")) {
    concepts.push("الاستراتيجية", "الجمهور", "القنوات", "التحليل")
  }

  // Default concepts if none detected
  if (concepts.length === 0) {
    concepts.push("المفهوم الأول", "المفهوم الثاني", "المفهوم الثالث", "المفهوم الرابع")
  }

  return concepts.slice(0, 6) // Limit to 6 main concepts
}

function generateSubConcepts(concept: string): string[] {
  const subConceptsMap: Record<string, string[]> = {
    "الذكاء الاصطناعي": ["التطبيقات", "التحديات", "المستقبل"],
    "التعلم الآلي": ["الخوارزميات", "البيانات", "النماذج"],
    التخطيط: ["الأهداف", "الموارد", "الجدولة"],
    التصميم: ["واجهة المستخدم", "التجربة", "النماذج الأولية"],
  }

  return subConceptsMap[concept] || ["فرعي 1", "فرعي 2", "فرعي 3"]
}
