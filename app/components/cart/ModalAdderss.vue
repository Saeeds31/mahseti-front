<template>
  <div
    v-if="show"
    class="fixed inset-0 p-10 bg-black/60 flex items-center justify-center z-50"
    @click.self="emit('close')"
  >
    <div class="bg-primary rounded-lg w-full max-w-2xl p-4 relative">
      
      <!-- دکمه بستن -->
      <button
        @click="emit('close')"
        class="absolute top-3 left-3 text-gray-500 hover:text-gray-800"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- عنوان -->
      <h2 class="text-lg font-semibold mb-4 pb-4 border-b ">
        {{ editAddress ? 'ویرایش آدرس' : 'افزودن آدرس' }}
      </h2>

      <!-- فرم -->
      <form
        @submit.prevent="saveAddress"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
      >
        <!-- استان -->
        <div class="flex flex-col gap-2">
          <label for="province" class="font-semibold text-sm">استان</label>
          <select
            id="province"
            v-model="province_id"
            @change="validateProvince"
            class="border rounded-inner p-3 py-4 w-full outline-hidden"
            :class="{ 'border-red-500': errors.province_id }"
          >
            <option value="">انتخاب استان</option>
            <option v-for="province in provinces" :key="province.id" :value="province.id">
              {{ province.name }}
            </option>
          </select>
          <span v-if="errors.province_id" class="text-red-500 text-xs">{{ errors.province_id }}</span>
        </div>

        <!-- شهر -->
        <div class="flex flex-col gap-2">
          <label for="city" class="font-semibold text-sm">شهر</label>
          <select
            id="city"
            v-model="city_id"
            @change="validateCity"
            class="border rounded-inner p-3 py-4 w-full outline-hidden"
            :class="{ 'border-red-500': errors.city_id }"
            :disabled="!province_id"
          >
            <option value="">انتخاب شهر</option>
            <option v-for="city in cities" :key="city.id" :value="city.id">
              {{ city.name }}
            </option>
          </select>
          <span v-if="errors.city_id" class="text-red-500 text-xs">{{ errors.city_id }}</span>
        </div>

        <!-- نام گیرنده -->
        <div class="flex flex-col gap-2 md:col-span-2">
          <label for="receiver_name" class="font-semibold text-sm">نام گیرنده</label>
          <input
            id="receiver_name"
            v-model="receiver_name"
            @blur="validateReceiverName"
            type="text"
            class="border rounded-inner p-3 py-4 w-full outline-hidden"
            :class="{ 'border-red-500': errors.receiver_name }"
          />
          <span v-if="errors.receiver_name" class="text-red-500 text-xs">{{ errors.receiver_name }}</span>
        </div>

        <!-- کد پستی -->
        <div class="flex flex-col gap-2">
          <label for="postal" class="font-semibold text-sm">کد پستی</label>
          <input
            id="postal"
            v-model="postal_code"
            @blur="validatePostalCode"
            type="text"
            maxlength="10"
            class="border rounded-inner p-3 py-4 w-full outline-hidden"
            :class="{ 'border-red-500': errors.postal_code }"
          />
          <span v-if="errors.postal_code" class="text-red-500 text-xs">{{ errors.postal_code }}</span>
        </div>

        <!-- شماره تماس -->
        <div class="flex flex-col gap-2">
          <label for="phone" class="font-semibold text-sm">شماره تماس</label>
          <input
            id="phone"
            v-model="phone"
            @blur="validatePhone"
            type="text"
            maxlength="11"
            class="border rounded-inner p-3 py-4 w-full outline-hidden"
            :class="{ 'border-red-500': errors.phone }"
          />
          <span v-if="errors.phone" class="text-red-500 text-xs">{{ errors.phone }}</span>
        </div>

        <!-- آدرس -->
        <div class="flex flex-col gap-2 md:col-span-2">
          <label for="address_line" class="font-semibold text-sm">آدرس کامل</label>
          <textarea
            id="address_line"
            v-model="address_line"
            @blur="validateAddressLine"
            rows="2"
            class="border rounded-inner p-3 py-4 w-full outline-hidden resize-none"
            :class="{ 'border-red-500': errors.address_line }"
          ></textarea>
          <span v-if="errors.address_line" class="text-red-500 text-xs">{{ errors.address_line }}</span>
        </div>

        <!-- دکمه -->
        <div class="md:col-span-2">
          <button type="submit" :disabled="loading" class="btn ">
            {{ loading ? 'در حال ذخیره...' : 'ذخیره آدرس' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  editAddress: Object  // آدرس برای ویرایش
})
const emit = defineEmits(['close', 'save'])

const { createAddress, updateAddress, loading } = useAddresses()
const { provinces, cities, fetchProvinces, fetchCities } = useLocations()

const province_id = ref('')
const city_id = ref('')
const receiver_name = ref('')
const postal_code = ref('')
const phone = ref('')
const address_line = ref('')

// Load provinces when modal opens and fill form if editing
watch(() => props.show, async (isOpen) => {
  if (isOpen) {
    if (provinces.value.length === 0) {
      console.log('🔄 Modal opened, loading provinces...')
      await fetchProvinces()
    }

    // اگر در حالت ویرایش هستیم، فرم را پر کنید
    if (props.editAddress) {
      console.log('✏️ Loading address for edit:', props.editAddress)
      receiver_name.value = props.editAddress.receiver_name || ''
      province_id.value = props.editAddress.province_id || ''
      city_id.value = props.editAddress.city_id || ''
      postal_code.value = props.editAddress.postal_code || ''
      phone.value = props.editAddress.phone || ''
      address_line.value = props.editAddress.address_line || ''

      // بارگذاری شهرها برای استان انتخاب شده
      if (province_id.value) {
        await fetchCities(province_id.value)
      }
    } else {
      // پاک کردن فرم برای آدرس جدید
      province_id.value = ''
      city_id.value = ''
      receiver_name.value = ''
      postal_code.value = ''
      phone.value = ''
      address_line.value = ''
    }
  }
})

