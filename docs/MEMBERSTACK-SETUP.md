# 🔐 Memberstack + Stripe Setup Guide

Пошаговая инструкция по настройке Memberstack с интеграцией Stripe для платформы Learnify.

---

## 📋 Что нужно сделать

1. ✅ Создать Memberstack account
2. ✅ Подключить Stripe к Memberstack
3. ✅ Создать Plans для курсов
4. ✅ Настроить webhooks
5. ✅ Добавить credentials в проект

---

## 1️⃣ Создание Memberstack Account

1. Перейдите на [Memberstack.com](https://www.memberstack.com)
2. Создайте account (доступен бесплатный план для разработки)
3. Создайте новый App для вашего проекта

---

## 2️⃣ Подключение Stripe

### В Memberstack Dashboard:

1. Перейдите в **Settings → Payments**
2. Нажмите **Connect with Stripe**
3. Авторизуйтесь в Stripe (или создайте Stripe account)
4. Подтвердите подключение

✅ **Готово!** Memberstack автоматически синхронизируется со Stripe.

### Что происходит автоматически:
- Memberstack создаёт Stripe Customer для каждого пользователя
- Платежи обрабатываются через Stripe Checkout
- Webhook events от Stripe передаются через Memberstack

---

## 3️⃣ Создание Plans (Курсов)

В Memberstack каждый платный курс = один Plan.

### Создание Plan:

1. Перейдите в **Plans → Create Plan**
2. Заполните информацию:

```
Name: Creative Writing Course
Price: $49.99
Type: One-time payment (или Subscription для подписок)
Description: Full access to Creative Writing course
```

3. Сохраните Plan
4. **Скопируйте Plan ID** (например: `pln_abc123def456`)

### Связывание Plan с курсом:

В вашей БД добавьте `memberstackPlanId` к курсу:

```sql
UPDATE courses 
SET memberstack_plan_id = 'pln_abc123def456' 
WHERE slug = 'creative-writing';
```

Или через Admin Panel при создании курса.

### Для бесплатных курсов:
- Не создавайте Plan
- Оставьте `memberstackPlanId = null`
- Enrollment будет создаваться напрямую

---

## 4️⃣ Настройка Webhooks

Memberstack отправляет webhooks когда происходят события (покупка, отмена и т.д.).

### В Memberstack Dashboard:

1. Перейдите в **Settings → Webhooks**
2. Нажмите **Add Webhook**
3. Укажите URL:
   ```
   https://yourdomain.com/api/webhooks/memberstack
   ```
   
   Для локальной разработки используйте **ngrok** или **Memberstack CLI**.

4. Выберите события:
   - ✅ `member.plan.purchased`
   - ✅ `member.plan.cancelled`
   - ✅ `member.plan.updated`

5. Сохраните и скопируйте **Webhook Secret**

### Добавьте secret в .env:
```bash
MEMBERSTACK_WEBHOOK_SECRET="whsec_your_secret_here"
```

---

## 5️⃣ Получение API Keys

### Public Key (для frontend):

1. В Memberstack Dashboard → **Settings → API Keys**
2. Скопируйте **Public Key**
3. Добавьте в `.env`:
   ```bash
   NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY="pk_sb_abc123..."
   ```

### Secret Key (для backend):

1. В том же разделе скопируйте **Secret Key**
2. Добавьте в `.env`:
   ```bash
   MEMBERSTACK_SECRET_KEY="sk_sb_xyz789..."
   ```

⚠️ **Важно:** Secret Key никогда не показывайте в frontend!

---

## 6️⃣ Тестирование

### Test Mode:
- Memberstack автоматически использует Stripe Test Mode
- Используйте тестовые карты Stripe:
  - **Successful:** `4242 4242 4242 4242`
  - **Declined:** `4000 0000 0000 0002`

### Локальное тестирование webhooks:

1. Установите Memberstack CLI:
   ```bash
   npm install -g @memberstack/cli
   ```

2. Запустите webhook forwarding:
   ```bash
   memberstack webhooks forward --to http://localhost:3000/api/webhooks/memberstack
   ```

3. Теперь webhooks будут приходить на ваш локальный сервер!

---

## 7️⃣ Проверка интеграции

### Checklist:

- [ ] Memberstack Public Key добавлен в `.env`
- [ ] Memberstack Secret Key добавлен в `.env`
- [ ] Stripe подключен в Memberstack Dashboard
- [ ] Plans созданы для платных курсов
- [ ] `memberstackPlanId` добавлен в Course records
- [ ] Webhook URL настроен
- [ ] Webhook Secret добавлен в `.env`

### Тестовый flow:

1. Зарегистрируйтесь как новый пользователь
2. Перейдите на страницу платного курса
3. Нажмите "Enroll" (должен открыться Stripe Checkout)
4. Введите тестовую карту `4242 4242 4242 4242`
5. Завершите покупку
6. Проверьте что:
   - Enrollment создан в БД
   - Payment record создан
   - Email отправлен
   - У вас есть доступ к курсу

---

## 8️⃣ Production Setup

### Переключение на Production:

1. В Memberstack Dashboard переключите **Mode** на **Production**
2. В Stripe Dashboard переключитесь на **Live Mode**
3. Обновите API keys в `.env` на production ключи
4. Обновите webhook URL на production домен

### Production Checklist:

- [ ] Production Memberstack keys
- [ ] Stripe Live Mode enabled
- [ ] Production webhook URL
- [ ] SSL certificate установлен (для HTTPS)
- [ ] Email настройки проверены (SendGrid production)

---

## 💡 Примеры использования в коде

### Frontend - Покупка курса:
```typescript
import { purchaseCourseWithMemberstack } from '@/lib/memberstack';

const handleEnroll = async () => {
  const result = await purchaseCourseWithMemberstack(
    course.memberstackPlanId,
    course.id
  );
  
  if (result.success) {
    toast.success('Purchase successful!');
  }
};
```

### Backend - Webhook handler:
```typescript
// /api/webhooks/memberstack/route.ts
if (event.type === 'member.plan.purchased') {
  await prisma.enrollment.create({
    data: {
      userId: event.data.memberId,
      courseId: event.data.metadata.courseId,
      planConnectionId: event.data.planConnectionId
    }
  });
}
```

---

## 🔧 Troubleshooting

### Проблема: Webhook не приходит
**Решение:** 
- Проверьте URL webhook в Memberstack Dashboard
- Убедитесь что выбраны правильные события
- Проверьте логи в Memberstack Dashboard → Webhooks → Logs

### Проблема: Stripe checkout не открывается
**Решение:**
- Проверьте что Stripe подключен в Memberstack
- Убедитесь что Plan существует и активен
- Проверьте что `memberstackPlanId` правильный

### Проблема: Payment успешен, но enrollment не создаётся
**Решение:**
- Проверьте webhook handler в `/api/webhooks/memberstack`
- Проверьте что `courseId` передаётся в metadata
- Проверьте логи сервера на ошибки

---

## 📚 Документация

- [Memberstack Docs](https://docs.memberstack.com/)
- [Memberstack + Stripe](https://docs.memberstack.com/hc/en-us/articles/4406868467227-Stripe-Integration)
- [Memberstack Webhooks](https://docs.memberstack.com/hc/en-us/articles/4406868541979-Webhooks)
- [Stripe Test Cards](https://stripe.com/docs/testing)

---

## ✅ Готово!

После выполнения всех шагов ваша платформа готова принимать платежи через Memberstack + Stripe!

**Преимущества:**
- ✅ Не нужны прямые Stripe API keys
- ✅ PCI compliance обрабатывается Memberstack
- ✅ Автоматическая синхронизация user + payment data
- ✅ Встроенный Customer Portal
- ✅ Проще в настройке и поддержке

**Поддержка:** [Memberstack Support](https://www.memberstack.com/support)
