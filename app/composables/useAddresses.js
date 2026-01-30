export const useAddresses = () => {
  const { $api } = useNuxtApp()
  const toast = useToast()
  const addresses = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Get all addresses
  const fetchAddresses = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $api.get('/front/addresses')
      addresses.value = response.data.data || response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'خطا در دریافت آدرس‌ها'
      console.error('Error fetching addresses:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new address
  const createAddress = async (addressData) => {
    loading.value = true
    error.value = null
    try {
      console.log('📤 Sending address data:', addressData)
      const response = await $api.post('/front/addresses', {
        receiver_name: addressData.receiver_name,
        province_id: addressData.province_id,
        city_id: addressData.city_id,
        postal_code: addressData.postal_code,
        address_line: addressData.address_line,
        phone: addressData.phone
      })
      console.log('✅ Address created successfully:', response.data)

      // نمایش toast موفقیت
      toast.add({
        title: 'موفقیت',
        description: response.data?.message || 'آدرس کاربر با موفقیت ثبت شد',
        color: 'green'
      })

      await fetchAddresses()
      return response.data
    } catch (err) {
      console.error('❌ Full error object:', err)
      console.error('❌ Error response:', err.response)
      console.error('❌ Error data:', err.response?.data)
      error.value = err.response?.data?.message || 'خطا در ایجاد آدرس'

      // نمایش toast خطا
      toast.add({
        title: 'خطا',
        description: err.response?.data?.message || 'خطا در ایجاد آدرس',
        color: 'red'
      })

      throw err
    } finally {
      loading.value = false
    }
  }

  // Update address
  const updateAddress = async (id, addressData) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api.put(`/front/addresses/${id}`, {
        receiver_name: addressData.receiver_name,
        province_id: addressData.province_id,
        city_id: addressData.city_id,
        postal_code: addressData.postal_code,
        address_line: addressData.address_line,
        phone: addressData.phone
      })

      // نمایش toast موفقیت
      toast.add({
        title: 'موفقیت',
        description: response.data?.message || 'آدرس با موفقیت ویرایش شد',
        color: 'green'
      })

      await fetchAddresses()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'خطا در ویرایش آدرس'
      console.error('Error updating address:', err)

      // نمایش toast خطا
      toast.add({
        title: 'خطا',
        description: err.response?.data?.message || 'خطا در ویرایش آدرس',
        color: 'red'
      })

      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete address
  const deleteAddress = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api.delete(`/front/addresses/${id}`)

      // نمایش toast موفقیت
      toast.add({
        title: 'موفقیت',
        description: response.data?.message || 'آدرس با موفقیت حذف شد',
        color: 'green'
      })

      await fetchAddresses()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'خطا در حذف آدرس'
      console.error('Error deleting address:', err)

      // نمایش toast خطا
      toast.add({
        title: 'خطا',
        description: err.response?.data?.message || 'خطا در حذف آدرس',
        color: 'red'
      })

      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress
  }
}
