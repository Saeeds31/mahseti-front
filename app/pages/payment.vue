<template>
  <div class="container">
    <SharedBreadCrumb :items="[
      { label: 'سبد خرید', href: '/cart' },
      { label: 'انتخاب آدرس و روش ارسال', href: '/shipping' },
      { label: 'پرداخت', href: '/payment' }
    ]" />
    <CartProgressSteps :current-step="3" />

    <div class="bg-primary rounded-inner shadow pad">
      <h2 class="text-xl font-semibold mb-6 border-b pb-3">
        انتخاب شیوه پرداخت
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <!-- ستون راست: انتخاب روش پرداخت -->
        <div class="flex flex-col gap-6">
          <!-- انتخاب نوع پرداخت -->
          <div class="space-y-4">
            <h3 class="font-bold text-base lg:text-lg">انتخاب روش پرداخت</h3>

            <!-- پرداخت اینترنتی -->
            <label
              class="border rounded-inner p-4 cursor-pointer flex items-start gap-3 hover:border-secondary transition-all duration-200"
              :class="{ 'border-secondary bg-secondary-fade': paymentMethod === 'online' }"
            >
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                v-model="paymentMethod"
                class="mt-1 shrink-0"
              />
              <div class="flex-1">
                <div class="flex gap-2 items-center mb-1">
                  <IconPaymentWay />
                  <span class="font-bold text-sm lg:text-base">پرداخت اینترنتی</span>
                </div>
                <span class="text-muted text-xs lg:text-sm">پرداخت با کلیه کارت‌های عضو شتاب</span>
              </div>
            </label>

            <!-- پرداخت از کیف پول -->
            <label
              class="border rounded-inner p-4 cursor-pointer flex items-start gap-3 hover:border-secondary transition-all duration-200"
              :class="{ 'border-secondary bg-secondary-fade': paymentMethod === 'wallet' }"
            >
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                v-model="paymentMethod"
                class="mt-1 shrink-0"
              />
              <div class="flex-1">
                <div class="flex gap-2 items-center mb-1">
                  <IconPaymentWay />
                  <span class="font-bold text-sm lg:text-base">پرداخت از کیف پول</span>
                </div>
                <span class="text-muted text-xs lg:text-sm">استفاده از موجودی کیف پول شما</span>
              </div>
            </label>
          </div>

          <!-- انتخاب درگاه پرداخت (فقط برای پرداخت اینترنتی) -->
          <div v-if="paymentMethod === 'online'" class="space-y-3">
            <h3 class="font-bold text-base lg:text-lg">انتخاب درگاه پرداخت</h3>
            <div class="flex gap-4 flex-wrap">
              <button
                type="button"
                aria-label="انتخاب درگاه سپهر"
                :class="[
                  'relative rounded-xl h-[100px] w-[140px] p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105',
                  selected === 1
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-accent text-black border border-accent',
                ]"
                @click="selected = 1"
              >
                <img
                  src="@/assets/images/payping1.png"
                  alt="لوگوی سپهر"
                  class="absolute -top-5 w-14 h-14 object-contain bg-white rounded-full p-1"
                />
                <span class="text-xs lg:text-sm font-medium mt-8">درگاه سپهر</span>
              </button>

              <button
                type="button"
                aria-label="انتخاب درگاه پی‌پینگ"
                :class="[
                  'relative rounded-xl h-[100px] w-[140px] p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105',
                  selected === 2
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-accent text-black border border-accent',
                ]"
                @click="selected = 2"
              >
                <img
                  src="@/assets/images/payping1.png"
                  alt="لوگوی پی‌پینگ"
                  class="absolute -top-5 w-14 h-14 object-contain bg-white rounded-full p-1"
                />
                <span class="text-xs lg:text-sm font-medium mt-8">درگاه پی‌پینگ</span>
              </button>
            </div>
          </div>

          <!-- دکمه مرحله قبل -->
          <nuxt-link
            to="/shipping"
            class="btnborderBlack w-full mt-auto text-center"
          >
            مرحله قبل
          </nuxt-link>
        </div>

        <!-- ستون چپ: خلاصه سفارش -->
        <div class="space-y-4 flex flex-col">
          <!-- نوع سفارش -->
          <div class="bg-accent rounded-inner p-4 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-secondary shrink-0"></span>
            <span class="font-medium text-sm lg:text-base">نوع سفارش: عادی</span>
          </div>

          <!-- اطلاعات آدرس -->
          <div v-if="isFetchingSummary" class="bg-accent rounded-inner p-4 text-center">
            <SharedLoadingSpinner size="sm" />
          </div>
          <div
            v-else-if="selectedAddress"
            class="bg-accent rounded-inner p-4 text-xs lg:text-sm leading-relaxed space-y-2"
          >
            <p class="font-semibold text-sm lg:text-base mb-3 flex items-center gap-2">
              <IconLocAdders class="shrink-0" />
              <span>مشخصات تحویل گیرنده</span>
            </p>
            <p>
              <span class="text-muted ml-1">نام:</span>
              <span class="font-semibold text-secondary">{{ selectedAddress.receiver_name }}</span>
            </p>
            <p>
              <span class="text-muted ml-1">آدرس:</span>
              <span class="font-medium">{{ selectedAddress.address_line }}</span>
            </p>
            <p>
              <span class="text-muted ml-1">شماره تماس:</span>
              <span class="font-medium">{{ selectedAddress.phone }}</span>
            </p>
          </div>
          <div v-else class="bg-accent rounded-inner p-4 text-center text-xs lg:text-sm text-muted">
            اطلاعات آدرس یافت نشد
          </div>

          <!-- خلاصه مالی -->
          <div class="bg-accent rounded-inner p-4 space-y-3 text-xs lg:text-sm">
            <h3 class="font-bold text-sm lg:text-base mb-3">خلاصه سفارش</h3>

            <div class="flex justify-between items-center">
              <span class="text-muted">مجموع قیمت کالاها:</span>
              <span class="font-medium">{{ subtotal.toLocaleString("fa-IR") }} تومان</span>
            </div>

            <div class="flex justify-between items-center" :class="discount > 0 ? 'text-red-500' : 'text-muted'">
              <span>تخفیف محصولات:</span>
              <span class="font-medium">{{ discount > 0 ? '-' : '' }} {{ discount.toLocaleString("fa-IR") }} تومان</span>
            </div>

            <div v-if="apiCouponDiscount > 0" class="flex justify-between items-center text-green-600">
              <span>تخفیف کوپن ({{ couponCode }}):</span>
              <span class="font-semibold">- {{ apiCouponDiscount.toLocaleString("fa-IR") }} تومان</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-muted">هزینه ارسال:</span>
              <span class="font-medium" :class="shippingCost === 0 ? 'text-green-600' : ''">
                {{ shippingCost === 0 ? 'رایگان' : `${shippingCost.toLocaleString("fa-IR")} تومان` }}
              </span>
            </div>

            <div class="border-t my-2 border-muted"></div>

            <div class="flex justify-between items-center font-bold text-base lg:text-lg">
              <span>پرداخت نهایی:</span>
              <span class="text-secondary">{{ total.toLocaleString("fa-IR") }} تومان</span>
            </div>
          </div>

          <!-- دکمه پرداخت -->
          <button
            @click="handlePayment"
            :disabled="isProcessing"
            :class="[
              'btn w-full',
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <span v-if="isProcessing">در حال پردازش...</span>
            <span v-else class="flex items-center justify-center gap-2">
              <span>تکمیل و پرداخت</span>
              <span>←</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useApi } from '@/composables/api/useApi'

