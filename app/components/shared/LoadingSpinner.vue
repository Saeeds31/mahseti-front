<template>
  <div class="loading-wrapper" :class="sizeClass">
    <div class="outer-ring"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: v => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v)
  }
})

const sizeClass = computed(() => `size-${props.size}`)
</script>

<style scoped>
/* ===== Wrapper ===== */
.loading-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* ===== Outer Ring ===== */
.outer-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid var(--bg-secondary-fade);
  border-top-color: var(--bg-secondary);
  animation: spin 0.9s linear infinite;
  box-shadow: var(--shadow);
}

/* ===== Inner Dot ===== */
.inner-dot {
  position: absolute;
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--bg-secondary),
    var(--bg-secondary-fade)
  );
  animation: pulse 1.2s ease-in-out infinite;
}

/* ===== Sizes ===== */
.size-xs {
  width: 18px;
  height: 18px;
}
.size-sm {
  width: 26px;
  height: 26px;
}
.size-md {
  width: 38px;
  height: 38px;
}
.size-lg {
  width: 54px;
  height: 54px;
}
.size-xl {
  width: 72px;
  height: 72px;
}

/* ===== Animations ===== */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.85);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}
</style>
