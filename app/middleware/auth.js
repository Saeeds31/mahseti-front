export default defineNuxtRouteMiddleware((to) => {
  // فقط در client-side اجرا شود
  if (process.server) {
    return
  }

  // دریافت توکن از localStorage
  const token = localStorage.getItem('auth-token')

  console.log('🔐 Auth middleware - Token:', token ? 'exists' : 'not found')
  console.log('🔐 Navigating to:', to.path)

  // اگر توکن نداشت، مودال لاگین را باز کن و به صفحه اصلی redirect کن
  if (!token) {
    console.log('⛔ No token found, redirecting to home')

    // باز کردن مودال لاگین
    nextTick(() => {
      const loginModal = useState('loginModal')
      loginModal.value = true
    })

    // به صفحه اصلی redirect کن
    return navigateTo('/')
  }

  console.log('✅ Token found, allowing access')
})
