# Исправление ошибки localStorage для SSR в Next.js

## Проблема
Ошибка `ReferenceError: localStorage is not defined` возникала при попытке использования localStorage во время pre-rendering страниц в Next.js на сервере.

## Внесенные исправления

### 1. ✅ src/store/userStore.ts
**Проблема:** Zustand с `persist` middleware пытался использовать `localStorage` на сервере.

**Решение:** Создана безопасная обертка для storage с проверкой на клиентскую среду:

```typescript
// Safe storage wrapper for SSR compatibility
const safeStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};

// Использование в Zustand store:
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({ ... }),
    {
      name: 'learnify-user-storage',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
```

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

### 1. Безопасная обертка для localStorage
Вместо прямого обращения к `localStorage`, используется безопасная обертка, которая:
- Проверяет наличие `window` (браузерная среда)
- Возвращает `null` или не выполняет действие, если код выполняется на сервере
- Работает нормально в браузере

### 2. Проверки браузерного окружения
Все функции, использующие браузерные API (`window`, `document`, `navigator`, `localStorage`), должны иметь проверку:

```typescript
if (typeof window === 'undefined') {
  // Код выполняется на сервере - skip или fallback
  return;
}
// Безопасно использовать браузерные API
```

### 3. Client-side компоненты
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
