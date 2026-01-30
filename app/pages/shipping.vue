<script setup>
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { addresses, loading, error, fetchAddresses, deleteAddress } = useAddresses()
const { shippingMethods, fetchShippingMethods, loading: shippingLoading } = useShipping()

const showAddressModal = ref(false)
const editingAddress = ref(null)
const selectedAddress = ref(null)
const selectedShipping = ref(1)

const cartData = ref(null)
const subtotal = ref(900000)

// 🔥 Watch برای تغییر آدرس
watch(selectedAddress, async (newAddressId, oldAddressId) => {
  if (newAddressId && newAddressId !== oldAddressId) {
    console.log('🔄 Address changed to:', newAddressId)
    console.log('📤 Fetching shipping methods for address:', newAddressId)
    
    // ✅ فراخوانی API با address_id جدید
    await fetchShippingMethods(newAddressId)
    
    // انتخاب خودکار اولین روش ارسال
    if (shippingMethods.value.length > 0) {
      selectedShipping.value = shippingMethods.value[0].id
    }
  }
})

onMounted(async () => {
  const savedCart = localStorage.getItem('cart-summary')
  if (savedCart) {
    try {
      cartData.value = JSON.parse(savedCart)
      subtotal.value = cartData.value.totalPrice || 900000
      console.log('📦 Cart loaded from localStorage:', cartData.value)
    } catch (err) {
      console.error('❌ Failed to parse cart data:', err)
    }
  }

  await fetchAddresses()
  
  if (addresses.value.length > 0) {
    selectedAddress.value = addresses.value[0].id
  }

  // ✅ بارگذاری اولیه روش‌های ارسال با address_id
  if (selectedAddress.value) {
    await fetchShippingMethods(selectedAddress.value)

    if (shippingMethods.value.length > 0) {
      selectedShipping.value = shippingMethods.value[0].id
    }
  }
})

const shippingCost = computed(() => {
  const method = shippingMethods.value.find(m => m.id === selectedShipping.value)
  return method ? method.cost : 0
})

const total = computed(() => subtotal.value + shippingCost.value)

async function handleDeleteAddress(id) {
  const toast = useToast()

  const shouldDelete = confirm('آیا مطمئن هستید که می‌خواهید این آدرس را حذف کنید؟')

  if (shouldDelete) {
    try {
      await deleteAddress(id)
      if (selectedAddress.value === id && addresses.value.length > 0) {
        selectedAddress.value = addresses.value[0].id
      }

      toast.add({
        title: 'موفقیت',
        description: 'آدرس با موفقیت حذف شد',
        color: 'green'
      })
    } catch (err) {
      toast.add({
        title: 'خطا',
        description: 'خطا در حذف آدرس',
        color: 'red'
      })
    }
  }
}

function addNewAddress() {
  fetchAddresses()
  showAddressModal.value = false
  editingAddress.value = null
}

function openEditModal(address) {
  editingAddress.value = address
  showAddressModal.value = true
}

function openNewAddressModal() {
  editingAddress.value = null
  showAddressModal.value = true
}

async function handleNextStep() {
  const { $api } = useNuxtApp()
  const toast = useToast()

  if (!selectedAddress.value) {
    toast.add({
      title: 'خطا',
      description: 'لطفاً یک آدرس انتخاب کنید',
      color: 'red'
    })
    return
  }

  if (!selectedShipping.value) {
    toast.add({
      title: 'خطا',
      description: 'لطفاً یک روش ارسال انتخاب کنید',
      color: 'red'
    })
    return
  }

  try {
    console.log('📤 Sending shipping data:', {
      address_id: selectedAddress.value,
      shipping_method: selectedShipping.value
    })

    const response = await $api.post('/front/shippings', {
      address_id: selectedAddress.value,
      shipping_method: selectedShipping.value
    })

    console.log('✅ Shipping saved successfully:', response.data)

    localStorage.setItem('shipping-info', JSON.stringify({
      address_id: selectedAddress.value,
      shipping_method_id: selectedShipping.value
    }))

    toast.add({
      title: 'موفقیت',
      description: response.data?.message || 'اطلاعات ارسال با موفقیت ثبت شد',
      color: 'green'
    })

    navigateTo('/payment')
  } catch (err) {
    console.error('❌ Shipping error:', err)
    toast.add({
      title: 'خطا',
      description: err.response?.data?.message || 'خطا در ثبت اطلاعات ارسال',
      color: 'red'
    })
  }
}
</script>


