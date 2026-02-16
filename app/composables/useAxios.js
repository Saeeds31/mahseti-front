// composables/axios.js
import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // فقط یک بار ساخته می‌شه (توسط Nuxt Plugin)
  const api = axios.create({
    baseURL: config.public.apiBase || 'https://api.vitamixfruit.com/api/v1',
    timeout: 10000, // بهتره بیشتر باشه
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // درخواست‌ها: فقط در کلاینت توکن رو اضافه کن
  api.interceptors.request.use((config) => {
    // فقط در مرورگر (کلاینت) اجرا بشه
    if (process.client) {
      const token = localStorage.getItem('auth-token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  // پاسخ‌ها: مدیریت خطاها (مثلاً 401 → لاگ‌اوت خودکار)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // مثال: اگر توکن منقضی شده بود
      if (error.response?.status === 401) {
        // پاک کردن توکن از localStorage
        if (process.client) {
          localStorage.removeItem('auth-token')
          localStorage.removeItem('user')
          navigateTo('/login')
        }
      }

      console.error('API Error:', error.response?.data || error.message)
      return Promise.reject(error)
    }
  )

  // این api رو در سراسر اپ در دسترس قرار بده
  return {
    provide: {
      api // حالا می‌تونی از $api استفاده کنی
    }
  }
})