definePageMeta({
  middleware: 'auth'
})

const { getCheckoutSummary } = useApi()
const { $api } = useNuxtApp()

const paymentMethod = ref('online') // 'online' یا 'wallet'
const selected = ref(1) // برای انتخاب درگاه پرداخت
const cartData = ref(null)
const couponCode = ref('') // کد تخفیف
const isProcessing = ref(false) // برای جلوگیری از کلیک مکرر
const checkoutSummary = ref(null) // داده‌های checkout summary از API
const isFetchingSummary = ref(false) // برای نمایش loading
const shippingInfo = ref(null) // اطلاعات shipping از API

onMounted(async () => {
  const toast = useToast()

  // بارگذاری اطلاعات cart از localStorage
  const savedCart = localStorage.getItem('cart-summary')
  if (savedCart) {
    try {
      cartData.value = JSON.parse(savedCart)

      // بارگذاری کد تخفیف از localStorage
      if (cartData.value.couponCode) {
        couponCode.value = cartData.value.couponCode
      }

      console.log('📦 Cart loaded:', cartData.value)
      console.log('🎟️ Coupon code:', couponCode.value)
    } catch (err) {
      console.error('❌ Failed to parse cart data:', err)
    }
  }

  // بارگذاری اطلاعات shipping از localStorage
  const savedShipping = localStorage.getItem('shipping-info')
  if (savedShipping) {
    try {
      shippingInfo.value = JSON.parse(savedShipping)
      console.log('📦 Shipping info loaded from localStorage:', shippingInfo.value)

      // بارگذاری checkout summary با استفاده از address_id و shipping_method_id
      if (shippingInfo.value?.address_id && shippingInfo.value?.shipping_method_id) {
        await fetchCheckoutSummary()
      } else {
        toast.add({
          title: 'خطا',
          description: 'اطلاعات آدرس و روش ارسال یافت نشد. لطفاً به مرحله قبل بازگردید.',
          color: 'red'
        })
      }
    } catch (err) {
      console.error('❌ Failed to parse shipping data:', err)
      toast.add({
        title: 'خطا',
        description: 'خطا در بارگذاری اطلاعات. لطفاً به مرحله قبل بازگردید.',
        color: 'red'
      })
    }
  } else {
    toast.add({
      title: 'خطا',
      description: 'اطلاعات آدرس و روش ارسال یافت نشد. لطفاً به مرحله قبل بازگردید.',
      color: 'red'
    })
  }
})

