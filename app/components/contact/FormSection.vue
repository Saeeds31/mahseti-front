<template>
  <section class="flex flex-col-1 lg:flex-row items-end">
    <div class="lg:w-1/4 max-md:hidden">
      <img
        src="/contact/3d-girl.svg"
        class="object-contain"
        alt="Support Character"
      />
    </div>

    <div
      class="w-full lg:w-3/4 flex items-start justify-between lg:justify-end gap-8 relative"
    >
      <div class="pb-12 lg:w-2/5 text-right flex flex-col h-full justify-start">
        <div class="mb-4 max-md:hidden">
          <img
            src="/contact/mahseti.svg"
            alt="logo"
            class="w-20 h-auto opacity-90"
          />
        </div>

        <ul
          class="space-y-6 text-sm font-medium leading-8 list-disc list-inside"
        >
          <li>
            تیم ماه ستی همیشه آماده شنیدن نظرات و پاسخگویی به سوالات شماست.
          </li>
          <li>
            نظرات و پیشنهادهایتان را با ما به اشتراک بگذارید، هر بازخورد شما
            برای بهبود تجربه ما ارزشمند است.
          </li>
          <li class="text-black">منتظر دیدگاه‌های شما هستیم!</li>
        </ul>
      </div>

      <div class="w-full lg:w-3/5">
        <h3 class="text-xl font-medium mb-6">فرم ارتباطی</h3>

        <form @submit.prevent="onSubmit" class="space-y-5 md:ml-20">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700"
                >نام و نام خانوادگی</label
              >
              <input
                v-model="model.name"
                type="text"
                placeholder="سارا مهدوی"
                class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition placeholder-gray-300"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700"
                >شماره تماس</label
              >
              <input
                v-model="model.phone"
                type="tel"
                placeholder="۰۹۱۱ ۰۹۹ ۸۸۷۷"
                class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition dir-rtl placeholder:text-left placeholder-gray-300"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700"
              >پیشنهاد و نظر شما:</label
            >
            <textarea
              v-model="model.message"
              rows="5"
              placeholder="نظر خود را بنویسید..."
              class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition resize-none placeholder-gray-300"
            ></textarea>
          </div>

          <div class="text-left">
            <button
              type="submit"
              :disabled="loading"
              class="bg-[#1D4ED8] text-white px-10 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition shadow-md shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed w-32"
            >
              <span v-if="loading">...</span>
              <span v-else>ارسال</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["submit"]);

const onSubmit = () => {
  emit("submit");
};
</script>
