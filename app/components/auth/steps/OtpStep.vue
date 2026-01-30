<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-2xl font-bold">کد تأیید</h3>
      <button @click="$emit('back')" type="button" class="text-sm text-strong hover:underline">
        ویرایش شماره
      </button>
    </div>
    <p class="text-sm text-muted mb-6 text-center">
      کد ارسال‌شده به <strong class="text">{{ formatMobile(mobile) }}</strong> را وارد کنید
    </p>

    <SharedOtpInput v-model:code="otpValue" :length="6" class="my-6" />

    <div class="flex gap-3 mt-6">
      <button
        @click="handleVerify"
        :disabled="loading || otpValue.length !== 6"
        class="flex-1 btn py-3 px-4 rounded-inner transition disabled:opacity-60"
      >
        <span v-if="!loading">تأیید</span>
        <svg v-else class="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </button>

      <button
        type="button"
        @click="$emit('resend')"
        :disabled="timer > 0"
        class="flex-1 bg-accent py-3 px-4 rounded-inner transition disabled:opacity-60"
      >
        {{ timer > 0 ? `${timer} ثانیه` : 'ارسال مجدد' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  otp: String,
  mobile: String,
  timer: Number,
  loading: Boolean
})

const emit = defineEmits(['update:otp', 'verify', 'resend', 'back'])

const otpValue = ref(props.otp || '')

watch(() => props.otp, (newVal) => {
  otpValue.value = newVal || ''
})

watch(otpValue, (newVal) => {
  emit('update:otp', newVal)
})

const handleVerify = () => {
  if (otpValue.value.length === 6 && !props.loading) {
    emit('verify')
  }
}

const formatMobile = (num) => num.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
</script>
