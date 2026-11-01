<!-- app/pages/about-us.vue -->
<template>
  <main class="pb-20 flex flex-col px-4 md:px-8 xl:px-28">
    <SharedBreadCrumb :items="[{ label: 'درباره ما', href: '/about-us' }]" />

    <AboutHeroCollage
      :image-src="aboutData.hero.imageSrc"
      :alt="aboutData.hero.alt"
      :fallback-src="aboutData.hero.fallbackSrc"
    />

    <AboutStorySection
      :title="aboutData.story.title"
      :paragraphs="aboutData.story.paragraphs"
      :highlight="aboutData.story.highlight"
      :image-src="aboutData.story.imageSrc"
      :image-alt="aboutData.story.imageAlt"
      :fallback-src="aboutData.story.fallbackSrc"
    />

    <AboutFAQSection />
  </main>
</template>

<script setup>
import { computed } from 'vue'

const defaultAbout = {
  hero: {
    imageSrc: '/about/Group.svg',
    alt: 'Mahseti Model',
    fallbackSrc: '/contact/Group.svg'
  },
  story: {
    title: 'فروشگاه ماه ستی ، انتخابی شایسته',
    paragraphs: [
      'مجموعه ماه ستی توسط سه خواهر از سال ۱۳۹۵ شروع به فعالیت کرده است و از فروش محلی و منطقه‌ای توانسته است با تلاش فراوان به فروش در سطح کشور برسد و در خدمت شمار زیادی از مشتریان گرامی در سطح کشور باشد.',
      'این مجموعه همواره در تلاش است با ارائه محصولات با کیفیت که قیمت‌های مناسبی دارند بهترین خدمات را به شما مشتریان عزیز ارائه دهد.',
      'ماه ستی متنوع‌ترین و باکیفیت‌ترین انواع لباس‌های زیر را در دسترس شما عزیزان قرار داده تا بتوانید متناسب با نیاز خود مدل دلخواه را انتخاب کنید.'
    ],
    highlight:
      'ما به دنبال تعادل بین راحتی، پوشیدنی بودن و زیبایی بی‌همتا هستیم. محصولاتی که با مواد باکیفیت، دوخت دقیق و دغدغه‌ی سلامت پوست طراحی شده‌اند برای زنانی که به خودشان اهمیت می‌دهند.',
    imageSrc: '/about/model-pink.svg',
    imageAlt: 'Mahseti Model',
    fallbackSrc: '/contact/Group.svg'
  }
}

const { data } = await useAsyncData('about-page', async () => {
  // در آینده: return await $fetch('/api/about')
  return null
})

const aboutData = computed(() => data.value ?? defaultAbout)
</script>
