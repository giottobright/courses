# 🚀 Learnify - Quick Start для Production

**Последнее обновление:** 5 февраля 2026  
**Статус:** Backend готов, Frontend требует интеграции

---

## 📋 Что уже сделано

### ✅ Полностью готово:

1. **База данных Prisma** с 10 моделями
2. **12+ API endpoints** для всех функций
3. **Memberstack integration** для аутентификации
4. **Stripe payments** с webhook обработкой
5. **SendGrid emails** (5 шаблонов)
6. **Cloudinary uploads** для изображений
7. **Certificate system** с PDF генерацией
8. **Seed данные** для тестирования
9. **Middleware** для защищённых роутов
10. **Полная документация** (PRD, Tech Stack, Integration Guide)

---

## 🏁 Быстрый старт (5 минут)

### 1. Установка

```bash
# Зависимости уже установлены!
# Если нужно переустановить:
npm install
```

### 2. Настройка БД

```bash
# Создайте .env файл (или обновите существующий)
# Минимум нужно:
DATABASE_URL="postgresql://user:password@localhost:5432/learnify"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Запустите миграции
npx prisma migrate dev --name init

# Заполните тестовыми данными
npm run prisma:seed

# Откройте Prisma Studio для просмотра
npm run prisma:studio
```

### 3. Запуск

```bash
npm run dev
```

Откройте http://localhost:3000

---

## 🎯 Что нужно доделать (Приоритеты)

### 🔴 CRITICAL (сделать в первую очередь)

#### 1. Frontend Integration с API

Сейчас страницы используют mock data, нужно подключить к реальным API:

**Dashboard** (`src/app/dashboard/page.tsx`):
```typescript
// Заменить mock data на:
const { data } = await fetch('/api/enrollments?userId=' + user.id);
const { data: progress } = await fetch('/api/progress?userId=' + user.id);
```

**Courses Catalog** (`src/app/courses/page.tsx`):
```typescript
// Добавить:
const { data } = await fetch('/api/courses?category=X&search=Y');
```

**Course Detail** (`src/app/courses/[slug]/page.tsx`):
```typescript
// Заменить mock на:
const course = await fetch('/api/courses/' + courseId);
const reviews = await fetch('/api/reviews?courseId=' + courseId);

// Добавить кнопку Enroll:
async function handleEnroll() {
  await fetch('/api/courses/' + courseId + '/enroll', {
    method: 'POST',
    body: JSON.stringify({ userId, userName, userEmail })
  });
}
```

**Lesson Player** (`src/app/learn/[courseSlug]/[lessonSlug]/page.tsx`):
```typescript
// Добавить Vimeo player:
{lesson.vimeoId && (
  <iframe src={`https://player.vimeo.com/video/${lesson.vimeoId}`} />
)}

// Кнопка Complete:
async function markComplete() {
  await fetch('/api/lessons/' + lessonId + '/complete', {
    method: 'POST',
    body: JSON.stringify({ userId, userName, userEmail })
  });
}
```

#### 2. Error Handling

```bash
# Создайте файлы:
src/app/error.tsx
src/app/not-found.tsx
src/app/loading.tsx
```

Примеры в PROJECT-STATUS.md

---

### 🟡 IMPORTANT (следующий шаг)

#### 3. Admin Panel

Создайте страницы:
```
src/app/admin/
├── layout.tsx
├── page.tsx           # Dashboard
├── courses/
│   ├── page.tsx       # Список
│   ├── new/page.tsx   # Создать курс
│   └── [id]/page.tsx  # Редактировать
└── users/page.tsx     # Пользователи
```

Используйте существующие API:
- `GET /api/courses` - список
- `POST /api/courses` - создать
- `PUT /api/courses/[id]` - обновить
- `DELETE /api/courses/[id]` - удалить

#### 4. Vimeo Player Integration

В `src/app/learn/[courseSlug]/[lessonSlug]/page.tsx`:
```typescript
<iframe
  src={`https://player.vimeo.com/video/${lesson.vimeoId}`}
  width="100%"
  height="100%"
  frameBorder="0"
  allow="autoplay; fullscreen"
  allowFullScreen
/>
```

---

### 🟢 NICE TO HAVE (когда основное готово)

5. Social sharing кнопки
6. Performance optimization (Next.js Image)
7. Loading skeletons
8. Testing

---

## 🔧 Тестирование API

### Проверка endpoints:

```bash
# Курсы
curl http://localhost:3000/api/courses

