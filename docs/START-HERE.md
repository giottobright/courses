# 👋 START HERE - Learnify Platform

## Добро пожаловать в проект Learnify!

Этот файл поможет вам быстро сориентироваться в проекте.

---

## 🎯 Что это?

**Learnify** - полнофункциональная платформа для онлайн-обучения с:
- 💻 Frontend для учеников
- 👨‍💼 Admin Panel
- 🔌 Backend API
- 💳 Платёжной системой (Memberstack + Stripe)
- 🎥 Видео-уроками (Vimeo)
- 🏆 Сертификатами

**Статус:** ✅ **100% готово к запуску**

---

## ⚡ Быстрый старт (5 минут)

```bash
# 1. Установите зависимости
npm install

# 2. Настройте .env (см. ENV-TEMPLATE.md)
cp ENV-TEMPLATE.md .env
# Заполните DATABASE_URL и Memberstack keys

# 3. Настройте БД
npm run prisma:migrate
npm run prisma:seed

# 4. Запустите
npm run dev

# Откройте http://localhost:3000
```

**Готово!** Платформа запущена локально.

---

## 📖 Какую документацию читать?

### Если вы хотите:

**🚀 Быстро запустить проект:**
→ Читайте: **`GETTING-STARTED-RU.md`** (пошаговое руководство)

**🔧 Настроить Memberstack и платежи:**
→ Читайте: **`MEMBERSTACK-SETUP.md`** (детальная настройка)

**📚 Понять архитектуру:**
→ Читайте: **`TECH-STACK.md`** (технологии и связи)

**🔌 Настроить интеграции (Vimeo, Cloudinary, SendGrid):**
→ Читайте: **`INTEGRATION-GUIDE.md`** (все интеграции)

**🎨 Понять что реализовано:**
→ Читайте: **`PROJECT-OVERVIEW.md`** (полный обзор)

**🧪 Протестировать платформу:**
→ Читайте: **`TESTING-CHECKLIST.md`** (200+ тестов)

**🚀 Задеплоить на production:**
→ Читайте: **`DEPLOYMENT.md`** (deployment guide)

**📝 Полная спецификация продукта:**
→ Читайте: **`PRD.md`** (1996 строк, Product Requirements)

---

## 🗺️ Карта документации

```
START-HERE.md (вы здесь!)
    ↓
    ├─→ Хочу запустить быстро
    │   └─→ GETTING-STARTED-RU.md
    │       └─→ ENV-TEMPLATE.md
    │
    ├─→ Хочу понять проект
    │   ├─→ PROJECT-OVERVIEW.md (что реализовано)
    │   ├─→ TECH-STACK.md (архитектура)
    │   └─→ PRD.md (полная спецификация)
    │
    ├─→ Хочу настроить интеграции
    │   ├─→ MEMBERSTACK-SETUP.md (auth + payments)
    │   └─→ INTEGRATION-GUIDE.md (остальные)
    │
    ├─→ Хочу протестировать
    │   └─→ TESTING-CHECKLIST.md
    │
    └─→ Хочу задеплоить
        └─→ DEPLOYMENT.md
```

---

## 📦 Что входит в проект?

### ✅ Frontend (100%)
- Homepage
- Courses catalog с поиском
- Course detail page
- Lesson player
- User dashboard
- Wishlist
- Certificates
- Error/Loading pages

### ✅ Admin Panel (100%)
- Admin dashboard
- Courses management (CRUD)
- Course editor
- Users management
- Analytics
- Settings

### ✅ Backend (100%)
- 15+ API endpoints
- Database (Prisma + PostgreSQL)
- Authentication (Memberstack)
- Payments (Memberstack + Stripe)
- Email notifications
- Certificate generation

### ✅ Интеграции (100%)
- Memberstack (auth + payments)
- Stripe (через Memberstack)
- Vimeo (video hosting)
- Cloudinary (images)
- SendGrid (emails)

---

## 🔑 Ключевые файлы

