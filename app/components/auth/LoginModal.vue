<!-- components/auth/LoginModal.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="loginModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
      @click.self="closeModal"
    >
      <div
        class="bg-primary shadow-xl p-8 rounded-inner w-full max-w-md relative"
        @click.stop
      >
        <button
          @click="closeModal"
          class="absolute top-4 left-4 text-muted hover:text-strong transition"
        >
          <iconClose class="w-6 h-6" />
        </button>

        <!-- Mobile Step -->
        <template v-if="step === 'mobile'">
          <h3 class="text-2xl font-bold mb-2">ورود یا عضویت</h3>
          <p class="text-sm text-muted mb-6">لطفا شماره موبایل خود را وارد کنید</p>

          <form @submit.prevent="handleMobileSubmit" class="space-y-4">
            <input
              v-model="mobile"
              type="tel"
              placeholder="09123456789"
              maxlength="11"
              class="w-full pad border rounded-inner bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="btnLoader"
            />
            <button
              type="submit"
              :disabled="btnLoader || !isValidMobile"
              class="w-full btn pad rounded-inner hover:bg-secondary-fade transition flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="!btnLoader">ادامه</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                در حال بررسی...
              </span>
            </button>
          </form>
        </template>

        <!-- OTP Step -->
        <template v-else-if="step === 'otp'">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-2xl font-bold">کد تأیید</h3>
            <button @click="step = 'mobile'" type="button" class="text-sm text-strong hover:underline">
              ویرایش شماره
            </button>
          </div>
          <p class="text-sm text-muted mb-6">
            کد ارسال‌شده به <strong class="text">{{ formatMobile(mobile) }}</strong> را وارد کنید
          </p>

          <SharedOtpInput v-model:code="otp" :length="6" class="my-6 justify-center" />

          <div class="flex gap-3">
            <button
              @click="verifyOtpCode"
              :disabled="btnLoader || otp.length !== 6"
              class="flex-1 btn pad rounded-inner hover:bg-secondary-fade transition disabled:opacity-60"
            >
              <span v-if="!btnLoader">تأیید</span>
              <svg v-else class="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </button>

            <button
              type="button"
              @click="resendOtp"
              :disabled="timer > 0"
              class="flex-1 bg-accent text pad rounded-inner hover:bg-accent-fade transition disabled:opacity-60"
            >
              {{ timer > 0 ? `${timer} ثانیه` : 'ارسال مجدد' }}
            </button>
          </div>
        </template>

        <!-- Register Step -->
        <template v-else-if="step === 'register'">
          <h3 class="text-2xl font-bold mb-2">تکمیل ثبت‌نام</h3>
          <p class="text-sm text-muted mb-6">لطفا اطلاعات خود را وارد کنید</p>

          <form @submit.prevent="completeRegistration" class="space-y-4">
            <input
              v-model="fullName"
              type="text"
              placeholder="نام و نام خانوادگی"
              class="w-full pad border rounded-inner bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="password"
              type="password"
              placeholder="رمز عبور (حداقل ۶ کاراکتر)"
              class="w-full pad border rounded-inner bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              :disabled="btnLoader || !isRegisterValid"
              class="w-full btn pad rounded-inner hover:bg-secondary-fade transition disabled:opacity-60"
            >
              <span v-if="!btnLoader">ثبت‌نام</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                در حال ثبت‌نام...
              </span>
            </button>
          </form>
        </template>

        <!-- Password Login Step -->
        <template v-else-if="step === 'password'">
          <h3 class="text-2xl font-bold mb-2">ورود با رمز عبور</h3>
          <p class="text-sm text-muted mb-6">
            شماره: <strong class="text">{{ formatMobile(mobile) }}</strong>
          </p>

          <form @submit.prevent="loginWithPass" class="space-y-4">
            <input
              v-model="password"
              type="password"
              placeholder="رمز عبور"
              class="w-full pad border rounded-inner bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              :disabled="btnLoader || password.length < 6"
              class="w-full btn pad rounded-inner hover:bg-secondary-fade transition disabled:opacity-60"
            >
              <span v-if="!btnLoader">ورود</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                در حال ورود...
              </span>
            </button>

            <button
              type="button"
              @click="switchToOtp"
              class="w-full bg-accent text pad rounded-inner hover:bg-accent-fade transition"
            >
              ورود با کد یک‌بار مصرف
            </button>
          </form>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApiAuth } from '~/composables/useAuth'
import { useCartStore } from '~/store/cart'

const { checkMobile, sendOtp, verifyOtp, loginWithPassword, register } = useApiAuth()
const { loginModal } = useAuth()

const { $toast } = useNuxtApp()

// State
const step = ref('mobile')
const mobile = ref('')
const otp = ref('')
const password = ref('')
const fullName = ref('')
const btnLoader = ref(false)
const timer = ref(0)
let timerInterval = null

// Computed
const isValidMobile = computed(() => /^09\d{9}$/.test(mobile.value))
const isRegisterValid = computed(() => fullName.value.length >= 3 && password.value.length >= 6)

