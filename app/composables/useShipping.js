export const useShipping = () => {
  const { $api } = useNuxtApp()
  const shippingMethods = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchShippingMethods = async (addressId = null) => {
    loading.value = true
    error.value = null

    try {
      const payload = addressId ? { address_id: addressId } : {}
      
      const response = await $api.post('/front/shippings', payload)
      
      // ✅ تغییر از data به methods
      shippingMethods.value = response.data.methods || []
      
      console.log('✅ Shipping methods loaded:', shippingMethods.value)
    } catch (err) {
      console.error('❌ Error fetching shipping methods:', err)
      error.value = err.response?.data?.message || 'خطا در دریافت روش‌های ارسال'
      shippingMethods.value = []
    } finally {
      loading.value = false
    }
  }

  const saveShipping = async (data) => {
    try {
      const response = await $api.post('/front/shippings', data)
      return response.data
    } catch (err) {
      throw err
    }
  }

  return {
    shippingMethods,
    loading,
    error,
    fetchShippingMethods,
    saveShipping
  }
}
