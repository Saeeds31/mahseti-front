<script setup>
const route = useRoute()

const status = computed(() => route.query.status === 'success' ? 'success' : 'failed')
const orderId = computed(() => route.query.order_id || null)
const walletTransactionId = computed(() => route.query.wallet_transaction_id || null)

const isSuccess = computed(() => status.value === 'success')

const title = computed(() => isSuccess.value ? 'پرداخت با موفقیت انجام شد' : 'پرداخت ناموفق بود')

const description = computed(() => {
  if (isSuccess.value) {
    if (orderId.value) return 'سفارش شما با موفقیت ثبت و پرداخت شد.'
    if (walletTransactionId.value) return 'کیف پول شما با موفقیت شارژ شد.'
    return 'تراکنش شما با موفقیت انجام شد.'
  }
  return 'متاسفانه در فرایند پرداخت مشکلی پیش آمد. در صورت کسر وجه، مبلغ تا ۷۲ ساعت آینده به حساب شما بازخواهد گشت.'
})

const primaryAction = computed(() => {
  if (isSuccess.value && orderId.value) {
    return { label: 'مشاهده جزئیات سفارش', to: `/panel/order/${orderId.value}` }
  }
  return { label: 'بازگشت به صفحه اصلی', to: '/' }
})

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">

      <!-- آیکون -->
      <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        :class="isSuccess ? 'bg-green-100' : 'bg-red-100'">
        <svg v-if="isSuccess" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <!-- عنوان -->
      <h1 class="text-xl font-bold mb-2" :class="isSuccess ? 'text-green-700' : 'text-red-700'">
        {{ title }}
      </h1>

      <!-- توضیحات -->
      <p class="text-gray-500 text-sm leading-6 mb-8">
        {{ description }}
      </p>

      <!-- دکمه‌ها -->
      <div class="flex flex-col gap-3">
        <NuxtLink :to="primaryAction.to"
          class="w-full inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white transition"
          :class="isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-900'">
          {{ primaryAction.label }}
        </NuxtLink>

        <NuxtLink v-if="isSuccess && orderId" to="/"
          class="w-full inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition">
          بازگشت به صفحه اصلی
        </NuxtLink>
      </div>

    </div>
  </div>
</template>