<script setup>
import { useApi } from '@/composables/api/useApi'

const { getBase } = useApi()

// دریافت منوها از API
const { data: baseData } = await useAsyncData(
  'baseMenus',
  async () => {
    try {
      return await getBase()
    } catch (error) {
      console.error('❌ Failed to fetch menus:', error)
      return { data: { menus: [] } }
    }
  },
  {
    lazy: true,
    server: false
  }
)

const menuItems = computed(() => {
  const menus = baseData.value?.data?.menus || []
  return menus.map(menu => ({
    title: menu.title,
    path: menu.link || '#',
    submenu: menu.children?.length > 0
      ? menu.children.map(child => ({
          title: child.title,
          path: child.link || '#'
        }))
      : null
  }))
})

const openSubmenu = ref(null)

const toggleSubmenu = (index) => {
  openSubmenu.value = openSubmenu.value === index ? null : index
}
</script>

<template>  
  <nav>
    <!-- Desktop Menu -->
    <ul class="hidden md:flex items-center gap-2">
      <li 
        v-for="item in menuItems" 
        :key="item.path"
        class="relative menu-wrapper"
      >
        <NuxtLink 
          :to="item.path" 
          class="menu-item pad rounded-inner text-sm font-medium cursor-pointer transition-all duration-300 inline-flex items-center gap-1"
        >
          {{ item.title }}
            <iconSubMenu v-if="item.submenu" />
        </NuxtLink>
        
        <ul 
          v-if="item.submenu" 
          class="submenu absolute top-12 right-0 min-w-[200px] mt-2 opacity-0 invisible translate-y-[-10px] transition-all duration-300 z-[100] bg-primary shadow rounded-inner border"
        >
          <li v-for="subItem in item.submenu" :key="subItem.path">
            <NuxtLink 
              :to="subItem.path" 
              class="submenu-item pad block text-sm transition-all duration-300 border-b last:border-b-0"
            >
              {{ subItem.title }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>

    <!-- Mobile Menu (Accordion Style) -->
    <ul class="md:hidden flex flex-col gap-2">
      <li 
        v-for="(item, index) in menuItems" 
        :key="item.path"
        class="mobile-menu-item"
      >
        <div class="flex items-center justify-between">
          <NuxtLink 
            v-if="!item.submenu"
            :to="item.path" 
            class="menu-item-mobile pad rounded-inner text-sm font-medium cursor-pointer transition-all duration-300 flex-1"
          >
            {{ item.title }}
          </NuxtLink>
          
          <button
            v-else
            @click="toggleSubmenu(index)"
            class="menu-item-mobile pad rounded-inner text-sm font-medium cursor-pointer transition-all duration-300 flex items-center justify-between w-full"
          >
            <span>{{ item.title }}</span>
            <svg 
              class="w-4 h-4 transition-transform duration-300"
              :class="{ 'rotate-180': openSubmenu === index }"
              viewBox="0 0 12 12" 
              fill="none"
            >
              <path d="M6 8L2 4L10 4L6 8Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        
        <transition name="accordion">
          <ul 
            v-if="item.submenu && openSubmenu === index" 
            class="submenu-mobile mt-2 mr-4 flex flex-col gap-1 overflow-hidden"
          >
            <li v-for="subItem in item.submenu" :key="subItem.path">
              <NuxtLink 
                :to="subItem.path" 
                class="submenu-item-mobile pad block text-sm transition-all duration-300 rounded-inner"
              >
                {{ subItem.title }}
              </NuxtLink>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* Desktop Styles */
.menu-item:hover {
  background-color: var(--bg-secondary-fade);
  color: var(--text-strong);
}

.menu-wrapper:hover .icon-arrow {
  transform: rotate(180deg);
}

.menu-wrapper:hover .submenu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.submenu-item:hover {
  background-color: var(--bg-secondary-fade);
  color: var(--text-strong);
}

.submenu-item.router-link-active {
  background-color: var(--bg-secondary-fade);
  color: var(--text-strong);
  font-weight: 500;
}

/* Mobile Styles */
.menu-item-mobile {
  text-align: right;
}

.menu-item-mobile:hover,
.menu-item-mobile:active {
  background-color: var(--bg-secondary-fade);
  color: var(--text-strong);
}

.submenu-item-mobile:hover,
.submenu-item-mobile:active {
  background-color: var(--bg-secondary-fade);
  color: var(--text-strong);
}

.submenu-item-mobile.router-link-active {
  background-color: var(--bg-secondary-fade);
  color: var(--text-strong);
  font-weight: 500;
}

/* Accordion Animation */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>