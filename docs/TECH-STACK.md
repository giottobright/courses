# 🏗️ Learnify Tech Stack & Architecture

**Версия:** 1.0  
**Дата:** 5 февраля 2026  
**Статус:** Production Ready

---

## 📊 Обзор архитектуры

```
┌─────────────────────────────────────────────────────────────┐
│                    Learnify Platform                         │
│                     (Next.js 14 App)                         │
│  ┌────────────────┐              ┌────────────────────┐    │
│  │   Frontend     │◄────────────►│    API Routes      │    │
│  │   (React)      │              │  /app/api/*        │    │
│  └────────────────┘              └──────────┬─────────┘    │
│         │                                    │               │
│         │ Memberstack SDK                    │ Prisma ORM   │
│         ▼                                    ▼               │
└─────────┼────────────────────────────────────┼──────────────┘
          │                                    │
   ┌──────▼──────────┐              ┌─────────▼──────────┐
   │  Memberstack    │              │   PostgreSQL DB    │
   │  (Auth & Users) │              │   (Course Data)    │
   └─────────────────┘              └────────────────────┘
          │                                    │
          │                         ┌──────────┴──────────┐
          │                         │                     │
   ┌──────▼──────────┐    ┌────────▼────────┐  ┌────────▼────────┐
   │  Stripe         │    │  Vimeo API      │  │  Cloudinary     │
   │  (Payments)     │    │  (Videos)       │  │  (Images)       │
   └─────────────────┘    └─────────────────┘  └─────────────────┘
          │
   ┌──────▼──────────┐
   │  SendGrid       │
   │  (Emails)       │
   └─────────────────┘
```

---

## 🔐 Что работает через Memberstack

### ✅ **Memberstack берёт на себя:**

#### 1. **Аутентификация и авторизация**
- ✅ Регистрация пользователей (email + password)
- ✅ Вход в систему (login)
- ✅ Session management (токены, cookies)
- ✅ Password reset / forgot password
- ✅ Email verification
- ✅ Social login (Google, Facebook) - опционально

#### 2. **Управление пользователями**
- ✅ User profiles (имя, email, avatar)
- ✅ Custom fields (дополнительные данные пользователя)
- ✅ Membership tiers (Free, Pro, Premium)
- ✅ Access control (кто к чему имеет доступ)

#### 3. **Защищённые маршруты**
- ✅ Protected pages (автоматическая проверка авторизации)
- ✅ Redirect неавторизованных на /login
- ✅ Role-based access (admin, user, instructor)

#### 4. **Платежи через Memberstack**
- ✅ **ИСПОЛЬЗУЕМ** - Memberstack интегрируется со Stripe автоматически
- Упрощённая архитектура: не нужны прямые Stripe API keys
- Memberstack обрабатывает checkout, webhooks и subscription management

### 📋 **Memberstack API Endpoints:**

```javascript
// Инициализация Memberstack
import memberstack from '@memberstack/dom';
const ms = memberstack('pk_live_xxx'); // public key

// Регистрация
await ms.signupMemberEmailPassword({
  email: 'user@example.com',
  password: 'password123',
  customFields: { name: 'John Doe' }
});

// Вход
await ms.loginMemberEmailPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Получить текущего пользователя
const member = await ms.getCurrentMember();

// Выход
await ms.logout();

// Обновить профиль
await ms.updateMemberJSON({
  customFields: { name: 'New Name', avatar: 'url' }
});
```

### 🔗 **Интеграция с нашим приложением:**

**Файл:** `src/lib/memberstack.ts` (уже создан, нужно подключить реальный SDK)

```typescript
// Подключение Memberstack SDK
import memberstack from '@memberstack/dom';

const ms = memberstack(process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY!);

// Наши функции для работы с Memberstack
export async function getCurrentUser() {
  const { data: member } = await ms.getCurrentMember();
  if (!member) return null;
  
  return {
    id: member.id,
    email: member.auth.email,
    name: member.customFields?.name || '',
    avatar: member.customFields?.avatar || '',
    membershipTier: member.planConnections?.[0]?.planId || 'free'
  };
}

export async function signIn(email: string, password: string) {
  const { data: member } = await ms.loginMemberEmailPassword({ email, password });
  return member;
}

export async function signUp(email: string, password: string, name: string) {
  const { data: member } = await ms.signupMemberEmailPassword({
    email,
    password,
    customFields: { name }
  });
  return member;
}
```

