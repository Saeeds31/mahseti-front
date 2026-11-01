<template>
  <div class="otp-input-container" dir="ltr">
    <input
      v-for="(digit, index) in length"
      :key="index"
      :ref="el => inputRefs[index] = el"
      v-model="digits[index]"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      class="otp-input"
      @input="handleInput(index, $event)"
      @keydown="handleKeyDown(index, $event)"
      @paste="handlePaste"
      autocomplete="off"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  length: {
    type: Number,
    default: 6,
  },
})

const emit = defineEmits(['update:code'])

const digits = ref(Array(props.length).fill(''))
const inputRefs = ref([])

// وقتی code از بیرون تغییر می‌کنه
watch(() => props.code, (newCode) => {
  if (newCode !== digits.value.join('')) {
    digits.value = newCode.split('').slice(0, props.length)
    while (digits.value.length < props.length) {
      digits.value.push('')
    }
  }
}, { immediate: true })

const handleInput = (index, event) => {
  const value = event.target.value
  
  // فقط عدد قبول کن
  if (!/^\d*$/.test(value)) {
    event.target.value = ''
    return
  }

  // اگر چند تا عدد یکجا paste شد
  if (value.length > 1) {
    const numbers = value.split('').filter(char => /\d/.test(char))
    numbers.forEach((num, i) => {
      if (index + i < props.length) {
        digits.value[index + i] = num
      }
    })
    
    // فوکوس به آخرین خونه پر شده
    const nextIndex = Math.min(index + numbers.length, props.length - 1)
    focusInput(nextIndex)
  } else {
    digits.value[index] = value
    
    // اگر عدد وارد شد، برو خونه بعدی
    if (value && index < props.length - 1) {
      focusInput(index + 1)
    }
  }

  emitCode()
}

const handleKeyDown = (index, event) => {
  // Backspace
  if (event.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      // اگر خونه فعلی خالیه، برو عقب و پاکش کن
      digits.value[index - 1] = ''
      focusInput(index - 1)
      emitCode()
    } else if (digits.value[index]) {
      // اگر خونه فعلی پره، پاکش کن
      digits.value[index] = ''
      emitCode()
    }
    event.preventDefault()
  }
  
  // Arrow Left
  if (event.key === 'ArrowLeft' && index > 0) {
    focusInput(index - 1)
    event.preventDefault()
  }
  
  // Arrow Right
  if (event.key === 'ArrowRight' && index < props.length - 1) {
    focusInput(index + 1)
    event.preventDefault()
  }

  // اگر خونه پر بود و عدد جدید زد، جایگزین کن
  if (/^\d$/.test(event.key) && digits.value[index]) {
    digits.value[index] = ''
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text')
  const numbers = pastedData.replace(/\D/g, '').split('').slice(0, props.length)
  
  numbers.forEach((num, i) => {
    digits.value[i] = num
  })
  
  // فوکوس به آخرین خونه یا خونه بعدی خالی
  const nextEmptyIndex = digits.value.findIndex(d => !d)
  const focusIndex = nextEmptyIndex === -1 ? props.length - 1 : nextEmptyIndex
  focusInput(focusIndex)
  
  emitCode()
}

const focusInput = (index) => {
  nextTick(() => {
    inputRefs.value[index]?.focus()
    inputRefs.value[index]?.select()
  })
}

const emitCode = () => {
  const code = digits.value.join('')
  emit('update:code', code)
}

onMounted(() => {
  // فوکوس خودکار روی اولین input
  focusInput(0)
})
</script>

<style scoped>
.otp-input-container {
  display: flex;
  gap: 8px;
  justify-content: center;
  direction: ltr;
}

.otp-input {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background-color: #0000000D;
  transition: all 0.2s ease;
  outline: none;
}

.otp-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: scale(1.05);
}

.otp-input:not(:placeholder-shown) {
  border-color: #10b981;
  background-color: rgba(16, 185, 129, 0.05);
}

@media (max-width: 480px) {
  .otp-input {
    width: 40px;
    height: 48px;
    font-size: 20px;
  }
  
  .otp-input-container {
    gap: 6px;
  }
}
</style>