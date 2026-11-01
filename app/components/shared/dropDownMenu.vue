<template>
    <nav id="mobileMenu" @click="checkCloseMenu"
        class="w-64  text-white min-h-screen z-[100] p-0 bg-[#1213] backdrop-filter backdrop-blur-sm fixed top-[0] right-[0] w-full">
        <button id="closeMenu" @click="closeMenu" class="absolute left-[8px] top-[8px]">
            <svg-close />
        </button>
        <ul class="bg-[#06102e] h-screen overflow-auto flex flex-col items-start gap-[8px] w-[320px] p-[24px] ">
            <li v-for="(item, index) in menus" :key="index" class="mb-2">
                <div class="flex justify-between items-center">
                    <a :href="item.link || '#'" class="flex-1 text-left px-4 py-2 rounded-md hover:bg-gray-700">
                        {{ item.title }}
                    </a>
                    <button v-if="item.children && item.children.length" @click="toggleSubMenu(index)"
                        class="px-2 py-2 hover:bg-gray-700 rounded-md focus:outline-none">
                        <svg class="w-4 h-4 transform transition-transform"
                            :class="{ 'rotate-180': openSubMenus[index] }" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                            </path>
                        </svg>
                    </button>
                </div>
                <ul v-if="item.children && item.children.length" v-show="openSubMenus[index]"
                    class="ml-4 mt-2 space-y-1">
                    <li v-for="(subItem, subIndex) in item.children" :key="subIndex">
                        <a :href="subItem.link || '#'" class="block px-4 py-2 text-sm hover:bg-gray-600 rounded-md">
                            {{ subItem.title }}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
    menus: {
        type: Array,
        required: true,
        default: () => []
    }
})
const emit = defineEmits(["closeMenu"])
function closeMenu() {
    emit("closeMenu", true)

} function checkCloseMenu(e) {
    if (e && e.target && e.target.id == 'mobileMenu') {
        closeMenu()
    }

}
const openSubMenus = ref({})

const toggleSubMenu = (index) => {
    openSubMenus.value[index] = !openSubMenus.value[index]
}
</script>
<style>
#mobileMenu ul {
    box-shadow: -11px 0px 5px #1213;
}

#mobileMenu #closeMenu svg path {
    stroke: white;
}
</style>