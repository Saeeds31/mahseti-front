<!-- app/components/home/Categories/index.vue -->
<template>
  <section class="w-full mt-16 mb-24 px-28 max-md:px-8 max-lg:px-12">
    <HomeTitleSection titleBlack="دسته‌بندی‌های" titleStrong="ما"
      description="راحتی، تنوع، پوشش زیبا، و تجربه خریدی فراموش‌نشدنی" />

    <div
      class="homeCategoryBox grid grid-cols-2 md:flex md:flex-row md:flex-nowrap gap-2 overflow-x-auto md:overflow-y-hidden w-full">
      <HomeCategoriesCard class="homeCategoryCard" v-for="(item, index) in sortedCategories" :key="item.id ?? index"
        :item="mapCategory(item, index)" />
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
  let arr = [...props.categories];
  arr.push(
    {
      id: 0,
      title: 'همه محصولات',
      description: 'دنیای بی پایان لباس زیر و محصولات زنانه در فروشگاه ماه ستی',
      image: null
    }
  )
  return arr
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
<style>
@media (max-width:680px) {
  .homeCategoryBox .homeCategoryCard:last-child {
    grid-column: 1 / 3;
  }
}
</style>