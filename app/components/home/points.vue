<template>
  <section class="container gap py-16">
    <homeTitleSection
      titleBlack="فواید "
      titleStrong="میوه خشک"
      description="میوه های خشک سالم و خوشمزه میان وعده ای انرژی بخش برای هر روز"
    />

    <div
      class="grid grid-cols-1 lg:grid-cols-3 items-center gap-10 lg:gap-4 text-center lg:text-right"
    >
      <!-- لیست سمت راست -->
      <ul class="flex flex-col gap-10 order-2 lg:order-1">
        <li class="flex flex-col items-center lg:items-start gap-2">
          <span class="text-strong font-bold text-lg">بهبود گوارش</span>
          <p class="text-sm">
            فیبر طبیعی موجود در میوه‌های خشک ویتامیکس
            به هضم بهتر غذا و عملکرد سالم دستگاه گوارش کمک می‌کند.
          </p>
        </li>
        <li class="flex flex-col items-center lg:items-start gap-2">
          <span class="text-strong font-bold text-lg">کم کالری و پرانرژی</span>
          <p class="text-sm">
            با وجود حجم کم، انرژی زیادی فراهم می‌کنند و انتخابی
            ایده‌آل برای میان‌وعده‌های سالم و تقویت بدن در طول روز هستند.
          </p>
        </li>
        <li class="flex flex-col items-center lg:items-start gap-2">
          <span class="text-strong font-bold text-lg">سرشار از مواد مغذی</span>
          <p class="text-sm">
            میوه‌های خشک ویتامیکس منبع طبیعی و غنی از ویتامین‌ها
            و مواد معدنی هستند که به تغذیه کامل و سالم بدن کمک می‌کنند.
          </p>
        </li>
      </ul>

      <!-- تصویر وسط -->
      <div class="order-1 lg:order-2 flex justify-center">
        <img
          src="/images/point.png"
          alt="فواید میوه خشک"
          class=" w-full"
        />
      </div>

      <!-- لیست سمت چپ -->
      <ul class="flex flex-col gap-10 order-3">
        <li class="flex flex-col items-center lg:items-end gap-2">
          <span class="text-strong font-bold text-lg">مدیریت وزن</span>
          <p class="text-sm text-center lg:text-left">
            مصرف کنترل‌شده میوه‌های خشک می‌تواند
            احساس سیری ایجاد کند و گزینه‌ای مناسب برای حفظ وزن سالم باشد.
          </p>
        </li>
        <li class="flex flex-col items-center lg:items-end gap-2">
          <span class="text-strong font-bold text-lg">تقویت سیستم ایمنی</span>
          <p class="text-sm text-center lg:text-left">
            ویتامین‌ها و آنتی‌اکسیدان‌های طبیعی موجود در
            میوه‌های خشک باعث تقویت دفاع طبیعی بدن در برابر بیماری‌ها می‌شوند.
          </p>
        </li>
        <li class="flex flex-col items-center lg:items-end gap-2">
          <span class="text-strong font-bold text-lg">حاوی آنتی‌اکسیدان طبیعی</span>
          <p class="text-sm text-center lg:text-left">
            آنتی‌اکسیدان‌ها با کاهش رادیکال‌های آزاد بدن
            سلامت سلول‌ها و جوان‌سازی طبیعی پوست را حمایت می‌کنند.
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>
