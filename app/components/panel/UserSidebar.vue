<template>
  <div class="card text-center border shadow p-8 rounded">
    <div class="flex justify-center flex-col items-center gap-3">
       <!-- <figure class="w-20 h-20  rounded-full">
          <img class="object-cover border-4 border-[#72B742] w-full h-full rounded-full" src="@/assets/images/about.png" alt="">
       </figure> -->
      <p class="font-semibold">{{ userProfile?.full_name || 'کاربر' }}</p>
      <p class="text-sm text-gray-500">{{ formatMobile(userProfile?.mobile) }}</p>
    </div>

  <ul class="space-y-4 text-right mt-10">
  <NuxtLink
    v-for="(item, index) in menu"
    :key="index"
    :to="item.to"
    class="sidebar-item flex items-center gap-3"
    :class="{ active: route.path === item.to }"
  >
    <component :is="item.icon" class="w-5 h-5 transition-colors" />
    <span>{{ item.label }}</span>
  </NuxtLink>

  <li
    class="text-red-500 cursor-pointer px-3 py-2"
    @click="logout"
  >
    خروج
  </li>
</ul>

  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  Wallet,
  LogOut
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// دریافت اطلاعات کاربر از localStorage
const userProfile = computed(() => {
  if (process.client) {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error('❌ Failed to parse user data from localStorage:', error)
        return null
      }
    }
  }
  return null
})

const menu = [
  { label: 'حساب کاربری', to: '/panel', icon: User },
  { label: 'کیف پول', to: '/panel/wallet', icon: Wallet },
  { label: 'لیست آدرس‌ها', to: '/panel/addresses', icon: MapPin },
  { label: 'پیگیری سفارشات', to: '/panel/orders', icon: ShoppingBag },
  { label: 'لیست علاقه‌مندی‌ها', to: '/panel/favorites', icon: Heart }
]

const formatMobile = (mobile) => {
  if (!mobile) return '---'
  // نمایش شماره به صورت 0912***333
  const mobileStr = mobile.toString()
  if (mobileStr.length >= 10) {
    return `${mobileStr.slice(0, 4)}***${mobileStr.slice(-3)}`
  }
  return mobile
}

const logout = () => {
  // اینجا API logout + پاک کردن token
  router.push('/login')
}
</script>

<style scoped>
.sidebar-item {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-item.active {
  background: var(--bg-secondary-fade);
  color: var(--text-strong);
}
</style>
