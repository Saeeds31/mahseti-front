<template>
  <main class="pb-20 flex flex-col px-4 md:px-8 xl:px-28">
    <SharedBreadCrumb
      class="mb-8"
      :items="[{ label: 'تماس با ما', href: '/contact-us' }]"
    />

    <ContactHeroSection :contact-info="contactInfo" />

    <ContactFormSection
      class="mt-16"
      :model="form"
      :loading="loading"
      @submit="submitForm"
    />
  </main>
</template>

<script setup>
import { reactive, ref, computed } from "vue";

const config = useRuntimeConfig();
const apiBase = (config.public.apiBase || config.public.baseURL || "").replace(
  /\/$/,
  "",
);

const defaultContactInfo = {
  address: "گرگان - خیابان پنج آذر، جنب سالن تختی",
  mobile: "۰۹۳۷-۵۰۱-۵۷۶۹",
  phone: "۰۹۳۷-۵۰۱-۵۵۵۴",
  supportHours: "۰۹:۰۰ تا ۱۷:۰۰",
  storeHours: "۰۹:۰۰ تا ۲۱:۰۰",
  telegram: "https://t.me/mahsetishop",
  telegramId: "mahsetishop",
  instagram: "https://instagram.com/mahsetishop",
  instagramId: "mahsetishop",
};

const { data } = await useAsyncData("contact-page", async () => {
  // در صورت اتصال API تنظیمات تماس، اینجا داده‌ها را fetched کنید.
  return null;
});

const contactInfo = computed(
  () => data.value?.contactInfo ?? defaultContactInfo,
);

const form = reactive({
  name: "",
  phone: "",
  message: "",
});

const loading = ref(false);

const toEnglishDigits = (value) => {
  const persianNums = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return value
    .toString()
    .split("")
    .map((char) => {
      const index = persianNums.indexOf(char);
      if (index > -1) return index.toString();
      return char;
    })
    .join("");
};

const resetForm = () => {
  form.name = "";
  form.phone = "";
  form.message = "";
};

const submitForm = async () => {
  const name = form.name.trim();
  const message = form.message.trim();
  const normalizedPhone = toEnglishDigits(form.phone).replace(/\D/g, "");

  if (!name) {
    alert("لطفاً نام و نام خانوادگی را وارد کنید.");
    return;
  }

  if (normalizedPhone.length !== 11) {
    alert("شماره موبایل باید دقیقاً ۱۱ رقم باشد.");
    return;
  }

  if (!message) {
    alert("متن پیام نمی‌تواند خالی باشد.");
    return;
  }

  loading.value = true;

  try {
    const fd = new FormData();
    fd.append("full_name", name);
    fd.append("subject", "پیام از فرم تماس وب‌سایت");
    fd.append("mobile", normalizedPhone);
    fd.append("email", "");
    fd.append("body", message);

    await $fetch("/front/contact", {
      baseURL: apiBase,
      method: "POST",
      body: fd,
      headers: {
        Accept: "application/json",
      },
    });

    alert("پیام شما با موفقیت ارسال شد.");
    resetForm();
  } catch (error) {
    console.error(error);

    const status = error?.response?.status;
    const apiErrors = error?.response?._data;

    if (status === 422 && apiErrors?.errors) {
      const messages = Object.values(apiErrors.errors).flat().join("\n");
      alert(messages || apiErrors.message || "اعتبارسنجی با خطا مواجه شد.");
    } else {
      alert("ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    }
  } finally {
    loading.value = false;
  }
};
</script>