---

## 🗄️ Что работает через Prisma + PostgreSQL

### ✅ **Наша БД хранит:**

#### 1. **Курсы и контент**
```prisma
model Course {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  description String
  price       Decimal
  thumbnailUrl String
  categoryId  String
  lessons     Lesson[]
  enrollments Enrollment[]
  reviews     Review[]
  createdAt   DateTime @default(now())
}
```

#### 2. **Уроки**
```prisma
model Lesson {
  id          String   @id @default(uuid())
  courseId    String
  title       String
  slug        String
  videoUrl    String?  // Vimeo URL
  content     String   // Markdown content
  order       Int
  duration    Int      // minutes
  isPreview   Boolean  @default(false)
  course      Course   @relation(fields: [courseId], references: [id])
}
```

#### 3. **Enrollments (записи на курсы)**
```prisma
model Enrollment {
  id           String   @id @default(uuid())
  userId       String   // Memberstack user ID
  courseId     String
  enrolledAt   DateTime @default(now())
  completedAt  DateTime?
  progress     Int      @default(0) // 0-100%
  course       Course   @relation(fields: [courseId], references: [id])
  progresses   LessonProgress[]
  
  @@unique([userId, courseId])
}
```

#### 4. **Прогресс по урокам**
```prisma
model LessonProgress {
  id           String   @id @default(uuid())
  enrollmentId String
  lessonId     String
  completed    Boolean  @default(false)
  completedAt  DateTime?
  enrollment   Enrollment @relation(fields: [enrollmentId], references: [id])
  
  @@unique([enrollmentId, lessonId])
}
```

#### 5. **Отзывы и рейтинги**
```prisma
model Review {
  id        String   @id @default(uuid())
  userId    String   // Memberstack user ID
  courseId  String
  rating    Int      // 1-5
  comment   String
  createdAt DateTime @default(now())
  course    Course   @relation(fields: [courseId], references: [id])
}
```

#### 6. **Сертификаты**
```prisma
model Certificate {
  id               String   @id @default(uuid())
  userId           String   // Memberstack user ID
  courseId         String
  certificateNumber String  @unique
  issuedAt         DateTime @default(now())
  pdfUrl           String?
  verificationCode String   @unique
}
```

#### 7. **Wishlist (сохранённые курсы)**
```prisma
model Wishlist {
  id        String   @id @default(uuid())
  userId    String   // Memberstack user ID
  courseId  String
  addedAt   DateTime @default(now())
  
  @@unique([userId, courseId])
}
```

#### 8. **Платежи**
```prisma
model Payment {
  id              String   @id @default(uuid())
  userId          String   // Memberstack user ID
  courseId        String
  amount          Decimal
  currency        String   @default("USD")
  status          String   // pending, completed, failed
  stripeSessionId String   @unique
  createdAt       DateTime @default(now())
  completedAt     DateTime?
}
```

#### 9. **Комментарии к урокам**
```prisma
model Comment {
  id        String   @id @default(uuid())
  userId    String   // Memberstack user ID
  lessonId  String
  content   String
  createdAt DateTime @default(now())
  parentId  String?  // для вложенных комментариев
}
```

#### 10. **Категории**
```prisma
model Category {
  id      String   @id @default(uuid())
  name    String
  slug    String   @unique
  icon    String
  color   String
  courses Course[]
}
```

---

## 💳 Что работает через Memberstack + Stripe

### ✅ **Memberstack + Stripe обрабатывают:**

#### 1. **Создание планов (в Memberstack Dashboard)**
- В Memberstack создаются Plans, связанные с ценами в Stripe
- Каждый курс может иметь свой Plan ID
- Memberstack автоматически создаёт Stripe Products и Prices

