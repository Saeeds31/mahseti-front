<template>
  <div v-if="show" class="fixed inset-0 p-10 bg-black/60 flex items-center justify-center z-50"
    @click.self="emit('close')">
    <div class="h-[90vh] bg-primary rounded-lg w-full max-w-2xl flex flex-col relative overflow-hidden">
      <!-- ✅ پروگرس بار بالای مودال -->
      <div v-if="isSaving" class="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-20">
        <div class="h-full bg-secondary transition-all duration-200 ease-out" :style="{ width: progress + '%' }"></div>
      </div>
      <!-- هدر فیکس (عنوان + دکمه بستن) -->
      <div class="flex-shrink-0 px-4 pt-4 pb-4 border-b">
        <button @click="emit('close')" class="absolute top-3 left-3 text-gray-500 hover:text-gray-800 z-10">
          <X class="w-5 h-5" />
        </button>
        <h2 class="text-lg font-semibold text-center">
          {{ editAddress ? 'ویرایش آدرس' : 'افزودن آدرس' }}
        </h2>
      </div>

      <!-- بخش اسکرول‌شونده (فرم) -->
      <div class="flex-1 overflow-y-auto px-4 py-4 custom-scroll">
        <form id="addressForm" @submit.prevent="saveAddress" class="grid grid-cols-1 md:grid-cols-2 gap-4"
          :class="{ 'opacity-60 pointer-events-none': isSaving }">
          <!-- استان -->
          <div class="flex flex-col gap-2 relative" ref="provinceBox">
            <label for="province" class="font-semibold text-sm">استان</label>
            <input type="hidden" v-model="province_id" />
            <input id="province" type="text" v-model="provinceSearch" @focus="openProvinceDropdown"
              @input="onProvinceSearchInput" placeholder="جستجو یا انتخاب استان"
              class="border rounded-inner p-3 py-4 w-full outline-hidden"
              :class="{ 'border-red-500': errors.province_id }" autocomplete="new-password" />

            <ul v-if="provinceDropdownOpen && filteredProvinces.length"
              class="absolute top-full mt-1 w-full bg-white border rounded-inner shadow-lg max-h-60 overflow-y-auto z-50">
              <li v-for="province in filteredProvinces" :key="province.id" @click="selectProvince(province)"
                class="px-3 py-2 cursor-pointer hover:bg-gray-100">
                {{ province.name }}
              </li>
            </ul>

            <div v-if="provinceDropdownOpen && !filteredProvinces.length"
              class="absolute top-full mt-1 w-full bg-white border rounded-inner shadow-lg p-3 text-sm text-gray-500 z-50">
              استانی یافت نشد
            </div>

            <span v-if="errors.province_id" class="text-red-500 text-xs">{{ errors.province_id }}</span>
          </div>

          <div class="flex flex-col gap-2 relative" ref="cityBox">
            <label for="city" class="font-semibold text-sm">شهر</label>
            <input type="hidden" v-model="city_id" />
            <input id="city" type="text" v-model="citySearch" @focus="openCityDropdown" @input="onCitySearchInput"
              placeholder="جستجو یا انتخاب شهر" class="border rounded-inner p-3 py-4 w-full outline-hidden"
              :class="{ 'border-red-500': errors.city_id }" :disabled="!province_id" autocomplete="new-password" />

            <ul v-if="cityDropdownOpen && filteredCities.length"
              class="absolute top-full mt-1 w-full bg-white border rounded-inner shadow-lg max-h-60 overflow-y-auto z-50">
              <li v-for="city in filteredCities" :key="city.id" @click="selectCity(city)"
                class="px-3 py-2 cursor-pointer hover:bg-gray-100">
                {{ city.name }}
              </li>
            </ul>

            <div v-if="cityDropdownOpen && !filteredCities.length"
              class="absolute top-full mt-1 w-full bg-white border rounded-inner shadow-lg p-3 text-sm text-gray-500 z-50">
              شهری یافت نشد
            </div>

            <span v-if="errors.city_id" class="text-red-500 text-xs">
              {{ errors.city_id }}
            </span>
          </div>

          <!-- نام گیرنده -->
          <div class="flex flex-col gap-2 md:col-span-2">

            <div class="grid md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="font-semibold text-sm">نام گیرنده</label>
                <input id="first_name" autocomplete="new-password" v-model="first_name" @blur="validateFirstName"
                  type="text" placeholder="نام" class="border rounded-inner p-3 py-4 w-full outline-hidden"
                  :class="{ 'border-red-500': errors.first_name }" />
                <span v-if="errors.first_name" class="text-red-500 text-xs">{{ errors.first_name }}</span>
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-semibold text-sm">
                  نام خانوادگی گیرنده
                </label>
                <input id="last_name" autocomplete="new-password" v-model="last_name" @blur="validateLastName"
                  type="text" placeholder="نام خانوادگی" class="border rounded-inner p-3 py-4 w-full outline-hidden"
                  :class="{ 'border-red-500': errors.last_name }" />
                <span v-if="errors.last_name" class="text-red-500 text-xs">{{ errors.last_name }}</span>
              </div>
            </div>
          </div>

          <!-- کد پستی -->
          <div class="flex flex-col gap-2">
            <label for="postal" class="font-semibold text-sm">کد پستی</label>
            <input id="postal" v-model="postal_code" autocomplete="new-password" type="text" maxlength="10"
              class="border rounded-inner p-3 py-4 w-full outline-hidden" />
          </div>

          <!-- شماره تماس -->
          <div class="flex flex-col gap-2">
            <label for="phone" class="font-semibold text-sm">شماره تماس</label>
            <input id="phone" v-model="phone" @blur="validatePhone" type="tel" autocomplete="new-password"
              maxlength="11" class="border rounded-inner p-3 py-4 w-full outline-hidden"
              :class="{ 'border-red-500': errors.phone }" />
            <span v-if="errors.phone" class="text-red-500 text-xs">{{ errors.phone }}</span>
          </div>

          <!-- آدرس -->
          <div class="flex flex-col gap-2 md:col-span-2">
            <label for="address_line" class="font-semibold text-sm">آدرس کامل</label>
            <textarea id="address_line" v-model="address_line" @blur="validateAddressLine" autocomplete="new-password"
              rows="2" class="border rounded-inner p-3 py-4 w-full outline-hidden resize-none"
              :class="{ 'border-red-500': errors.address_line }"></textarea>
            <span v-if="errors.address_line" class="text-red-500 text-xs">{{ errors.address_line }}</span>
          </div>
        </form>
      </div>

      <!-- فوتر فیکس (دکمه ذخیره) -->
      <div class="flex-shrink-0 px-4 py-4 border-t bg-primary">
        <button type="submit" form="addressForm" :disabled="isSaving" class="btn w-full relative overflow-hidden">
          <span v-if="!isSaving">ذخیره آدرس</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ saveAttempt > 1 ? 'تلاش مجدد...' : 'در حال ذخیره...' }}
            <span class="text-xs opacity-80">({{ Math.round(progress) }}%)</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { X } from 'lucide-vue-next'
