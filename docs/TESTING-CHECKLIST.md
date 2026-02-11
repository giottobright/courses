# 🧪 Testing Checklist - Memberstack Integration

Полный чеклист для тестирования обновлённой платформы с Memberstack + Stripe.

---

## ✅ Pre-Flight Check

### Environment Setup
- [ ] `.env` файл создан и заполнен
- [ ] `NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY` установлен
- [ ] `MEMBERSTACK_SECRET_KEY` установлен
- [ ] `MEMBERSTACK_WEBHOOK_SECRET` установлен
- [ ] Database connection работает
- [ ] Все остальные API keys добавлены (Vimeo, Cloudinary, SendGrid)

### Database Setup
- [ ] Prisma migrations выполнены: `npm run prisma:migrate`
- [ ] Seed data загружен: `npm run prisma:seed` (опционально)
- [ ] Courses имеют `memberstackPlanId` (для платных)
- [ ] Categories созданы
- [ ] Test users созданы (если нужно)

### Memberstack Setup
- [ ] Memberstack account создан
- [ ] Stripe подключен в Memberstack Dashboard
- [ ] Plans созданы для курсов
- [ ] Plan IDs добавлены в Course records
- [ ] Webhook URL настроен: `https://yourdomain.com/api/webhooks/memberstack`
- [ ] Webhook events выбраны: `member.plan.purchased`, `member.plan.cancelled`

---

## 🔬 Unit Tests

### 1. Memberstack Functions

**File:** `src/lib/memberstack.ts`

- [ ] `getCurrentMemberstackUser()` возвращает user или null
- [ ] `purchaseCourseWithMemberstack()` возвращает success result
- [ ] `hasUserPurchasedCourse()` проверяет plan connections
- [ ] `getUserPurchasedPlans()` возвращает массив plans
- [ ] `getMemberstackInstance()` возвращает Memberstack DOM instance

**Тест:**
```typescript
import { purchaseCourseWithMemberstack } from '@/lib/memberstack';

const result = await purchaseCourseWithMemberstack('pln_test123', 'course_123');
console.log('Purchase result:', result);
// Expected: { success: true, planConnection: {...} }
```

---

## 🧩 Integration Tests

### 2. Authentication Flow

- [ ] **Регистрация:**
  - Открыть `/signup`
  - Ввести email, password, name
  - Проверить redirect на dashboard
  - Проверить что user создан в Memberstack

- [ ] **Вход:**
  - Открыть `/login`
  - Ввести credentials
  - Проверить redirect
  - Проверить session cookie

- [ ] **Выход:**
  - Нажать Logout
  - Проверить что user выведен из системы
  - Проверить redirect на homepage

---

### 3. Course Browsing

- [ ] **Homepage:**
  - Открыть `/`
  - Проверить что курсы отображаются
  - Проверить navigation links

- [ ] **Courses Catalog:**
  - Открыть `/courses`
  - Проверить search функцию
  - Проверить фильтры (category, price, level)
  - Проверить сортировку
  - Проверить skeleton loaders

- [ ] **Course Detail:**
  - Открыть `/courses/[slug]`
  - Проверить отображение информации
  - Проверить lessons curriculum
  - Проверить reviews section
  - Проверить instructor info

---

### 4. Free Course Enrollment

**Сценарий:** Запись на бесплатный курс

- [ ] Открыть бесплатный курс (price = 0)
- [ ] Нажать "Enroll Now"
- [ ] Проверить что enrollment создан:
  ```sql
  SELECT * FROM enrollments WHERE user_id = 'test_user' AND course_id = 'course_id';
  ```
- [ ] Проверить что нет Payment record (для бесплатных)
- [ ] Проверить email notification отправлен
- [ ] Проверить доступ к урокам: `/learn/[course]/[lesson]`
- [ ] Проверить что кнопка изменилась на "Continue Learning"

**Expected result:** ✅ Enrollment создан без платежа

---

### 5. Paid Course Purchase (Memberstack + Stripe)

**Сценарий:** Покупка платного курса

#### A. Checkout Flow

- [ ] Открыть платный курс (price > 0)
- [ ] Проверить что отображается `memberstackPlanId`
- [ ] Нажать "Enroll Now"
- [ ] Проверить что открывается Stripe Checkout (через Memberstack)
- [ ] Заполнить тестовую карту:
  - Card: `4242 4242 4242 4242`
  - CVC: `123`
  - Date: `12/34`
  - ZIP: `12345`
- [ ] Нажать "Pay"

#### B. Post-Purchase Verification

