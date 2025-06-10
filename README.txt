
# Pregnancy Tracking Tool - README
# أداة متابعة الحمل - دليل الاستخدام

## Project Structure / هيكل المشروع

- index.html  --> Main HTML structure (no inline styles or JS)
                  الهيكل الرئيسي للصفحة HTML (بدون أكواد CSS أو JS داخله)

- style.css   --> All styles (colors, gradients, layout, fonts...)
                  جميع التنسيقات (الألوان، الخلفيات، التخطيط...)

- script.js   --> All logic and calculations with clear comments
                  جميع الأكواد البرمجية الخاصة بالحسابات مع تعليقات واضحة


## How to Edit / كيفية التعديل

### 1. Change Pregnancy Duration
In `script.js`, change:
```js
const PREGNANCY_WEEKS = 40;
```
لو عايز تغير مدة الحمل (مثلاً 38 أسبوع)، غيّر القيمة هنا.

### 2. Add New Calculation Method
In `initDirectCalculation()`, edit `calculatePregnancy()` function.
لو عايز تضيف طريقة حساب جديدة، ضيف شرط جديد (if-else) فى هذه الدالة.

### 3. Improve Calendar View
You can modify `generatePregnancyCalendar()` to add:
- More colors
- More info inside each day
- Icons or labels

يمكنك تعديل دالة التقويم لإضافة المزيد من الألوان أو الأيقونات أو المعلومات داخل كل يوم.

### 4. Reverse Calculation Improvements
The current logic assumes:
- You input target date + month + week + day → we calculate the pregnancy start date.

## Suggested Improvement / تحسين مقترح (للحساب العكسي):
Instead of using:
```daysFromStart = (pregnancyWeek - 1) * 7 + (weekDay - 1)```

You can implement a more user-friendly input:
- User enters target date + current week only → day of the week is inferred from target date.

E.g.:
```js
const targetWeekDay = targetDate.getDay(); // auto-detect day of the week
```

Then:
```js
daysFromStart = (pregnancyWeek - 1) * 7 + targetWeekDay;
```

This way you remove manual selection of "week day" and make the UI simpler.

بهذه الطريقة ستتمكن من تبسيط واجهة المستخدم وتجنب إدخال يوم الأسبوع يدويًا.

## Future Enhancements / تحسينات مستقبلية:
- Add language toggle (AR / EN).
- Allow saving calculation as PDF.
- Add notification/reminder feature.

إمكانية إضافة خصائص مستقبلية مثل:
- دعم تغيير اللغة (عربي / إنجليزي).
- تصدير النتائج إلى PDF.
- إضافة خاصية التذكير بالمواعيد المهمة.

---
Good luck! 🚀
بالتوفيق!
