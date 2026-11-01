<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  weight: {
    type: [Array, String],
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const selectedOption = ref(null)

const safeDecode = (value) => {
  if (typeof value !== 'string') return value
  try {
    return decodeURIComponent(value)
  } catch (error) {
    return value
  }
}

const normalizeToArray = (input) => {
  if (Array.isArray(input)) return input

  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input)
      if (Array.isArray(parsed)) return parsed
    } catch (error) { }

    if (input.includes(',')) return input.split(',').map((item) => item.trim())
    return [input]
  }

  return []
}

const normalizedOptions = computed(() => {
  const rawOptions = props.options?.length ? props.options : normalizeToArray(props.weight)

  return rawOptions.map((item) => {
    if (item && typeof item === 'object') {
      const id = item.id ?? item.value ?? item.title ?? item.label ?? item
      const value = item.value ?? item.id ?? item.title ?? item.label ?? ''
      const label = safeDecode(item.label ?? item.title ?? item.value ?? '')
      return {
        id,
        value,
        label,
        isAvailable: item.isAvailable ?? item.is_available ?? true
      }
    }

    const normalizedValue = safeDecode(String(item))
    return {
      id: normalizedValue,
      value: normalizedValue,
      label: normalizedValue,
      isAvailable: true
    }
  })
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      selectedOption.value = null
      return
    }
    const option = normalizedOptions.value.find(
      (item) => item.id === newValue || item.value === newValue
    )
    selectedOption.value = option ?? null
  },
  { immediate: true }
)

const selectOption = (option) => {
  // 🔹 فقط disabled واقعی جلوی انتخاب رو می‌گیره
  // گزینه ناموجود قابل انتخابه چون ممکنه در ترکیب دیگه موجود باشه
  if (props.disabled) return
  selectedOption.value = option
  emit('update:modelValue', option.id)
}
</script>

<template>
  <div class="w-[80%]">
    <p v-if="label" class="text-xs font-medium text-muted mb-2">
      {{ label }}
    </p>

    <div class="grid grid-cols-4 gap-2">
      <button v-for="option in normalizedOptions" :key="option.id" type="button" @click="selectOption(option)"
        class="relative cursor-pointer text-center border p-2 rounded-inner transition-colors duration-200 text-xs"
        :class="{
          'bg-secondary text-primery !border-black':
            selectedOption?.id === option.id && !disabled,
          'bg-primary text-muted border-border-light':
            selectedOption?.id !== option.id || disabled,
          'cursor-not-allowed opacity-50': disabled,
          'opacity-50': !option.isAvailable && !disabled
        }">
        <span :class="{ 'line-through': !option.isAvailable }">{{ option.label }}</span>

        <!-- 🔹 ضربدر روی گزینه ناموجود -->
        <svg v-if="!option.isAvailable" class="absolute inset-0 m-auto w-6 h-6 text-red-500 pointer-events-none"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>
    </div>

    <p v-if="showError && !selectedOption" class="text-red-500 text-xs mt-2">
      لطفاً ابتدا گزینه مورد نظر را انتخاب کنید
    </p>
  </div>
</template>