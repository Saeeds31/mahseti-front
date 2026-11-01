<script setup>
const route = useRoute()
const status = computed(() => route.query.status === 'success' ? 'success' : 'failed')
const walletTransactionId = computed(() => route.query.wallet_transaction_id || null)
const amount = computed(() => route.query.amount || null)
const balance = computed(() => route.query.balance || null)
const isSuccess = computed(() => status.value === 'success')

// عنوان بر اساس وضعیت
const title = computed(() =>
    isSuccess.value ? 'شارژ کیف پول با موفقیت انجام شد' : 'شارژ کیف پول ناموفق بود'
)

// توضیحات
const description = computed(() => {
    if (isSuccess.value) {
        let text = 'کیف پول شما با موفقیت شارژ شد.'
        if (amount.value) {
            text += ` مبلغ ${new Intl.NumberFormat('fa-IR').format(Number(amount.value))} تومان به حساب شما واریز شد.`
        }
        if (balance.value) {
            text += ` موجودی فعلی شما: ${new Intl.NumberFormat('fa-IR').format(Number(balance.value))} تومان`
        }
        return text
    }
    return 'متاسفانه در فرایند شارژ کیف پول مشکلی پیش آمد. در صورت کسر وجه، مبلغ تا ۷۲ ساعت آینده به حساب شما بازخواهد گشت.'
})

// دکمه‌های اصلی
const primaryAction = computed(() => {
    if (isSuccess.value) {
        return {
            label: 'مشاهده کیف پول',
            to: '/panel/wallet'
        }
    }
    return {
        label: 'تلاش مجدد',
        to: '/panel/wallet'
    }
})
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">

            <!-- آیکون -->
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                :class="isSuccess ? 'bg-green-100' : 'bg-red-100'">
                <!-- آیکون موفقیت -->
                <svg v-if="isSuccess" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>

                <!-- آیکون کیف پول برای موفقیت -->
                <svg v-if="isSuccess" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 absolute"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 10h18M5 6h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>

                <!-- آیکون خطا -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-600" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>

            <!-- عنوان -->
            <h1 class="text-xl font-bold mb-2" :class="isSuccess ? 'text-green-700' : 'text-red-700'">
                {{ title }}
            </h1>

            <!-- توضیحات -->
            <p class="text-gray-500 text-sm leading-6 mb-4">
                {{ description }}
            </p>

            <!-- شماره تراکنش (در صورت موفقیت) -->
            <div v-if="isSuccess && walletTransactionId" class="mb-6 text-xs text-gray-400">
                <span>شماره تراکنش: </span>
                <span dir="ltr" class="font-mono">{{ walletTransactionId }}</span>
            </div>

            <!-- دکمه‌ها -->
            <div class="flex flex-col gap-3">
                <NuxtLink :to="primaryAction.to"
                    class="w-full inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white transition"
                    :class="isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-900'">
                    {{ primaryAction.label }}
                </NuxtLink>

                <NuxtLink v-if="!isSuccess" to="/"
                    class="w-full inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition">
                    بازگشت به صفحه اصلی
                </NuxtLink>
            </div>

        </div>
    </div>
</template>