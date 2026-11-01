<!-- app/components/shared/header.vue -->
<template>
  <header class="mb-4">
    <headerTopBar />
    <div class="hidden md:block">
      <div class="container w-full flex justify-between py-4">
        <div class="flex items-center gap-5">
          <SharedLogo :width="'100px'" height="'67px'" />
          <HeaderSearch />
        </div>

        <div class="flex items-center gap-2">
          <HeaderBtnProfile />

          <button type="button"
            class="relative flex items-center gap-2 rounded-xl border p-1 border-gray-300  bg-secondary"
            @click="openCartSidebar">
            <span class="text-white">سبد خرید</span>
            <img src="/icons/bag.svg" class="" />
            <span v-if="cartItemsCount > 0" class="cart-badge">
              {{ cartItemsCount }}
            </span>
          </button>
          <nuxt-link v-if="user" to="/panel/favorites">
            <img src="/icons/heart.svg" class="border-2 border-gray-300 rounded-xl p-2" />
          </nuxt-link>
        </div>
      </div>

      <div class="container py-2 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <HeaderMenu />
        </div>

        <div class="flex gap-2 items-center">
          <div>
            <h3 class="font-bold">تلفن تماس</h3>
            <div class="font-medium">{{ phoneNumber }}</div>
            <p class="text-sm text-gray-500">10 صبح تا 5 عصر</p>
          </div>
          <IconPhone />
        </div>
      </div>
      <div class="border-b h-1"></div>
    </div>

    <!-- Mobile Header -->
    <div class="md:hidden">
      <div class="container w-full flex justify-between items-center py-3">
        <!-- Hamburger Menu (Left) -->
        <button @click="toggleMenu" class="p-2 rounded-xl border-2 border-gray-300">
          <IconMenu />
        </button>

        <!-- Logo (Center) -->
        <SharedLogo :width="'80px'" :height="'54px'" />

        <!-- Profile (Right) -->

        <div class="flex gap-2">
          <button type="button" class="relative" @click="openCartSidebar">
            <img src="/icons/bag.svg" class="rounded-xl border p-1 border-gray-300 bg-secondary" />
            <span v-if="cartItemsCount > 0" class="cart-badge">{{
              cartItemsCount
            }}</span>
          </button>
        </div>
        <HeaderBtnProfile />

      </div>
      <div class="container border-b-2 border-gray-400 pb-4">
        <HeaderSearch class="headerSearchMobile" />

      </div>
      <!-- Mobile Menu Overlay -->
      <transition name="slide">
        <div v-if="isMenuOpen" class="fixed inset-0 bg-black/40 z-[10000]" @click="toggleMenu">
          <div class="fixed right-0 top-0 h-full w-[85vw] max-w-[360px] bg-white shadow-2xl flex flex-col" @click.stop>
            <!-- Header: Logo + Close -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
              <SharedLogo :width="'70px'" :height="'47px'" />
              <button @click="toggleMenu" class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="بستن منو">
                <IconClose />
              </button>
            </div>

            <!-- Tabs -->
            <div class="flex border-b border-gray-200 shrink-0">
              <button @click="activeTab = 'menu'" class="flex-1 py-3 text-sm font-medium transition-colors relative"
                :class="activeTab === 'menu' ? 'text-secondary' : 'text-gray-500'">
                منو
                <span v-if="activeTab === 'menu'"
                  class="absolute bottom-0 right-0 left-0 h-0.5 bg-secondary rounded-full"></span>
              </button>
              <button @click="activeTab = 'categories'"
                class="flex-1 py-3 text-sm font-medium transition-colors relative"
                :class="activeTab === 'categories' ? 'text-secondary' : 'text-gray-500'">
                دسته‌بندی‌ها
                <span v-if="activeTab === 'categories'"
                  class="absolute bottom-0 right-0 left-0 h-0.5 bg-secondary rounded-full"></span>
              </button>
            </div>

            <!-- Tab Content (scrollable) -->
            <div class="flex-1 overflow-y-auto overscroll-contain">
              <!-- Menu Tab -->
              <div v-show="activeTab === 'menu'" class="p-4">
                <HeaderMenu :menuToggleFunction="toggleMenu" />
              </div>

              <!-- Categories Tab -->
              <div v-show="activeTab === 'categories'" class="p-4">
                <div v-if="loadingCategories" class="flex justify-center py-8">
                  <span class="text-gray-400 text-sm">در حال بارگذاری...</span>
                </div>
                <ul v-else class="flex flex-col gap-1">
                  <li v-for="cat in categories" :key="cat.id">
                    <nuxt-link :to="cat.id === 0 ? '/products' : `/products?category_ids=${cat.id}`"
                      class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      @click="toggleMenu">
                      <span>{{ cat.title }}</span>
                      <IconChevronLeft class="w-4 h-4 text-gray-400" />
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Phone (fixed at bottom) -->
            <div class="shrink-0 border-t border-gray-200 px-4 py-3">
              <div class="flex items-center gap-3">
                <IconPhone />
                <div>
                  <h3 class="text-xs text-gray-500 font-normal">تلفن تماس</h3>
                  <div class="text-sm font-medium">{{ phoneNumber }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useApi } from "@/composables/api/useApi";
