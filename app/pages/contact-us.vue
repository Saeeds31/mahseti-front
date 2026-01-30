<template>
  <main>
    <sharedBreadCrumb class="container" :items="[{ label: 'تماس با ما', href: '/contact-us' }]" />
    
    <!-- بخش آدرس‌ها -->
    <section class="container pt-20">
      <div class="flex flex-wrap justify-between gap-4">
        <div class="flex gap-2 items-start w-full sm:w-[48%] lg:w-[23%]">
          <iconMap class="text-strong flex-shrink-0 mt-1" />
          <div class="text-sm text-muted">
            <span class="font-bold text">آدرس:</span>
            گلستان-گرگان-نصرآباد نصراباد7
          </div>
        </div>
        
        <div class="flex gap-2 items-start w-full sm:w-[48%] lg:w-[23%]">
          <iconAirplane class="text-strong flex-shrink-0 mt-1" />
          <div class="text-sm font-bold text">
            ارســال باکــــیفیـــت وحــرفـــه ای متناسب با استاندارد های جهان
          </div>
        </div>
        
        <div class="flex gap-2 items-start w-full sm:w-[48%] lg:w-[23%]">
          <iconChat class="text-strong flex-shrink-0 mt-1" />
          <div class="text-sm font-bold text">پشتیبـانــی 24ساعـــت</div>
        </div>
        
        <div class="flex gap-2 items-start w-full sm:w-[48%] lg:w-[23%]">
          <iconMobile class="text-strong flex-shrink-0 mt-1" />
          <div class="text-sm text-muted">
            <div>
              <span class="font-bold text">تلفن:</span>
              <span>1235 521 0911</span>
            </div>
            <div>
              <span class="font-bold text">ایمیل:</span>
              <span>info@vitamixfriut.az</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- نقشه گوگل -->
    <section class="pt-10">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51181.78644006659!2d52.69618715349814!3d36.7018622690866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8f81c6f2554bfb%3A0x1d77f2bb333c2f3a!2z2KjYp9io2YTYs9ix2Iwg2KfYs9iq2KfZhiDZhdin2LLZhtiv2LHYp9mG2Iwg2KfbjNix2KfZhg!5e0!3m2!1sfa!2s!4v1762125347960!5m2!1sfa!2s"
        width="100%"
        height="350"
        class="h-[250px] sm:h-[300px] md:h-[350px]"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>

    <!-- عنوان و فرم -->
   <contactForm />
  </main>
</template>