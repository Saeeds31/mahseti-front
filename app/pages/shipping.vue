<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { toast } from "vue3-toastify";
import { useApi } from "@/composables/api/useApi";

definePageMeta({
  middleware: 'auth'
})

const { addresses, loading, error, fetchAddresses, deleteAddress } = useAddresses()
const { shippingMethods, fetchShippingMethods, loading: shippingLoading } = useShipping()

const {
  getOrder
} = useApi();
const showAddressModal = ref(false)
const editingAddress = ref(null)
const selectedAddress = ref(null)
const selectedShipping = ref(1)

const cartData = ref(null)
const subtotal = ref(900000)
const reservationStorageKey = "selected-reservation";

const selectedReservation = ref(null);
const reservationMode = ref(false);
const loadSelectedReservation = () => {
  if (!process.client) {
    return null;
  }

  const saved = localStorage.getItem(reservationStorageKey);

  if (!saved) {
    return null;
  }

  try {
    const reservation = JSON.parse(saved);

    if (!reservation?.order_id) {
      localStorage.removeItem(reservationStorageKey);
      return null;
    }

    selectedReservation.value = reservation;
    reservationMode.value = true;

    return reservation;
  } catch (error) {
    console.error("Invalid reservation data:", error);

    localStorage.removeItem(reservationStorageKey);

    selectedReservation.value = null;
    reservationMode.value = false;

    return null;
  }
};
const loadReservationOrder = async () => {
  const reservation = loadSelectedReservation();

  if (!reservation) {
    return;
  }

  try {
    const response = await getOrder(reservation.order_id);

    const order = response?.data;

    if (!order) {
      return;
    }

    selectedAddress.value = order.address_id;

    // اگر آدرس در لیست آدرس‌های کاربر هست
    const reservationAddress = addresses.value.find(
      address => address.id === order.address_id
    );

    if (reservationAddress) {
      selectedAddress.value = reservationAddress.id;
    }
  } catch (error) {
    console.error("Failed to load reservation order:", error);
  }
};
// 🔥 Watch برای تغییر آدرس
watch(selectedAddress, async (newAddressId, oldAddressId) => {
  if (newAddressId && newAddressId !== oldAddressId) {

    // ✅ فراخوانی API با address_id جدید
    await fetchShippingMethods(newAddressId, selectedReservation.value?.order_id)

    // انتخاب خودکار اولین روش ارسال
    if (shippingMethods.value.length > 0) {
      selectedShipping.value = shippingMethods.value[0].id
    }
  }
})

