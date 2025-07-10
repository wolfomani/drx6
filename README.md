<div align="center">

# 🤖 منصة الذكاء الاصطناعي المتقدمة
## Advanced AI Integration Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-drx6.vercel.app-blue?style=for-the-badge)](https://drx6.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/wolfomani/drx6)
[![Built with Next.js](https://img.shields.io/badge/Built_with-Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-94.3%25-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

![Platform Preview](https://sjc.microlink.io/E5-5TtsM-U9cdsHKQF0I7YBiBYs9kJgw8Ao1Pu8VSG3HKgShmhwFMecuF2a_jdvx2__dFtNmhCFyR0KyPdHOKw.jpeg)

*منصة شاملة للتفاعل مع نماذج الذكاء الاصطناعي المتعددة مع أدوات متقدمة للمناقشة والتحليل*

[العربية](#العربية) • [English](#english) • [التثبيت](#installation) • [المميزات](#features) • [المساهمة](#contributing)

</div>

---

## 🌟 نظرة عامة | Overview

### العربية

منصة الذكاء الاصطناعي المتقدمة هي تطبيق ويب شامل يوفر واجهة موحدة للتفاعل مع أقوى نماذج الذكاء الاصطناعي في العالم. تم تصميم المنصة خصيصاً لدعم اللغة العربية مع توفير أدوات متقدمة للمناقشة والتحليل والبحث.

### English

The Advanced AI Integration Platform is a comprehensive web application that provides a unified interface for interacting with the world's most powerful AI models. The platform is specifically designed to support Arabic language with advanced tools for discussion, analysis, and research.

---

## ✨ المميزات الرئيسية | Key Features

### 🔗 تكامل متعدد النماذج | Multi-Model Integration
- **🚀 GROQ API** - نماذج Llama عالية السرعة
- **🧠 Together AI** - نماذج متعددة مع إعادة التشغيل التلقائي
- **💎 Gemini API** - نماذج Google المتقدمة مع معالجة الأخطاء

### 🎯 أدوات ذكية | Smart Tools
- **💬 مناقشات تفاعلية** - مناقشات متعددة النماذج في الوقت الفعلي
- **🔍 البحث الذكي** - بحث متقدم مع تتبع التاريخ
- **🗺️ خرائط ذهنية** - إنشاء خرائط ذهنية بالذكاء الاصطناعي
- **📊 تحليل الجودة** - تقييم جودة الاستجابات
- **🎓 التدريب** - محاكاة تدريب النماذج
- **📈 إدارة البيانات** - رفع وتحليل البيانات

### 🛡️ مراقبة وأمان | Monitoring & Security
- **⚡ مراقبة الصحة** - فحص حالة الخدمات في الوقت الفعلي
- **🔐 التحقق من المفاتيح** - اختبار وإدارة مفاتيح API
- **📊 إحصائيات متقدمة** - تتبع الأداء والاستخدام
- **🔄 إعادة المحاولة الذكية** - معالجة الأخطاء التلقائية

---

## 🚀 التثبيت والإعداد | Installation & Setup

### المتطلبات المسبقة | Prerequisites

\`\`\`bash
Node.js 18.18.0+
npm, yarn, pnpm, or bun
\`\`\`

### 1. استنساخ المشروع | Clone Repository

\`\`\`bash
git clone https://github.com/wolfomani/drx6.git
cd drx6
\`\`\`

### 2. تثبيت التبعيات | Install Dependencies

\`\`\`bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
\`\`\`

### 3. إعداد متغيرات البيئة | Environment Variables

إنشاء ملف `.env.local` وإضافة المفاتيح التالية:

\`\`\`env
# API Keys
GROQ_API_KEY=your_groq_api_key_here
TOGETHER_API_KEY=your_together_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Custom Configuration
NEXT_PUBLIC_APP_NAME="منصة الذكاء الاصطناعي المتقدمة"
NEXT_PUBLIC_APP_VERSION="1.0.0"
\`\`\`

### 4. تشغيل المشروع | Run Development Server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

---

## 🏗️ البنية التقنية | Technical Architecture

### التقنيات المستخدمة | Tech Stack

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| **Next.js** | 15.2.4 | إطار العمل الأساسي |
| **TypeScript** | Latest | لغة البرمجة الأساسية |
| **Tailwind CSS** | Latest | تصميم الواجهات |
| **Shadcn/ui** | Latest | مكونات الواجهة |
| **React** | 18.3.1 | مكتبة الواجهات |

### هيكل المشروع | Project Structure

\`\`\`
drx6/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 api/               # API Routes
│   │   ├── groq/            # GROQ API Integration
│   │   ├── gemini/          # Gemini API Integration
│   │   ├── together/        # Together AI Integration
│   │   └── ...              # Other API endpoints
│   ├── 📁 chat/             # Chat Interface
│   ├── layout.tsx           # Root Layout
│   └── page.tsx             # Home Page
├── 📁 components/            # React Components
│   ├── 📁 ui/               # Shadcn UI Components
│   ├── ai-discussion.tsx    # AI Discussion Component
│   ├── api-health-status.tsx # API Health Monitor
│   └── ...                  # Other components
├── 📁 hooks/                # Custom React Hooks
├── 📁 lib/                  # Utility Libraries
├── 📁 utils/                # Helper Functions
├── 📁 public/               # Static Assets
└── 📁 styles/               # Global Styles
\`\`\`

---

## 🎮 كيفية الاستخدام | How to Use

### 1. التحقق من المفاتيح | API Key Verification
![API Keys](https://sjc.microlink.io/E5-5TtsM-U9cdsHKQF0I7YBiBYs9kJgw8Ao1Pu8VSG3HKgShmhwFMecuF2a_jdvx2__dFtNmhCFyR0KyPdHOKw.jpeg)

- انتقل إلى تبويب "فحص المفاتيح"
- أدخل مفاتيح API الخاصة بك
- اختبر الاتصال مع كل خدمة

### 2. بدء مناقشة | Start Discussion

\`\`\`typescript
// مثال على بدء مناقشة
const discussion = {
  topic: "مستقبل الذكاء الاصطناعي",
  models: ["groq", "gemini", "together"],
  rounds: 3
}
\`\`\`

### 3. مراقبة الصحة | Health Monitoring

- تحقق من حالة جميع الخدمات
- راقب أوقات الاستجابة
- تتبع معدلات النجاح

---

## 🔧 التكوين المتقدم | Advanced Configuration

### إعدادات API | API Settings

\`\`\`typescript
// next.config.mjs
const config = {
  env: {
    GROQ_MODEL: 'llama3-8b-8192',
    GEMINI_MODEL: 'gemini-1.5-flash',
    TOGETHER_MODEL: 'meta-llama/Llama-3.2-3B-Instruct-Turbo'
  }
}
\`\`\`

### تخصيص الواجهة | UI Customization

\`\`\`css
/* tailwind.config.ts */
theme: {
  extend: {
    colors: {
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
    }
  }
}
\`\`\`

---

## 📊 الأداء والتحسين | Performance & Optimization

### مقاييس الأداء | Performance Metrics

- ⚡ **First Load JS**: ~100kB
- 🚀 **Page Load Time**: <2s
- 📱 **Mobile Optimized**: ✅
- 🌐 **SEO Ready**: ✅

### تحسينات مطبقة | Applied Optimizations

- **Code Splitting** - تقسيم الكود التلقائي
- **Image Optimization** - تحسين الصور
- **Bundle Analysis** - تحليل حجم الحزم
- **Caching Strategy** - استراتيجية التخزين المؤقت

---

## 🧪 الاختبار | Testing

\`\`\`bash
# تشغيل الاختبارات
npm run test

# اختبار التغطية
npm run test:coverage

# اختبار الأداء
npm run test:performance
\`\`\`

---

## 🚀 النشر | Deployment

### Vercel (موصى به | Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wolfomani/drx6)

### Docker

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

---

## 🤝 المساهمة | Contributing

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

### 1. Fork المشروع
### 2. إنشاء فرع جديد

\`\`\`bash
git checkout -b feature/amazing-feature
\`\`\`

### 3. Commit التغييرات

\`\`\`bash
git commit -m 'Add some amazing feature'
\`\`\`

### 4. Push للفرع

\`\`\`bash
git push origin feature/amazing-feature
\`\`\`

### 5. فتح Pull Request

---

## 📝 الترخيص | License

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 👥 الفريق | Team

<div align="center">

### 🏆 المطورون | Developers

| الاسم | الدور | GitHub |
|-------|--------|---------|
| **wolfomani** | Lead Developer | [@wolfomani](https://github.com/wolfomani) |
| **3ZWOORD** | Co-Developer | [@3ZWOORD](https://github.com/wolfomani) |

</div>

---

## 📞 التواصل والدعم | Contact & Support

<div align="center">

### 🌐 الروابط المهمة | Important Links

[![Live Demo](https://img.shields.io/badge/🌐_تجربة_مباشرة-drx6.vercel.app-blue?style=for-the-badge)](https://drx6.vercel.app)
[![GitHub Issues](https://img.shields.io/badge/🐛_تقرير_مشكلة-GitHub_Issues-red?style=for-the-badge)](https://github.com/wolfomani/drx6/issues)
[![Discussions](https://img.shields.io/badge/💬_مناقشات-GitHub_Discussions-green?style=for-the-badge)](https://github.com/wolfomani/drx6/discussions)

### 📊 إحصائيات المشروع | Project Stats

![GitHub stars](https://img.shields.io/github/stars/wolfomani/drx6?style=social)
![GitHub forks](https://img.shields.io/github/forks/wolfomani/drx6?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/wolfomani/drx6?style=social)

</div>

---

## 🔄 سجل التحديثات | Changelog

### v1.0.0 (2025-01-10)
- 🎉 الإصدار الأولي
- ✅ تكامل GROQ, Gemini, Together AI
- ✅ واجهة عربية كاملة
- ✅ مراقبة الصحة في الوقت الفعلي
- ✅ أدوات متقدمة للمناقشة والتحليل

---

## 🙏 شكر وتقدير | Acknowledgments

- **Next.js Team** - لإطار العمل الرائع
- **Vercel** - لمنصة النشر المتميزة
- **Shadcn** - لمكونات الواجهة الجميلة
- **OpenAI, Google, Meta** - لنماذج الذكاء الاصطناعي

---

<div align="center">

### 🌟 إذا أعجبك المشروع، لا تنس إعطاؤه نجمة! | If you like this project, don't forget to give it a star!

**صُنع بـ ❤️ في المملكة العربية السعودية | Made with ❤️ in Saudi Arabia**

</div>
