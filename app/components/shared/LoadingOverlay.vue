<template>
  <teleport to="body">
    <transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="loading-overlay" :class="{ 'full-screen': fullScreen }">
        <div class="loading-content">
          <SharedLoadingSpinner :size="size" :color="color" />
          <p v-if="message" class="loading-message">{{ message }}</p>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  fullScreen: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'lg'
  },
  color: {
    type: String,
    default: '#4F46E5'
  }
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.loading-overlay.full-screen {
  width: 100vw;
  height: 100vh;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.loading-message {
  font-size: 16px;
  color: #374151;
  margin: 0;
  text-align: center;
  font-weight: 500;
}
</style>
