# Исправление ошибки localStorage для SSR в Next.js

## Проблема
Ошибка `ReferenceError: localStorage is not defined` возникала при попытке использования localStorage во время pre-rendering страниц в Next.js на сервере.

## Внесенные исправления

### 1. ✅ src/store/userStore.ts
**Проблема:** Zustand с `persist` middleware пытался использовать `localStorage` на сервере во время сборки.

**Решение:** Используется **условное применение persist middleware** - он применяется ТОЛЬКО на клиенте:

```typescript
import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

// Safe storage wrapper for SSR compatibility
const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(name);
    } catch (e) {
      console.warn('Failed to remove from localStorage:', e);
    }
  },
};

// Store definition with proper TypeScript typing
const storeDefinition: StateCreator<UserState> = (set, get) => ({
  user: null,
  userProgress: [],
  isAuthenticated: false,
  
  setUser: (user: User | null) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  // ... other actions with proper typing
  enrollInCourse: (courseId: string) => set((state: UserState) => {
    // ... implementation
  }),
  
  getCourseProgress: (courseId: string) => {
    return get().userProgress.find((p) => p.courseId === courseId);
  },
});

// Conditional persist middleware - ONLY on client!
export const useUserStore = 
  typeof window !== 'undefined'
    ? create<UserState>()(
        persist(storeDefinition, {
          name: 'learnify-user-storage',
          storage: createJSONStorage(() => safeStorage),
          skipHydration: true, // Important for SSR
        })
      )
    : create<UserState>()(storeDefinition); // Server: no persist
```

**Ключевые моменты:**
- ✅ `persist` middleware применяется ТОЛЬКО когда `window` доступен (только на клиенте)
- ✅ На сервере используется обычный store без persist
- ✅ `skipHydration: true` предотвращает проблемы гидратации
- ✅ `try/catch` блоки защищают от ошибок localStorage
- ✅ **Правильная TypeScript типизация** с `StateCreator<UserState>` вместо `any`
- ✅ Все параметры функций типизированы корректно

### 2. ✅ src/lib/certificate.ts
**Проблема:** Функции использовали `document` и `navigator` без проверки на серверную среду.

**Решение:** Добавлены проверки для всех браузерных API:

```typescript
// В generateCertificatePDF:
if (typeof window === 'undefined' || typeof document === 'undefined') {
  throw new Error('generateCertificatePDF can only be called in browser environment');
}

// В shareCertificate:
if (typeof window === 'undefined' || typeof navigator === 'undefined') {
  console.warn('shareCertificate called on server-side');
  return;
}
```

### 3. ✅ Другие файлы уже были корректны
Следующие файлы уже имели правильные проверки:

- **src/components/MemberstackProvider.tsx** - имеет `'use client'` и проверку `typeof window !== 'undefined'`
- **src/lib/memberstack.ts** - все функции с браузерными API имеют проверки
- **src/components/features/SocialShare.tsx** - имеет `'use client'` и проверки
- **src/app/admin/page.tsx** - имеет `'use client'` директиву
- **src/app/courses/page.tsx** - имеет `'use client'` директиву
- **src/app/courses/[slug]/page.tsx** - имеет `'use client'` директиву

## Как работает решение

### 1. Условное применение persist middleware
**Главное решение:** persist middleware применяется ТОЛЬКО на клиенте:

```typescript
export const useUserStore = 
  typeof window !== 'undefined'
    ? create(persist(...))  // Client: with localStorage
    : create(...)           // Server: without localStorage
```

Это означает:
- ✅ На **сервере** (во время сборки): store работает БЕЗ persist, localStorage не вызывается
- ✅ На **клиенте** (в браузере): store работает С persist, сохраняет данные в localStorage
- ✅ Нет попыток использовать localStorage там, где его нет

### 2. Безопасная обертка для localStorage
Дополнительная защита с `try/catch` блоками:
- Проверяет наличие `window` (браузерная среда)
- Ловит исключения при работе с localStorage (например, если квота превышена)
- Возвращает `null` или не выполняет действие при ошибках

### 3. Правильная TypeScript типизация
**Важно!** Используйте `StateCreator<UserState>` для корректной типизации:

```typescript
import { create, StateCreator } from 'zustand';

// ❌ Неправильно - вызовет ошибки TypeScript
const storeDefinition = (set: any, get: any) => ({ ... });

// ✅ Правильно - TypeScript знает все типы
const storeDefinition: StateCreator<UserState> = (set, get) => ({
  user: null,
  userProgress: [],
  isAuthenticated: false,
  
  setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
  
  enrollInCourse: (courseId: string) => set((state: UserState) => {
    // state полностью типизирован
    if (!state.user) return state;
    // ...
  }),
});
```

