export const useLocations = () => {
  const { $api } = useNuxtApp()
  const provinces = ref([])
  const cities = ref([])
  const loadingProvinces = ref(false)
  const loadingCities = ref(false)
  const error = ref(null)

  // Get all provinces
  const fetchProvinces = async () => {
    console.log('🌍 Fetching provinces...')
    loadingProvinces.value = true
    error.value = null
    try {
      const response = await $api.get('/front/provinces')
      console.log('✅ Provinces response:', response.data)
      provinces.value = response.data.data || response.data
      console.log('✅ Provinces loaded:', provinces.value)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'خطا در دریافت استان‌ها'
      console.error('❌ Error fetching provinces:', err)
      console.error('❌ Error response:', err.response?.data)
      throw err
    } finally {
      loadingProvinces.value = false
    }
  }

  // Get cities by province
  const fetchCities = async (provinceId = null) => {
    console.log('🏙️ Fetching cities for province:', provinceId)
    loadingCities.value = true
    error.value = null
    try {
      const url = provinceId
        ? `/front/cities?province_id=${provinceId}`
        : '/front/cities'
      console.log('📍 API URL:', url)
      const response = await $api.get(url)
      console.log('✅ Cities response:', response.data)
      cities.value = response.data.data || response.data
      console.log('✅ Cities loaded:', cities.value)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'خطا در دریافت شهرها'
      console.error('❌ Error fetching cities:', err)
      console.error('❌ Error response:', err.response?.data)
      throw err
    } finally {
      loadingCities.value = false
    }
  }

  return {
    provinces,
    cities,
    loadingProvinces,
    loadingCities,
    error,
    fetchProvinces,
    fetchCities
  }
}
