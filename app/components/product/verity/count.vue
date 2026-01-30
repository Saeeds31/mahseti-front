<template>
  <div class="flex items-center border border-border-light rounded-inner w-32 overflow-hidden">
    <!-- دکمه منفی -->
    <button
      class="flex-1 text-center p-2 bg-accent text-muted hover:bg-accent-fade transition-colors"
      @click="decrease"
    >
      -
    </button>

    <!-- مقدار -->
    <div class="flex-1 text-center p-2 text-sm font-medium">
      {{ quantity }}
    </div>

    <!-- دکمه مثبت -->
    <button
      class="flex-1 text-center p-2 bg-accent text-muted hover:bg-accent-fade transition-colors"
      @click="increase"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

// props: مقدار اولیه
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 99
  }
})

const emit = defineEmits(['update:modelValue'])

const quantity = ref(props.modelValue)

watch(quantity, (val) => {
  emit('update:modelValue', val)
})

function increase() {
  if (quantity.value < props.max) quantity.value++
}

function decrease() {
  if (quantity.value > props.min) quantity.value--
}
</script>
