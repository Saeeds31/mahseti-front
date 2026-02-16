<template>
  <footer
    class="relative bg-[#0B0B0B] text-gray-400 pt-12 px-4 md:px-8 xl:px-28"
  >
    <div
      class="relative mx-auto grid grid-cols-[1fr_100px] lg:grid-cols-[1fr_80px] gap-6"
    >
      <!-- ستون راست -->
      <div class="space-y-10">
        <!-- ردیف ۱: مزیت‌ها -->
        <div class="grid grid-cols-2 md:grid-cols-6 gap-8 items-start">
          <!-- لوگو -->
          <div class="flex h-full items-start max-md:mt-8">
            <NuxtLink to="/">
              <img
                src="/images/logo.svg"
                :alt="siteName"
                class="opacity-90 max-w-[160px]"
              />
            </NuxtLink>
          </div>

          <!-- لیست مزیت‌ها -->
          <div v-for="item in advantages" :key="item.title" class="space-y-2">
            <img :src="item.icon" :alt="item.title" class="h-10 w-auto" />
            <h4 class="text-sm font-semibold text-white">
              {{ item.title }}
            </h4>
            <p class="text-xs text-gray-500 leading-5">
              {{ item.subtitle }}
            </p>
          </div>
        </div>

        <!-- ردیف ۲: لینک‌ها -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 text-xs md:mr-8"
        >
          <!-- ستون: لینک‌های مهم -->
          <div>
            <h5
              class="mb-4 text-white font-semibold text-sm border-b border-white/10 pb-2 inline-block"
            >
              دسترسی سریع
            </h5>
            <div class="grid grid-cols-3 gap-x-4 gap-y-6">
              <ul
                v-for="(col, i) in quickAccessColumns"
                :key="`quick-${i}`"
                class="space-y-3"
              >
                <li v-for="item in col" :key="item.label">
                  <NuxtLink
                    :to="item.href"
                    class="hover:text-pink-500 transition-colors duration-200 flex items-center gap-1"
                  >
                    <span>{{ item.label }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- ستون: دسته‌بندی -->
          <div>
            <h5
              class="mb-4 text-white font-semibold text-sm border-b border-white/10 pb-2 inline-block"
            >
              دسته‌بندی‌ها
            </h5>
            <div class="grid grid-cols-3 gap-x-4 gap-y-6">
              <ul
                v-for="(col, i) in categoryColumns"
                :key="`cat-${i}`"
                class="space-y-3"
              >
                <li v-for="item in col" :key="item.label">
                  <NuxtLink
                    :to="item.href"
                    class="hover:text-pink-500 transition-colors duration-200 flex items-center gap-1"
                  >
                    <span>{{ item.label }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- ستون: شبکه‌های اجتماعی -->
          <div>
            <h5
              class="mb-4 text-white font-semibold text-sm border-b border-white/10 pb-2 inline-block"
            >
              شبکه‌های اجتماعی
            </h5>
            <ul class="space-y-4">
              <li v-for="item in socialLinks" :key="item.label">
                <a
                  :href="item.href"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center gap-3 hover:text-white transition"
                >
                  <img
                    :src="item.icon"
                    :alt="item.label"
                    class="w-5 h-5 opacity-80"
                  />
                  <span>{{ item.label }}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- ستون: اطلاعات تماس -->
          <div>
            <h5
              class="mb-4 text-white font-semibold text-sm border-b border-white/10 pb-2 inline-block"
            >
              اطلاعات تماس
            </h5>
            <ul class="space-y-4 leading-relaxed">
              <li
                v-for="item in contactItems"
                :key="item.label"
                class="flex items-start gap-3 text-sm"
              >
                <img
                  v-if="item.icon"
                  :src="item.icon"
                  class="w-5 h-5 mt-1 opacity-80 shrink-0"
                  :alt="item.label"
                />
                <a
                  v-if="item.href"
                  :href="item.href"
                  class="hover:text-white transition"
                  :dir="item.dir || 'rtl'"
                >
                  {{ item.label }}
                </a>
                <span v-else class="text-gray-500">
                  {{ item.label }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- ستون چپ -->
      <div class="relative flex flex-col items-center lg:items-end gap-6">
        <button
          class="sticky top-6  rounded-md bg-pink-700 py-2 px-[6px] font-normal !text-xs text-white transition hover:bg-pink-600 backdrop-blur-sm"
          type="button"
          @click="scrollTop"
        >
          برگشت به بالا
        </button>

        <div class="absolute bottom-0 left-0 hidden lg:block">
          <img src="/images/star.svg" alt="star" class="mb-2" />
        </div>
      </div>
    </div>

    <div class="mt-12 border-t border-white/10" />

    <p class="py-4 text-center font-normal text-base text-gray-500">
      {{ footerNote }}
    </p>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import { useSettingStore } from "@/store/settings.js";
import { storeToRefs } from "pinia";

const settingStore = useSettingStore();
const { settings, menus } = storeToRefs(settingStore);

const siteName = computed(
  () => settings.value?.site?.site_name || "Mahset Shop",
);

const footerNote = computed(() => {
  return settings.value?.site?.site_footer_note || "Design by padhosha";
});

const advantages = [
  {
    title: "ارسال سریع",
    subtitle: "۳ تا ۷ روز کاری",
    icon: "/icons/delivery.svg",
  },
  { title: "پشتیبانی", subtitle: "در روزهای کاری", icon: "/icons/support.svg" },
  {
    title: "قیمت مناسب",
    subtitle: "خرید بدون واسطه",
    icon: "/icons/price.svg",
  },
  { title: "پرداخت امن", subtitle: "درگاه بانکی", icon: "/icons/payment.svg" },
  {
    title: "ضمانت کیفیت",
    subtitle: "خرید با اطمینان",
    icon: "/icons/quality.svg",
  },
];

const fallbackQuickAccess = [
  { label: "سوتین اسفنجی", href: "/category/sutien-esfanji" },
  { label: "سوتین نخی", href: "/category/sutien-nakhy" },
  { label: "سوتین ورزشی", href: "/category/sutien-varzeshi" },
  { label: "سوتین معمولی", href: "/category/sutien-mamooli" },
  { label: "نیم تنه", href: "/category/nim-tane" },
  { label: "لباس خواب", href: "/category/lebas-khab" },
  { label: "شورت توری", href: "/category/short-tori" },
  { label: "شورت اسلیپ", href: "/category/short-eslip" },
  { label: "شورت پادار", href: "/category/short-padar" },
];

const fallbackCategories = [
  { label: "سوتین", href: "/category/sutien" },
  { label: "شورت", href: "/category/short" },
  { label: "نیم تنه", href: "/category/nim-tane" },
  { label: "لباس", href: "/category/lebas" },
  { label: "اکسسوری", href: "/category/accessory" },
  { label: "ست لباس زیر", href: "/category/set" },
];

const fallbackSocials = [
  {
    label: "اینستاگرام: mahsetishop",
    href: "https://instagram.com/mahsetishop",
    icon: "/icons/instagram.svg",
  },
  {
    label: "تلگرام: mahsetishop",
    href: "https://t.me/mahsetishop",
    icon: "/icons/telegram.svg",
  },
];

const fallbackContacts = [
  {
    label: "۰۹۳۷ - ۵۰۱ - ۵۷۶۹",
    href: "tel:09375015769",
    icon: "/icons/phone.svg",
    dir: "ltr",
  },
  {
    label: "گرگان، خیابان پنج آذر، جنب سالن تختی",
    icon: "/icons/location.svg",
  },
];

const buildColumns = (items, columnCount) => {
  if (!items?.length) return [];
  const perColumn = Math.ceil(items.length / columnCount);
  const columns = [];
  for (let i = 0; i < items.length; i += perColumn) {
    const slice = items.slice(i, i + perColumn);
    if (slice.length) {
      columns.push(slice);
    }
  }
  return columns;
};

const quickAccessColumns = computed(() => {
  const source = menus.value?.length
    ? menus.value.map((menu) => ({
        label: menu.title,
        href: menu.link || "#",
      }))
    : fallbackQuickAccess;

  return buildColumns(source, 3);
});

const categoryColumns = computed(() => buildColumns(fallbackCategories, 3));

const socialLinks = computed(() => {
  const socials = settings.value?.social || {};
  const map = [
    { key: "instagram", label: "اینستاگرام", icon: "/icons/instagram.svg" },
    { key: "telegram", label: "تلگرام", icon: "/icons/telegram.svg" },
    { key: "whatsapp", label: "واتساپ", icon: "/icons/whatsapp.svg" },
    { key: "youtube", label: "یوتیوب", icon: "/icons/youtube.svg" },
  ];

  const dynamicItems = map
    .filter((item) => socials[item.key])
    .map((item) => ({
      label: `${item.label}: ${extractHandle(socials[item.key])}`,
      href: socials[item.key],
      icon: item.icon,
    }));

  return dynamicItems.length ? dynamicItems : fallbackSocials;
});

const contactItems = computed(() => {
  const site = settings.value?.site || {};
  const items = [];

  if (site.site_phone) {
    items.push({
      label: site.site_phone,
      href: `tel:${site.site_phone.replace(/\s+/g, "")}`,
      icon: "/icons/phone.svg",
      dir: "ltr",
    });
  }

  if (site.site_email) {
    items.push({
      label: site.site_email,
      href: `mailto:${site.site_email}`,
      icon: "/icons/mail.svg",
      dir: "ltr",
    });
  }

  if (site.site_address) {
    items.push({
      label: site.site_address,
      icon: "/icons/location.svg",
    });
  }

  return items.length ? items : fallbackContacts;
});

const extractHandle = (url) => {
  if (!url) return "";
  const cleaned = url.replace(/\/+$/, "");
  const parts = cleaned.split("/");
  return parts[parts.length - 1] || cleaned;
};

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
