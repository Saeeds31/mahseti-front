# سیستم Global Loading

## نحوه استفاده در صفحات جدید

برای اضافه کردن loading به صفحات جدید، از الگوی زیر استفاده کنید:

```vue
<script setup>
import { ref } from 'vue'
import { useApi } from '@/composables/api/useApi'
import { usePageLoading } from '@/composables/usePageLoading'

const { getYourData, getBase } = useApi()
const { loadPageWithBase } = usePageLoading()

// state ها
const pending = ref(true)
const error = ref(null)
const data = ref(null)

// بارگذاری همزمان base + درخواست‌های صفحه
try {
  await loadPageWithBase(
    [
      // درخواست اول
      async () => {
        const response = await getYourData()
        data.value = response
        return response
      },
      // درخواست دوم (اختیاری)
      async () => {
        // درخواست دیگر
      }
    ],
    'در حال بارگذاری...', // پیام loading
    getBase // تابع برای دریافت base (اختیاری)
  )
} catch (err) {
  error.value = err
  console.error('خطا در بارگذاری:', err)
} finally {
  pending.value = false
}
</script>
```

## نکات مهم:

1. **درخواست base فقط یک بار اجرا می‌شود** - اگر قبلاً لود شده باشد، دوباره اجرا نمی‌شود

2. **تمام درخواست‌ها به صورت همزمان اجرا می‌شوند** - برای بهینه‌سازی سرعت

3. **Loading overlay روی کل صفحه نمایش داده می‌شود** - از طریق Layout

4. **پارامتر getBase اختیاری است** - اگر نمی‌خواهید base چک شود، آن را ارسال نکنید

## مثال بدون base:

```vue
try {
  await loadPageWithBase(
    [
      async () => await getYourData()
    ],
    'در حال بارگذاری...'
    // بدون getBase
  )
} catch (err) {
  error.value = err
}
```

## استفاده مستقیم از Loading Store:

اگر می‌خواهید در جای دیگری loading نمایش دهید:

```vue
<script setup>
import { useLoadingStore } from '~/store/loading'

const loadingStore = useLoadingStore()

// نمایش loading
loadingStore.showLoading('پیام دلخواه...')

// مخفی کردن loading
loadingStore.hideLoading()
</script>
```

## فایل‌های مرتبط:

- `app/store/loading.js` - Store مدیریت وضعیت loading
- `app/composables/usePageLoading.js` - Composable برای بارگذاری صفحات
- `app/components/shared/LoadingOverlay.vue` - Component نمایش loading
- `app/layouts/default.vue` - Layout اصلی با loading overlay
- `app/layouts/panel.vue` - Layout پنل با loading overlay
