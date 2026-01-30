<template>
  <div class="w-[80%]">
    <div class="grid grid-cols-4 gap-2">
      <div
        v-for="(item, index) in props.weight"
        :key="index"
        @click="selectWeight(item)"
        class="cursor-pointer text-center border p-2 rounded-inner transition-colors duration-200 text-xs"
        :class="{
          'bg-secondary text-primery border-black': selectedWeight === item,
          'bg-primary text text-muted border-border-light': selectedWeight !== item
        }"
      >
        <span>{{ item }}</span>
      </div>
    </div>
    <p v-if="props.showError && !selectedWeight" class="text-red-500 text-xs mt-2">
      لطفاً ابتدا وزن مورد نظر را انتخاب کنید
    </p>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

// props
const props = defineProps({
  weight: {
    type: Array,
    default: () => [50, 100, 150, 200, 250, 500]
  },
  showError: {
    type: Boolean,
    default: false
  }
})

// Debug log
watch(() => props.showError, (newVal) => {
  console.log('🚨 showError changed to:', newVal)
})

const emit = defineEmits(['update:modelValue'])

// state داخلی برای نگه داشتن وزن انتخاب شده (فقط یکی)
const selectedWeight = ref(null)

// انتخاب وزن
function selectWeight(item) {
  selectedWeight.value = item
  emit('update:modelValue', item)
  console.log('🎯 Selected weight:', item)
}
</script>