// Load provinces on mount as well
onMounted(async () => {
  console.log('🎯 Component mounted')
  if (provinces.value.length === 0) {
    await fetchProvinces()
  }
})

// Watch province changes to load cities
watch(province_id, async (newProvinceId) => {
  console.log('🔄 Province changed:', newProvinceId)
  if (newProvinceId) {
    city_id.value = '' // Reset city when province changes
    await fetchCities(newProvinceId)
  } else {
    cities.value = []
  }
})

const errors = ref({
  province_id: '',
  city_id: '',
  receiver_name: '',
  postal_code: '',
  phone: '',
  address_line: ''
})

// Validation functions
const validateReceiverName = () => {
  if (!receiver_name.value.trim()) {
    errors.value.receiver_name = 'نام گیرنده الزامی است'
    return false
  }
  if (receiver_name.value.trim().length < 4) {
    errors.value.receiver_name = 'نام گیرنده باید حداقل 4 حرف باشد'
    return false
  }
  errors.value.receiver_name = ''
  return true
}

const validatePhone = () => {
  if (!phone.value.trim()) {
    errors.value.phone = 'شماره تماس الزامی است'
    return false
  }
  const phoneRegex = /^09\d{9}$/
  if (!phoneRegex.test(phone.value)) {
    errors.value.phone = 'شماره تماس باید 11 رقم و با 09 شروع شود'
    return false
  }
  errors.value.phone = ''
  return true
}

const validatePostalCode = () => {
  if (!postal_code.value.trim()) {
    errors.value.postal_code = 'کد پستی الزامی است'
    return false
  }
  const postalRegex = /^\d{10}$/
  if (!postalRegex.test(postal_code.value)) {
    errors.value.postal_code = 'کد پستی باید 10 رقم باشد'
    return false
  }
  errors.value.postal_code = ''
  return true
}

const validateAddressLine = () => {
  if (!address_line.value.trim()) {
    errors.value.address_line = 'آدرس الزامی است'
    return false
  }
  const wordCount = address_line.value.trim().split(/\s+/).length
  if (wordCount < 3) {
    errors.value.address_line = 'آدرس باید حداقل 3 کلمه داشته باشد'
    return false
  }
  errors.value.address_line = ''
  return true
}

const validateProvince = () => {
  if (!province_id.value) {
    errors.value.province_id = 'انتخاب استان الزامی است'
    return false
  }
  errors.value.province_id = ''
  return true
}

const validateCity = () => {
  if (!city_id.value) {
    errors.value.city_id = 'انتخاب شهر الزامی است'
    return false
  }
  errors.value.city_id = ''
  return true
}

const isFormValid = computed(() => {
  return (
    !errors.value.province_id &&
    !errors.value.city_id &&
    !errors.value.receiver_name &&
    !errors.value.postal_code &&
    !errors.value.phone &&
    !errors.value.address_line &&
    province_id.value &&
    city_id.value &&
    receiver_name.value &&
    postal_code.value &&
    phone.value &&
    address_line.value
  )
})

async function saveAddress() {
  // Validate all fields
  const isProvinceValid = validateProvince()
  const isCityValid = validateCity()
  const isNameValid = validateReceiverName()
  const isPhoneValid = validatePhone()
  const isPostalValid = validatePostalCode()
  const isAddressValid = validateAddressLine()

  if (!isProvinceValid || !isCityValid || !isNameValid || !isPhoneValid || !isPostalValid || !isAddressValid) {
    return
  }

  try {
    const addressData = {
      receiver_name: receiver_name.value,
      province_id: province_id.value,
      city_id: city_id.value,
      postal_code: postal_code.value,
      address_line: address_line.value,
      phone: phone.value
    }

    // اگر در حالت ویرایش هستیم
    if (props.editAddress && props.editAddress.id) {
      await updateAddress(props.editAddress.id, addressData)
    } else {
      await createAddress(addressData)
    }

    // Clear form
    province_id.value = ''
    city_id.value = ''
    receiver_name.value = ''
    postal_code.value = ''
    phone.value = ''
    address_line.value = ''

    // Clear errors
    errors.value = {
      province_id: '',
      city_id: '',
      receiver_name: '',
      postal_code: '',
      phone: '',
      address_line: ''
    }

    emit('save')
  } catch (err) {
    console.error('❌ Save address error:', err)

    // نمایش خطاهای سرور
    if (err.response?.data?.errors) {
      const serverErrors = err.response.data.errors
      console.log('Server validation errors:', serverErrors)

      // نمایش خطاهای فیلدها
      if (serverErrors.receiver_name) errors.value.receiver_name = serverErrors.receiver_name[0]
      if (serverErrors.province_id) errors.value.province_id = serverErrors.province_id[0]
      if (serverErrors.city_id) errors.value.city_id = serverErrors.city_id[0]
      if (serverErrors.postal_code) errors.value.postal_code = serverErrors.postal_code[0]
      if (serverErrors.address_line) errors.value.address_line = serverErrors.address_line[0]
      if (serverErrors.phone) errors.value.phone = serverErrors.phone[0]

      alert('لطفاً خطاهای فرم را بررسی کنید')
    } else {
      alert(err.response?.data?.message || 'خطا در ذخیره آدرس')
    }
  }
}
</script>


<style scoped>

.input-short:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15);
}
</style>