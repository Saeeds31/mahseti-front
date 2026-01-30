<template>
  <section class="container gap py-16">
    <homeTitleSection
      titleBlack="صادرات"
      titleStrong="ویتامیکس فروت"
      description="میوه های خشک سالم و خوشمزه میان وعده ای انرژی بخش برای هر روز"
    />

    <div
      class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
    >
      <!-- تصویر -->
      <img
        class="w-full lg:w-1/2 rounded-2xl object-cover"
        src="/images/track.png"
        alt="صادرات"
      />

      <!-- متن -->
      <div class="w-full lg:w-1/2 flex flex-col gap-4 items-start text-center lg:text-right">
        <h3 class="text-strong text-lg lg:text-2xl font-bold">
          ویتامیکس؛ طعم طبیعی در بازارهای جهانی
        </h3>
        <span class="text-muted text-sm lg:text-base">
          از تولید تا تحویل؛ صادراتی مطمئن با بسته‌بندی حرفه‌ای و خدمات ویژه
        </span>
        <p class="text-justify leading-7 text-sm lg:text-base">
          شرکت ویتامیکس فروت با بهره‌گیری از تجربه و دانش تخصصی در حوزه فرآوری و بسته‌بندی میوه‌های خشک،
          توانسته است جایگاه ویژه‌ای در بازارهای بین‌المللی به دست آورد. ما با انتخاب بهترین میوه‌های تازه،
          فرآیند خشک‌سازی استاندارد و استفاده از بسته‌بندی‌های مدرن و مقاوم، محصولاتی با کیفیت ممتاز و
          ماندگاری بالا را ارائه می‌دهیم. صادرات برای ما تنها یک مسیر تجاری نیست، بلکه فرصتی است برای رساندن
          طعم طبیعی و اصیل ایران به سراسر جهان. شبکه گسترده حمل‌ونقل و همکاری با شرکت‌های معتبر لجستیکی، امکان
          ارسال سریع و مطمئن محصولات را به هر نقطه دنیا فراهم کرده است. ویتامیکس شریک قابل اعتماد شما در مسیر
          توسعه تجارت جهانی میوه خشک است.
        </p>
        <!-- <nuxt-link
          to="/export"
          class="btn"
        >
          مشاهده بیشتر
        </nuxt-link> -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { useSettingStore } from '~/store/settings'
import { storeToRefs } from 'pinia'

const settingStore = useSettingStore()
const { settings } = storeToRefs(settingStore)
</script>
