// store/menu.js.js

import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "~/composables/api/useApi";

export const useCategoryStore = defineStore("category", () => {
  const { getShopFilters } = useApi();

  // وضعیت: آرایه‌ای برای ذخیره آیتم‌های منو/دسته‌بندی‌ها
  const menuItems = ref([]);
  const filters = ref(null); // برای ذخیره کل آبجکت فیلترها
  const loading = ref(false);

  /**
   * فراخوانی API و بارگذاری فیلترها و آیتم‌های منو
   */
  const fetchMenuData = async () => {
    // جلوگیری از فراخوانی مجدد اگر از قبل داده داریم
    if (menuItems.value.length > 0) return;

    loading.value = true;
    try {
      // فراخوانی API از کامپوزبل
      const response = await getShopFilters();
      console.log("✅ API Response for Menu:", response);
      // فرض: API آبجکتی برمی‌گرداند که شامل "categories" است.
      // اگر API شما آبجکت دیگری برمی‌گرداند، این خط را باید تغییر دهید.
      filters.value = response;
      const categories = response?.categories || [];

      // تبدیل داده‌های API به ساختار مورد نیاز NavMenu.vue
      menuItems.value = categories.map((cat) => ({
        id: cat.id,
        label: cat.title, // استفاده از عنوان دسته برای نمایش در منو
        link: `/products?category=${cat.slug}`, // مسیردهی به صفحه محصولات با فیلتر دسته
        // اگر زیرمنو دارید (sub_categories)، می‌توانید اینجا آن را تعریف کنید:
        subItems: cat.sub_categories
          ? cat.sub_categories.map((subCat) => ({
              id: subCat.id,
              label: subCat.title,
              link: `/products?category=${subCat.slug}`,
            }))
          : [],
      }));
    } catch (error) {
      console.error("❌ Failed to fetch menu data:", error);
      // می‌توانید یک لیست پیش‌فرض یا پیام خطا را برای کاربر تنظیم کنید
    } finally {
      loading.value = false;
    }
  };

  return {
    menuItems,
    filters,
    loading,
    fetchMenuData,
  };
});