- [ ] **Redirect:** Проверить redirect обратно на course page
- [ ] **Webhook:** Проверить что webhook пришёл:
  ```bash
  # В логах сервера:
  Memberstack webhook received: member.plan.purchased
  ```
- [ ] **Enrollment:** Проверить в БД:
  ```sql
  SELECT * FROM enrollments WHERE user_id = 'test_user' AND course_id = 'course_id';
  -- Should have planConnectionId
  ```
- [ ] **Payment:** Проверить Payment record:
  ```sql
  SELECT * FROM payments WHERE user_id = 'test_user' AND course_id = 'course_id';
  -- Should have status = COMPLETED
  ```
- [ ] **Course Count:** Проверить что `studentsCount` увеличился:
  ```sql
  SELECT students_count FROM courses WHERE id = 'course_id';
  ```
- [ ] **Emails:** Проверить что отправлены:
  - Enrollment confirmation email
  - Payment receipt email
- [ ] **Access:** Проверить доступ к урокам
- [ ] **Dashboard:** Проверить что курс появился в dashboard

**Expected result:** ✅ Все records созданы, emails отправлены, доступ открыт

---

### 6. Lesson Player

**Сценарий:** Просмотр и completion урока

- [ ] Открыть `/learn/[course]/[lesson]`
- [ ] Проверить Vimeo player отображается
- [ ] Проверить sidebar с lessons
- [ ] Нажать "Mark as Complete"
- [ ] Проверить что lesson отмечен completed
- [ ] Проверить что progress обновился в БД:
  ```sql
  SELECT progress FROM enrollments WHERE id = 'enrollment_id';
  ```
- [ ] Проверить auto-navigation к следующему уроку
- [ ] Завершить все уроки курса
- [ ] Проверить что:
  - Progress = 100%
  - Certificate создан
  - Email с certificate отправлен

**Expected result:** ✅ Progress tracking работает, certificate выдан

---

### 7. Wishlist

**Сценарий:** Добавление и удаление из wishlist

- [ ] Открыть course detail page
- [ ] Нажать "Add to Wishlist" (heart icon)
- [ ] Проверить toast notification
- [ ] Проверить в БД:
  ```sql
  SELECT * FROM wishlists WHERE user_id = 'test_user' AND course_id = 'course_id';
  ```
- [ ] Открыть `/wishlist`
- [ ] Проверить что курс отображается
- [ ] Нажать "Remove" (trash icon)
- [ ] Проверить что курс удалён из wishlist
- [ ] Проверить empty state когда wishlist пуст

**Expected result:** ✅ Wishlist operations работают

---

### 8. Reviews & Ratings

**Сценарий:** Добавление review

- [ ] Открыть course detail page (только для enrolled courses)
- [ ] Нажать "Write a review"
- [ ] Выбрать rating (1-5 stars)
- [ ] Написать review text
- [ ] Нажать "Submit Review"
- [ ] Проверить в БД:
  ```sql
  SELECT * FROM reviews WHERE user_id = 'test_user' AND course_id = 'course_id';
  ```
- [ ] Проверить что review отображается на странице
- [ ] Проверить что average rating обновился
- [ ] Проверить что reviewsCount увеличился

**Expected result:** ✅ Reviews система работает

---

## 👨‍💼 Admin Panel Tests

### 9. Admin Dashboard

- [ ] Открыть `/admin` (требуется admin access)
- [ ] Проверить статистику:
  - Total Courses
  - Total Students
  - Total Revenue
  - Certificates Issued
- [ ] Проверить Recent Courses list
- [ ] Проверить Recent Activity
- [ ] Проверить Platform Statistics

**Expected result:** ✅ Dashboard отображает реальные данные

---

### 10. Admin Courses Management

- [ ] Открыть `/admin/courses`
- [ ] Проверить courses list
- [ ] Использовать search
- [ ] Использовать filters (all/published/draft)
- [ ] Нажать "Edit" на курсе
- [ ] Обновить course information
- [ ] Добавить `memberstackPlanId` для платного курса
- [ ] Сохранить изменения
- [ ] Проверить что changes сохранились
- [ ] Проверить Publish/Unpublish toggle
- [ ] Создать новый курс: `/admin/courses/new`
- [ ] Заполнить форму
- [ ] Сохранить
- [ ] Проверить в courses list

**Expected result:** ✅ CRUD operations работают

---

### 11. Admin Users Management

- [ ] Открыть `/admin/users`
- [ ] Проверить users list
- [ ] Проверить user statistics:
  - Courses enrolled
  - Courses completed
  - Certificates earned
  - Total spent
