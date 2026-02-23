<!-- app/components/home/BannerTriple.vue -->
<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<template>
  <section class="w-full px-28 max-md:px-8 max-lg:px-12 mt-16">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div
        v-for="(ban, i) in items"
        :key="i"
        class="relative rounded-xl overflow-hidden flex justify-between items-center pr-8"
        :style="{
          background: `linear-gradient(to top, ${ban.bgFrom} 0%, ${ban.bgTo} 100%)`,
        }"
      >
        <div class="flex flex-col items-start text-white">
          <p class="text-lg font-semibold">{{ ban.title }}</p>

          <button
            v-if="ban.button"
            class="mt-4 px-3 py-2 border border-white rounded-lg font-normal text-sm hover:bg-white hover:text-black transition"
          >
            {{ ban.button }}
          </button>
        </div>

        <img
          :src="ban.image"
          class="object-contain pointer-events-none"
          alt=""
        />
      </div>
    </div>
  </section>
</template>
