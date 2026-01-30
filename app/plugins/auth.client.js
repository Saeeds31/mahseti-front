// plugins/auth.client.js
import { useSettingStore } from '~/store/settings'
import { useCartStore } from '~/store/cart'

export default defineNuxtPlugin(async (nuxtApp) => {
  const settingStore = useSettingStore()
  const cartStore = useCartStore()
  const { $api } = nuxtApp

  // بارگذاری cart از localStorage
  cartStore.loadFromLocalStorage()

  // بررسی توکن در localStorage
  const token = localStorage.getItem('auth-token')
  const storedUser = localStorage.getItem('user')

  console.log('🔐 Auth Plugin - Token:', token ? 'exists' : 'not found')

  if (token) {
    try {
      // تنظیم header Authorization
      if ($api.defaults?.headers?.common) {
        $api.defaults.headers.common.Authorization = `Bearer ${token}`
        console.log('✅ Authorization header set')
      }

      // بارگذاری اطلاعات کاربر از localStorage
      if (storedUser) {
        settingStore.user = JSON.parse(storedUser)
        console.log('👤 User loaded from localStorage:', settingStore.user)
      }

      // دریافت اطلاعات به‌روز کاربر از سرور
      // console.log('📡 Fetching user profile...')
      // const response = await $api.get('/front/profile')
      // console.log('📄 Profile response:', response.data)

      // if (response.data?.data?.user) {
      //   settingStore.user = response.data.data.user
      //   localStorage.setItem('user', JSON.stringify(response.data.data.user))
      //   console.log('👤 User updated:', settingStore.user)
      // } else if (response.data?.user) {
      //   settingStore.user = response.data.user
      //   localStorage.setItem('user', JSON.stringify(response.data.user))
      //   console.log('👤 User updated (alt structure):', settingStore.user)
      // } else {
      //   console.warn('⚠️ User data not found in response')
      // }

      // Sync کردن cart محلی با سرور
      if (cartStore.items.length > 0) {
        console.log('🔄 Syncing local cart with server...')
        try {
          await cartStore.syncWithServer($api)
          console.log('✅ Cart synced successfully')
        } catch (error) {
          console.error('❌ Failed to sync cart:', error)
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error.response?.data || error.message)
      // اگر توکن منقضی شده، پاک کنیم
      if (error.response?.status === 401) {
        console.log('🗑️ Clearing invalid token')
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
        settingStore.user = null
        if ($api.defaults?.headers?.common) {
          delete $api.defaults.headers.common.Authorization
        }
      }
    }
  }
})