#### 2. **Покупка курсов (Frontend)**
```typescript
// app/courses/[slug]/page.tsx
import { purchaseCourseWithMemberstack } from '@/lib/memberstack';

const handlePurchase = async () => {
  // Memberstack открывает Stripe Checkout автоматически
  const result = await purchaseCourseWithMemberstack(
    course.memberstackPlanId, // Plan ID из Memberstack
    course.id // metadata для webhook
  );
  
  if (result.success) {
    // После успешной оплаты Memberstack отправит webhook
    toast.success('Purchase successful!');
  }
};
```

#### 3. **Webhooks (через Memberstack)**
```typescript
// app/api/webhooks/memberstack/route.ts
export async function POST(request: Request) {
  const event = await request.json();
  
  if (event.type === 'member.plan.purchased') {
    const { memberId, planId, metadata } = event.data;
    const courseId = metadata.courseId;
    
    // Создать enrollment
    await prisma.enrollment.create({
      data: { 
        userId: memberId, 
        courseId,
        planConnectionId: event.data.planConnectionId 
      }
    });
    
    // Отправить email через SendGrid
    await sendEnrollmentEmail(memberId, courseId);
  }
  
  return Response.json({ received: true });
}
```

#### 4. **Payment Portal (управление подписками)**
```typescript
import { openPaymentPortal } from '@/lib/memberstack';

// Memberstack открывает Stripe Customer Portal
await openPaymentPortal();
```

#### 5. **Преимущества использования Memberstack:**
- ✅ Не нужны прямые Stripe API keys
- ✅ Memberstack обрабатывает PCI compliance
- ✅ Автоматическая синхронизация user data
- ✅ Встроенный Payment Portal
- ✅ Проще в настройке и поддержке

---

## 🎥 Что работает через Vimeo

### ✅ **Vimeo предоставляет:**

#### 1. **Видео хостинг**
- Приватное хранилище видео уроков
- Автоматическая конвертация (360p, 720p, 1080p, 4K)
- Адаптивная потоковая передача (HLS)
- Защита от скачивания

#### 2. **Встроенный плеер**
```typescript
// app/learn/[courseSlug]/[lessonSlug]/page.tsx
export default function LessonPage({ lesson }) {
  return (
    <div className="aspect-video">
      <iframe
        src={`https://player.vimeo.com/video/${lesson.vimeoId}?h=${lesson.vimeoHash}`}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
```

#### 3. **API для управления видео**
```typescript
import { Vimeo } from 'vimeo';

const vimeo = new Vimeo(
  process.env.VIMEO_CLIENT_ID!,
  process.env.VIMEO_CLIENT_SECRET!,
  process.env.VIMEO_ACCESS_TOKEN!
);

// Загрузка видео (для admin panel)
vimeo.upload(
  'path/to/video.mp4',
  { name: 'Lesson Title', privacy: { view: 'unlisted' } },
  (uri) => console.log('Video uploaded:', uri)
);
```

#### 4. **Privacy Settings**
- **Domain-level privacy**: видео доступны только с вашего домена
- **Password protection**: опционально
- **Unlisted**: не индексируются поисковиками

---

## 📧 Что работает через SendGrid

### ✅ **SendGrid отправляет:**

#### 1. **Transactional Emails**
```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  await sgMail.send({
    to: userEmail,
    from: 'hello@learnify.com',
    subject: 'Welcome to Learnify!',
    templateId: 'd-xxxxx', // SendGrid template
    dynamicTemplateData: { userName }
  });
}

export async function sendCourseEnrollmentEmail(userEmail: string, courseName: string) {
  await sgMail.send({
    to: userEmail,
    from: 'hello@learnify.com',
    subject: `You're enrolled in ${courseName}!`,
    templateId: 'd-yyyyy',
    dynamicTemplateData: { courseName }
  });
}

export async function sendCertificateEmail(userEmail: string, certificateUrl: string) {
  await sgMail.send({
    to: userEmail,
    from: 'hello@learnify.com',
    subject: 'Your Certificate is Ready!',
    templateId: 'd-zzzzz',
    dynamicTemplateData: { certificateUrl }
  });
}
```

#### 2. **Email Templates (в SendGrid dashboard)**
- Welcome email
- Course enrollment confirmation
- Payment receipt
- Certificate earned
- Password reset
- Weekly digest

---

## 🖼️ Что работает через Cloudinary

### ✅ **Cloudinary хранит:**

#### 1. **Изображения курсов**
```typescript
// lib/upload.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
});

