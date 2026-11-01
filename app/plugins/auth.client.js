// plugins/auth.client.js
import { useSettingStore } from "~/store/settings";
import { useCartStore } from "~/store/cart";

export default defineNuxtPlugin(async (nuxtApp) => {
  const settingStore = useSettingStore();
  const cartStore = useCartStore();
  const { $api } = nuxtApp;

  // بارگذاری cart از localStorage
  cartStore.loadFromLocalStorage();

  // بررسی توکن در localStorage
  const token = localStorage.getItem("auth-token");
  const storedUser = localStorage.getItem("user");


  if (token) {
    try {
      // تنظیم header Authorization
      if ($api.defaults?.headers?.common) {
        $api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }

      // بارگذاری اطلاعات کاربر از localStorage
      if (storedUser) {
        settingStore.user = JSON.parse(storedUser);
      }

     

      // Sync کردن cart محلی با سرور
      if (cartStore.items.length > 0) {
        try {
          await cartStore.syncWithServer($api);
        } catch (error) {
        }
      }
    } catch (error) {
     
      // اگر توکن منقضی شده، پاک کنیم
      if (error.response?.status === 401) {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user");
        settingStore.user = null;
        if ($api.defaults?.headers?.common) {
          delete $api.defaults.headers.common.Authorization;
        }
      }
    }
  }
});
