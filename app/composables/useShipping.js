export const useShipping = () => {
  const { $api } = useNuxtApp();
  const shippingMethods = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchShippingMethods = async (
    addressId = null,
    selectedReservation = null,
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const payload = {};

      if (selectedReservation) {
        payload.reservation_order_id = selectedReservation;
      }
      if (addressId) {
        payload.address_id = addressId;
      }

      const response = await $api.post("/front/shippings", payload);

      shippingMethods.value = response.data.methods || [];

      
    } catch (err) {
      console.error("❌ Error fetching shipping methods:", err);

      error.value =
        err.response?.data?.message || "خطا در دریافت روش‌های ارسال";

      shippingMethods.value = [];
    } finally {
      loading.value = false;
    }
  };

  const saveShipping = async (data) => {
    try {
      const response = await $api.post("/front/shippings", data);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    shippingMethods,
    loading,
    error,
    fetchShippingMethods,
    saveShipping,
  };
};