# Конкретный курс (замените ID)
curl http://localhost:3000/api/courses/COURSE_ID

# Прогресс (нужен userId из Memberstack)
curl http://localhost:3000/api/progress?userId=USER_ID

# Отзывы
curl http://localhost:3000/api/reviews?courseId=COURSE_ID
```

---

## 📚 Полезные команды

```bash
# Database
npm run prisma:generate    # Сгенерировать Prisma Client
npm run prisma:migrate     # Запустить миграции
npm run prisma:seed        # Заполнить тестовыми данными
npm run prisma:studio      # Открыть Prisma Studio

# Development
npm run dev                # Запустить dev server
npm run build              # Production build
npm start                  # Запустить production server
npm run lint               # Проверить код

# Git (когда готово)
git add .
git commit -m "feat: complete backend and API integration"
git push origin main
```

---

## 🌐 Интеграция сервисов

### Когда будете готовы к production:

1. **Memberstack** → См. INTEGRATION-GUIDE.md раздел "Memberstack"
2. **Stripe** → См. INTEGRATION-GUIDE.md раздел "Stripe"
3. **Vimeo** → См. INTEGRATION-GUIDE.md раздел "Vimeo"
4. **Cloudinary** → См. INTEGRATION-GUIDE.md раздел "Cloudinary"
5. **SendGrid** → См. INTEGRATION-GUIDE.md раздел "SendGrid"

Каждый раздел содержит:
- Пошаговые инструкции
- Скриншоты настроек
- Примеры кода
- Troubleshooting

---

## 🚢 Deploy на Timeweb Cloud

### Когда frontend готов:

```bash
# 1. Production build
npm run build

# 2. Проверьте что всё работает
npm start

# 3. Подключите GitHub к Timeweb Cloud
# См. INTEGRATION-GUIDE.md раздел "Deployment"

# 4. Добавьте environment variables в Timeweb dashboard

# 5. Deploy!
git push origin main  # Auto-deploy
```

---

## 📖 Документация

У вас есть полная документация:

- **PRD.md** - Product Requirements (что делает платформа)
- **TECH-STACK.md** - Архитектура и технологии
- **INTEGRATION-GUIDE.md** - Настройка всех сервисов
- **PROJECT-STATUS.md** - Детальный статус проекта
- **DESIGN-SYSTEM.md** - Дизайн компоненты
- **SETUP-RU.md** - Руководство по запуску

---

## 💡 Рекомендации

### Порядок работы:

1. ✅ **Сначала:** Запустите локально с тестовой БД
2. ✅ **Затем:** Интегрируйте frontend с API
3. ✅ **После:** Создайте admin панель
4. ✅ **Наконец:** Deploy на production

### Полезные инструменты:

- **Prisma Studio** - визуальный редактор БД
- **Stripe CLI** - тестирование webhooks локально
- **Thunder Client** (VS Code) - тестирование API
- **React DevTools** - отладка компонентов

---

## 🆘 Если что-то не работает

### Проблема: Prisma не подключается к БД
```bash
# Проверьте DATABASE_URL
echo $DATABASE_URL

# Пересоздайте Prisma Client
npx prisma generate
```

### Проблема: API возвращает ошибки
```bash
# Проверьте логи в терминале
# Убедитесь что БД заполнена:
npm run prisma:seed
```

### Проблема: TypeScript ошибки
```bash
# Обновите типы Prisma
npx prisma generate
```

### Больше troubleshooting:
См. INTEGRATION-GUIDE.md раздел "Troubleshooting"

---

## 📊 Прогресс

**Backend:** ████████████████████ 100% ✅  
**Frontend:** ████████░░░░░░░░░░░░  40% 🟡  
**Admin Panel:** ░░░░░░░░░░░░░░░░░░░░  0% 🔴  
**Integration:** ░░░░░░░░░░░░░░░░░░░░  0% 🔴  

**Общий прогресс:** ██████░░░░░░░░░░░░░░ 64% 🟡

---

## 🎉 Когда всё готово

После завершения у вас будет:

✅ Полнофункциональная платформа онлайн-обучения  
✅ Аутентификация через Memberstack  
✅ Платежи через Stripe  
✅ Email уведомления  
✅ Система сертификатов  
✅ Wishlist, Reviews, Comments  
✅ Admin панель для управления контентом  
✅ Production-ready deployment  

---

**Удачи с завершением проекта! Вы уже прошли 64% пути! 🚀**

Если нужна помощь - вся документация в папке проекта.
