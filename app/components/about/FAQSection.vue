<!-- app/components/about/FAQSection.vue -->
<template>
  <section class="pb-10 px-28 max-md:px-8 max-lg:px-12">
    <h2 class="mb-6 mr-1 text-right text-base font-bold text-gray-800">
      سوالات متداول
    </h2>

    <ul class="space-y-4">
      <li
        v-for="item in faqs"
        :key="item.id"
        class="rounded-lg border transition-all duration-300"
        :class="activeId === item.id ? '!border-[#ED2E68]' : 'border-gray-200'"
      >
        <button
          class="flex w-full items-center justify-between px-4 py-3 text-right text-sm md:text-base text-gray-700"
          @click="toggle(item.id)"
        >
          <span :class="activeId === item.id ? 'text-blue-600' : ''">
            {{ item.question }}
          </span>
          <span
            class="transition-transform duration-300 opacity-50"
            :class="activeId === item.id ? 'rotate-180' : ''"
          >
            ▾
          </span>
        </button>

        <div
          v-if="activeId === item.id && item.answer"
          class="px-4 pb-4 text-sm leading-relaxed text-gray-600"
        >
          <p class="mb-2">
            {{ item.answer }}
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from "vue";

const faqs = ref([
  {
    id: 1,
    question: "چگونه می‌توانم سفارش خود را ثبت کنم؟",
    answer: "ایجا جواب قرار میگیرد.",
  },
  {
    id: 2,
    question:
      "آیا می‌توان بدون ثبت‌نام در سایت یا داشتن حساب کاربری، سفارش خود را ثبت نمایم؟",
    answer: "ایجا جواب قرار میگیرد.",
  },
  {
    id: 3,
    question:
      "چگونه می‌توانم سفارشات خود را پیگیری کنم و از وضعیت آن‌ها مطلع شوم؟",
    answer: "ایجا جواب قرار میگیرد.",
  },
  {
    id: 4,
    question: "پس از اینکه سفارشم را ثبت کردم، چقدر طول می‌کشد به دستم برسد؟",
    answer: "ایجا جواب قرار میگیرد.",
  },
  {
    id: 5,
    question: "امکان ارسال سفارش به یک شهر دیگر وجود دارد؟",
    answer: "ایجا جواب قرار میگیرد.",
  },
  {
    id: 6,
    question: "تحویل حضوری",
    answer:
      "با توجه به حجم سفارشات روزانه، تحویل سفارشات به صورت حضوری لطفاً بعد از گذشت ۴۸ تا ۷۲ ساعت از ثبت سفارش برای دریافت آن مراجعه نمایید.",
  },
]);

const activeId = ref(6);

function toggle(id) {
  activeId.value = activeId.value === id ? null : id;
}
</script>