// Helpers
const formatMobile = (num) => num.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')

const closeModal = () => {
  loginModal.value = false
  resetForm()
}

const resetForm = () => {
  step.value = 'mobile'
  mobile.value = ''
  otp.value = ''
  password.value = ''
  fullName.value = ''
  btnLoader.value = false
  clearTimer()
}

const clearTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  timer.value = 0
}

const startTimer = () => {
  clearTimer()
  timer.value = 60
  timerInterval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) clearInterval(timerInterval)
  }, 1000)
}

// Sync cart با سرور
const syncCartWithServer = async () => {
  try {
    const { $api } = useNuxtApp()
    const cartStore = useCartStore()

    // چک کردن localStorage قبل از load
    const rawCart = localStorage.getItem('guest-cart')
    console.log('🔍 Raw localStorage data:', rawCart)

    // بارگذاری cart از localStorage
    cartStore.loadFromLocalStorage()

    // لاگ کردن items بعد از load
    console.log('📦 Cart items after load:', cartStore.items)
    console.log('📊 Cart items length:', cartStore.items.length)

    // اگر محصولی در localStorage نیست، نیازی به sync نداریم
    if (cartStore.items.length === 0) {
      console.log('ℹ️ No items in local cart to sync')
      return
    }

    console.log('🔄 Syncing cart with server...', cartStore.items)

    // ارسال هر محصول به سرور
    for (const item of cartStore.items) {
      console.log('📤 Sending to server:', {
        variant_id: item.variant_id,
        quantity: item.quantity
      })

      const response = await $api.post('/front/cart/add', {
        variant_id: item.variant_id,
        quantity: item.quantity
      })

      console.log('📥 Server response:', response.data)
    }

    console.log('✅ Cart synced successfully')

    // پاک کردن localStorage بعد از sync موفق
    cartStore.clearCart()
  } catch (error) {
    console.error('❌ Failed to sync cart:', error)
  }
}

// Actions
async function handleMobileSubmit() {
  if (!isValidMobile.value) return $toast.warning('شماره موبایل معتبر نیست')

  btnLoader.value = true
  try {
    const res = await checkMobile(mobile.value)
    console.log('📱 Check mobile response:', res.data)

    if (res.data.status === 'login') {
      step.value = 'password'
    } else {
      await sendOtp(mobile.value)
      step.value = 'otp'
      startTimer()
    }
  } catch (err) {
    $toast.warning(err?.response?.data?.message || 'خطایی رخ داد')
  } finally {
    btnLoader.value = false
  }
}

async function verifyOtpCode() {
  btnLoader.value = true
  try {
    const res = await verifyOtp(mobile.value, otp.value)
    if (res.data.status === 'need_register') {
      step.value = 'register'
    } else {
      await handleSuccessfulLogin(res.data)
    }
  } catch (err) {
    $toast.warning(err?.response?.data?.message || 'کد نامعتبر است')
  } finally {
    btnLoader.value = false
  }
}

async function completeRegistration() {
  btnLoader.value = true
  try {
    const res = await register(mobile.value, password.value, fullName.value)
    await handleSuccessfulLogin(res.data)
  } catch (err) {
    $toast.warning(err?.response?.data?.message || 'خطا در ثبت‌نام')
  } finally {
    btnLoader.value = false
  }
}

async function loginWithPass() {
  btnLoader.value = true
  try {
    const res = await loginWithPassword(mobile.value, password.value)
    await handleSuccessfulLogin(res.data)
  } catch (err) {
    $toast.warning(err?.response?.data?.message || 'رمز عبور اشتباه است')
  } finally {
    btnLoader.value = false
  }
}

async function resendOtp() {
  if (timer.value > 0) return
  try {
    await sendOtp(mobile.value)
    startTimer()
    $toast.success('کد مجدداً ارسال شد')
  } catch (err) {
    $toast.warning('خطا در ارسال مجدد کد')
  }
}

function switchToOtp() {
  step.value = 'otp'
  resendOtp()
}

async function handleSuccessfulLogin(data) {
  const { $api } = useNuxtApp()

  console.log('🎉 Login successful, starting post-login process...')

  // ذخیره توکن و اطلاعات کاربر در localStorage
  localStorage.setItem('auth-token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
  console.log('✅ Token and user saved to localStorage')

  // تنظیم header Authorization برای درخواست‌های بعدی
  if ($api.defaults?.headers?.common) {
    $api.defaults.headers.common.Authorization = `Bearer ${data.token}`
    console.log('✅ Authorization header set')
  }

  // Sync کردن سبد خرید محلی با سرور
  console.log('🔄 Starting cart sync...')
  await syncCartWithServer()
  console.log('✅ Cart sync completed')

  $toast.success(`خوش آمدید ${data.user.full_name || data.user.mobile}`)
  closeModal()

  // Reload برای refresh کردن state - فقط بعد از sync کامل
  console.log('🔄 Reloading page...')
  window.location.reload()
}

onUnmounted(() => clearTimer())
</script>

<style scoped>
.w-modal {
  max-width: 420px;
  width: 100%;
}
</style>