const props = defineProps({
  show: Boolean,
  editAddress: Object  // آدرس برای ویرایش
})
const emit = defineEmits(['close', 'save'])
watch(() => props.show, (isOpen) => {
  if (!isOpen && isSaving.value) {
    cancelProgress()
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }
})
const { createAddress, updateAddress, loading } = useAddresses()
const { provinces, cities, fetchProvinces, fetchCities } = useLocations()
// ✅ state های پروگرس و retry
const isSaving = ref(false)
const progress = ref(0)
const saveAttempt = ref(0) // برای نمایش "تلاش دوم" به کاربر
let progressInterval = null
let abortController = null
const first_name = ref('')
const last_name = ref('')
const TIMEOUT_MS = 3000 // ۳ ثانیه
const MAX_ATTEMPTS = 2  // یک بار اصلی + یک بار retry
const province_id = ref('')
const city_id = ref('')
const postal_code = ref('')
const phone = ref('')
const address_line = ref('')

// ==== کامبوی سرچ شهر ====
const citySearch = ref('')          // متن اینپوت سرچ
const cityDropdownOpen = ref(false) // باز/بسته بودن لیست
const cityBox = ref(null)           // برای تشخیص کلیک بیرون
// ==== کامبوی سرچ استان ====
const provinceSearch = ref('')          // متن اینپوت سرچ استان
const provinceDropdownOpen = ref(false) // باز/بسته بودن لیست استان
const provinceBox = ref(null)           // برای تشخیص کلیک بیرون

// فیلتر استان‌ها بر اساس متن سرچ
const filteredProvinces = computed(() => {
  const list = provinces.value || []
  if (!provinceSearch.value) return list
  return list.filter(p => p.name.includes(provinceSearch.value))
})

// باز کردن لیست استان با کلیک روی اینپوت
function openProvinceDropdown() {
  provinceDropdownOpen.value = true
}

// وقتی کاربر تایپ می‌کند
function onProvinceSearchInput() {
  province_id.value = ''         // مقدار واقعی پاک شود تا فقط از لیست انتخاب شود
  provinceDropdownOpen.value = true
  errors.value.province_id = ''  // خطا را پاک کن
}

