<template>
  <div
    v-if="show"
    class="fixed inset-0 p-4 bg-black/60 flex items-center justify-center z-50"
    @click.self="emit('close')"
  >
    <div class="bg-primary rounded-lg w-full max-w-2xl p-6 relative">
      
      <!-- دکمه بستن -->
      <button
        @click="emit('close')"
        class="absolute top-4 left-4 text-gray-500 hover:text-gray-800"
      >
        <X class="w-6 h-6" />
      </button>

      <!-- عنوان -->
      <h2 class="text-xl font-semibold mb-6 pb-6 border-b ">
        اطلاعات کاربری
      </h2>

      <!-- فرم -->
      <form
        @submit.prevent="saveUser"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
      >
        <!-- نام و نام خانوادگی -->
        <div class="flex flex-col gap-3">
          <label for="fullName" class="font-bold">نام و نام خانوادگی</label>
          <input
            id="fullName"
            v-model="name"
            type="text"
            placeholder="مثال: حمیدرضا حاج‌دادی"
            class="border rounded-inner p-3 py-4 w-full outline-hidden "
          />
        </div>

        <!-- تاریخ تولد -->
        <div class="flex flex-col gap-3 relative">
          <label for="birthDate" class="font-bold">تاریخ تولد</label>
          <Calendar
            class="absolute right-4 top-[44px] w-4 h-4 text-gray-400 pointer-events-none"
          />
          <input
            id="birthDate"
            v-model="birthDate"
            type="date"
            class="border rounded-inner p-3 py-4 w-full outline-hidden  pr-10"
          />
        </div>

        <!-- شماره تماس -->
        <div class="flex flex-col gap-3">
          <label for="phone" class="font-bold">شماره تماس</label>
          <input
            id="phone"
            v-model="phone"
            type="text"
            placeholder="۰۹*********"
            class="border rounded-inner p-3 py-4 w-full outline-hidden "
          />
        </div>

        <!-- کد ملی -->
        <div class="flex flex-col gap-3">
          <label for="nationalCode" class="font-bold">کد ملی</label>
          <input
            id="nationalCode"
            v-model="nationalCode"
            type="text"
            placeholder="۱۲۳۴۵۶۷۸۹۰"
            class="border rounded-inner p-3 py-4 w-full outline-hidden "
          />
        </div>

        <!-- ایمیل -->
        <div class="flex flex-col gap-3">
          <label for="email" class="font-bold">ایمیل</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="example@mail.com"
            class="border rounded-inner p-3 py-4 w-full outline-hidden "
          />
        </div>

        <!-- رمز عبور -->
        <div class="flex flex-col gap-3">
          <label for="password" class="font-bold">رمز عبور</label>
          <input id="password" v-model="password" type="password" class="input" />
        </div>

        <!-- تأیید رمز عبور -->
        <div class="flex flex-col gap-3">
          <label for="confirmPassword" class="font-bold">تأیید رمز عبور</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="border rounded-inner p-3 py-4 w-full outline-hidden "
          />
        </div>

        <!-- دکمه -->
        <div class="md:col-span-2">
          <button type="submit" class="btn w-full" :disabled="loading">
            {{ loading ? 'در حال ذخیره...' : 'ذخیره اطلاعات' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
      import { useApi } from '@/composables/api/useApi'

import { ref, watch } from 'vue'
import { X, Calendar } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  userData: Object
})
const emit = defineEmits(['close', 'save'])

const name = ref('')
const birthDate = ref('')
const phone = ref('')
const email = ref('')
const nationalCode = ref('')
const password = ref('')
const confirmPassword = ref('')

// وقتی modal باز میشه یا userData تغییر میکنه، فیلدها رو پر کن
watch(() => [props.show, props.userData], ([show, userData]) => {
  if (show && userData) {
    name.value = userData.full_name || ''
    birthDate.value = userData.birth_date || ''
    phone.value = userData.mobile || ''
    email.value = userData.email || ''
    nationalCode.value = userData.national_code || ''
    // پسورد رو خالی نگه می‌داریم
    password.value = ''
    confirmPassword.value = ''
  }
}, { immediate: true })

const { updateUserProfile } = useApi()
const loading = ref(false)

async function saveUser() {
  const toast = useToast()

  // فقط نام و موبایل الزامیه
  if (!name.value || !phone.value) {
    toast.add({
      title: 'خطا',
      description: 'لطفاً نام و شماره تماس را وارد کنید',
      color: 'red'
    })
    return
  }

  // اگر پسورد وارد شده، تایید پسورد هم باید باشه
  if (password.value && password.value !== confirmPassword.value) {
    toast.add({
      title: 'خطا',
      description: 'رمز عبور و تأیید آن یکسان نیست',
      color: 'red'
    })
    return
  }

  loading.value = true

  try {
    const updateData = {
      full_name: name.value,
      mobile: phone.value,
      birth_date: birthDate.value || undefined,
      email: email.value || undefined,
      national_code: nationalCode.value || undefined
    }

    // فقط اگر پسورد وارد شده باشه اضافه کن
    if (password.value) {
      updateData.password = password.value
      updateData.password_confirmation = confirmPassword.value
    }

    await updateUserProfile(updateData)

    toast.add({
      title: 'موفقیت',
      description: 'اطلاعات با موفقیت به‌روزرسانی شد',
      color: 'green'
    })
    emit('save')
    emit('close')
  } catch (error) {
    console.error('Failed to update profile:', error)
    toast.add({
      title: 'خطا',
      description: error.response?.data?.message || 'خطا در به‌روزرسانی اطلاعات',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>


.input:focus {
  border-color: var(--bg-secondary);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15);
}

/* حذف آیکن پیش‌فرض تاریخ */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  display: none;
}

input[type="date"] {
  appearance: none;
  -webkit-appearance: none;
}
</style>

