# 🎓 Learnify - Платформа для онлайн-обучения

> Полнофункциональная образовательная платформа на Next.js 14 с интеграцией Memberstack, Stripe, Vimeo и другими сервисами.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-brightgreen)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📖 Содержание

- [О проекте](#-о-проекте)
- [Что реализовано](#-что-реализовано)
- [Технологии](#-технологии)
- [Быстрый старт](#-быстрый-старт)
- [Установка](#-установка)
- [Конфигурация](#-конфигурация)
- [Запуск проекта](#-запуск-проекта)
- [Структура проекта](#-структура-проекта)
- [API Endpoints](#-api-endpoints)
- [База данных](#-база-данных)
- [Интеграции](#-интеграции)
- [Deployment](#-deployment)
- [Тестирование](#-тестирование)
- [Документация](#-документация)

---

## 🎯 О проекте

**Learnify** - современная платформа для создания, продажи и прохождения онлайн-курсов. Платформа предоставляет полный цикл обучения: от просмотра каталога курсов до получения сертификата по завершению.

### Основные возможности:

- 🔐 **Аутентификация** через Memberstack
- 💳 **Приём платежей** через Memberstack + Stripe
- 🎥 **Видео-уроки** на Vimeo
- 📊 **Отслеживание прогресса** в реальном времени
- 🏆 **Автоматическая выдача сертификатов** (PDF)
- ⭐ **Система отзывов** и рейтингов
- ❤️ **Wishlist** для сохранения курсов
- 👨‍💼 **Admin Panel** для управления контентом
- 📧 **Email-уведомления** через SendGrid
- 🖼️ **Загрузка изображений** через Cloudinary

---

## ✨ Что реализовано

### 🎨 Frontend (100%)

#### Пользовательские страницы:
- ✅ **Homepage** - лендинг с героем и популярными курсами
- ✅ **Courses Catalog** (`/courses`) - каталог с поиском, фильтрами и сортировкой
- ✅ **Course Detail** (`/courses/[slug]`) - детальная страница курса с enrollment
- ✅ **Lesson Player** (`/learn/[course]/[lesson]`) - видео-плеер с навигацией
- ✅ **User Dashboard** (`/dashboard`) - личный кабинет с прогрессом
- ✅ **Wishlist** (`/wishlist`) - сохранённые курсы
- ✅ **Certificates** (`/certificates`) - просмотр и скачивание сертификатов

#### UI/UX фичи:
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark theme для lesson player
- ✅ Skeleton loaders для всех списков
- ✅ Error handling (error.tsx, not-found.tsx)
- ✅ Loading states (loading.tsx, Spinner)
- ✅ Toast notifications (success/error)
- ✅ Smooth animations (Framer Motion)
- ✅ Social sharing (Twitter, LinkedIn, Facebook)

### 👨‍💼 Admin Panel (100%)

- ✅ **Admin Dashboard** (`/admin`) - статистика платформы
- ✅ **Courses Management** (`/admin/courses`) - CRUD для курсов
- ✅ **Course Editor** (`/admin/courses/[id]`) - создание/редактирование
- ✅ **Users Management** (`/admin/users`) - список пользователей
- ✅ **Analytics** (`/admin/analytics`) - метрики и insights
- ✅ **Settings** (`/admin/settings`) - настройки интеграций

### 🔧 Backend & API (100%)

#### API Routes (15+):
- ✅ `/api/courses` - список и создание курсов
- ✅ `/api/courses/[id]` - получение, обновление, удаление
- ✅ `/api/courses/[id]/enroll` - запись на курс
- ✅ `/api/enrollments` - список записей пользователя
- ✅ `/api/lessons/[id]/complete` - завершение урока
- ✅ `/api/progress` - статистика прогресса
- ✅ `/api/reviews` - отзывы (GET/POST)
- ✅ `/api/wishlist` - управление wishlist
- ✅ `/api/webhooks/memberstack` - обработка платежей
- ✅ `/api/certificates` - генерация и верификация
- ✅ `/api/comments` - комментарии к урокам

#### Database (Prisma + PostgreSQL):
- ✅ 10 моделей: Category, Course, Lesson, Enrollment, LessonProgress, Review, Certificate, Wishlist, Payment, Comment
- ✅ Полные связи (relations) между моделями
- ✅ Индексы для оптимизации запросов
- ✅ Seed script для тестовых данных

### 🔌 Интеграции (100%)

- ✅ **Memberstack** - аутентификация + платежи
- ✅ **Stripe** (через Memberstack) - payment processing
- ✅ **Vimeo** - видео хостинг и streaming
- ✅ **Cloudinary** - загрузка и оптимизация изображений
- ✅ **SendGrid** - email notifications (5 типов писем)
- ✅ **jsPDF + html2canvas** - генерация PDF сертификатов

### 📚 Документация (100%)

- ✅ `PRD.md` (1996 строк) - Product Requirements Document
- ✅ `TECH-STACK.md` - архитектура и технологии
- ✅ `MEMBERSTACK-SETUP.md` - настройка Memberstack
- ✅ `INTEGRATION-GUIDE.md` - настройка всех интеграций
- ✅ `TESTING-CHECKLIST.md` - чеклист тестирования
- ✅ `MIGRATION-COMPLETE.md` - инструкции по миграции
- ✅ `DEPLOYMENT.md` - деплой на production
- ✅ `CHANGELOG.md` - история изменений

---

## 🛠 Технологии

### Frontend
- **Framework:** Next.js 14 (App Router, Server Components, SSR)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **State Management:** Zustand (для user state)
- **Forms:** React Hook Form + Zod validation
- **Notifications:** React Hot Toast

### Backend
- **Database:** PostgreSQL
- **ORM:** Prisma 6.19
- **API:** Next.js API Routes (RESTful)
- **Authentication:** Memberstack
- **Payments:** Stripe (через Memberstack)
- **File Upload:** Cloudinary
- **Email:** SendGrid
- **Video:** Vimeo API

### Dev Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Code Formatting:** Prettier (рекомендуется)
- **Type Checking:** TypeScript
- **Database Tools:** Prisma Studio

---

## 🚀 Быстрый старт

### Минимальные требования:
- Node.js 18+ 
- PostgreSQL 14+
- npm или yarn

### Шаги:

```bash
# 1. Клонировать репозиторий
git clone <repository-url>
cd courses

# 2. Установить зависимости
npm install

# 3. Настроить .env
cp ENV-TEMPLATE.md .env
# Заполните все переменные (см. раздел Конфигурация)

# 4. Настроить базу данных
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed  # Опционально: тестовые данные

# 5. Запустить dev сервер
npm run dev

# Откройте http://localhost:3000
```

---

## 📦 Установка

### 1. Клонирование проекта

```bash
git clone <repository-url>
cd courses
```

### 2. Установка зависимостей

```bash
npm install
```

Основные зависимости:
- `next@14.2.3` - фреймворк
- `react@18.3.1` - UI библиотека
- `@prisma/client@6.19.2` - ORM
- `@memberstack/dom@2.0.1` - аутентификация
- `framer-motion@11.2.10` - анимации
- `zustand@4.5.7` - state management
- `react-hot-toast@2.6.0` - уведомления

### 3. Настройка PostgreSQL

#### Вариант A: Локально
```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql
sudo systemctl start postgresql

# Windows
# Скачайте с https://www.postgresql.org/download/
```

#### Вариант B: Docker
```bash
docker run --name learnify-db \
  -e POSTGRES_USER=learnify \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=learnify \
  -p 5432:5432 \
  -d postgres:14
```

#### Вариант C: Облачный сервис
- [Supabase](https://supabase.com) (бесплатный план)
- [Neon](https://neon.tech) (serverless PostgreSQL)
- [Railway](https://railway.app)
- [Timeweb Cloud](https://timeweb.cloud) (для production)

### 4. Создание базы данных

```bash
# Подключитесь к PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE learnify;

# Выйдите
\q
```

---

## ⚙️ Конфигурация

### Environment Variables

Создайте файл `.env` в корне проекта:

```bash
# ===========================================
# DATABASE
# ===========================================
DATABASE_URL="postgresql://user:password@localhost:5432/learnify"

# ===========================================
# APP CONFIGURATION
# ===========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-min-32-chars"

# ===========================================
# MEMBERSTACK (Authentication + Payments)
# ===========================================
# Получите на https://www.memberstack.com
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY="pk_sb_..."
MEMBERSTACK_SECRET_KEY="sk_sb_..."
MEMBERSTACK_WEBHOOK_SECRET="whsec_..."

# ===========================================
# VIMEO (Video Hosting)
# ===========================================
# Получите на https://developer.vimeo.com/apps
VIMEO_ACCESS_TOKEN="your_vimeo_access_token"
VIMEO_CLIENT_ID="your_client_id"
VIMEO_CLIENT_SECRET="your_client_secret"

# ===========================================
# CLOUDINARY (Image Upload)
# ===========================================
# Получите на https://cloudinary.com
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_preset"

# ===========================================
# SENDGRID (Email Service)
# ===========================================
# Получите на https://sendgrid.com
SENDGRID_API_KEY="SG.xxxxx"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
SENDGRID_FROM_NAME="Learnify"

# ===========================================
# ADMIN CONFIGURATION
# ===========================================
# ID пользователей с admin доступом (через запятую)
NEXT_PUBLIC_ADMIN_USER_IDS="user_id_1,user_id_2"
```

### Подробная настройка интеграций

См. **`MEMBERSTACK-SETUP.md`** и **`INTEGRATION-GUIDE.md`**

---

## 🎮 Запуск проекта

### Development Mode

```bash
# Запустить dev сервер
npm run dev

# Открыть в браузере:
# http://localhost:3000
```

**Dev сервер включает:**
- Hot reload
- Fast refresh
- Source maps
- Error overlay

### Production Build

```bash
# Собрать проект
npm run build

# Запустить production сервер
npm start
```

### Database Management

```bash
# Применить миграции
npm run prisma:migrate

# Открыть Prisma Studio (GUI для БД)
npm run prisma:studio

# Сгенерировать Prisma Client
npm run prisma:generate

# Заполнить БД тестовыми данными
npm run prisma:seed
```

### Linting

```bash
# Проверить код
npm run lint

# Исправить автоматически
npm run lint -- --fix
```

---

## 📂 Структура проекта

```
learnify-platform/
├── prisma/
│   ├── schema.prisma          # Database schema (10 models)
│   └── seed.ts                # Seed script
│
├── public/                    # Static assets
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (routes)/         # Page routes
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── courses/      # Courses pages
│   │   │   ├── dashboard/    # User dashboard
│   │   │   ├── learn/        # Lesson player
│   │   │   ├── wishlist/     # Wishlist
│   │   │   └── certificates/ # Certificates
│   │   │
│   │   ├── admin/            # Admin panel
│   │   │   ├── page.tsx      # Admin dashboard
│   │   │   ├── courses/      # Course management
│   │   │   ├── users/        # User management
│   │   │   └── analytics/    # Analytics
│   │   │
│   │   ├── api/              # API Routes
│   │   │   ├── courses/      # Courses API
│   │   │   ├── enrollments/  # Enrollments API
│   │   │   ├── reviews/      # Reviews API
│   │   │   ├── wishlist/     # Wishlist API
│   │   │   └── webhooks/     # Webhooks
│   │   │
│   │   ├── error.tsx         # Global error boundary
│   │   ├── not-found.tsx     # 404 page
│   │   ├── loading.tsx       # Global loading
│   │   └── layout.tsx        # Root layout
│   │
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── ui/               # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Skeleton.tsx
│   │   │
│   │   └── features/         # Feature components
│   │       └── SocialShare.tsx
│   │
│   ├── lib/                  # Utilities & integrations
│   │   ├── prisma.ts         # Prisma client
│   │   ├── memberstack.ts    # Memberstack utilities
│   │   ├── email.ts          # SendGrid utilities
│   │   ├── upload.ts         # Cloudinary utilities
│   │   ├── certificate.ts    # Certificate generation
│   │   └── hooks/            # Custom hooks
│   │       ├── useAuth.ts
│   │       └── useApi.ts
│   │
│   ├── store/
│   │   └── userStore.ts      # Zustand store
│   │
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   │
│   ├── data/
│   │   └── courses.ts        # Mock data (fallback)
│   │
│   └── middleware.ts         # Next.js middleware
│
├── docs/                     # Documentation
│   ├── PRD.md
│   ├── TECH-STACK.md
│   ├── MEMBERSTACK-SETUP.md
│   └── ...
│
├── .env                      # Environment variables (gitignored)
├── .env.example             # Environment template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
├── next.config.mjs          # Next.js config
└── README.md                # This file
```

---

## 🔌 API Endpoints

### Courses

```
GET    /api/courses              # List courses (with filters)
POST   /api/courses              # Create course (admin)
GET    /api/courses/[id]         # Get course by ID
PUT    /api/courses/[id]         # Update course (admin)
DELETE /api/courses/[id]         # Delete course (admin)
POST   /api/courses/[id]/enroll  # Enroll in course
```

### Enrollments

```
GET    /api/enrollments          # Get user enrollments
```

### Lessons

```
POST   /api/lessons/[id]/complete  # Mark lesson as complete
```

### Progress

```
GET    /api/progress             # Get user progress stats
```

### Reviews

```
GET    /api/reviews              # Get course reviews
POST   /api/reviews              # Submit review
```

### Wishlist

```
GET    /api/wishlist             # Get user wishlist
POST   /api/wishlist             # Add to wishlist
DELETE /api/wishlist/[courseId]  # Remove from wishlist
```

### Certificates

```
GET    /api/certificates/[id]         # Get certificate
GET    /api/certificates/verify       # Verify certificate
```

### Webhooks

```
POST   /api/webhooks/memberstack  # Memberstack events
```

### Comments

```
GET    /api/comments              # Get lesson comments
POST   /api/comments              # Post comment
```

---

## 🗄️ База данных

### Схема (Prisma)

**10 моделей:**

1. **Category** - категории курсов
2. **Course** - курсы
3. **Lesson** - уроки
4. **Enrollment** - записи пользователей на курсы
5. **LessonProgress** - прогресс по урокам
6. **Review** - отзывы
7. **Certificate** - сертификаты
8. **Wishlist** - сохранённые курсы
9. **Payment** - платежи
10. **Comment** - комментарии

### Основные связи:

```
Category 1→N Course
Course 1→N Lesson
Course 1→N Enrollment
Enrollment 1→N LessonProgress
Course 1→N Review
Course 1→N Payment
```

### Команды Prisma:

```bash
# Создать миграцию
npm run prisma:migrate

# Открыть Prisma Studio
npm run prisma:studio

# Сгенерировать client
npm run prisma:generate

# Заполнить данными
npm run prisma:seed

# Сбросить БД (DANGER!)
npx prisma migrate reset
```

---

## 🔗 Интеграции

### 1. Memberstack (Auth + Payments)

**Функции:**
- Регистрация и вход пользователей
- Session management
- Password reset
- Покупка курсов (Stripe через Memberstack)
- Customer Portal

**Setup:** См. `MEMBERSTACK-SETUP.md`

**Используется в:**
- `src/lib/memberstack.ts`
- `src/lib/hooks/useAuth.ts`
- `src/app/api/webhooks/memberstack/route.ts`

---

### 2. Stripe (через Memberstack)

**Функции:**
- Payment processing
- Checkout Sessions
- Webhooks

**Важно:** Прямые Stripe API keys **НЕ НУЖНЫ**. Всё через Memberstack!

**Setup:**
1. Подключите Stripe в Memberstack Dashboard
2. Создайте Plans для курсов
3. Добавьте Plan IDs в Course records

---

### 3. Vimeo (Video Hosting)

**Функции:**
- Хостинг видео уроков
- Secure streaming
- Adaptive bitrate

**Setup:**
1. Создайте Vimeo Pro account
2. Получите Access Token
3. Загрузите видео
4. Добавьте `vimeoId` в Lesson records

**Используется в:**
- `src/app/learn/[courseSlug]/[lessonSlug]/page.tsx`

---

### 4. Cloudinary (Image Upload)

**Функции:**
- Загрузка изображений курсов
- Оптимизация и CDN
- Трансформация изображений

**Setup:**
1. Создайте Cloudinary account
2. Получите API credentials
3. Создайте Upload Preset

**Используется в:**
- `src/lib/upload.ts`

---

### 5. SendGrid (Email Service)

**Функции:**
- Welcome emails
- Enrollment confirmations
- Payment receipts
- Certificate delivery
- Password reset

**Setup:**
1. Создайте SendGrid account
2. Получите API Key
3. Verify sender email

**Используется в:**
- `src/lib/email.ts`

**Типы писем:**
- `sendWelcomeEmail()`
- `sendEnrollmentEmail()`
- `sendPaymentReceiptEmail()`
- `sendCertificateEmail()`
- `sendPasswordResetEmail()`

---

## 🚀 Deployment

### Рекомендуемые платформы:

1. **Vercel** (оптимально для Next.js)
2. **Netlify**
3. **Railway**
4. **Timeweb Cloud** (для российского рынка)

### Deployment на Vercel:

```bash
# 1. Установите Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Production deploy
vercel --prod
```

### Deployment на Timeweb Cloud:

См. **`DEPLOYMENT.md`** для подробных инструкций.

### Checklist перед деплоем:

- [ ] Environment variables настроены на production
- [ ] Database URL указывает на production DB
- [ ] Memberstack в Production Mode
- [ ] Stripe подключен через Memberstack
- [ ] Webhook URLs обновлены
- [ ] Domain настроен
- [ ] SSL certificate установлен
- [ ] Prisma migrations выполнены
- [ ] Seed data загружен (опционально)
- [ ] Email отправитель verified (SendGrid)

---

## 🧪 Тестирование

### Тест-сценарии:

См. полный чеклист в **`TESTING-CHECKLIST.md`** (200+ тестов)

### Быстрый тест:

1. **Регистрация:**
   ```
   /signup → введите email/password → проверьте redirect
   ```

2. **Browse courses:**
   ```
   /courses → используйте search и filters
   ```

3. **Free enrollment:**
   ```
   Откройте free course → Enroll → проверьте access
   ```

4. **Paid purchase:**
   ```
   Откройте paid course → Enroll → Stripe checkout
   Test card: 4242 4242 4242 4242
   ```

5. **Watch lesson:**
   ```
   /learn/[course]/[lesson] → play video → mark complete
   ```

6. **Complete course:**
   ```
   Завершите все уроки → получите certificate
   ```

### Тестовые данные:

```bash
# Загрузить seed data
npm run prisma:seed
```

**Создаётся:**
- 6 categories
- 3 sample courses (1 с уроками)

---

## 📖 Документация

### Для разработчиков:

| Документ | Описание |
|----------|----------|
| **README.md** | Этот файл - общий обзор |
| **PRD.md** | Product Requirements (1996 строк) |
| **TECH-STACK.md** | Архитектура и технологии |
| **INTEGRATION-GUIDE.md** | Настройка интеграций |
| **MEMBERSTACK-SETUP.md** | Настройка Memberstack |
| **TESTING-CHECKLIST.md** | Чеклист тестирования |
| **ENV-TEMPLATE.md** | Environment variables |

### Для деплоя:

| Документ | Описание |
|----------|----------|
| **DEPLOYMENT.md** | Production deployment |
| **MIGRATION-COMPLETE.md** | После миграции на Memberstack |
| **QUICK-START.md** | Быстрый старт |

### История:

| Документ | Описание |
|----------|----------|
| **CHANGELOG.md** | История изменений |
| **STRIPE-MIGRATION-SUMMARY.md** | Детали миграции |
| **FINAL-MIGRATION-REPORT.md** | Итоговый отчёт |

---

## 🤝 Contribution

Этот проект создан как коммерческий продукт. Contribution guidelines будут добавлены позже.

---

## 📄 License

MIT License - см. файл [LICENSE](LICENSE)

---

## 👥 Authors

**Learnify Development Team**

---

## 🆘 Support

### Документация:
- Все гайды в репозитории
- Начните с этого README
- Затем см. соответствующие документы по нужной теме

### Помощь по интеграциям:
- Memberstack: https://docs.memberstack.com/
- Stripe: через Memberstack Support
- Vimeo: https://developer.vimeo.com/
- Cloudinary: https://cloudinary.com/documentation
- SendGrid: https://docs.sendgrid.com/

### Issues:
- Создайте issue в репозитории с:
  - Описанием проблемы
  - Шагами для воспроизведения
  - Логами/screenshots
  - Environment (OS, Node version, etc.)

---

## 📊 Project Status

**Version:** 2.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** February 5, 2026

### Что готово: ✅

- ✅ Frontend (100%)
- ✅ Admin Panel (100%)
- ✅ Backend API (100%)
- ✅ Database Schema (100%)
- ✅ Integrations (100%)
- ✅ Documentation (100%)

### Roadmap:

**Phase 1** (Current):
- ✅ MVP Complete
- ✅ Memberstack Integration
- ✅ Full Documentation

**Phase 2** (Planned):
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Live classes
- [ ] Quizzes & assignments
- [ ] Community forums
- [ ] AI recommendations

**Phase 3** (Future):
- [ ] Multi-language support
- [ ] Advanced gamification
- [ ] Learning paths
- [ ] Team accounts
- [ ] White-label solutions

---

## 🎉 Quick Links

- 📚 [Full Documentation](docs/)
- 🚀 [Quick Start](QUICK-START.md)
- 🔧 [Memberstack Setup](MEMBERSTACK-SETUP.md)
- 🧪 [Testing Guide](TESTING-CHECKLIST.md)
- 📦 [Deployment Guide](DEPLOYMENT.md)
- 📝 [Changelog](CHANGELOG.md)

---

## 💡 Tips

### Development:
```bash
# Быстрый рестарт dev сервера
npm run dev

# Открыть Prisma Studio
npm run prisma:studio

# Проверить типы
npx tsc --noEmit

# Форматировать код
npx prettier --write .
```

### Production:
```bash
# Проверка перед деплоем
npm run build
npm run lint

# Проверка миграций
npm run prisma:migrate status
```

---

**Готово к запуску! 🚀**

Начните с раздела [Быстрый старт](#-быстрый-старт) и следуйте инструкциям.

Для подробной настройки см. [Конфигурация](#-конфигурация).

---

*Made with ❤️ for educators and learners worldwide*
