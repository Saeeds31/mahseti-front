<template>
  <nav
    class="w-full bg-white dark:bg-gray-900 dark:border-gray-800 relative z-50"
  >
    <div class="mx-auto">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink to="/" class="text-sm text-gray-800 dark:text-white pl-3">
            صفحه اصلی
          </NuxtLink>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-8 space-x-reverse">
          <ul class="flex flex-row gap-4">
            <li v-for="item in menuItems" :key="item.id" class="group relative">
              <!-- Parent Item -->
              <NuxtLink
                :to="item.link || '#'"
                :class="[
                  'flex items-center text-sm font-medium transition-colors py-5',
                  isActive(item.link)
                    ? 'text-indigo-600 font-bold dark:text-indigo-400'
                    : 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400',
                ]"
              >
                {{ item.title }}
                <!-- <svg
                  v-if="item.children && item.children.length > 0"
                  class="w-4 h-4 mr-1 transform group-hover:rotate-180 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg> -->
              </NuxtLink>

              <!-- Dropdown / Submenu -->
              <div
                v-if="item.children && item.children.length > 0"
                class="absolute top-full right-0 w-56 bg-white border border-gray-100 rounded-b-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 dark:bg-gray-800 dark:border-gray-700"
              >
                <ul class="py-2">
                  <li v-for="sub in item.children" :key="sub.id">
                    <NuxtLink
                      :to="sub.link || '#'"
                      :class="[
                        'block px-4 py-2 text-sm',
                        isActive(sub.link)
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400'
                          : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700',
                      ]"
                    >
                      {{ sub.title }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-600 hover:text-gray-900 focus:outline-none dark:text-gray-300"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <div
      v-show="mobileMenuOpen"
      class="md:hidden bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800"
    >
      <ul class="px-4 py-2 space-y-1">
        <li v-for="item in menuItems" :key="item.id">
          <div class="flex flex-col">
            <div class="flex justify-between items-center w-full">
              <NuxtLink
                :to="item.link || '#'"
                :class="[
                  'block py-3 text-base font-medium',
                  isActive(item.link)
                    ? 'text-indigo-600 font-bold dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200',
                ]"
                @click="!item.children?.length && (mobileMenuOpen = false)"
              >
                {{ item.title }}
              </NuxtLink>

              <!-- <button
                v-if="item.children && item.children.length > 0"
                @click.stop="toggleMobileSubmenu(item.id)"
                class="p-2 focus:outline-none"
              >
                <svg
                  class="w-5 h-5 text-gray-500 transform transition-transform duration-200"
                  :class="{ 'rotate-180': activeMobileSub === item.id }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button> -->
            </div>

            <ul
              v-if="item.children && item.children.length > 0"
              v-show="activeMobileSub === item.id"
              class="pr-4 border-r-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 mb-2 rounded-lg"
            >
              <li v-for="sub in item.children" :key="sub.id">
                <NuxtLink
                  :to="sub.link || '#'"
                  :class="[
                    'block py-2 text-sm',
                    isActive(sub.link)
                      ? 'text-indigo-600 font-semibold dark:text-indigo-400'
                      : 'text-gray-600 hover:text-indigo-600 dark:text-gray-400',
                  ]"
                  @click="mobileMenuOpen = false"
                >
                  {{ sub.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "@/composables/api/useApi";

const route = useRoute();
const mobileMenuOpen = ref(true);
const activeMobileSub = ref(null);

const { getBase } = useApi();

const { data: baseResponse, error: baseError } = await useAsyncData(
  "layout-base-data",
  () => getBase(),
  { server: true, lazy: true },
);

const resolveLink = (item) => {
  if (item?.link) return item.link;

  const title = (item?.title || "").trim();

  if (title === "درباره ما") return "/about-us";
  if (title === "تماس با ما") return "/contact-us";

  if (item?.id) return `/products?category_id=${item.id}`;

  return "#";
};

const normalizeMenus = (rawMenus) => {
  if (!Array.isArray(rawMenus)) return [];

  return rawMenus.map((m) => ({
    id: m.id ?? m.title,
    title: m.title ?? "",
    link: resolveLink(m),
    children: Array.isArray(m.children)
      ? m.children.map((c) => ({
          id: c.id ?? c.title,
          title: c.title ?? "",
          link: resolveLink(c),
        }))
      : [],
  }));
};

const menuItems = computed(() => {
  const data = baseResponse.value?.data ?? baseResponse.value ?? {};
  const rawMenus = data.menus ?? [];
  return normalizeMenus(rawMenus);
});

const isActive = (link) => {
  if (!link || link === "#") return false;
  return route.fullPath === link;
};

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false;
    activeMobileSub.value = null;
  },
);

const toggleMobileSubmenu = (id) => {
  activeMobileSub.value = activeMobileSub.value === id ? null : id;
};
</script>
