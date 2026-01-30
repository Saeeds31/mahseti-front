<template>
  <div class="card shadow p-8 rounded">
    <h2 class="font-semibold mb-4 text-xl border-b pb-8 ">
      اطلاعات کاربری
    </h2>

    <div v-if="profilePending" class="text-center py-10">
      <SharedLoadingSpinner size="lg" />
    </div>

    <div v-else-if="profileData" class="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm py-8 border-b">
      <div class="flex flex-col gap-2">
        <span class="text-lg">نام و نام خانوادگی:</span>
        <span class="text-muted">{{ profileData?.user?.full_name || '-' }}</span>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-lg">کد ملی:</span>
        <span class="text-muted">{{ profileData?.user?.national_code || '-' }}</span>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-lg">ایمیل:</span>
        <span class="text-muted">{{ profileData?.user?.email || '-' }}</span>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-lg">شماره تماس:</span>
        <span class="text-muted">{{ profileData?.user?.mobile || '-' }}</span>
      </div>
    </div>

    <!-- دکمه ویرایش -->
    <div v-if="profileData">
      <button class="btn mt-6" @click="showModal = true">
        ویرایش
      </button>

      <!-- مودال -->
      <panelEditUserModal
        :show="showModal"
        :userData="profileData?.user"
        @close="showModal = false"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script setup>
   import { useApi } from '@/composables/api/useApi'

import { ref } from 'vue'

definePageMeta({
  layout: 'panel',
  middleware: 'auth'
})

const { getUserProfile } = useApi()

// دریافت اطلاعات کاربر از API
const { data: profileData, pending: profilePending, refresh: refreshProfile } = await useAsyncData(
  'userProfile',
  async () => {
    try {
      return await getUserProfile()
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error)
      return { data: null }
    }
  },
  {
    lazy: true,
    server: false
  }
)

const showModal = ref(false)

async function handleSave() {
  console.log('✅ Profile updated successfully')
  // داده‌های پروفایل رو دوباره بگیر
  await refreshProfile()
}
</script>