import { storeToRefs } from "pinia";
import { useSettingStore } from "~/store/settings";
import { useCategoryStore } from "~/store/menu.js";
const categoryStore = useCategoryStore();
const settingStore = useSettingStore();

const { getBase } = useApi();

const isMenuOpen = ref(false);
const { user } = storeToRefs(settingStore);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const openCartSidebar = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("open-cart-sidebar"));
};
// شمارش ری‌اکتیو سبد خرید (لحظه‌ای)

const cartItemsCount = ref(0);

const readCartCount = () => {
  if (typeof window === "undefined") return 0;

  try {
    const summary = JSON.parse(localStorage.getItem("cart-summary") || "{}");
    if (typeof summary.totalQuantity === "number") return summary.totalQuantity;

    const guestCart = JSON.parse(localStorage.getItem("guest-cart") || "{}");
    const items = guestCart.items || [];
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  } catch {
    return 0;
  }
};

const syncCartCount = () => {
  cartItemsCount.value = readCartCount();
};

onMounted(() => {
  syncCartCount();
  window.addEventListener("storage", syncCartCount);
  window.addEventListener("cart-updated", syncCartCount);
});

onBeforeUnmount(() => {
  window.removeEventListener("storage", syncCartCount);
  window.removeEventListener("cart-updated", syncCartCount);
});

// دریافت تنظیمات از API
const { data: baseData } = await useAsyncData(
  "headerBaseData",
  async () => {
    try {
      return await getBase();
    } catch (error) {
      console.error("❌ Failed to fetch base data in header:", error);
      return { data: { settings: [] } };
    }
  },
  {
    lazy: true,
    server: false,
  },
);

// شماره تلفن از settings
const phoneNumber = computed(() => {
  const settings = baseData.value?.data?.settings?.site;
  return settings?.support_phone || "------------";
});
// تب فعال
const activeTab = ref("menu");

// دسته‌بندی‌ها
const categories = ref([]);
const loadingCategories = ref(false);
const selectedCategory = ref(null);

const fetchCategories = async () => {
  loadingCategories.value = true;
  try {
    const res = await categoryStore.fetchFilters();
    const inMenu = [1, 2, 6, 3, 4, 7, 12, 10];
    const list = res?.data?.categories?.filter(cat => !inMenu.includes(cat.id)) || [];
    categories.value = [{ id: 0, title: "همه دسته‌ها" }, ...list];
    if (!selectedCategory.value) {
      selectedCategory.value = categories.value[0];
    }
  } catch (err) {
    categories.value = [{ id: 0, title: "همه دسته‌ها" }];
  } finally {
    loadingCategories.value = false;
  }
};

// وقتی کاربر تب دسته‌بندی‌ها رو باز کرد و هنوز لود نشده، fetch کن
watch(activeTab, (tab) => {
  if (tab === "categories" && categories.value.length === 0) {
    fetchCategories();
  }
});

// وقتی منو بسته شد، تب رو ریست کن (اختیاری)
watch(isMenuOpen, (open) => {
  if (!open) activeTab.value = "menu";
});
</script>

<style>
.icon-btn {
  background-color: var(--bg-secondary-fade);
  cursor: pointer;
}

.icon-btn:hover {
  background-color: var(--bg-secondary);
  transition: 0.4s;
}

/* Cart Badge */
.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--red);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* Slide Animation */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-active .fixed.right-0,
.slide-leave-active .fixed.right-0 {
  transition: transform 0.3s ease;
}

.slide-enter-from .fixed.right-0,
.slide-leave-to .fixed.right-0 {
  transform: translateX(100%);
}

.headerSearchMobile {
  width: 100%;
}
</style>
