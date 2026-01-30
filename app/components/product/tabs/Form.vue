<template>
  <div class="p-3 mt-6 rounded-inner border shadow-sm">
    <h3 class="text-lg font-bold mb-4 m-0">نظر خود را بنویسید</h3>

    <form @submit.prevent="submitComment" class="space-y-4">

      <!-- نام + امتیاز -->
      <div class="w-full flex flex-col md:flex-row gap-3 justify-between">

        <!-- نام کاربر -->
        <div class="w-full md:w-[50%]">
          <label for="name" class="block text-sm font-medium mb-2">نام و نام خانوادگی</label>
          <input
            v-model="formData.name"
            type="text"
            id="name"
            placeholder="نام خود را وارد کنید"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- امتیاز -->
        <div class="w-full md:w-[50%]">
          <label class="block text-sm font-medium text-gray-700 mb-2">امتیاز شما</label>

          <div class="flex gap-2 justify-start md:justify-start">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="formData.rating = star"
              class="transition-transform hover:scale-110"
            >
              <svg
                class="w-8 h-8 transition-colors"
                :class="star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  class="fill-current"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- متن نظر -->
      <div>
        <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
          نظر شما
        </label>
        <textarea
          v-model="formData.text"
          id="comment"
          rows="5"
          placeholder="نظر خود را در مورد محصول بنویسید..."
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          class="px-6 py-2.5 bg-accent  text-sm font-medium rounded-inner  transition-colors"
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
  rating: 0,
  text: "",
});

const isFormValid = computed(() => {
  return (
    formData.value.name.trim() &&
    formData.value.rating > 0 &&
    formData.value.text.trim()
  );
});

const submitComment = () => {
  if (isFormValid.value) {
    emit("submit", {
      name: formData.value.name,
      rating: formData.value.rating,
      text: formData.value.text,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      date: "الان",
      likes: 0,
      dislikes: 0,
      replies: [],
    });
    resetForm();
  }
};

const resetForm = () => {
  formData.value = {
    name: "",
    rating: 0,
    text: "",
  };
};
</script>