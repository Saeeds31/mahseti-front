<template>
  <div class="border-b flex gap-4 pb-5 items-center">
    <span class="font-semibold">مرتب سازی :</span>
    <ul class="flex gap-2 flex-wrap">
      <li
        v-for="option in sortOptions"
        :key="option.label"
        :class="{ active: selectedLabel === option.label }"
        @click="selectSort(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'relevance' // مقدار پیش‌فرض API
  }
})

const emit = defineEmits(['update:modelValue'])

// مپ کردن متن فارسی به مقدار قابل قبول API
const sortOptions = [
  { label: 'مرتبط ترین', value: 'relevance' },
  { label: 'پرفروش ترین', value: 'best_selling' },
  { label: 'پربازدید ترین', value: 'most_viewed' },
  { label: 'تخفیف دار', value: 'discounted' },
  { label: 'جدیدترین', value: 'newest' },
]

// پیدا کردن label فعلی بر اساس value دریافتی از والد
const selectedLabel = ref(
  sortOptions.find(opt => opt.value === props.modelValue)?.label || 'مرتبط ترین'
)

// وقتی والد مقدار رو تغییر داد (مثلاً از URL یا فیلتر دیگر)
watch(() => props.modelValue, (newVal) => {
  const found = sortOptions.find(opt => opt.value === newVal)
  selectedLabel.value = found ? found.label : 'مرتبط ترین'
})

// وقتی کاربر کلیک کرد
const selectSort = (option) => {
  selectedLabel.value = option.label
  emit('update:modelValue', option.value) // فقط value رو به والد می‌فرستیم
}
</script>

<style scoped>
li {
  color: var(--text-muted);
  padding: 4px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.4s ease;
}

li:hover {
  background-color: var(--bg-secondary);
  color: var(--bg-primary);
}

li.active {
  background-color: var(--bg-secondary);
  color: var(--bg-primary);
  font-weight: 600;
}
</style>