// انتخاب استان از لیست
function selectProvince(province) {
  province_id.value = province.id
  provinceSearch.value = province.name
  provinceDropdownOpen.value = false
  validateProvince()
}
// فیلتر شهرها بر اساس متن سرچ
const filteredCities = computed(() => {
  const list = cities.value || []
  if (!citySearch.value) return list
  return list.filter(c => c.name.includes(citySearch.value))
})

// باز کردن لیست با کلیک روی اینپوت
function openCityDropdown() {
  if (!province_id.value) return
  cityDropdownOpen.value = true
}

// وقتی کاربر تایپ می‌کند
function onCitySearchInput() {
  city_id.value = ''         // مقدار واقعی پاک شود تا فقط از لیست انتخاب شود
  cityDropdownOpen.value = true
  errors.value.city_id = ''  // خطا را پاک کن
}

// انتخاب شهر از لیست
function selectCity(city) {
  city_id.value = city.id
  citySearch.value = city.name
  cityDropdownOpen.value = false
  validateCity()
}

// کلیک بیرون از باکس => بستن لیست
function handleClickOutside(e) {
  if (cityBox.value && !cityBox.value.contains(e.target)) {
    cityDropdownOpen.value = false
  }
  if (provinceBox.value && !provinceBox.value.contains(e.target)) {
    provinceDropdownOpen.value = false
  }
}

onMounted(async () => {
  if (provinces.value.length === 0) {
    await fetchProvinces()
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Load provinces when modal opens and fill form if editing
watch(() => props.show, async (isOpen) => {
  if (isOpen) {
    if (provinces.value.length === 0) {
      await fetchProvinces()
    }

    // اگر در حالت ویرایش هستیم، فرم را پر کنید
    if (props.editAddress) {
      const fullName = (props.editAddress.receiver_name || '').trim()
      const parts = fullName.split(/\s+/)
      first_name.value = parts[0] || ''
      last_name.value = parts.slice(1).join(' ') || ''
      province_id.value = props.editAddress.province_id || ''
      city_id.value = props.editAddress.city_id || ''
      postal_code.value = props.editAddress.postal_code || ''
      phone.value = props.editAddress.phone || ''
      address_line.value = props.editAddress.address_line || ''

      // پر کردن متن سرچ استان با نام استان انتخاب‌شده
      const foundProvince = (provinces.value || []).find(p => p.id === province_id.value)
      provinceSearch.value = foundProvince ? foundProvince.name : ''

      // بارگذاری شهرها برای استان انتخاب شده
      if (province_id.value) {
        await fetchCities(province_id.value)
        // پر کردن متن سرچ با نام شهر انتخاب‌شده
        const found = (cities.value || []).find(c => c.id === city_id.value)
        citySearch.value = found ? found.name : ''
      }
    } else {
      // پاک کردن فرم برای آدرس جدید
      province_id.value = ''
      city_id.value = ''
      first_name.value = ''
      last_name.value = ''
      postal_code.value = ''
      phone.value = ''
      address_line.value = ''
      citySearch.value = ''
      cityDropdownOpen.value = false
      provinceSearch.value = ''
      provinceDropdownOpen.value = false
    }
  }
})

// Watch province changes to load cities
// Watch province changes to load cities
watch(province_id, async (newProvinceId, oldProvinceId) => {
  // فقط وقتی استان واقعاً تغییر کرده (نه موقع پاک شدن ناشی از تایپ)
  if (newProvinceId && newProvinceId !== oldProvinceId) {
    city_id.value = ''      // Reset city when province changes
    citySearch.value = ''   // Reset search text
    cityDropdownOpen.value = false
    await fetchCities(newProvinceId)
  } else if (!newProvinceId) {
    cities.value = []
    citySearch.value = ''
    city_id.value = ''
    cityDropdownOpen.value = false
  }
})

const errors = ref({
  province_id: '',
  city_id: '',
  first_name: '',
  last_name: '',
  postal_code: '',
  phone: '',
  address_line: ''
})
const validateFirstName = () => {
  if (!first_name.value.trim()) {
    errors.value.first_name = 'نام الزامی است'
    return false
  }
  if (first_name.value.trim().length < 2) {
    errors.value.first_name = 'نام باید حداقل 2 حرف باشد'
    return false
  }
  errors.value.first_name = ''
  return true
}

const validateLastName = () => {
  if (!last_name.value.trim()) {
    errors.value.last_name = 'نام خانوادگی الزامی است'
    return false
  }
  if (last_name.value.trim().length < 2) {
    errors.value.last_name = 'نام خانوادگی باید حداقل 2 حرف باشد'
    return false
  }
  errors.value.last_name = ''
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
    !errors.value.first_name &&
    !errors.value.last_name &&
    !errors.value.postal_code &&
    !errors.value.phone &&
    !errors.value.address_line &&
    province_id.value &&
    city_id.value &&
    postal_code.value &&
    phone.value &&
    address_line.value
  )
})
/**
 * اجرای یک تابع async با timeout و retry خودکار
 */
async function executeWithTimeoutAndRetry(fn, { timeout = TIMEOUT_MS, retries = 1 } = {}) {
  let lastError = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    saveAttempt.value = attempt + 1
    abortController = new AbortController()

    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, timeout)

    try {
      // پاس دادن سیگنال به تابع درخواست (اگر پشتیبانی کند)
      const result = await fn(abortController.signal)
      clearTimeout(timeoutId)
      return result
    } catch (err) {
      clearTimeout(timeoutId)
      lastError = err

      // اگر آخرین تلاش بود، خطا رو بنداز بیرون
      if (attempt === retries) {
        throw err
      }

      // اگر خطای کنسلی بود یا خطای شبکه، دوباره تلاش کن
      console.warn(`⏱️ Attempt ${attempt + 1} failed, retrying...`, err?.message)
      // یک وقفه کوچک قبل از retry
      await new Promise(r => setTimeout(r, 300))
    }
  }

  throw lastError
}
function startProgress() {
  progress.value = 0
  isSaving.value = true

  // شبیه‌سازی پیشرفت: سریع شروع میشه، نزدیک ۹۰٪ کند میشه
  progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 8
    } else if (progress.value < 98) {
      progress.value += 0.5
    }
  }, 200)
}

