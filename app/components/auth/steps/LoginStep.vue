<template>
  <div class="animate-fade-in">
    <h3 class="text-xl font-bold mb-2 text">ورود با رمز عبور</h3>
    <p class="text-sm text-muted mb-4 flex items-center justify-center gap-2">
      <span>شماره:</span>
      <strong class="text">{{ formatMobile }}</strong>
    </p>
    
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
      <div class="relative">
        <input 
          ref="passwordInput"
          :value="password"
          @input="$emit('update:password', $event.target.value)"
          @keyup.enter="handleSubmit"
          :type="showPassword ? 'text' : 'password'"
          placeholder="رمز عبور" 
          class="w-full pad border rounded-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition pl-10"
          autocomplete="current-password"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-strong transition"
          tabindex="-1"
        >
          <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
      
      <LoadingButton 
        :loading="loading"
        :disabled="!password || password.length < 6"
        type="submit"
      >
        ورود
      </LoadingButton>
      
      <div class="relative my-2">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="bg-primary px-2 text-muted">یا</span>
        </div>
      </div>
      
      <button 
        type="button"
        class="bg-accent text pad rounded-inner hover:bg-accent-fade transition flex items-center justify-center gap-2 font-medium"
        @click="$emit('switchToOtp')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
          <path d="M12 18h.01"/>
        </svg>
        ورود با کد یکبار مصرف
      </button>
    </form>
    
    <p class="text-xs text-muted text-center mt-4">
      رمز عبور خود را فراموش کرده‌اید؟ از کد یکبار مصرف استفاده کنید
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LoadingButton from '../LoadingButton.vue'

const props = defineProps({
  password: {
    type: String,
    default: '',
  },
  mobile: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:password', 'submit', 'switchToOtp'])

const passwordInput = ref(null)
const showPassword = ref(false)

const formatMobile = computed(() => {
  // فرمت: 0912 *** 6789
  const mobile = props.mobile
  if (mobile.length === 11) {
    return `${mobile.slice(0, 4)} *** ${mobile.slice(7)}`
  }
  return mobile
})

const handleSubmit = () => {
  if (props.password && props.password.length >= 6 && !props.loading) {
    emit('submit')
  }
}

onMounted(() => {
  passwordInput.value?.focus()
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>