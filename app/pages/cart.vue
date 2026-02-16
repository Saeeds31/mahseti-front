<!-- pages/cart.vue -->
<template>
  <div class="container">
    <SharedBreadCrumb :items="[{ label: 'سبد خرید', href: '/cart' }]" />
    <CartProgressSteps :current-step="1" />

    <!-- Empty Cart Message -->
    <div v-if="cartItems.length === 0" class="pad sjadow rounded mx-auto flex flex-col justify-center items-center w-full"  alt="">

      <img class="w-[20%] " src="@/assets/images/shopping.png" />

      <h2 class="text-md mb-7 text-muted">سبد خرید شما خالی است</h2>


    </div>

    <!-- Cart Table -->
    <div v-else class="bg-primary rounded-inner shadow pad mb-8">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[600px]">
          <thead>
            <tr class="border-b">
              <th class="text-right pb-4 font-semibold">سبد خرید شما</th>
              <th class="text-center pb-4 font-semibold">قیمت </th>
              <th class="text-center pb-4 font-semibold">تعداد</th>
              <th class="text-center pb-4 font-semibold">حذف</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in cartItems"
              :key="item.id"
              class="max-w-4xl mx-auto border-b py-3"
            >
              <td class="py-4">
                <div class="flex items-center gap-4">
                  <div
                    class=" p-2 w-18 h-18 rounded-inner bg-accent flex items-center justify-center text-3xl shrink-0 overflow-hidden"
                  >
                    <img
                      v-if="item.image"
                       :src="$getImageUrl(item.image)"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                    />
                    <span v-else>📦</span>
                  </div>
                  <div class="flex flex-col gap-2">
                    <p class="font-semibold">{{ item.name }}</p>
                    <p class="text-sm text-muted">{{ item.weight }}</p>
                  </div>
                </div>
              </td>
              <td class="text-center whitespace-nowrap">
                {{ item.price.toLocaleString("fa-IR") }}
                <span class="text-muted">تومان</span>
              </td>
              <td class="text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="increaseQuantity(item.id)"
                    class="w-6 h-6 rounded-inner border flex items-center justify-center hover:bg-secondary transition"
                  >
                    <Plus :size="16" />
                  </button>
                  <span>{{ item.quantity }}</span>
                  <button
                    @click="decreaseQuantity(item.id)"
                    class="w-6 h-6 rounded-inner border flex items-center justify-center hover:bg-secondary transition"
                  >
                    <Minus :size="16" />
                  </button>
                </div>
              </td>
              <td class="text-center">
                <button
                  @click="removeItem(item.id)"
                  class="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 :size="20" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary Box -->
      <div class="mt-8 bg-accent-fade rounded-inner py-4 px-8 flex justify-between">

         <form @submit="applyCoupon" class="flex gap-3 items-start flex-col">
            <div class="flex gap-3 w-full">
              <input
                v-model="couponCode"
                class="bg-primery border py-2 px-4 rounded-inner flex-1"
                type="text"
                placeholder="کد تخفیف خود را وارد کنید ..."
                :disabled="isCheckingCoupon"
              >
              <button
                type="submit"
                class="btn"
                :disabled="isCheckingCoupon"
              >
                {{ isCheckingCoupon ? 'در حال بررسی...' : 'اعمال کد تخفیف' }}
              </button>
            </div>
            <p v-if="couponError" class="text-red-500 text-sm">{{ couponError }}</p>
            <p v-if="couponDiscount > 0" class="text-green-500 text-sm">
              تخفیف کوپن: {{ couponDiscount.toLocaleString("fa-IR") }} تومان
            </p>
         </form>
        <div>
          <div class="flex justify-between mb-2">
            <span>مجموع قیمت همه کالا:</span>
            <span class="font-semibold"
              >{{ subtotal.toLocaleString("fa-IR") }} تومان</span
            >
          </div>
          <div class="flex justify-between mb-2">
            <span>تخفیف محصولات:</span>
            <span class="font-semibold">{{ discount.toLocaleString("fa-IR") }} تومان</span>
          </div>
          <div v-if="couponDiscount > 0" class="flex justify-between mb-2">
            <span>تخفیف کوپن:</span>
            <span class="font-semibold text-green-600">{{ couponDiscount.toLocaleString("fa-IR") }} تومان</span>
          </div>
          <div class="flex justify-between mb-4 text-strong font-bold text-lg">
            <span>پرداخت:</span>
            <span>{{ totalPrice.toLocaleString("fa-IR") }} تومان</span>
          </div>
        </div>
      </div>

     <div class="flex justify-end  mt-5 ">
         <button @click="goToShipping" class="btn ">
        ادامه فرایند
      </button>
     </div>
    </div>

    <!-- Login Modal -->
    <AuthLoginModal v-if="loginModal" />
  </div>
