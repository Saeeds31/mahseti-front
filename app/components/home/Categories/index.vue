<!-- app/components/home/Categories/index.vue -->
<template>
  <section class="w-full mt-16 mb-24 px-28 max-md:px-8 max-lg:px-12">
    <HomeTitleSection
      titleBlack="دسته‌بندی‌های"
      titleStrong="ما"
      description="راحتی، تنوع، پوشش زیبا، و تجربه خریدی فراموش‌نشدنی"
    />

    <div
      class="grid pt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
    >
      <HomeCategoriesCard
        v-for="(item, index) in sortedCategories"
        :key="item.id ?? index"
        :item="mapCategory(item, index)"
        :class="mapCategory(item, index).big ? 'row-span-2' : 'row-span-1'"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
});

const sortedCategories = computed(() => {
  return [...props.categories].sort((a, b) => {
    const ao = a?.order ?? 9999;
    const bo = b?.order ?? 9999;
    return ao - bo;
  });
});

const mapCategory = (item, index) => {
  return {
    id: item.id,
    title: item.title ?? "دسته‌بندی",
    description:
      item.meta_description || item.description || "محصولات این دسته را ببینید",
    image: item.main_image || item.icon || "",
    link: item.slug ? `/category/${item.slug}` : `/category/${item.id}`,
    buttonText: "مشاهده محصولات",
    big: index === 0,
    gradient: gradientByIndex(index),
  };
};

const gradientByIndex = (index) => {
  const gradients = [
    "bg-[#628F24]",
    "bg-[#0A2E63]",
    "bg-[#028BBF]",
    "bg-[#1F7F42]",
    "bg-[#1A8D6A]",
  ];
  return gradients[index % gradients.length];
};
</script>
