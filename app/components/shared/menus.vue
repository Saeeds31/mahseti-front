<template>
    <nav >
        <ul class="flex items-center gap-[16px]">
            <li class="relative" v-for="(item, index) in menus" :key="index">
                <nuxt-link :to="item.link" class="flex items-center gap-[8px] px-[8px] py-[4px]">
                    <span>
                        {{ item.title }}

                    </span>
                    <svg-menu-icon v-if="item.children.length" />
                </nuxt-link>
                <ul class="absolute top-full right-[0] flex flex-col z-10 gap-[10px] hidden"
                    v-if="item.children.length">
                    <li class="menu-sub-item" v-for="(subItem, index) in item.children" :key="index">

                        <nuxt-link class="px-[8px] py-[4px]" :to="subItem.link">
                            {{ subItem.title }}
                        </nuxt-link>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>
<script setup>
defineProps({
    menus: {
        type: Array
    }
})
</script>
