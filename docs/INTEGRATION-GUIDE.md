# 🚀 Learnify Integration Guide

**Полное руководство по настройке и запуску платформы в production**

---

## 📋 Содержание

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Memberstack Integration](#memberstack-integration)
4. [Stripe Payments](#stripe-payments)
5. [Vimeo Video Hosting](#vimeo-video-hosting)
6. [Cloudinary Image Storage](#cloudinary-image-storage)
7. [SendGrid Email Service](#sendgrid-email-service)
8. [Deployment to Timeweb Cloud](#deployment-to-timeweb-cloud)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Необходимые аккаунты:

- ✅ **PostgreSQL Database** (Timeweb Cloud или Supabase)
- ✅ **Memberstack** (аутентификация) - https://memberstack.com
- ✅ **Stripe** (платежи) - https://stripe.com
- ✅ **Vimeo Pro** (видео) - https://vimeo.com
- ✅ **Cloudinary** (изображения) - https://cloudinary.com
- ✅ **SendGrid** (email) - https://sendgrid.com
- ✅ **Timeweb Cloud** (хостинг) - https://timeweb.cloud

---

## Database Setup

### 1. Создание базы данных

#### Вариант A: Timeweb Cloud PostgreSQL

1. Войдите в панель Timeweb Cloud
2. Перейдите в "Базы данных" → "Создать БД"
3. Выберите PostgreSQL 14+
4. Запишите `DATABASE_URL`:
   ```
   postgresql://username:password@host:port/database
   ```

#### Вариант B: Supabase (бесплатно)

1. Создайте проект на https://supabase.com
2. Перейдите в Settings → Database
3. Скопируйте Connection String (URI mode)

### 2. Настройка Prisma

```bash
# 1. Создайте .env файл
cp .env.example .env

# 2. Добавьте DATABASE_URL в .env
DATABASE_URL="postgresql://user:password@host:port/learnify"

# 3. Запустите миграции
npx prisma migrate dev --name init

# 4. Сгенерируйте Prisma Client
npx prisma generate

# 5. Заполните начальными данными
npx prisma db seed
```

### 3. Проверка

```bash
# Открыть Prisma Studio для просмотра данных
npx prisma studio
```

---

## Memberstack Integration

### 1. Создание Memberstack приложения

1. Зарегистрируйтесь на https://app.memberstack.com/
2. Создайте новое приложение
3. Перейдите в Settings → Keys
4. Скопируйте **Public Key**

### 2. Настройка в проекте

Добавьте в `.env`:
```bash
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY="pk_live_xxxxxxxxxx"
```

### 3. Установка SDK

SDK уже установлен через `npm install @memberstack/dom`

### 4. Добавление скрипта в layout

Скрипт уже подключен в `src/lib/memberstack.ts` и загружается автоматически.

### 5. Настройка Custom Fields

В Memberstack Dashboard → Members → Custom Fields:
- `name` (Text)
- `avatar` (Text - URL)

### 6. Настройка Membership Plans (опционально)

Создайте планы:
- **Free** (по умолчанию)
- **Pro** ($9.99/month)
- **Premium** ($29.99/month)

### 7. Тестирование

```typescript
// В любом client component
import { getCurrentMemberstackUser } from '@/lib/memberstack';

const user = await getCurrentMemberstackUser();
console.log('Current user:', user);
```

---

## Stripe Payments (через Memberstack)

⚡ **Обновление:** Stripe интегрируется автоматически через Memberstack!

### 1. Подключение Stripe к Memberstack

1. В Memberstack Dashboard перейдите в **Settings → Payments**
2. Нажмите **Connect with Stripe**
3. Авторизуйтесь в Stripe (или создайте аккаунт)
4. Подтвердите подключение

✅ **Готово!** Прямые Stripe API keys больше не нужны.

### 2. Создание Plans для курсов

1. В Memberstack Dashboard перейдите в **Plans**
2. Нажмите **Create Plan**
3. Заполните:
   - Name: например "Creative Writing Course"
   - Price: $49.99
   - Type: One-time payment
4. Сохраните и скопируйте **Plan ID** (например: `pln_abc123`)

### 3. Связывание Plans с курсами

В БД добавьте `memberstackPlanId` к курсам:
```sql
UPDATE courses 
SET memberstack_plan_id = 'pln_abc123' 
WHERE slug = 'creative-writing';
```

Или через Admin Panel при создании курса.

### 4. Настройка Webhooks

1. В Memberstack Dashboard → **Settings → Webhooks**
2. Добавьте webhook URL:
   ```
   https://your-domain.com/api/webhooks/memberstack
   ```
3. Выберите события:
   - ✅ `member.plan.purchased`
   - ✅ `member.plan.cancelled`
   - ✅ `member.plan.updated`
4. Сохраните и скопируйте **Webhook Secret**
5. Добавьте в `.env`:
   ```bash
   MEMBERSTACK_WEBHOOK_SECRET="whsec_xxxxxx"
   ```

### 5. Тестирование платежей

Memberstack автоматически использует Stripe Test Mode.

Используйте тестовые карты:
- Успешная: `4242 4242 4242 4242`
- Отклонённая: `4000 0000 0000 0002`

CVC: любые 3 цифры  
Дата: любая будущая дата

### 6. Локальное тестирование webhooks

```bash
# Используйте Memberstack CLI
npm install -g @memberstack/cli

# Forward webhooks to localhost
memberstack webhooks forward --to http://localhost:3000/api/webhooks/memberstack
```

**См. подробное руководство:** `MEMBERSTACK-SETUP.md`

---

## Vimeo Video Hosting

### 1. Создание Vimeo Pro аккаунта

1. Подпишитесь на Vimeo Pro: https://vimeo.com/upgrade
2. Стоимость: $20/месяц

### 2. Получение API credentials

1. Перейдите в https://developer.vimeo.com/apps
2. Создайте новое приложение
3. Получите:
   - Client ID
   - Client Secret
   - Access Token (с правами: upload, edit, delete)

### 3. Настройка в проекте

Добавьте в `.env`:
```bash
VIMEO_CLIENT_ID="xxxxxx"
VIMEO_CLIENT_SECRET="xxxxxx"
VIMEO_ACCESS_TOKEN="xxxxxx"
```

### 4. Загрузка видео

#### Через Vimeo интерфейс (рекомендуется):
1. Загрузите видео через https://vimeo.com/upload
2. Настройте Privacy → Unlisted
3. Enable Domain-level privacy: добавьте ваш домен
4. Скопируйте Video ID из URL: `vimeo.com/VIDEO_ID`

#### Через API (для админ-панели):
```typescript
import { uploadToVimeo } from '@/lib/vimeo'; // TODO: create this utility

const videoId = await uploadToVimeo('/path/to/video.mp4', {
  name: 'Lesson Title',
  privacy: 'unlisted',
});
```

### 5. Добавление видео к уроку

В админ-панели при создании урока:
```typescript
{
  videoUrl: `https://player.vimeo.com/video/${videoId}`,
  vimeoId: videoId,
  vimeoHash: hashCode, // если используется приватность по домену
}
```

---

## Cloudinary Image Storage

### 1. Создание Cloudinary аккаунта

1. Зарегистрируйтесь на https://cloudinary.com/users/register/free
2. Бесплатный план: 25GB storage, 25GB bandwidth/month

### 2. Получение credentials

1. Перейдите в Dashboard
2. Скопируйте:
   - Cloud Name
   - API Key
   - API Secret

### 3. Настройка в проекте

Добавьте в `.env`:
```bash
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="xxxxxx"
CLOUDINARY_API_SECRET="xxxxxx"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="learnify_courses"
```

### 4. Создание Upload Preset

1. Перейдите в Settings → Upload
2. Добавьте Upload Preset:
   - Name: `learnify_courses`
   - Signing Mode: **Unsigned**
   - Folder: `learnify/courses`
   - Transformations: 
     - Width: 1920
     - Height: 1080
     - Crop: limit
     - Quality: auto:good
     - Format: auto

### 5. Загрузка изображений

#### Client-side (в формах):
```typescript
import { uploadToCloudinaryClient } from '@/lib/upload';

const url = await uploadToCloudinaryClient(file);
```

#### Server-side (в API routes):
```typescript
import { uploadCourseThumbnail } from '@/lib/upload';

const url = await uploadCourseThumbnail(base64Image);
```

---

## SendGrid Email Service

### 1. Создание SendGrid аккаунта

1. Зарегистрируйтесь на https://signup.sendgrid.com/
2. Бесплатный план: 100 emails/day

### 2. Получение API Key

1. Перейдите в Settings → API Keys
2. Create API Key → Full Access
3. Скопируйте ключ (показывается только один раз!)

### 3. Настройка в проекте

Добавьте в `.env`:
```bash
SENDGRID_API_KEY="SG.xxxxxx"
SENDGRID_FROM_EMAIL="hello@yourdomain.com"
SENDGRID_FROM_NAME="Learnify Platform"
```

### 4. Верификация домена (для production)

1. Перейдите в Settings → Sender Authentication
2. Authenticate Your Domain
3. Следуйте инструкциям по добавлению DNS записей
4. Подтвердите верификацию

### 5. Настройка Email Templates (опционально)

1. Перейдите в Email API → Dynamic Templates
2. Создайте шаблоны для:
   - Welcome Email
   - Course Enrollment
   - Payment Receipt
   - Certificate Earned

### 6. Тестирование

```typescript
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail('test@example.com', 'Test User');
```

---

## Deployment to Timeweb Cloud

### 1. Подготовка проекта

```bash
# 1. Убедитесь что всё работает локально
npm run build

# 2. Создайте production .env файл
# Скопируйте все ключи из .env в Timeweb dashboard

# 3. Push в Git
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Создание приложения на Timeweb

1. Войдите в https://timeweb.cloud/
2. Перейдите в "Облачные приложения" → "Создать приложение"
3. Выберите:
   - **Фреймворк:** Node.js
   - **Версия:** 18.x или выше
   - **Repository:** Подключите ваш GitHub repo
   - **Branch:** main
4. Настройки сборки:
   ```
   Build Command: npm run build
   Start Command: npm start
   Port: 3000
   ```

### 3. Добавление Environment Variables

В настройках приложения добавьте все переменные из `.env`:
```
DATABASE_URL=...
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=...
STRIPE_SECRET_KEY=...
VIMEO_ACCESS_TOKEN=...
CLOUDINARY_API_KEY=...
SENDGRID_API_KEY=...
NEXT_PUBLIC_APP_URL=https://your-app.timeweb.cloud
```

### 4. Запуск миграций БД

После первого деплоя:
```bash
# В Timeweb консоли или через SSH
npx prisma migrate deploy
npx prisma db seed
```

### 5. Настройка домена (опционально)

1. В настройках приложения добавьте Custom Domain
2. Добавьте DNS записи у вашего регистратора:
   ```
   Type: CNAME
   Name: @
   Value: your-app.timeweb.cloud
   ```
3. Подождите propagation (до 48 часов)

### 6. Включение HTTPS

SSL сертификат выдаётся автоматически через Let's Encrypt.

---

## Testing

### 1. Проверка API Routes

```bash
# Курсы
curl https://your-app.com/api/courses

# Конкретный курс
curl https://your-app.com/api/courses/COURSE_ID

# Прогресс (нужен userId)
curl https://your-app.com/api/progress?userId=USER_ID
```

### 2. Проверка Memberstack Auth

1. Перейдите на `/login`
2. Зарегистрируйте тестового пользователя
3. Проверьте что session сохраняется
4. Перейдите на `/dashboard` (должен быть доступ)

### 3. Проверка Stripe Payments

1. Выберите платный курс
2. Нажмите "Buy Course"
3. Используйте тестовую карту `4242 4242 4242 4242`
4. Проверьте что:
   - Enrollment создался в БД
   - Email пришёл
   - Доступ к курсу открыт

### 4. Проверка прохождения курса

1. Откройте урок курса
2. Пройдите урок до конца
3. Отметьте как completed
4. Проверьте что progress обновился
5. Пройдите все уроки
6. Проверьте что сертификат выдался

### 5. Проверка email уведомлений

Проверьте что приходят emails:
- ✅ Welcome email при регистрации
- ✅ Enrollment email при записи на курс
- ✅ Payment receipt после оплаты
- ✅ Certificate email при завершении курса

---

## Troubleshooting

### Проблема: Prisma не подключается к БД

**Решение:**
```bash
# Проверьте DATABASE_URL
echo $DATABASE_URL

# Проверьте доступ к БД
npx prisma db pull

# Пересоздайте Prisma Client
npx prisma generate
```

### Проблема: Memberstack auth не работает

**Решение:**
1. Проверьте что Public Key правильный
2. Откройте Browser DevTools → Network
3. Проверьте загружается ли `memberstack.js`
4. Проверьте cookies: должен быть `_ms-mem`

### Проблема: Stripe webhooks не приходят

**Решение:**
1. Проверьте webhook endpoint URL
2. Проверьте что выбраны нужные events
3. Проверьте STRIPE_WEBHOOK_SECRET
4. В Stripe Dashboard → Webhooks смотрите logs
5. Используйте Stripe CLI для локального тестирования

### Проблема: Vimeo видео не загружаются

**Решение:**
1. Проверьте Privacy settings видео (должно быть Unlisted)
2. Добавьте ваш домен в Domain-level privacy
3. Проверьте что vimeoId правильный
4. Проверьте CORS настройки

### Проблема: Cloudinary upload fails

**Решение:**
1. Проверьте Upload Preset существует и Unsigned
2. Проверьте Cloud Name правильный
3. Проверьте размер файла (Free: max 10MB)
4. Проверьте формат файла (jpg, png, webp)

### Проблема: SendGrid emails не отправляются

**Решение:**
1. Проверьте API Key активен
2. Проверьте FROM email verified
3. Проверьте квоту (Free: 100/day)
4. Смотрите logs в SendGrid Dashboard → Activity

### Проблема: Deployment на Timeweb не работает

**Решение:**
1. Проверьте Build logs в Timeweb dashboard
2. Проверьте что `npm run build` работает локально
3. Проверьте Node.js версия (должна быть 18+)
4. Проверьте что все env variables добавлены
5. Проверьте что порт 3000 правильный

---

## 🎉 Готово!

После всех настроек ваша платформа полностью функциональна:

✅ **Аутентификация** через Memberstack  
✅ **База данных** с курсами и пользователями  
✅ **Платежи** через Stripe  
✅ **Видео уроки** через Vimeo  
✅ **Изображения** через Cloudinary  
✅ **Email уведомления** через SendGrid  
✅ **Хостинг** на Timeweb Cloud  

### Следующие шаги:

1. ✅ Загрузите реальные курсы через админ-панель
2. ✅ Настройте domain и SSL
3. ✅ Добавьте Google Analytics
4. ✅ Настройте мониторинг (Sentry)
5. ✅ Запустите маркетинг!

**Удачи с запуском! 🚀**
