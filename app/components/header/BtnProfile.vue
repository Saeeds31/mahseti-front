<template>
  <!-- Profile Button - لاگین نکرده -->
  <button
    v-if="!user"
    @click="loginModal = true"
    class="icon-btn p-2 rounded-full transition hover:bg-secondary"
  >
    <iconProfile />
  </button>

  <!-- User Profile Dropdown - لاگین کرده -->
  <div v-else class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="  flex items-center gap-2 py-2 px-4 rounded-inner lg:rounded bg-secondary-fade hover:bg-secondary transition"
    >
      <span class="  font-medium">{{ user.full_name || user.mobile }}</span>
      <iconProfile class="w-5 h-5" />
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        class="absolute left-0 mt-2 w-48 rounded-inner bg-primary shadow-lg border border-gray-200 z-50"
      >
        <div class="py-1">
          <nuxt-link
            to="/panel"
            @click="isDropdownOpen = false"
            class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary-fade transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>پنل کاربری</span>
          </nuxt-link>

          <button
            @click="handleLogout"
            class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>خروج از حساب</span>
          </button>
        </div>
      </div>
    </transition>
  </div>

  <!-- Login Modal -->
  <AuthLoginModal v-if="loginModal" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingStore } from '~/store/settings'
import { useAuth } from '~/composables/useAuth'
import { useApiAuth } from '~/composables/useAuth'

const { logout } = useApiAuth()
const { loginModal } = useAuth()

const settingStore = useSettingStore()
const { user } = storeToRefs(settingStore)

const { $toast } = useNuxtApp()

// Dropdown
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleLogout = async () => {
  isDropdownOpen.value = false
  await logout()
  $toast.success('با موفقیت خارج شدید')
  navigateTo('/')
}

// بستن dropdown با کلیک خارج از آن
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.icon-btn {
  background-color: var(--bg-secondary-fade);
  transition: background-color 0.3s ease;
}

.icon-btn:hover {
  background-color: var(--bg-secondary);
}

.w-modal { max-width: 420px; width: 100%; }

section#loginModal form input {
  background-color: #0000000D;
}
</style>