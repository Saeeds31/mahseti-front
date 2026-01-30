<template>
  <div class="skeleton" :class="[shapeClass, sizeClass]" :style="customStyle"></div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'rectangular',
    validator: (value) => ['rectangular', 'circular', 'text'].includes(value)
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '20px'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const shapeClass = computed(() => `skeleton-${props.variant}`)
const sizeClass = computed(() => `skeleton-size-${props.size}`)

const customStyle = computed(() => {
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width
  const height = typeof props.height === 'number' ? `${props.height}px` : props.height

  return {
    width,
    height: props.variant === 'circular' ? width : height
  }
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}

.skeleton-rectangular {
  border-radius: 4px;
}

.skeleton-circular {
  border-radius: 50%;
}

.skeleton-text {
  border-radius: 4px;
  transform-origin: 0 55%;
  transform: scale(1, 0.6);
}

.skeleton-size-sm {
  height: 16px;
}

.skeleton-size-md {
  height: 20px;
}

.skeleton-size-lg {
  height: 24px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