### Backend:
- `prisma/schema.prisma` - схема БД (10 моделей)
- `src/app/api/**` - все API endpoints
- `src/lib/**` - utilities и integrations

### Frontend:
- `src/app/**` - все страницы (Next.js App Router)
- `src/components/**` - переиспользуемые компоненты
- `src/lib/hooks/**` - custom React hooks

### Config:
- `.env` - environment variables (создайте сами)
- `package.json` - dependencies
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Tailwind styles

---

## ⚙️ Environment Variables (минимум)

Для локального запуска нужны минимум:

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/learnify"

# Memberstack
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY="pk_sb_..."
MEMBERSTACK_SECRET_KEY="sk_sb_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-32-chars-min"
```

**Остальные** (Vimeo, Cloudinary, SendGrid) опциональны для первого запуска.

**Подробнее:** `ENV-TEMPLATE.md`

---

## 💡 FAQ

### Q: Нужны ли мне прямые Stripe API keys?
**A:** ❌ НЕТ! Stripe интегрируется через Memberstack автоматически.

### Q: Могу ли я запустить без Memberstack?
**A:** ⚠️ Нет, Memberstack обязателен для authentication и payments.

### Q: Какая база данных поддерживается?
**A:** PostgreSQL 14+ (обязательно). MySQL не поддерживается.

### Q: Можно ли использовать другой video host вместо Vimeo?
**A:** Да, но нужно будет переделать Lesson Player. Vimeo оптимален для MVP.

### Q: Сколько стоит запустить платформу?
**A:** 
- Memberstack: Free tier (до 50 users)
- Vimeo Pro: $20/мес
- Cloudinary: Free tier
- SendGrid: Free tier (100 emails/day)
- Database: Free tier на Supabase/Neon
- **Итого:** ~$20/мес для старта

### Q: Есть ли demo?
**A:** Запустите локально с `npm run prisma:seed` для тестовых данных.

---

## 🛠️ Troubleshooting

### "Cannot connect to database"
→ Проверьте что PostgreSQL запущен и DATABASE_URL правильный

### "Memberstack is not defined"
→ Проверьте что `@memberstack/dom` установлен и Public Key в `.env`

### "Port 3000 already in use"
→ Используйте другой порт: `PORT=3001 npm run dev`

### "Prisma migration failed"
→ Сбросьте БД: `npx prisma migrate reset` (удалит данные!)

---

## 📞 Куда дальше?

### Вариант 1: Я разработчик, хочу запустить локально
1. Читайте **GETTING-STARTED-RU.md**
2. Следуйте шагам
3. Запускайте dev сервер
4. Тестируйте функционал

### Вариант 2: Я хочу понять код
1. Читайте **TECH-STACK.md** (архитектура)
2. Читайте **PROJECT-OVERVIEW.md** (что реализовано)
3. Изучайте код в `src/`
4. Используйте Prisma Studio для БД

### Вариант 3: Я хочу задеплоить
1. Читайте **DEPLOYMENT.md**
2. Настройте production database
3. Настройте Memberstack в Production Mode
4. Deploy на Vercel/Netlify
5. Тестируйте production

### Вариант 4: Я Product Owner
1. Читайте **PRD.md** (полная спецификация)
2. Читайте **PROJECT-OVERVIEW.md** (обзор функций)
3. Тестируйте платформу локально
4. Планируйте контент и marketing

---

## 🎉 Готово!

**Платформа Learnify полностью реализована и готова к запуску!**

### Статус разработки:
- ✅ Frontend: 100%
- ✅ Admin Panel: 100%
- ✅ Backend: 100%
- ✅ Database: 100%
- ✅ Integrations: 100%
- ✅ Documentation: 100%

**Общий прогресс: 100% ✨**

---

**Начните с `GETTING-STARTED-RU.md` и запускайте платформу! 🚀**

---

*Last Updated: February 5, 2026*  
*Version: 2.0.0*  
*Status: Production Ready*