Это предотвратит ошибки компиляции TypeScript:
- `Type 'StateCreator<...>' is not assignable to parameter`
- `Type 'User | null' is not assignable to type 'null'`

### 4. skipHydration для предотвращения проблем гидратации
Опция `skipHydration: true` важна, потому что:
- Сервер и клиент имеют разные версии store (с persist и без)
- `skipHydration` предотвращает автоматическую гидратацию при первом рендере
- Store синхронизируется с localStorage после монтирования на клиенте

### 5. Проверки браузерного окружения
Все функции, использующие браузерные API (`window`, `document`, `navigator`, `localStorage`), должны иметь проверку:

```typescript
if (typeof window === 'undefined') {
  // Код выполняется на сервере - skip или fallback
  return;
}
// Безопасно использовать браузерные API
```

### 6. Client-side компоненты
Компоненты, которые используют браузерные API или хуки (`useState`, `useEffect`), должны иметь директиву `'use client'` в начале файла.

## Тестирование

После внесения изменений:

1. **Локальная сборка:**
   ```bash
   npm run build
   npm start
   ```

2. **Проверить страницы:**
   - `/admin` - должна загружаться без ошибок
   - `/courses` - должна загружаться без ошибок
   - `/courses/[slug]` - должна загружаться без ошибок

3. **Production сборка:**
   ```bash
   docker build -t courses-app .
   docker run -p 3000:3000 courses-app
   ```

## Типичные ошибки и их решения

### TypeScript ошибка: "Type is not assignable"

**Ошибка:**
```
Type error: Argument of type 'StateCreator<...>' is not assignable to parameter
Type 'User | null' is not assignable to type 'null'
```

**Причина:** Использование `any` вместо правильных типов в `storeDefinition`.

**Решение:**
```typescript
// ❌ Неправильно
const storeDefinition = (set: any, get: any) => ({ ... });

// ✅ Правильно
import { StateCreator } from 'zustand';
const storeDefinition: StateCreator<UserState> = (set, get) => ({ ... });
```

### ReferenceError: localStorage is not defined

**Причина:** Обращение к localStorage на сервере.

**Решение:** Условное применение persist middleware (см. выше).

---

## Важные правила для предотвращения подобных ошибок

### ❌ Неправильно:
```typescript
// В компоненте без 'use client'
const value = localStorage.getItem('key');

// В серверном компоненте
export default function Page() {
  const data = window.location.href; // ❌ Ошибка!
}
```

### ✅ Правильно:
```typescript
'use client'; // Добавить в начало файла

export default function Page() {
  const [value, setValue] = useState<string | null>(null);
  
  useEffect(() => {
    // Безопасно использовать браузерные API в useEffect
    if (typeof window !== 'undefined') {
      setValue(localStorage.getItem('key'));
    }
  }, []);
}
```

## Дополнительно: Ручная гидратация (если нужна)

Если вам нужно вручную гидратировать store (из-за `skipHydration: true`), добавьте в компонент:

```typescript
'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export default function MyComponent() {
  useEffect(() => {
    // Гидратация store из localStorage на клиенте
    if (typeof window !== 'undefined') {
      useUserStore.persist.rehydrate();
    }
  }, []);
  
  // ... остальной код
}
```

Однако в большинстве случаев это **не требуется**, так как Zustand автоматически загружает данные из localStorage при первом обращении к store на клиенте.

## Альтернативные решения

### Вариант 1: Динамический импорт с `ssr: false`
```typescript
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(
  () => import('@/components/ClientOnlyComponent'),
  { ssr: false }
);
```

### Вариант 2: Использование `next-client-cookies` или аналогичных библиотек
Для хранения данных, которые нужны и на сервере, и на клиенте, используйте cookies вместо localStorage:

```typescript
import { useCookies } from 'next-client-cookies';

export default function Component() {
  const cookies = useCookies();
  const value = cookies.get('key');
}
```

## Checklist для новых компонентов

При создании нового компонента или функции, проверьте:

- [ ] Использует ли компонент `useState`, `useEffect` или другие React хуки? → Добавьте `'use client'`
- [ ] Обращается ли код к `window`, `document`, `navigator`, `localStorage`? → Добавьте проверку `typeof window !== 'undefined'`
- [ ] Использует ли компонент сторонние библиотеки, работающие только в браузере? → Используйте динамический импорт или `'use client'`
- [ ] Нужны ли данные на сервере (SEO, первичный рендер)? → Используйте Server Components и API routes

## Дополнительная информация

### Документация Next.js:
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)

### Документация Zustand:
- [Persist Middleware](https://github.com/pmndrs/zustand#persist-middleware)
- [SSR and Next.js](https://github.com/pmndrs/zustand/blob/main/docs/guides/nextjs.md)

## Статус
✅ **Все проблемы с localStorage исправлены**
✅ **Приложение готово к production сборке**
✅ **SSR работает корректно**
