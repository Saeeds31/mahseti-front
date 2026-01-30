<template>
  <footer class="gap bg-secondary-fade rounded-tl-4xl rounded-tr-4xl rounded-bl-4xl pt-8 pb-4">
    <div class="container mx-auto">
      <!-- بخش اصلی فوتر -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b">
        <!-- ستون 1: لوگو و شبکه‌های اجتماعی -->
        <div class="flex flex-col items-center lg:items-start gap-6">
          <nuxt-link to="/">
            <img
              class="w-[180px] h-auto"
              src="/images/logo.png"
              :alt="settings?.site?.site_name || 'ویتامیکس'"
            >
          </nuxt-link>

          <!-- آیکون‌های شبکه‌های اجتماعی -->
          <div class="flex items-center gap-3" v-if="settings?.social">
            <a
              v-if="settings.social.instagram"
              :href="settings.social.instagram"
              target="_blank"
              class="w-8 h-8 bg-[#2C3E50] rounded-full flex items-center justify-center hover:bg-[#1a252f] transition"
              aria-label="اینستاگرام"
            >
              <AtSign :size="16" class="text-white" />
            </a>
            <a
              v-if="settings.social.telegram"
              :href="settings.social.telegram"
              target="_blank"
              class="w-8 h-8 bg-[#2C3E50] rounded-full flex items-center justify-center hover:bg-[#1a252f] transition"
              aria-label="تلگرام"
            >
              <Send :size="16" class="text-white" />
            </a>
            <a
              v-if="settings.social.whatsapp"
              :href="settings.social.whatsapp"
              target="_blank"
              class="w-8 h-8 bg-[#2C3E50] rounded-full flex items-center justify-center hover:bg-[#1a252f] transition"
              aria-label="واتساپ"
            >
              <MessageCircle :size="16" class="text-white" />
            </a>
            <a
              v-if="settings.social.youtube"
              :href="settings.social.youtube"
              target="_blank"
              class="w-8 h-8 bg-[#2C3E50] rounded-full flex items-center justify-center hover:bg-[#1a252f] transition"
              aria-label="یوتیوب"
            >
              <Video :size="16" class="text-white" />
            </a>
          </div>
        </div>

        <!-- ستون 2: لینک‌های مهم (از API) -->
        <div class="flex flex-col gap-4">
          <h4 class="font-bold text-lg">لینک های مهم</h4>
          <ul class="space-y-2">
            <li v-for="menu in menus?.slice(0, 4)" :key="menu.id">
              <nuxt-link
                :to="menu.link"
                class="text-sm hover:text-strong transition flex items-center gap-1"
              >
                <ChevronLeft :size="14" />
                {{ menu.title }}
              </nuxt-link>
            </li>
          </ul>
        </div>

        <!-- ستون 3: دسترسی سریع -->
        <div class="flex flex-col gap-4">
          <h4 class="font-bold text-lg">دسترسی سریع</h4>
          <ul class="space-y-2">
            <li>
              <nuxt-link to="/products" class="text-sm hover:text-strong transition flex items-center gap-1">
                <ChevronLeft :size="14" />
                محصولات ویتامیکس
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/about" class="text-sm hover:text-strong transition flex items-center gap-1">
                <ChevronLeft :size="14" />
                درباره ما
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/contact" class="text-sm hover:text-strong transition flex items-center gap-1">
                <ChevronLeft :size="14" />
                تماس با ما
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/blog" class="text-sm hover:text-strong transition flex items-center gap-1">
                <ChevronLeft :size="14" />
                شیوه خشک
              </nuxt-link>
            </li>
          </ul>
        </div>

        <!-- ستون 4: ارتباط با ما (از API) -->
        <div class="flex flex-col gap-4">
          <h4 class="font-bold text-lg">ارتباط با ما</h4>
          <ul class="space-y-3">
            <li v-if="settings?.site?.site_address" class="flex items-start gap-2 text-sm">
              <MapPin :size="16" class="shrink-0 mt-0.5 text-strong" />
              <span class="text-muted">{{ settings.site.site_address }}</span>
            </li>
            <li v-if="settings?.site?.site_email" class="flex items-start gap-2 text-sm">
              <Mail :size="16" class="shrink-0 mt-0.5 text-strong" />
              <a
                :href="`mailto:${settings.site.site_email}`"
                class="text-muted hover:text-strong transition"
              >
                {{ settings.site.site_email }}
              </a>
            </li>
            <li v-if="settings?.site?.site_phone" class="flex items-start gap-2 text-sm">
              <Phone :size="16" class="shrink-0 mt-0.5 text-strong" />
              <a
                :href="`tel:${settings.site.site_phone}`"
                class="text-muted hover:text-strong transition"
                dir="ltr"
              >
                {{ settings.site.site_phone }}
              </a>
            </li>
          </ul>
        </div>

        <!-- ستون 5: نمادها -->
        <div class="flex flex-col gap-4 items-center lg:items-start">
          <a href="#" class="block" target="_blank">
            <img src="@/assets/images/enamad.png" alt="نماد اعتماد الکترونیکی" class="w-24 h-auto">
          </a>
          <a href="#" class="block" target="_blank">
            <img src="@/assets/images/samandehi.png" alt="نماد ساماندهی" class="w-24 h-auto">
          </a>
        </div>
      </div>

      <!-- بخش پایین فوتر -->
      <div class="pt-4 text-center">
        <p class="text-sm text-muted">
          All rights reserved
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { AtSign, Send, MessageCircle, Video, ChevronLeft, MapPin, Mail, Phone } from 'lucide-vue-next'
import { useSettingStore } from '../../store/settings.js'
import { storeToRefs } from 'pinia'

const settingStore = useSettingStore()
const { settings, menus } = storeToRefs(settingStore)
</script>

<style scoped>
/* استفاده از متغیرهای CSS برای رنگ‌ها */
footer {
  background-color: var(--bg-secondary-fade);
  color: var(--text);
}

h4 {
  color: var(--text);
}

a:hover {
  color: var(--text-strong);
}
</style>