<template>
  <div class="container">
    <SharedBreadCrumb :items="[
      { label: 'سبد خرید', href: '/cart' },
      { label: 'انتخاب آدرس و روش ارسال', href: '/shipping' }
    ]" />
    <CartProgressSteps :current-step="2" />

    <div class="lg:col-span-2 space-y-6 border pad rounded-inner">
      <div class="flex justify-between">
        <h3 class="font-bold textxl">مکان تحویل سفارش</h3>

        <button @click="openNewAddressModal"
          class="flex gap-2 bg-secondary-fade py-2 px-4 rounded-inner hover:bg-secondary cursor-pointer"
        >
          <IconPlusBorder />
          <span>افزودن آدرس جدید</span>
        </button>
      </div>

      <div v-if="loading" class="text-center py-10">
        <SharedLoadingSpinner size="lg" />
      </div>

      <div v-else-if="error" class="text-center py-10 text-red-500">
        {{ error }}
      </div>

      <div v-else-if="addresses.length === 0" class="text-center py-10 text-muted">
        هنوز آدرسی ثبت نشده است
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-10">
        <label v-for="address in addresses" :key="address.id"
          class="border rounded-inner pad flex items-start gap-3 md:gap-4 cursor-pointer hover:border-secondary transition"
          :class="{ 'border-secondary ': selectedAddress === address.id }"
        >
          <input type="radio" name="address" :value="address.id" v-model="selectedAddress" class="mt-1 shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm text-muted mb-1 flex gap-2">
              <IconLocAdders />
              <span>{{ address.address_line }}</span>
            </p>
            <p class="text-sm text-muted flex mb-1 gap-2 items-center">
              <IconCodePost />
              <span>کدپستی: {{ address.postal_code }}</span>
            </p>
            <div class="flex gap-2 text-muted">
              <IconProfileAdderss />
              <div class="flex gap-2 text-muted">
                <p class="text-sm mb-1">گیرنده: {{ address.receiver_name }}</p>
                |
                <p class="text-sm mb-1">تلفن: {{ address.phone }}</p>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click.prevent="handleDeleteAddress(address.id)" type="button">
              <IconTrashRed />
            </button>
            <button @click.prevent="openEditModal(address)" type="button" class="text-muted text-xl hover:text-strong transition shrink-0">⋮</button>
          </div>
        </label>
      </div>

      <!-- Shipping Method -->
      <div class="bg-primary">
        <h3 class="text-lg font-semibold mb-4">شیوه ارسال</h3>

        <div v-if="shippingLoading" class="text-center py-10">
          <SharedLoadingSpinner size="sm" />
        </div>

        <div v-else-if="shippingMethods.length === 0" class="text-center py-10 text-muted">
          روش ارسالی موجود نیست
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label v-for="method in shippingMethods" :key="method.id"
            class="border rounded-inner pad cursor-pointer hover:border-secondary transition"
            :class="{ 'border-secondary ': selectedShipping === method.id }"
          >
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <input type="radio" name="shipping" :value="method.id" v-model="selectedShipping" />
                <span class="font-semibold text-sm md:text-base">{{ method.name }}</span>
              </div>
              <p class="text-xs text-muted">{{ method.description }}</p>
              <div class="flex items-center justify-between mt-2">
                <p class="text-sm text-muted">هزینه ارسال</p>
                <p class="text-strong font-semibold">{{ method.cost.toLocaleString("fa-IR") }} تومان</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div class="flex justify-between gap-4 text-center">
        <nuxt-link class="btnborderBlack w-[50%]" to="/cart">مرحله قبل</nuxt-link>
        <button @click="handleNextStep" class="btn w-[50%]">مرحله بعد</button>
      </div>
    </div>

    <CartModalAdderss
      :show="showAddressModal"
      :edit-address="editingAddress"
      @close="showAddressModal = false"
      @save="addNewAddress"
    />
  </div>
</template>
