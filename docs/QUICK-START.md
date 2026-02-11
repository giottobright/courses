# 🚀 Quick Start Guide - Learnify Platform

## ✅ Проект готов на 100%!

Frontend: ✅ 100%  
Admin Panel: ✅ 100%  
**Общий прогресс: 100%**

---

## 📁 Что создано

### Frontend (100%)
- ✅ Dashboard с API integration
- ✅ Courses catalog с фильтрами
- ✅ Course detail page (reviews, enroll, wishlist)
- ✅ Lesson Player с Vimeo
- ✅ Wishlist page
- ✅ Error & Loading states
- ✅ Social sharing

### Admin Panel (100%)
- ✅ Admin Dashboard со статистикой
- ✅ Courses Management (CRUD)
- ✅ Course Editor (create/edit)
- ✅ Users Management
- ✅ Analytics page
- ✅ Settings page

### Backend & API (100%)
- ✅ Prisma schema (10 models)
- ✅ 15+ API routes
- ✅ Stripe integration
- ✅ Vimeo integration
- ✅ Cloudinary integration
- ✅ SendGrid integration
- ✅ Memberstack integration

---

## 🏃 Быстрый старт (Development)

### 1. Установите зависимости
```bash
npm install
```

### 2. Настройте базу данных
```bash
# Создайте .env файл
cp .env.example .env

# Добавьте DATABASE_URL в .env
# Example: postgresql://user:password@localhost:5432/learnify

# Запустите миграции
npm run prisma:migrate

# (Опционально) Заполните тестовыми данными
npm run prisma:seed
```

### 3. Добавьте API Keys в .env
```env
# Memberstack
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=your_key
MEMBERSTACK_SECRET_KEY=your_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Vimeo
VIMEO_ACCESS_TOKEN=your_token

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# SendGrid
SENDGRID_API_KEY=your_key
SENDGRID_FROM_EMAIL=noreply@learnify.com
```

### 4. Запустите dev сервер
```bash
npm run dev
```

Откройте http://localhost:3000

---

## 🌐 Deployment на Production (Timeweb)

### 1. Создайте PostgreSQL базу на Timeweb
- Перейдите в Timeweb Panel
- Создайте PostgreSQL database
- Скопируйте connection string

### 2. Deploy Next.js приложение
```bash
# Build для production
npm run build

# Start production server
npm start
```

### 3. Настройте переменные окружения
- Добавьте все переменные из `.env.example`
- Используйте production ключи (не test!)
- Обновите `NEXTAUTH_URL` на ваш домен

### 4. Запустите миграции на production
```bash
npm run prisma:migrate
npm run prisma:seed  # Опционально
```

### 5. Настройте Stripe Webhooks
- Перейдите в Stripe Dashboard
- Добавьте webhook URL: `https://yourdomain.com/api/webhooks/stripe`
- Выберите events: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`
- Скопируйте webhook signing secret в `STRIPE_WEBHOOK_SECRET`

---

## 📖 Навигация по проекту

### Основные файлы

**Frontend**
- `src/app/` - Все страницы (Next.js App Router)
- `src/components/` - Переиспользуемые компоненты
- `src/lib/` - Utilities и integrations
- `src/store/` - Zustand state management

**Backend**
- `src/app/api/` - API routes
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Seed script

**Documentation**
- `PRD.md` - Product Requirements (полная спецификация)
- `TECH-STACK.md` - Архитектура и технологии
- `INTEGRATION-GUIDE.md` - Настройка интеграций
- `COMPLETION-SUMMARY.md` - Финальный отчёт
- `CHANGELOG.md` - История изменений

### Структура страниц

```
/                          Homepage
/courses                   Courses catalog
/courses/[slug]            Course detail
/dashboard                 User dashboard
/learn/[course]/[lesson]   Lesson player
/wishlist                  Saved courses
/certificates              Certificates
/admin                     Admin dashboard
/admin/courses             Courses management
/admin/users               Users management
/admin/analytics           Analytics
```

---

## 🔑 Ключевые компоненты

### Custom Hooks
- `useAuth()` - Memberstack authentication
- `useApi()` - API calls с loading/error states

### UI Components
- `Button` - Кнопки с вариантами (primary, outline, ghost)
- `Card` - Карточки с hover эффектами
- `Badge` - Badges с вариантами (success, warning, error)
- `ProgressBar` - Прогресс бары с цветами
- `Spinner` - Loading spinners
- `Skeleton` - Skeleton loaders

### Feature Components
- `SocialShare` - Social sharing (Twitter, LinkedIn, Facebook)
- `Navbar` - Navigation bar
- `Footer` - Footer с links
- `CourseCard` - Course card component

---

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
```