export async function uploadCourseImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'learnify_courses');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  const data = await response.json();
  return data.secure_url; // https://res.cloudinary.com/xxx/image/upload/xxx.jpg
}
```

#### 2. **Автоматическая оптимизация**
- Конвертация в WebP
- Responsive images (разные размеры)
- Lazy loading URLs
- CDN distribution

#### 3. **Transformations**
```typescript
// Получить оптимизированное изображение
const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_225,c_fill,q_auto,f_auto/${publicId}.jpg`;

// Для hero изображений
const heroUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_1920,h_1080,c_fill,q_auto,f_auto/${publicId}.jpg`;
```

---

## 🎯 API Routes (Next.js)

### Структура API:

```
app/api/
├── courses/
│   ├── route.ts              # GET /api/courses (список)
│   ├── [id]/route.ts         # GET /api/courses/[id] (детали)
│   └── [id]/enroll/route.ts  # POST /api/courses/[id]/enroll
│
├── lessons/
│   ├── [id]/route.ts         # GET /api/lessons/[id]
│   └── [id]/complete/route.ts # POST /api/lessons/[id]/complete
│
├── progress/
│   └── route.ts              # GET /api/progress (мой прогресс)
│
├── reviews/
│   ├── route.ts              # GET /POST /api/reviews
│   └── [id]/route.ts         # PUT /DELETE /api/reviews/[id]
│
├── wishlist/
│   ├── route.ts              # GET /POST /api/wishlist
│   └── [courseId]/route.ts   # DELETE /api/wishlist/[courseId]
│
├── certificates/
│   ├── route.ts              # GET /api/certificates
│   ├── generate/route.ts     # POST /api/certificates/generate
│   └── verify/route.ts       # GET /api/certificates/verify?code=xxx
│
├── checkout/
│   └── route.ts              # POST /api/checkout (Stripe session)
│
├── webhooks/
│   ├── stripe/route.ts       # POST /api/webhooks/stripe
│   └── memberstack/route.ts  # POST /api/webhooks/memberstack
│
├── comments/
│   ├── route.ts              # GET /POST /api/comments
│   └── [id]/route.ts         # PUT /DELETE /api/comments/[id]
│
├── search/
│   └── route.ts              # GET /api/search?q=keyword
│
└── admin/
    ├── courses/route.ts      # Admin CRUD для курсов
    ├── users/route.ts        # Admin управление пользователями
    └── stats/route.ts        # Admin статистика
```

---

## 🔑 Environment Variables

### `.env.local` (для разработки):

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/learnify"

# Memberstack
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY="pk_live_xxxxxxxxx"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxxxxxx"
STRIPE_SECRET_KEY="sk_live_xxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxx"

# Vimeo
VIMEO_CLIENT_ID="xxxxxxxxx"
VIMEO_CLIENT_SECRET="xxxxxxxxx"
VIMEO_ACCESS_TOKEN="xxxxxxxxx"

# Cloudinary
CLOUDINARY_CLOUD_NAME="learnify"
CLOUDINARY_API_KEY="xxxxxxxxx"
CLOUDINARY_API_SECRET="xxxxxxxxx"

# SendGrid
SENDGRID_API_KEY="SG.xxxxxxxxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Production (Timeweb Cloud):
Все переменные добавляются через Dashboard → Environment Variables

---

## 📦 Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "14.2.3",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "typescript": "5.4.5",
    
    "@prisma/client": "^5.20.0",
    "@memberstack/dom": "^2.0.0",
    "stripe": "^14.0.0",
    "@sendgrid/mail": "^8.1.0",
    "cloudinary": "^2.0.0",
    "vimeo": "^2.2.0",
    
    "framer-motion": "11.2.10",
    "lucide-react": "0.378.0",
    "zustand": "4.5.2",
    "tailwindcss": "3.4.3",
    
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "zod": "^3.22.0",
    "react-hook-form": "^7.50.0"
  },
  "devDependencies": {
    "prisma": "^5.20.0",
    "@types/node": "20.12.12",
    "@types/react": "18.3.2",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.3"
  }
}
```

