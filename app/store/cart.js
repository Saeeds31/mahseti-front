// stores/cart.js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isLoading = ref(false)

  // بارگذاری cart از localStorage
  const loadFromLocalStorage = () => {
    if (process.client) {
      const savedCart = localStorage.getItem('guest-cart')
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart)
          items.value = parsed.items || []
          console.log('🛒 Cart loaded from localStorage:', items.value)
        } catch (error) {
          console.error('❌ Failed to parse cart:', error)
          items.value = []
        }
      }
    }
  }

  // ذخیره cart در localStorage
  const saveToLocalStorage = () => {
    if (process.client) {
      localStorage.setItem('guest-cart', JSON.stringify({
        items: items.value,
        timestamp: new Date().toISOString()
      }))
      console.log('💾 Cart saved to localStorage')
    }
  }

  // افزودن محصول به cart
  const addItem = (product) => {
    const existingItem = items.value.find(item => item.variant_id === product.variant_id)

    if (existingItem) {
      existingItem.quantity += product.quantity || 1
    } else {
      items.value.push({
        ...product,
        quantity: product.quantity || 1
      })
    }

    saveToLocalStorage()
  }

  // حذف محصول از cart
  const removeItem = (variantId) => {
    items.value = items.value.filter(item => item.variant_id !== variantId)
    saveToLocalStorage()
  }

  // افزایش تعداد
  const increaseQuantity = (variantId) => {
    const item = items.value.find(item => item.variant_id === variantId)
    if (item) {
      item.quantity++
      saveToLocalStorage()
    }
  }

  // کاهش تعداد
  const decreaseQuantity = (variantId) => {
    const item = items.value.find(item => item.variant_id === variantId)
    if (item && item.quantity > 1) {
      item.quantity--
      saveToLocalStorage()
    } else if (item && item.quantity === 1) {
      removeItem(variantId)
    }
  }

  // پاک کردن تمام cart
  const clearCart = () => {
    items.value = []
    if (process.client) {
      localStorage.removeItem('guest-cart')
    }
  }

  // Sync کردن cart با سرور بعد از لاگین
  const syncWithServer = async (api) => {
    if (items.value.length === 0) return

    isLoading.value = true
    try {
      // ارسال هر آیتم به سرور
      for (const item of items.value) {
        await api.post('/front/cart/add', {
          variant_id: item.variant_id,
          quantity: item.quantity
        })
      }

      console.log('✅ Cart synced with server')
      clearCart() // پاک کردن cart محلی بعد از sync
    } catch (error) {
      console.error('❌ Failed to sync cart:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // محاسبات
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity
    }, 0)
  })

  return {
    items,
    isLoading,
    totalItems,
    subtotal,
    loadFromLocalStorage,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    syncWithServer
  }
})