onMounted(async () => {
  loadReservationOrder()
  const savedCart = localStorage.getItem('cart-summary')
  if (savedCart) {
    try {
      cartData.value = JSON.parse(savedCart)
      subtotal.value = cartData.value.totalPrice || 900000
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
    await fetchShippingMethods(selectedAddress.value, selectedReservation.value?.order_id)

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

  const shouldDelete = confirm('آیا مطمئن هستید که می‌خواهید این آدرس را حذف کنید؟')

  if (shouldDelete) {
    try {
      await deleteAddress(id)
      if (selectedAddress.value === id && addresses.value.length > 0) {
        selectedAddress.value = addresses.value[0].id
      }

      toast.success('آدرس با موفقیت حذف شد')
    } catch (err) {
      toast.error('خطا در حذف آدرس')
    }
  }
}

async function addNewAddress() {
  await fetchAddresses()
  showAddressModal.value = false
  editingAddress.value = null
  if (addresses.value.length > 0) {
    selectedAddress.value = addresses.value[0].id
  }

  // ✅ بارگذاری اولیه روش‌های ارسال با address_id
  if (selectedAddress.value) {
    await fetchShippingMethods(selectedAddress.value, selectedReservation.value?.order_id)
    if (shippingMethods.value.length > 0) {
      selectedShipping.value = shippingMethods.value[0].id
    }
  }
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

  if (!selectedAddress.value) {
    toast.error('لطفاً یک آدرس انتخاب کنید')
    return
  }

  if (!selectedShipping.value) {
    toast.error('لطفاً یک روش ارسال انتخاب کنید')
    return
  }

  try {

    const response = await $api.post('/front/shippings', {
      address_id: selectedAddress.value,
      shipping_method: selectedShipping.value
    })

    localStorage.setItem('shipping-info', JSON.stringify({
      address_id: selectedAddress.value,
      shipping_method_id: selectedShipping.value
    }))


    navigateTo('/payment')
  } catch (err) {
    console.error('❌ Shipping error:', err)
    toast.error(err.response?.data?.message || 'خطا در ثبت اطلاعات ارسال')
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
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-[12px] md:text-xl">
            مکان تحویل سفارش
          </h3>

          <p v-if="reservationMode" class="text-xs text-muted mt-1">
            آدرس مربوط به سفارش رزرو شده
          </p>
        </div>

        <button v-if="!reservationMode" @click="openNewAddressModal"
          class="flex items-center gap-2 bg-secondary-fade py-2 px-4 rounded-inner hover:bg-secondary cursor-pointer">
          <IconPlusBorder />
          <span class="text-[12px] md:text-[14px]">
            افزودن آدرس جدید
          </span>
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
      <div v-else-if="reservationMode" class="border-b pb-10">
        <div v-for="address in addresses.filter(
          address => address.id === selectedAddress
        )" :key="address.id" class="border border-secondary rounded-inner pad bg-secondary-fade">
          <div class="flex items-start gap-3 md:gap-4">

            <div class="mt-1 shrink-0">
              <div class="w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center">
                <div class="w-2.5 h-2.5 rounded-full bg-secondary"></div>
              </div>
            </div>

            <div class="flex-1 min-w-0">

              <p class="text-sm text-muted mb-2 flex gap-2">
                <IconLocAdders />
                <span>{{ address.address_line }}</span>
              </p>

              <p class="text-sm text-muted flex mb-2 gap-2 items-center">
                <IconCodePost />
                <span>
                  کدپستی: {{ address.postal_code }}
                </span>
              </p>

              <div class="flex gap-2 text-muted">
                <IconProfileAdderss />

                <div class="flex gap-2 text-muted flex-wrap">
                  <p class="text-sm">
                    گیرنده: {{ address.receiver_name }}
                  </p>

                  <span>|</span>

                  <p class="text-sm">
                    تلفن: {{ address.phone }}
                  </p>
                </div>
              </div>

            </div>

            <div class="text-secondary font-semibold text-sm">
              آدرس رزرو
            </div>

          </div>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-10">
        <label v-for="address in addresses" :key="address.id"
          class="border rounded-inner pad flex items-start gap-3 md:gap-4 cursor-pointer hover:border-secondary transition"
          :class="{ 'border-secondary ': selectedAddress === address.id }">
          <input type="radio" name="address" :value="address.id" v-model="selectedAddress" class="mt-1 shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm text-muted mb-1 flex gap-2">
              <IconLocAdders />
              <span>
                {{ address.province?.name }}
                -
                {{ address.city?.name }}
                ,
                {{ address.address_line }}</span>
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
          <div class="flex gap-2 flex-col md:flex-row">
            <button @click.prevent="handleDeleteAddress(address.id)"
              class="flex items-center border border-gray-300 rounded-[8px] px-2 py-1 cursor-pointer" type="button">
              <span class="text-red-500 text-sm">حذف</span>
              <IconTrashRed />
            </button>
            <button @click.prevent="openEditModal(address)" type="button"
              class="text-muted text-xl hover:text-strong transition shrink-0 flex items-center border border-gray-300 rounded-[8px] px-2 py-1 cursor-pointer">
              <span class="text-grey-500 text-[10px]">ویرایش</span>
              <span>
                ⋮
              </span>
            </button>
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
            :class="{ 'border-secondary ': selectedShipping === method.id }">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <input type="radio" name="shipping" :value="method.id" v-model="selectedShipping" />
                <span class="font-semibold text-sm md:text-base">{{ method.name }}</span>
              </div>
              <p class="text-xs text-muted">{{ method.message ?? method.description }}</p>
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

    <CartModalAdderss :show="showAddressModal" :edit-address="editingAddress" @close="showAddressModal = false"
      @save="addNewAddress" />
  </div>
</template>