// تابع برای fetch کردن checkout summary
const fetchCheckoutSummary = async () => {
  if (!shippingInfo.value?.address_id || !shippingInfo.value?.shipping_method_id) {
    console.log('⚠️ Address or shipping method not available yet')
    return
  }

  isFetchingSummary.value = true

  try {
    const response = await getCheckoutSummary({
      address_id: shippingInfo.value.address_id,
      shipping_method_id: shippingInfo.value.shipping_method_id,
      coupon_code: couponCode.value || ''
    })

    checkoutSummary.value = response.data || response
    console.log('✅ Checkout summary loaded:', checkoutSummary.value)

    // اگر کوپن از API برگشت، کد تخفیف رو آپدیت کن
    if (checkoutSummary.value?.coupon) {
      couponCode.value = checkoutSummary.value.coupon.code || ''
    }
  } catch (err) {
    console.error('❌ Failed to fetch checkout summary:', err)
  } finally {
    isFetchingSummary.value = false
  }
}

// محاسبه قیمت‌ها - از API اگر موجود باشه، وگرنه از localStorage
const subtotal = computed(() => {
  if (checkoutSummary.value?.summary?.subtotal !== undefined) {
    return checkoutSummary.value.summary.subtotal
  }
  return cartData.value?.totalPrice || 0
})

const shippingCost = computed(() => {
  if (checkoutSummary.value?.summary?.shipping_cost !== undefined) {
    return checkoutSummary.value.summary.shipping_cost
  }
  return 0
})

const discount = computed(() => {
  if (checkoutSummary.value?.summary?.product_discount !== undefined) {
    return checkoutSummary.value.summary.product_discount
  }
  return cartData.value?.discount || 0
})

const totalDiscount = computed(() => {
  if (checkoutSummary.value?.summary?.coupon_discount !== undefined) {
    return discount.value + checkoutSummary.value.summary.coupon_discount
  }
  return discount.value
})

// تخفیف کوپن از API
const apiCouponDiscount = computed(() => {
  if (checkoutSummary.value?.summary?.coupon_discount !== undefined) {
    return checkoutSummary.value.summary.coupon_discount
  }
  return 0
})

const total = computed(() => {
  if (checkoutSummary.value?.summary?.payable_amount !== undefined) {
    return checkoutSummary.value.summary.payable_amount
  }
  return subtotal.value + shippingCost.value - totalDiscount.value
})

// آدرس و روش ارسال انتخاب شده - مستقیماً از checkout summary
const selectedAddress = computed(() => {
  return checkoutSummary.value?.address || null
})

const selectedShippingMethod = computed(() => {
  return checkoutSummary.value?.shipping_method || null
})

// تابع ثبت سفارش
async function handlePayment() {
  const { $api } = useNuxtApp()
  const toast = useToast()

  if (isProcessing.value) return

  // اعتبارسنجی
  if (!selectedAddress.value) {
    toast.add({
      title: 'خطا',
      description: 'آدرس تحویل یافت نشد',
      color: 'red'
    })
    return
  }

  if (!selectedShippingMethod.value) {
    toast.add({
      title: 'خطا',
      description: 'روش ارسال یافت نشد',
      color: 'red'
    })
    return
  }

  isProcessing.value = true

  try {
    const payload = {
      address_id: selectedAddress.value.id,
      shipping_method_id: selectedShippingMethod.value.id,
      payment_method: paymentMethod.value === 'wallet' ? 'wallet' : 'online',
      coupon_code: couponCode.value.trim() || '' // همیشه ارسال میشه، حتی اگه خالی باشه
    }

    console.log('📤 Sending order:', payload)

    const response = await $api.post('/front/order', payload)

    console.log('✅ Order created:', response.data)

    toast.add({
      title: 'موفقیت',
      description: response.data?.message || 'سفارش شما با موفقیت ثبت شد',
      color: 'green'
    })

    // پاک کردن سبد خرید از localStorage
    localStorage.removeItem('cart-summary')

    // هدایت به صفحه مناسب (درگاه پرداخت یا صفحه تایید)
    if (response.data?.payment_url) {
      window.location.href = response.data.payment_url
    } else {
      navigateTo('/orders')
    }
  } catch (err) {
    console.error('❌ Order error:', err)
    toast.add({
      title: 'خطا',
      description: err.response?.data?.message || 'خطا در ثبت سفارش',
      color: 'red'
    })
  } finally {
    isProcessing.value = false
  }
}
</script>
