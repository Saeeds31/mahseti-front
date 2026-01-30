<template>
  <div class="relative w-full md:w-110">
    <form @submit.prevent="handleSearch" class="relative w-full">
      <input
        v-model="query"
        class="border py-3  px-7 rounded-full w-full text-xs pr-4 pl-12 outline-none"
        type="search"
        placeholder="جستجو ..."
      />
      <button
        type="submit"
        class="absolute left-1 top-1/2 -translate-y-1/2 icon-btn rounded-full p-2 hover:bg-secondary/90"
      >
        <iconSearch class="w-4 h-4" />
      </button>
    </form>

    <!-- نتایج سرچ -->
    <div
      v-if="results.length"
      class="absolute top-full left-0 w-full md:w-[500px] bg-white rounded-lg shadow-lg mt-2 z-50 max-h-[400px] md:max-h-96 overflow-y-auto p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3"
    >
      <div
        v-for="item in results"
        :key="item.id"
        class="border hover:shadow-md rounded-lg cursor-pointer p-2 flex flex-col items-center transition-all duration-200"
      >
        <img
          :src="item.image || '/images/test/slide1.png'"
          :alt="item.name"
          class="w-16 h-16 md:w-20 md:h-20 object-cover rounded"
        />
        <span class="text-xs mt-2 text-center font-medium line-clamp-2">{{
          item.name
        }}</span>
        <span class="text-xs md:text-sm font-semibold mt-1 text-green-700"
          >{{ item.price }} تومان</span
        >
      </div>
    </div>

    <!-- وقتی نتیجه‌ای پیدا نشد -->
    <p
      v-else-if="searched && !loading && query"
      class="absolute top-full left-0 w-full mt-2 z-50 bg-primary rounded-lg shadow text-center py-4 text-sm text-muted"
    >
      نتیجه‌ای یافت نشد
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const query = ref("");
const results = ref([]);
const loading = ref(false);
const searched = ref(false);

const handleSearch = async () => {
  if (!query.value.trim()) return;

  loading.value = true;
  searched.value = true;

  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/front/products/search`,
      {
        params: { search: query.value },
      }
    );
    results.value = res.data?.data || [];
  } catch (err) {
    console.error("خطا در جستجو:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
form {
  direction: rtl;
}

/* محدود کردن تعداد خطوط متن */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>