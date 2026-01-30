import { ref, computed } from 'vue'
import { useApi } from './api/useApi'

const wishlistItems = ref([])
const isLoading = ref(false)
const lastFetchTime = ref(0)
const FETCH_COOLDOWN = 2000 // 2 ثانیه cooldown بین درخواست‌ها

export const useWishlist = () => {
  const { getWishlist, addToWishlist, removeFromWishlist } = useApi()

  // بارگذاری لیست wishlist از سرور
  const fetchWishlist = async (force = false) => {
    // بررسی لاگین بودن
    if (!process.client) return

    const token = localStorage.getItem('auth-token')
    if (!token) {
      wishlistItems.value = []
      return
    }

    // جلوگیری از درخواست‌های مکرر
    const now = Date.now()
    if (!force && isLoading.value) {
      console.log('⏳ Wishlist fetch already in progress, skipping...')
      return
    }

    if (!force && (now - lastFetchTime.value) < FETCH_COOLDOWN) {
      console.log('⏳ Wishlist fetch cooldown, skipping...')
      return
    }

    isLoading.value = true
    lastFetchTime.value = now

    try {
      const response = await getWishlist()
      wishlistItems.value = response.data || []
      console.log('✅ Wishlist loaded:', wishlistItems.value.length, 'items')
    } catch (error) {
      // فقط خطاهای غیر از timeout را لاگ کن
      if (!error.message?.includes('timeout')) {
        console.error('❌ Error loading wishlist:', error)
      }
      wishlistItems.value = []
    } finally {
      isLoading.value = false
    }
  }

  // بررسی اینکه آیا محصول در wishlist هست
  const isInWishlist = (productId) => {
    return wishlistItems.value.some(item => {
      // اگر آیتم product داره
      if (item.product) {
        return item.product.id === productId
      }
      // اگر آیتم product_id داره
      if (item.product_id) {
        return item.product_id === productId
      }
      return false
    })
  }

  // افزودن به wishlist
  const addToWishlistAndRefresh = async (productId) => {
    try {
      await addToWishlist(productId)
      await fetchWishlist(true) // رفرش لیست بعد از افزودن (force)
      return true
    } catch (error) {
      console.error('❌ Error adding to wishlist:', error)
      throw error
    }
  }

  // حذف از wishlist
  const removeFromWishlistAndRefresh = async (productId) => {
    try {
      await removeFromWishlist(productId)
      await fetchWishlist(true) // رفرش لیست بعد از حذف (force)
      return true
    } catch (error) {
      console.error('❌ Error removing from wishlist:', error)
      throw error
    }
  }

  // تغییر وضعیت wishlist (toggle)
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlistAndRefresh(productId)
      return false
    } else {
      await addToWishlistAndRefresh(productId)
      return true
    }
  }

  return {
    wishlistItems,
    isLoading,
    fetchWishlist,
    isInWishlist,
    addToWishlistAndRefresh,
    removeFromWishlistAndRefresh,
    toggleWishlist
  }
}
