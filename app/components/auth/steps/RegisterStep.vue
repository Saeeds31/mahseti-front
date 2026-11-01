<template>
  <div>
    <h3 class="text-2xl font-bold mb-2 text-center">تکمیل ثبت‌نام</h3>
    <p class="text-sm text-muted mb-6 text-center">لطفا اطلاعات خود را وارد کنید</p>

    <form @submit.prevent="$emit('submit')" class="space-y-4">
      <input
        :value="fullName"
        @input="$emit('update:fullName', $event.target.value)"
        type="text"
        placeholder="نام و نام خانوادگی"
        class="w-full py-3 px-4 border rounded-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="loading"
      />
      <input
        :value="password"
        @input="$emit('update:password', $event.target.value)"
        type="password"
        placeholder="رمز عبور (حداقل ۶ کاراکتر)"
        class="w-full py-3 px-4 border rounded-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="loading"
      />
      <button
        type="submit"
        :disabled="loading || !isValid"
        class="w-full btn py-3 px-4 rounded-inner transition disabled:opacity-60"
      >
        <span v-if="!loading">ثبت‌نام</span>
        <span v-else class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          در حال ثبت‌نام...
        </span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  fullName: String,
  password: String,
  loading: Boolean
})

defineEmits(['update:fullName', 'update:password', 'submit'])

const isValid = computed(() => props.fullName?.length >= 3 && props.password?.length >= 6)
</script>
