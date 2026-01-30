<template>
  <div class="border rounded p-8 shadow">
    <div class="flex justify-between items-center pb-4 border-b">
      <h3 class="font-bold text-xl">آدرس ها</h3>

      <button @click="openNewAddressModal"
        class="flex gap-2 bg-secondary-fade py-2 px-4 rounded-inner hover:bg-secondary cursor-pointer"
      >
        <Plus :size="20" />
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

    <div v-else class="gap-4 grid pt-10">
      <label
        v-for="address in addresses"
        :key="address.id"
        class="border rounded-inner pad flex items-start gap-3 md:gap-4 cursor-pointer hover:border-secondary transition"
        :class="{ 'border-secondary ': selectedAddress === address.id }"
      >
        <input
          type="radio"
          name="address"
          :value="address.id"
          v-model="selectedAddress"
          class="mt-1 shrink-0"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm text-muted mb-1 flex gap-2">
            <MapPin :size="18" />
            <span>{{ address.address_line }}</span>
          </p>
          <p class="text-sm text-muted flex mb-1 gap-2 items-center">
            <Hash :size="18" />
            <span>کدپستی: {{ address.postal_code }}</span>
          </p>
          <div class="flex gap-2 text-muted">
            <User :size="18" />
            <div class="flex gap-2 text-muted">
              <p class="text-sm mb-1">
                گیرنده: {{ address.receiver_name }}
              </p>
              |
              <p class="text-sm mb-1">تلفن: {{ address.phone }}</p>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click.prevent="handleDeleteAddress(address.id)" type="button" class="text-red-500 hover:text-red-700 transition">
            <Trash2 :size="20" />
          </button>
          <button
            @click.prevent="openEditModal(address)"
            type="button"
            class="text-muted hover:text-strong transition shrink-0"
          >
            <MoreVertical :size="20" />
          </button>
        </div>
      </label>
    </div>

    <CartModalAdderss
      :show="showAddressModal"
      :edit-address="editingAddress"
      @close="showAddressModal = false"
      @save="addNewAddress"
    />
  </div>
</template>


<script setup>
import { Plus, MapPin, Hash, User, Trash2, MoreVertical } from 'lucide-vue-next'

definePageMeta({
  layout: "panel",
  middleware: 'auth'
});
import { ref, onMounted } from 'vue'

const { addresses, loading, error, fetchAddresses, deleteAddress } = useAddresses()

const showAddressModal = ref(false)
const editingAddress = ref(null)  // آدرس در حال ویرایش
const selectedAddress = ref(null)
const selectedShipping = ref(1)

onMounted(async () => {
  await fetchAddresses()
  if (addresses.value.length > 0) {
    selectedAddress.value = addresses.value[0].id
  }
})

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
  editingAddress.value = null  // پاک کردن آدرس در حال ویرایش
}

function openEditModal(address) {
  editingAddress.value = address
  showAddressModal.value = true
}

function openNewAddressModal() {
  editingAddress.value = null
  showAddressModal.value = true
}
</script>