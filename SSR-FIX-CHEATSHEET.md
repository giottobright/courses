# 🚀 Шпаргалка: localStorage + SSR в Next.js

## ⚡ Быстрая проверка перед деплоем

```bash
# 1. Очистка
rm -rf .next

# 2. Сборка
npm run build

# 3. Запуск
npm start
```

**Ожидаемый результат:** Никаких ошибок `localStorage is not defined` ✅

---

## 🔧 Основное исправление

### ❌ Неправильно (вызывает ошибку)

```typescript
export const useUserStore = create<State>()(
  persist(
    (set) => ({ ... }),
    { name: 'storage', storage: createJSONStorage(() => localStorage) }
  )
);
```

### ✅ Правильно (работает с SSR)

```typescript
const storeDefinition = (set, get) => ({ /* ... */ });

export const useUserStore = 
  typeof window !== 'undefined'
    ? create<State>()(persist(storeDefinition, {
        name: 'storage',
        storage: createJSONStorage(() => safeStorage),
        skipHydration: true
      }))
    : create<State>()(storeDefinition);
```

---

## 📝 Правила для избежания ошибок

### ✅ Используйте `'use client'` для:
- Компонентов с `useState`, `useEffect`
- Компонентов с обращением к `window`, `document`, `localStorage`
- Интерактивных компонентов (кнопки, формы)

### ✅ Проверяйте окружение:
```typescript
// В компонентах
useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('key', 'value');
  }
}, []);

// В утилитах
function myFunction() {
  if (typeof window === 'undefined') return null;
  return window.location.href;
}
```

### ✅ Для Zustand с persist:
1. Условное применение persist (только на клиенте)
2. Используйте `skipHydration: true`
3. Безопасная обертка storage с try/catch

---

## 🐛 Типичные ошибки и решения

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `localStorage is not defined` | Обращение к localStorage на сервере | Условная проверка `typeof window` |
| `window is not defined` | Обращение к window на сервере | Условная проверка + `'use client'` |
| `document is not defined` | Обращение к document на сервере | Условная проверка + `'use client'` |
| Hydration mismatch | Разное состояние на сервере и клиенте | `skipHydration: true` в persist |

---

## 🧪 Быстрый тест

### 1. Проверка сборки:
```bash
npm run build
```
- ✅ Должно завершиться БЕЗ ошибок
- ✅ Все страницы должны собраться

### 2. Проверка страниц:
- ✅ `/admin`
- ✅ `/courses`
- ✅ `/dashboard`
- ✅ `/wishlist`

### 3. Проверка консоли браузера:
- ❌ Не должно быть ошибок localStorage
- ❌ Не должно быть ошибок window/document

---

## 🔍 Отладка

### Если ошибка все еще есть:

1. **Найдите проблемный файл:**
   ```
   ReferenceError: localStorage is not defined
       at /app/.next/server/chunks/6619.js:1:1795
   ```
   Ищите импорты в `src/store/userStore.ts` и смежных файлах

2. **Проверьте условие:**
   ```typescript
   // Должно быть ДО создания store
   typeof window !== 'undefined'
   ```

3. **Очистите кеш:**
   ```bash
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build
   ```

---

## 📦 Структура исправления

```
src/
  store/
    userStore.ts       ← Главное исправление (условный persist)
  lib/
    certificate.ts     ← Проверки window/document
  components/
    MemberstackProvider.tsx  ← Уже имеет 'use client'
    features/
      SocialShare.tsx        ← Уже имеет 'use client'
  app/
    admin/
      page.tsx         ← Уже имеет 'use client'
      settings/page.tsx ← Уже имеет 'use client'
    courses/page.tsx   ← Уже имеет 'use client'
    dashboard/page.tsx ← Уже имеет 'use client'
    wishlist/page.tsx  ← Уже имеет 'use client'
```

---

## 🎯 Чеклист готовности

Перед деплоем проверьте:

- [ ] `npm run build` проходит без ошибок
- [ ] Все страницы открываются в браузере
- [ ] Консоль браузера без ошибок localStorage
- [ ] localStorage сохраняет данные (проверьте в DevTools)
- [ ] Docker сборка успешна (опционально)

---

## 🚀 Команды для деплоя

```bash
# 1. Коммит изменений
git add .
git commit -m "fix: resolve localStorage SSR compatibility"

# 2. Пуш на удаленный репозиторий
git push origin main

# 3. TimeWeb автоматически пересоберет приложение
```

---

## 📚 Документация

- **Детали:** `SSR-LOCALSTORAGE-FIX.md`
- **Быстрый старт:** `QUICK-FIX-GUIDE.md`
- **Тестирование:** `TEST-BUILD-LOCALLY.md`
- **История изменений:** `CHANGELOG-SSR-FIX.md`
- **Эта шпаргалка:** `SSR-FIX-CHEATSHEET.md`

---

**Версия:** 2.0.0  
**Дата:** 12.02.2026  
**Статус:** ✅ Production Ready
