export default defineNuxtRouteMiddleware((to) => {
  // فقط در client-side اجرا شود
  if (process.server) {
    return
  }

  // دریافت توکن از localStorage
  const token = localStorage.getItem('auth-token')


  // اگر توکن نداشت، مودال لاگین را باز کن و به صفحه اصلی redirect کن
  if (!token) {

    // باز کردن مودال لاگین
    nextTick(() => {
      const loginModal = useState('loginModal')
      loginModal.value = true
    })

    // به صفحه اصلی redirect کن
    return navigateTo('/')
  }

})
