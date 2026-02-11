# ✅ Migration Complete: Stripe → Memberstack

## 🎉 Успешно переведено на Memberstack + Stripe!

**Дата:** 5 февраля 2026  
**Статус:** ✅ Complete - Ready for Testing

---

## 📊 Сводка изменений

### Удалено ❌
- Direct Stripe integration (`lib/stripe.ts`)
- `/api/checkout` route
- `/api/webhooks/stripe` route
- Stripe API keys из environment

### Добавлено ✨
- Memberstack payment functions в `lib/memberstack.ts`
- `/api/webhooks/memberstack` route
- Memberstack webhook secret
- `memberstackPlanId` в Course model
- `planConnectionId` в Enrollment и Payment models

### Обновлено 🔄
- Course detail page - использует Memberstack payments
- Prisma schema - новые поля для Memberstack
- Документация - полностью обновлена
- Environment variables template

---

## 📁 Новые файлы

1. **MEMBERSTACK-SETUP.md** - Полное руководство по настройке Memberstack
2. **ENV-TEMPLATE.md** - Обновлённый шаблон environment variables
3. **STRIPE-MIGRATION-SUMMARY.md** - Детальное описание миграции
4. **TESTING-CHECKLIST.md** - Чеклист для тестирования
5. **MIGRATION-COMPLETE.md** - Этот файл

---

## 🔑 Что нужно сделать

### 1. Обновите Environment Variables

Создайте `.env` файл (если ещё не создан):

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/learnify"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Memberstack (Authentication + Payments)
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY="pk_sb_..."
MEMBERSTACK_SECRET_KEY="sk_sb_..."
MEMBERSTACK_WEBHOOK_SECRET="whsec_..." # NEW!

# Vimeo (без изменений)
VIMEO_ACCESS_TOKEN="..."

# Cloudinary (без изменений)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# SendGrid (без изменений)
SENDGRID_API_KEY="..."
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"

# Admin Users
NEXT_PUBLIC_ADMIN_USER_IDS="user_id_1,user_id_2"
```

**⚠️ УДАЛИТЕ старые Stripe keys (больше не нужны):**
```bash
# ❌ Remove these:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# STRIPE_SECRET_KEY
# STRIPE_WEBHOOK_SECRET
```

---

### 2. Настройте Memberstack

Следуйте инструкциям в **MEMBERSTACK-SETUP.md**:

#### Quick Steps:
1. **Connect Stripe** (Settings → Payments → Connect with Stripe)
2. **Create Plans** для каждого платного курса
3. **Copy Plan IDs** и добавьте в Course records
4. **Setup Webhook** (`https://yourdomain.com/api/webhooks/memberstack`)
5. **Copy Webhook Secret** и добавьте в `.env`

---

### 3. Обновите Database

Запустите Prisma migration:

```bash
# Generate Prisma client
npm run prisma:generate

# Run migration
npm run prisma:migrate

# (Optional) Seed data
npm run prisma:seed
```

**Новые поля в БД:**
- `courses.memberstackPlanId`
- `enrollments.planConnectionId`
- `payments.memberstackPlanId`
- `payments.planConnectionId`

---

### 4. Добавьте Plan IDs к курсам

**Вариант A: Через Admin Panel**
1. Откройте `/admin/courses`
2. Edit каждый платный курс
3. Добавьте Memberstack Plan ID
4. Save

**Вариант B: Напрямую в БД**
```sql
-- Update course with Memberstack Plan ID
UPDATE courses 
SET memberstack_plan_id = 'pln_abc123def456' 
WHERE slug = 'creative-writing';

-- Repeat for all paid courses
```

---

### 5. Запустите проект

```bash
# Install dependencies (if needed)
npm install

# Start dev server
npm run dev
```

Откройте http://localhost:3000

---

### 6. Протестируйте Payment Flow

Следуйте **TESTING-CHECKLIST.md**:

#### Quick Test:
1. ✅ Зарегистрируйтесь как новый user
2. ✅ Откройте платный курс
3. ✅ Нажмите "Enroll Now"
4. ✅ Проверьте что открывается Stripe Checkout
5. ✅ Используйте test card: `4242 4242 4242 4242`
6. ✅ Завершите покупку
7. ✅ Проверьте что:
   - Webhook пришёл (логи сервера)
   - Enrollment создан (БД)
   - Payment создан (БД)
   - Email отправлен
   - Доступ к урокам открыт

---

## 🔍 Как проверить что всё работает

### Чеклист:
- [ ] Environment variables настроены
- [ ] Memberstack + Stripe подключены
- [ ] Plans созданы в Memberstack
- [ ] Plan IDs добавлены в courses
- [ ] Webhook URL настроен
- [ ] Prisma migration выполнена
- [ ] Dev server запущен
- [ ] Free enrollment работает
- [ ] Paid purchase через Memberstack работает
- [ ] Webhook создаёт enrollment
- [ ] Emails отправляются
- [ ] Admin panel accessible

---

## 🎯 Архитектура (After Migration)