function finishProgress() {
  clearInterval(progressInterval)
  progressInterval = null
  progress.value = 100

  // یک تاخیر کوچیک برای نمایش ۱۰۰٪
  setTimeout(() => {
    isSaving.value = false
    progress.value = 0
    saveAttempt.value = 0
  }, 400)
}

function cancelProgress() {
  clearInterval(progressInterval)
  progressInterval = null
  isSaving.value = false
  progress.value = 0
  saveAttempt.value = 0
}
async function saveAddress() {
  // Validate all fields
  const isProvinceValid = validateProvince()
  const isCityValid = validateCity()
  const isFirstNameValid = validateFirstName()
  const isLastNameValid = validateLastName()
  const isPhoneValid = validatePhone()
  const isAddressValid = validateAddressLine()

  if (!isProvinceValid || !isCityValid || !isFirstNameValid || !isLastNameValid || !isPhoneValid || !isAddressValid) {
    return
  }
  const receiver_name = `${first_name.value.trim()} ${last_name.value.trim()}`.trim()
  const addressData = {
    receiver_name: receiver_name,
    province_id: province_id.value,
    city_id: city_id.value,
    postal_code: postal_code.value,
    address_line: address_line.value,
    phone: phone.value
  }

  startProgress()

  try {
    const isEdit = props.editAddress && props.editAddress.id

    await executeWithTimeoutAndRetry(
      (signal) => isEdit
        ? updateAddress(props.editAddress.id, addressData, signal)
        : createAddress(addressData, signal),
      { timeout: TIMEOUT_MS, retries: 1 } // یک retry
    )

    finishProgress()

    // Clear form
    province_id.value = ''
    city_id.value = ''
    first_name.value = ''
    last_name.value = ''
    postal_code.value = ''
    phone.value = ''
    address_line.value = ''
    citySearch.value = ''
    cityDropdownOpen.value = false
    provinceSearch.value = ''
    provinceDropdownOpen.value = false
    errors.value = {
      province_id: '',
      city_id: '',
      first_name: '',
      last_name: '',
      postal_code: '',
      phone: '',
      address_line: ''
    }

    emit('save')
  } catch (err) {
    cancelProgress()
    // اگر timeout بود پیام مناسب بده
    const isTimeout = err?.name === 'AbortError' || err?.code === 'ERR_CANCELED'

    if (err.response?.data?.errors) {
      const serverErrors = err.response.data.errors
      if (serverErrors.receiver_name) errors.value.first_name = serverErrors.receiver_name[0]
      if (serverErrors.province_id) errors.value.province_id = serverErrors.province_id[0]
      if (serverErrors.city_id) errors.value.city_id = serverErrors.city_id[0]
      if (serverErrors.postal_code) errors.value.postal_code = serverErrors.postal_code[0]
      if (serverErrors.address_line) errors.value.address_line = serverErrors.address_line[0]
      if (serverErrors.phone) errors.value.phone = serverErrors.phone[0]

    }
  }
}
</script>


<style scoped>
.input-short:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15);
}

.custom-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>