</template>
<style scoped>
.border-gradient {
  border: 1px solid;

  border-image-source: linear-gradient(
    90deg,
    rgba(214, 214, 214, 0.2) 0%,
    #5d5d5d 50%,
    rgba(214, 214, 214, 0.2) 100%
  );
}
</style>

<script setup>
import { Plus, Minus, Trash2 } from 'lucide-vue-next'
import { useApi } from '@/composables/api/useApi'
import { computed, ref, onMounted } from 'vue'
import { useSettingStore } from '~/store/settings'
import { useAuth } from '~/composables/useAuth'

// صفحه cart نیاز به لاگین نداره - کاربر می‌تونه بدون لاگین محصول اضافه کنه
// فقط وقتی روی "ادامه فرایند" کلیک کرد، چک می‌کنیم که لاگین کرده یا نه

import { useCartStore } from '~/store/cart'

const { getCart, increaseCartItem, decreaseCartItem, deleteCartItem, checkCoupon } = useApi()
const { loginModal } = useAuth()
const cartStore = useCartStore()
const settingStore = useSettingStore()
const runtimeConfig = useRuntimeConfig()

// بررسی لاگین بودن کاربر - باید reactive باشه
const isLoggedIn = computed(() => !!settingStore.user)

// ساخت کلید cache بر اساس وضعیت لاگین
const token = process.client ? localStorage.getItem('auth-token') : null
const cacheKey = token ? `cart-${token.substring(0, 10)}` : 'cart-guest'

console.log('🔑 Cart cache key:', cacheKey)

// دریافت داده‌های کارت از API
const { data: cartData, refresh: refreshCart } = await useAsyncData(
  cacheKey,
  async () => {
    // چک کردن لاگین از localStorage
    const token = process.client ? localStorage.getItem('auth-token') : null

    if (!token) {
      console.log('⚠️ User not logged in, using local cart')
      // استفاده از cart محلی
      cartStore.loadFromLocalStorage()
      return {
        items: cartStore.items,
        summary: {
          subtotal: cartStore.subtotal,
          product_discount_total: 0
        }
      }
    }

    // کاربر لاگین کرده - از API استفاده می‌کنیم
    try {
      console.log('🔐 User logged in, fetching cart from API')
      return await getCart()
    } catch (error) {
      console.error('❌ Failed to fetch cart:', error)
      return { items: [], summary: { subtotal: 0, product_discount_total: 0 } }
    }
  }
)

console.log('🛒 Cart data:', cartData.value)

// Reload cart بعد از mount (برای اطمینان از sync بودن)
onMounted(async () => {
  console.log('📍 Cart page mounted, refreshing cart data')
  await refreshCart()
})

// کوپن تخفیف
const couponCode = ref('')
const couponDiscount = ref(0)
const couponError = ref('')
const isCheckingCoupon = ref(false)

const cartItems = computed(() => {
  if (!cartData.value?.items) return []

  console.log('🔍 Processing cart items:', cartData.value.items)

  return cartData.value.items.map(item => {
    console.log('📦 Item:', item)

    // چک می‌کنیم این از API هست یا localStorage
    // اگر از API باشه، structure متفاوته
    if (item.title) {
      // از API
      return {
        id: item.id,
        name: item.title || 'محصول',
        weight: item.variant?.attributes?.[0]?.value || '',
        price: item.line_original_total || item.price || 0,
        quantity: item.quantity,
        image: item.image || null,
        variant_id: item.variant_id,
        line_total: item.line_final_total || (item.price * item.quantity)
      }
    } else {
      // از localStorage
      return {
        id: item.id || item.variant_id,
        name: item.name || 'محصول',
        weight: item.weight || '',
        price: item.price || 0,
        quantity: item.quantity,
        image: item.image || null,
        variant_id: item.variant_id,
        line_total: item.price * item.quantity
      }
    }
  })
})

const subtotal = computed(() => {
  return cartData.value?.summary?.subtotal || 0
})