```
┌─────────────────────────────────────────────────────┐
│             Learnify Platform                        │
│              (Next.js 14)                            │
│                                                       │
│  ┌────────────┐           ┌────────────────┐        │
│  │  Frontend  │◄─────────►│  API Routes    │        │
│  │  (React)   │           │  /app/api/*    │        │
│  └──────┬─────┘           └────────┬───────┘        │
│         │                          │                 │
│         │ Memberstack SDK          │ Prisma         │
│         ▼                          ▼                 │
└─────────┼──────────────────────────┼────────────────┘
          │                          │
    ┌─────▼──────────┐     ┌─────────▼─────────┐
    │  Memberstack   │     │   PostgreSQL      │
    │   (Auth +      │     │   (Course Data)   │
    │   Payments)    │     └───────────────────┘
    └────────┬───────┘
             │
       ┌─────▼──────┐
       │   Stripe   │ (через Memberstack)
       │ (Payments) │
       └────────────┘
```

### Payment Flow:
```
User clicks "Enroll"
      ↓
purchaseCourseWithMemberstack(planId, courseId)
      ↓
Memberstack opens Stripe Checkout
      ↓
User completes payment
      ↓
Memberstack webhook → /api/webhooks/memberstack
      ↓
Create Enrollment + Payment in DB
      ↓
Send emails
      ↓
User gets access to course
```

---

## 📚 Документация

### Обязательно прочитайте:
1. **MEMBERSTACK-SETUP.md** - Пошаговая настройка
2. **ENV-TEMPLATE.md** - Environment variables
3. **STRIPE-MIGRATION-SUMMARY.md** - Что изменилось
4. **TESTING-CHECKLIST.md** - Как тестировать

### Дополнительно:
- **TECH-STACK.md** - Обновлённая архитектура
- **INTEGRATION-GUIDE.md** - Integrations setup
- **QUICK-START.md** - Quick start guide

---

## 🐛 Troubleshooting

### Проблема: "Memberstack is not defined"
**Решение:**
```bash
# Убедитесь что SDK установлен
npm install @memberstack/dom

# Проверьте что Public Key в .env
echo $NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY
```

### Проблема: Stripe checkout не открывается
**Решение:**
- Проверьте что Stripe подключен в Memberstack Dashboard
- Убедитесь что Plan существует (Memberstack → Plans)
- Проверьте что `memberstackPlanId` правильный в Course record

### Проблема: Webhook не создаёт enrollment
**Решение:**
- Проверьте webhook URL в Memberstack Dashboard
- Проверьте логи: `console.log` в `/api/webhooks/memberstack`
- Убедитесь что `courseId` передаётся в metadata
- Проверьте DATABASE_URL connection

### Проблема: Database migration failed
**Решение:**
```bash
# Reset database (DANGER: deletes all data)
npm run prisma:migrate reset

# Or manually update schema
npm run prisma:migrate dev --name memberstack_integration
```

---

## 💡 Best Practices

### 1. Development
- Используйте Memberstack Test Mode
- Используйте Stripe test cards
- Forward webhooks локально: `memberstack webhooks forward`

### 2. Production
- Переключите на Production Mode в Memberstack
- Обновите webhook URL на production domain
- Используйте Live Stripe keys (через Memberstack)
- Setup SSL certificate (HTTPS required)

### 3. Monitoring
- Проверяйте webhook logs в Memberstack Dashboard
- Monitor database для failed enrollments
- Setup error tracking (Sentry)
- Monitor SendGrid email delivery

---

## 🎓 Training Notes

### Для разработчиков:
- Memberstack обрабатывает checkout автоматически
- Не нужно создавать Stripe Sessions вручную
- Webhook создаёт enrollment, не frontend
- Plan IDs нужно настроить в Memberstack Dashboard

### Для админов:
- Создавайте Plans в Memberstack для новых курсов
- Copy Plan ID и добавляйте в Course record
- Monitor webhooks в Memberstack Dashboard
- Check email delivery в SendGrid

---

## ✅ Migration Status

**Completed Tasks:**
- ✅ Memberstack payment functions implemented
- ✅ Course detail page updated
- ✅ Stripe API routes removed
- ✅ Memberstack webhook handler created
- ✅ Prisma schema updated
- ✅ Documentation updated
- ✅ Testing checklist created

**Status:** 🟢 **Complete - Ready for Testing**

---

## 🚀 Next Steps

1. **Setup Memberstack** (30 min)
   - Follow MEMBERSTACK-SETUP.md

2. **Run Migrations** (5 min)
   - `npm run prisma:migrate`

3. **Add Plan IDs** (15 min)
   - Update courses with Memberstack Plan IDs

4. **Test Payment Flow** (30 min)
   - Follow TESTING-CHECKLIST.md

5. **Deploy to Production** (when ready)
   - Update environment variables
   - Configure production webhook URL
   - Test end-to-end

---

## 📞 Support

**Вопросы по настройке:**
- См. документацию в репозитории
- Check Memberstack Docs: https://docs.memberstack.com/

**Memberstack Support:**
- https://www.memberstack.com/support

**Stripe (через Memberstack):**
- Все вопросы через Memberstack Support

---

## 🎉 Готово!

Платформа успешно переведена на Memberstack + Stripe!

**Преимущества новой архитектуры:**
- ✅ Проще в настройке
- ✅ Меньше кода для поддержки
- ✅ Нет прямых Stripe API keys
- ✅ Автоматический PCI compliance
- ✅ Встроенный Customer Portal
- ✅ Централизованное управление

**Начните с MEMBERSTACK-SETUP.md и следуйте инструкциям!**

---

*Last Updated: 5 февраля 2026*  
*Version: 2.0 - Memberstack Integration*