---

## 🚀 Deployment (Timeweb Cloud)

### Что деплоим:

```
1. Next.js Application (Timeweb Cloud App)
   ├── Build command: npm run build
   ├── Start command: npm start
   ├── Port: 3000
   └── Environment: все переменные из .env

2. PostgreSQL Database (Timeweb Cloud DB)
   ├── Version: PostgreSQL 14+
   ├── Storage: 10GB (начальный)
   └── Connection: DATABASE_URL

3. Статические файлы (автоматически через Next.js)
   ├── Images → Cloudinary
   ├── Videos → Vimeo
   └── PDFs → Cloudinary или S3
```

### Процесс деплоя:

```bash
# 1. Подготовка
npm run build
npm run prisma:generate
npm run prisma:migrate

# 2. Push в Git
git push origin main

# 3. Timeweb Cloud автоматически:
# - Скачивает код
# - Устанавливает dependencies
# - Запускает build
# - Запускает приложение
```

---

## ✅ Что ДЕЛАЕМ сами (в Next.js)

1. ✅ **UI/UX** - все страницы, компоненты, дизайн
2. ✅ **Бизнес-логика** - правила доступа, проверки, валидация
3. ✅ **API Routes** - все эндпоинты
4. ✅ **Интеграция сервисов** - связываем Memberstack, Stripe, Vimeo и тд
5. ✅ **Прогресс обучения** - отслеживание, статистика
6. ✅ **Сертификаты** - генерация, хранение, верификация
7. ✅ **Reviews & Ratings** - система отзывов
8. ✅ **Search** - поиск курсов
9. ✅ **Wishlist** - сохранённые курсы
10. ✅ **Comments** - комментарии к урокам
11. ✅ **Admin Panel** - управление контентом
12. ✅ **Analytics** - отслеживание активности

---

## ❌ Что НЕ ДЕЛАЕМ сами (используем сервисы)

1. ❌ **Аутентификация** → Memberstack
2. ❌ **Видео хостинг** → Vimeo
3. ❌ **Обработка платежей** → Stripe
4. ❌ **Отправка email** → SendGrid
5. ❌ **Хранение изображений** → Cloudinary
6. ❌ **CDN** → Vercel/Timeweb Cloud (автоматически)

---

## 💰 Стоимость инфраструктуры (месяц)

| Сервис | План | Стоимость |
|--------|------|-----------|
| **Timeweb Cloud App** | Node.js Start | ~500₽ |
| **Timeweb Cloud DB** | PostgreSQL 10GB | ~300₽ |
| **Memberstack** | Pro Plan | $25 (~2300₽) |
| **Stripe** | Pay-as-you-go | 2.9% + $0.30 за транзакцию |
| **Vimeo Pro** | Pro Plan | $20/мес (~1800₽) |
| **Cloudinary** | Free tier | 0₽ (до 25GB) |
| **SendGrid** | Free tier | 0₽ (до 100 писем/день) |
| **ИТОГО** | | ~4900₽/мес + комиссии Stripe |

### Альтернативы для снижения стоимости:

- **Memberstack → NextAuth.js** (бесплатно, но нужна своя реализация)
- **Vimeo → YouTube** (бесплатно, но видео публичные)
- **SendGrid → Nodemailer + Gmail** (бесплатно, но лимиты)

---

## 🎯 Итого: Идеальная архитектура

✅ **Memberstack** - аутентификация, управление пользователями  
✅ **Next.js + Prisma + PostgreSQL** - курсы, контент, прогресс, отзывы  
✅ **Stripe** - платежи  
✅ **Vimeo** - видео уроков  
✅ **Cloudinary** - изображения  
✅ **SendGrid** - email рассылка  

**Всё интегрируется через Next.js API routes.**  
**Одно приложение на Timeweb Cloud.**  
**Масштабируемо, надёжно, современно.**

---

🚀 **Готово к разработке!**