const discount = computed(() => {
  return cartData.value?.summary?.product_discount_total || 0
})

const totalDiscount = computed(() => {
  return discount.value + couponDiscount.value
})

const totalPrice = computed(() => {
  return subtotal.value - totalDiscount.value
})

const increaseQuantity = async (id) => {
  console.log('➕ Increasing quantity for item:', id)

  // چک کردن لاگین از localStorage
  const token = process.client ? localStorage.getItem('auth-token') : null

  if (!token) {
    // برای کاربران guest از localStorage استفاده می‌کنیم
    const item = cartStore.items.find(i => i.id === id || i.variant_id === id)
    if (item) {
      cartStore.increaseQuantity(item.variant_id)
      await refreshCart()
    }
    return
  }

  try {
    await increaseCartItem(id)
    await refreshCart()
    console.log('✅ Quantity increased successfully')
  } catch (error) {
    console.error('❌ Failed to increase quantity:', error)
    alert('خطا در افزایش تعداد محصول')
  }
}

const decreaseQuantity = async (id) => {
  console.log('➖ Decreasing quantity for item:', id)

  // چک کردن لاگین از localStorage
  const token = process.client ? localStorage.getItem('auth-token') : null

  if (!token) {
    // برای کاربران guest از localStorage استفاده می‌کنیم
    const item = cartStore.items.find(i => i.id === id || i.variant_id === id)
    if (item) {
      cartStore.decreaseQuantity(item.variant_id)
      await refreshCart()
    }
    return
  }

  try {
    await decreaseCartItem(id)
    await refreshCart()
    console.log('✅ Quantity decreased successfully')
  } catch (error) {
    console.error('❌ Failed to decrease quantity:', error)
    alert('خطا در کاهش تعداد محصول')
  }
}

const removeItem = async (id) => {
  console.log('🗑️ Removing item:', id)

  // چک کردن لاگین از localStorage
  const token = process.client ? localStorage.getItem('auth-token') : null

  if (!token) {
    // برای کاربران guest از localStorage استفاده می‌کنیم
    const item = cartStore.items.find(i => i.id === id || i.variant_id === id)
    if (item) {
      cartStore.removeItem(item.variant_id)
      await refreshCart()
    }
    return
  }

  try {
    await deleteCartItem(id)
    await refreshCart()
    console.log('✅ Item removed successfully')
  } catch (error) {
    console.error('❌ Failed to remove item:', error)
    alert('خطا در حذف محصول')
  }
}

const applyCoupon = async (event) => {
  event.preventDefault()

  if (!couponCode.value) {
    couponError.value = 'لطفاً کد تخفیف را وارد کنید'
    return
  }

  isCheckingCoupon.value = true
  couponError.value = ''

  try {
    const result = await checkCoupon(couponCode.value, subtotal.value)
    console.log('🎟️ Coupon result:', result)

    if (result.success) {
      couponDiscount.value = result.discount || 0
      alert('کد تخفیف با موفقیت اعمال شد')
    }
  } catch (error) {
    console.error('❌ Coupon check failed:', error)
    couponError.value = error.response?.data?.message || 'کد تخفیف نامعتبر است'
    couponDiscount.value = 0
  } finally {
    isCheckingCoupon.value = false
  }
}

// ذخیره مقادیر cart در localStorage و رفتن به صفحه shipping
const goToShipping = () => {
  // ذخیره اطلاعات cart در localStorage
  const cartSummary = {
    items: cartItems.value,
    subtotal: subtotal.value,
    discount: discount.value,
    couponDiscount: couponDiscount.value,
    couponCode: couponCode.value,
    totalPrice: totalPrice.value,
    timestamp: new Date().toISOString()
  }

  localStorage.setItem('cart-summary', JSON.stringify(cartSummary))
  console.log('💾 Cart saved to localStorage:', cartSummary)

  // چک کردن لاگین
  const token = localStorage.getItem('auth-token')

  if (!token) {
    // اگر لاگین نکرده، مودال لاگین باز می‌شه
    console.log('⛔ User not logged in, opening login modal')
    const loginModal = useState('loginModal')
    loginModal.value = true
  } else {
    // اگر لاگین کرده، به صفحه shipping می‌ره
    console.log('✅ User logged in, navigating to shipping')
    navigateTo('/shipping')
  }
}
</script>

