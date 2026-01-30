<template>
  <div class="p-3 mt-6 rounded-inner border shadow-sm pad">
    <h3 class="text-lg font-bold mb-4 m-0">نظر خود را بنویسید</h3>

    <form @submit.prevent="submitComment" class="space-y-4">

      <!-- نام + ایمیل -->
      <div class="w-full flex flex-col md:flex-row gap-3">

        <!-- نام -->
        <div class="w-full md:w-[30%]">
          <label class="block text-sm font-medium mb-2">
            نام و نام خانوادگی
          </label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="نام خود را وارد کنید"
            required
            class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <!-- ایمیل -->
        <div class="w-full md:w-[30%]">
          <label class="block text-sm font-medium mb-2">
            ایمیل
          </label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="example@email.com"
            required
            class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
              <!-- شماره تماس -->
      <div class="w-full md:w-[30%]">
        <label class="block text-sm font-medium mb-2">
          شماره تماس
        </label>
        <input
          v-model="formData.phone"
          type="tel"
          placeholder="09xxxxxxxxx"
          required
          class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      </div>



      <!-- متن نظر -->
      <div>
        <label class="block text-sm font-medium mb-2">
          نظر شما
        </label>
        <textarea
          v-model="formData.text"
          rows="5"
          placeholder="نظر خود را بنویسید..."
          required
          class="w-full px-4 py-3 border rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-green-500"
        ></textarea>
      </div>

      <!-- دکمه‌ها -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          :disabled="!isFormValid"
          class="btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ثبت نظر
        </button>

        <button
          type="button"
          @click="resetForm"
          class="bg-accent px-6 py-2.5 text-sm rounded-inner"
        >
          پاک کردن
        </button>
      </div>

    </form>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["submit"]);

const formData = ref({
  name: "",
  email: "",
  phone: "",
  text: "",
});

const isFormValid = computed(() => {
  return (
    formData.value.name.trim() &&
    formData.value.email.trim() &&
    formData.value.phone.trim() &&
    formData.value.text.trim()
  );
});

const submitComment = () => {
  if (!isFormValid.value) return;

  emit("submit", {
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    text: formData.value.text,
    date: "الان",
  });

  resetForm();
};

const resetForm = () => {
  formData.value = {
    name: "",
    email: "",
    phone: "",
    text: "",
  };
};
</script>