- [ ] Использовать search
- [ ] Проверить Last Active timestamps

**Expected result:** ✅ Users dashboard работает

---

## 🔄 Webhook Tests

### 12. Memberstack Webhooks

**Test 1: Plan Purchased**
- [ ] Купить курс через Memberstack
- [ ] Проверить логи webhook:
  ```
  POST /api/webhooks/memberstack
  event.type: member.plan.purchased
  ```
- [ ] Проверить что:
  - Enrollment created
  - Payment created
  - Emails sent
  - Course studentCount incremented

**Test 2: Plan Cancelled** (если applicable)
- [ ] Отменить plan через Memberstack Dashboard
- [ ] Проверить webhook:
  ```
  event.type: member.plan.cancelled
  ```
- [ ] Проверить что enrollment updated

---

## 🌐 End-to-End Tests

### 13. Complete User Journey

**Сценарий:** От регистрации до certificate

1. [ ] **Регистрация:**
   - Создать новый account
   - Подтвердить email (если enabled)

2. [ ] **Browse Courses:**
   - Просмотреть courses catalog
   - Использовать search и filters
   - Открыть course detail

3. [ ] **Purchase Course:**
   - Добавить в wishlist
   - Купить платный курс
   - Завершить Stripe checkout

4. [ ] **Learn:**
   - Открыть первый урок
   - Просмотреть video
   - Mark as complete
   - Пройти все уроки

5. [ ] **Certificate:**
   - Получить certificate
   - Скачать PDF
   - Share в social media

6. [ ] **Review:**
   - Оставить review
   - Поставить rating

7. [ ] **Dashboard:**
   - Проверить progress
   - Проверить certificates
   - Проверить statistics

**Expected result:** ✅ Весь flow работает от начала до конца

---

## 🚨 Error Handling Tests

### 14. Error Scenarios

- [ ] **Invalid Course ID:** Открыть `/courses/invalid-slug` → 404 page
- [ ] **Unauthorized Access:** Открыть `/learn/course/lesson` без enrollment → redirect
- [ ] **Payment Failed:** Использовать declined card `4000 0000 0000 0002` → error message
- [ ] **Network Error:** Отключить internet → toast error
- [ ] **Invalid API Response:** Mock failed API → error boundary
- [ ] **Missing Memberstack Plan:** Купить курс без `memberstackPlanId` → graceful error

**Expected result:** ✅ Errors обрабатываются gracefully

---

## 📱 Responsive Tests

### 15. Mobile & Desktop

- [ ] Desktop (1920x1080):
  - Homepage
  - Courses catalog
  - Course detail
  - Lesson player
  - Dashboard
  - Admin panel

- [ ] Tablet (768x1024):
  - Navigation menu
  - Cards layout
  - Forms

- [ ] Mobile (375x667):
  - Mobile menu
  - Touch interactions
  - Scrolling
  - Forms

**Expected result:** ✅ Responsive на всех размерах

---

## ⚡ Performance Tests

### 16. Loading & Performance

- [ ] Homepage loads < 2s
- [ ] Courses catalog loads < 2s
- [ ] Images optimized (Next.js Image)
- [ ] Videos load progressively (Vimeo)
- [ ] No layout shifts (CLS)
- [ ] Smooth animations (60fps)
- [ ] API responses < 500ms

**Expected result:** ✅ Хорошая performance

---

## ✅ Final Verification

### 17. Production Readiness

- [ ] All tests passed
- [ ] No console errors
- [ ] No console warnings (except expected)
- [ ] Database migrations выполнены
- [ ] Environment variables configured
- [ ] Webhooks настроены и работают
- [ ] Emails отправляются корректно
- [ ] SSL certificate установлен (HTTPS)
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Backup strategy configured

---

## 📊 Test Results Summary

**Date:** _____________  
**Tester:** _____________  
**Environment:** [ ] Development [ ] Staging [ ] Production

### Results:
- Total Tests: _____ / _____
- Passed: _____ ✅
- Failed: _____ ❌
- Skipped: _____ ⏭️

### Critical Issues Found:
1. _____________
2. _____________
3. _____________

### Notes:
_____________________________________________
_____________________________________________
_____________________________________________

---

## 🎉 Sign-Off

**Platform Status:** 
- [ ] ✅ Ready for Production
- [ ] ⚠️ Ready with minor issues
- [ ] ❌ Not ready - critical bugs found

**Signed by:** _____________  
**Date:** _____________

---

**Next Steps:**
1. Fix any critical issues
2. Deploy to production
3. Monitor for 24 hours
4. Collect user feedback