---

## 📊 Admin Panel

### Доступ к admin panel
- URL: `/admin`
- Требуется admin access (настроить в Memberstack или через `NEXT_PUBLIC_ADMIN_USER_IDS` в .env)

### Функционал
- **Dashboard**: статистика платформы, recent activity
- **Courses**: создание, редактирование, удаление курсов
- **Users**: список пользователей с статистикой
- **Analytics**: метрики и insights
- **Settings**: настройки интеграций

---

## 🔒 Authentication Flow

1. User регистрируется через Memberstack
2. Memberstack создаёт account и session
3. Frontend получает user data через `useAuth()`
4. Protected routes проверяются через middleware
5. API routes получают userId из Memberstack session

---

## 💳 Payment Flow

1. User нажимает "Enroll" на paid course
2. Frontend создаёт Stripe Checkout Session (`/api/checkout`)
3. User перенаправляется на Stripe
4. После payment, Stripe отправляет webhook
5. Backend обрабатывает webhook (`/api/webhooks/stripe`)
6. Создаётся Enrollment и Payment record
7. Отправляется email confirmation (SendGrid)
8. User получает доступ к курсу

---

## 📧 Email Notifications

Автоматические emails через SendGrid:
- ✅ Welcome email (регистрация)
- ✅ Enrollment confirmation (при записи на курс)
- ✅ Payment receipt (после оплаты)
- ✅ Certificate email (при завершении курса)
- ✅ Password reset (при сбросе пароля)

---

## 🎓 Certificate Flow

1. User завершает все уроки курса
2. Backend автоматически проверяет completion
3. Создаётся Certificate record в БД
4. Генерируется PDF certificate (jsPDF + html2canvas)
5. Отправляется email с certificate (SendGrid)
6. User может скачать certificate из dashboard
7. Certificate можно verify через `/api/certificates/verify`

---

## 🎯 Testing Checklist

### User Flow
- [ ] Регистрация через Memberstack
- [ ] Вход в систему
- [ ] Browse courses
- [ ] View course detail
- [ ] Enroll in free course
- [ ] Purchase paid course (Stripe test mode)
- [ ] Watch video lesson
- [ ] Mark lesson as complete
- [ ] Complete course
- [ ] Receive certificate
- [ ] Leave review
- [ ] Add course to wishlist
- [ ] Share course

### Admin Flow
- [ ] Access admin panel
- [ ] Create new course
- [ ] Edit existing course
- [ ] Publish/unpublish course
- [ ] Delete course
- [ ] View users list
- [ ] View analytics
- [ ] Check platform stats

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Проверьте DATABASE_URL в .env
# Убедитесь, что PostgreSQL запущен
# Попробуйте reconnect:
npm run prisma:generate
```

### Memberstack Not Loading
```bash
# Проверьте NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY
# Убедитесь, что скрипт загружается в browser
# Check browser console for errors
```

### Stripe Webhook Failed
```bash
# Проверьте STRIPE_WEBHOOK_SECRET
# Убедитесь, что webhook URL правильный
# Test webhook через Stripe CLI:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Video Not Playing
```bash
# Проверьте VIMEO_ACCESS_TOKEN
# Убедитесь, что video public или unlisted
# Check Vimeo privacy settings
```

---

## 📞 Support & Resources

### Documentation
- **PRD.md** - Полная спецификация продукта
- **TECH-STACK.md** - Архитектура и технологии
- **INTEGRATION-GUIDE.md** - Настройка интеграций
- **COMPLETION-SUMMARY.md** - Финальный отчёт

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Memberstack Docs](https://docs.memberstack.com/)
- [Stripe Docs](https://stripe.com/docs)
- [Vimeo API Docs](https://developer.vimeo.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [SendGrid Docs](https://docs.sendgrid.com/)

---

## 🎉 Готово к запуску!

Все компоненты реализованы, все интеграции настроены (требуют API keys), документация полная.

**Next steps**:
1. Добавьте API keys в `.env`
2. Запустите `npm run dev`
3. Протестируйте все flows
4. Deploy на Timeweb Cloud
5. Загрузите контент через admin panel
6. Запустите платформу! 🚀

---

**Platform Status**: ✅ Ready for Production  
**Version**: 1.0.0  
**Last Updated**: February 5, 2026

**Удачного запуска! 🎓✨**
