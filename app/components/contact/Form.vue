<template>
       <section class="pt-10 pb-10">
     <div class="flex flex-col justify-center items-center my-5">
      <h2 class="font-bold text-2xl">ارتباط با ما </h2>
      <p class="text-muted mt-2">asdfghjkl;''</p>
     </div>


      <form @submit.prevent="handleSubmit" class="container mt-6 px-4">
        <!-- نام کامل و شماره موبایل -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block font-bold mb-3">نام کامل</label>
            <div class="relative px-4 py-3 border rounded-inner border-light bg-accent text" :class="{'border-red-500': errors.full_name}">
              <input
                v-model="formData.full_name"
                type="text"
                placeholder="نام کامل"
                class="w-full pr-10 outline-none bg-transparent"
              />
              <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted">
                <iconUserInput />
              </span>
            </div>
            <p v-if="errors.full_name" class="text-red-500 text-sm mt-1">{{ errors.full_name[0] }}</p>
          </div>

          <div>
            <label class="block font-bold mb-3">شماره موبایل</label>
            <div class="relative px-4 py-3 border rounded-inner border-light bg-accent text" :class="{'border-red-500': errors.mobile}">
              <input
                v-model="formData.mobile"
                type="tel"
                placeholder="شماره موبایل"
                class="w-full pr-10 outline-none bg-transparent"
              />
              <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted">
                <iconPhoneinput />
              </span>
            </div>
            <p v-if="errors.mobile" class="text-red-500 text-sm mt-1">{{ errors.mobile[0] }}</p>
          </div>
        </div>

        <!-- موضوع -->
        <div class="mb-6">
          <label class="block font-bold mb-3">موضوع</label>
          <div class="relative px-4 py-3 border rounded-inner border-light bg-accent text" :class="{'border-red-500': errors.subject}">
            <input
              v-model="formData.subject"
              type="text"
              placeholder="موضوع"
              class="w-full pr-10 outline-none bg-transparent"
            />
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted">
              <iconSubjectinput />
            </span>
          </div>
          <p v-if="errors.subject" class="text-red-500 text-sm mt-1">{{ errors.subject[0] }}</p>
        </div>

        <!-- پیام -->
        <div class="mb-6">
          <label for="body" class="block font-bold mb-3">پیام شما</label>
          <div class="relative px-4 py-3 border rounded-inner border-light bg-accent text" :class="{'border-red-500': errors.body}">
            <textarea
              v-model="formData.body"
              id="body"
              rows="6"
              placeholder="پیام"
              class="w-full pr-10 outline-none bg-transparent resize-none"
            ></textarea>
            <span class="absolute right-3 top-6 text-muted">
              <iconPeninput />
            </span>
          </div>
          <p v-if="errors.body" class="text-red-500 text-sm mt-1">{{ errors.body[0] }}</p>
        </div>

        <!-- چک‌باکس و دکمه ارسال -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="btn w-full sm:w-auto order-2 sm:order-1"
            :class="{'opacity-50 cursor-not-allowed': loading || !isFormValid}"
          >
            {{ loading ? 'در حال ارسال...' : 'ارسال پیام' }}
          </button>

          <div class="flex items-start gap-2 flex-1 order-1 sm:order-2">
            <input
              v-model="agreement"
              type="checkbox"
              id="agreement"
              class="mt-1 w-4 h-4 border rounded text-secondary focus:ring-secondary flex-shrink-0"
            />
            <label for="agreement" class="text-sm text-gray-600 text-right">
              من موافقم که اطلاعات من جمع‌آوری و ذخیره می‌شوند
            </label>
          </div>
        </div>
      </form>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApi } from '@/composables/api/useApi'

const { submitContact } = useApi()
const toast = useToast()

const formData = ref({
  full_name: '',
  mobile: '',
  subject: '',
  body: ''
})

const errors = ref({})
const loading = ref(false)
const agreement = ref(false)

// اعتبارسنجی فرم
const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!formData.value.full_name || formData.value.full_name.trim() === '') {
    errors.value.full_name = ['فیلد نام کامل الزامی است.']
    isValid = false
  }

  if (!formData.value.mobile || formData.value.mobile.trim() === '') {
    errors.value.mobile = ['فیلد شماره موبایل الزامی است.']
    isValid = false
  } else if (!/^09[0-9]{9}$/.test(formData.value.mobile)) {
    errors.value.mobile = ['شماره موبایل باید با 09 شروع شود و 11 رقم باشد.']
    isValid = false
  }

  if (!formData.value.subject || formData.value.subject.trim() === '') {
    errors.value.subject = ['فیلد موضوع الزامی است.']
    isValid = false
  }

  if (!formData.value.body || formData.value.body.trim() === '') {
    errors.value.body = ['فیلد پیام الزامی است.']
    isValid = false
  }

  return isValid
}

// چک کردن اینکه آیا فرم معتبر است
const isFormValid = computed(() => {
  return formData.value.full_name.trim() !== '' &&
         formData.value.mobile.trim() !== '' &&
         formData.value.subject.trim() !== '' &&
         formData.value.body.trim() !== '' &&
         agreement.value
})

const handleSubmit = async () => {
  // اعتبارسنجی فرم
  if (!validateForm()) {
    toast.add({
      title: 'خطا',
      description: 'لطفاً تمام فیلدهای الزامی را پر کنید',
      color: 'red'
    })
    return
  }

  if (!agreement.value) {
    toast.add({
      title: 'خطا',
      description: 'لطفاً موافقت خود را با ذخیره اطلاعات تأیید کنید',
      color: 'red'
    })
    return
  }

  errors.value = {}
  loading.value = true

  try {
    const response = await submitContact(formData.value)

    if (response.success) {
      toast.add({
        title: 'موفقیت',
        description: response.message || 'پیام شما با موفقیت ارسال شد',
        color: 'green'
      })

      // پاک کردن فرم
      formData.value = {
        full_name: '',
        mobile: '',
        subject: '',
        body: ''
      }
      agreement.value = false
      errors.value = {}
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }

    toast.add({
      title: 'خطا',
      description: error.response?.data?.message || 'خطایی در ارسال پیام رخ داد',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>