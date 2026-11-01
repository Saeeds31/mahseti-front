import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "~/composables/api/useApi";

export const useCategoryStore = defineStore("category", () => {
  const { getShopFilters } = useApi();
  const menuItems = ref([]);
  const filters = ref(null); // برای ذخیره کل آبجکت فیلترها
  const loading = ref(false);
  const isLoaded = ref(false);
  const fetchMenuData = async ({ force = false } = {}) => {
    if (menuItems.value.length > 0) return;
    if (isLoaded.value && !force) return filters.value;
    if (loading.value) return filters.value;

    loading.value = true;
    try {
      const response = await getShopFilters();
      filters.value = response;
      const categories = response?.categories || [];
      menuItems.value = categories.map((cat) => ({
        id: cat.id,
        label: cat.title, // استفاده از عنوان دسته برای نمایش در منو
        link: `/products?category=${cat.slug}`, // مسیردهی به صفحه محصولات با فیلتر دسته
        subItems: cat.sub_categories
          ? cat.sub_categories.map((subCat) => ({
              id: subCat.id,
              label: subCat.title,
              link: `/products?category=${subCat.slug}`,
            }))
          : [],
      }));
      isLoaded.value = true;
      return response;
    } catch (error) {
      console.error("❌ Failed to fetch menu data:", error);
    } finally {
      loading.value = false;
    }
  };
  const fetchFilters = async ({ force = false } = {}) => {
    if (isLoaded.value && !force) return filters.value;
    await fetchMenuData({ force });
    return filters.value;
  };
  const clear = () => {
    filters.value = null;
    menuItems.value = [];
    isLoaded.value = false;
  };
  return {
    menuItems,
    filters,
    loading,
    isLoaded,
    fetchMenuData,
    fetchFilters,
    clear,
  };
});
