<template>
  <button v-if="!user" @click="showLoginModal()" class="icon-btn p-2 rounded-full">
    <iconProfile />
  </button>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
const route = useRoute()
const { loginModal, user } = useAuth();
function showLoginModal() {
  localStorage.setItem('lastPage', route.fullPath)
  loginModal.value = true;
}
</script>

<style scoped>
.icon-btn {
  background-color: var(--bg-secondary-fade);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.icon-btn:hover {
  background-color: var(--bg-secondary);
}
</style>