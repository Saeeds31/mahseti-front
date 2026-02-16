<template>
  <section class="flex w-full">
    <div class="flex w-full gap-8 col-span-12">
      <div class="text-right w-2/3 max-md:w-full">
        <h1 class="text-3xl font-semibold text-gray-900 mb-6">تماس با ما</h1>

        <ul class="space-y-4 text-sm md:text-base font-medium leading-7 mb-10">
          <li class="flex items-center gap-2">
            <span class="mt-1.5 w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0"></span>
            ما همراه شما هستیم تا بهترین انتخاب‌های لباس زیر را با تجربه‌ای صادق و پشتیبانی سریع ارائه کنیم
          </li>
          <li class="flex items-center gap-2">
            <span class="mt-1.5 w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0"></span>
            ارتباط آسان، پشتیبانی بی‌وقفه. تیم ماه ستی همیشه آماده است تا به شما مشاوره بدهد
          </li>
        </ul>

        <div class="grid grid-cols-2 gap-4 max-md:gap-2">
          <div class="border border-gray-200 rounded-2xl p-4 max-md:p-2 shadow-sm flex flex-col gap-2 hover:border-gray-300 transition">
            <div class="flex items-center gap-2 text-blue-800 font-medium text-xs lg:text-base">
              <img :src="asset('location.svg')" alt="location" />
              <span>آدرس</span>
            </div>
            <p class="text-xs lg:text-base font-medium">
              {{ contactInfo.address }}
            </p>
          </div>

          <div class="border border-gray-200 rounded-2xl p-4 max-md:p-2 shadow-sm flex flex-col gap-2 hover:border-gray-300 transition">
            <div class="flex items-center gap-2 text-blue-800 font-medium text-sm lg:text-base">
              <img :src="asset('call.svg')" alt="phone" />
              <span>شماره تماس</span>
            </div>

            <div class="flex gap-3 font-sans font-medium dir-ltr text-xs lg:text-base">
              <a :href="`tel:${contactInfo.mobile}`">{{ contactInfo.mobile }}</a>
              -
              <a :href="`tel:${contactInfo.phone}`">{{ contactInfo.phone }}</a>
            </div>
          </div>

          <div class="border border-gray-200 rounded-2xl p-4 max-md:p-2 shadow-sm flex flex-col gap-2 hover:border-gray-300 transition">
            <div class="flex items-center gap-2 text-blue-800 font-medium text-sm lg:text-base">
              <img :src="asset('support.svg')" alt="clock" />
              <span>پشتیبانی</span>
            </div>
            <div class="flex justify-between w-full px-4 max-md:p-2 text-xs lg:text-base">
              <span>{{ contactInfo.supportHours }}</span>
              <span>شنبه تا پنج شنبه</span>
            </div>
          </div>

          <div class="border border-gray-200 rounded-2xl p-4 max-md:p-2 shadow-sm flex flex-col gap-2 hover:border-gray-300 transition">
            <div class="flex items-center gap-2 text-blue-800 font-medium text-sm lg:text-base">
              <img :src="asset('clock.svg')" alt="clock" />
              <span>ساعت کاری فروشگاه</span>
            </div>
            <div class="flex justify-between w-full px-4 max-md:p-2 text-xs lg:text-base">
              <span>{{ contactInfo.storeHours }}</span>
              <span>شنبه تا پنج شنبه</span>
            </div>
          </div>

          <a
            :href="contactInfo.telegram"
            target="_blank"
            class="border text-base font-medium border-gray-200 items-center justify-center gap-2 rounded-2xl p-6 max-md:p-3 shadow-sm flex hover:border-gray-300 transition h-20"
          >
            <img :src="asset('telegram.svg')" alt="telegram" />
            <span class="text-gray-700 font-medium text-base">
              تلگرام: {{ contactInfo.telegramId }}
            </span>
          </a>

          <a
            :href="contactInfo.instagram"
            target="_blank"
            class="border text-base font-medium border-gray-200 items-center justify-center gap-2 rounded-2xl p-6 max-md:p-3 shadow-sm flex hover:border-gray-300 transition h-20"
          >
            <img :src="asset('instagram.svg')" alt="instagram" />
            <span class="text-gray-700 font-medium text-base">
              اینستاگرام: {{ contactInfo.instagramId }}
            </span>
          </a>
        </div>
      </div>

      <div class="max-md:hidden w-1/3 flex items-center justify-center lg:col-span-4 order-1 lg:order-2 relative mt-8 lg:mt-0">
        <img
          :src="asset('phone-hand.svg')"
          alt="Contact Phone"
          class="object-contain mix-blend-multiply"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { joinURL } from 'ufo'

defineProps({
  contactInfo: {
    type: Object,
    required: true,
  },
})

const config = useRuntimeConfig()

const asset = (file) => {
  return joinURL(config.app.baseURL || '/', 'contact', file)
}
</script>
