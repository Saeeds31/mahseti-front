// stores/user.js
import { defineStore } from "pinia";
export const useSettingStore = defineStore("setting", () => {
  const settings = ref({});
  const menus = ref([]);
  const user = ref(null);
  return {
    settings,
    menus,
    user,
  };
});
