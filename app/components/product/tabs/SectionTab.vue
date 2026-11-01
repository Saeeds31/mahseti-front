<template>
  <div class="border border-gray-200 rounded-2xl m-4 w-full p-5" dir="rtl">
    <div class="">
      <!-- Tab Headers -->
      <div class="flex gap-4 border-b border-gray-500">
        <button @click="activeTab = 'text'" :class="['tab-button', { active: activeTab === 'text' }]">
          توضیحات
        </button>
        <button v-if="props.specifications && props.specifications.length" @click="activeTab = 'specifications'"
          :class="['tab-button', { active: activeTab === 'specifications' }]">
          ویژگی ها
        </button>
        <button @click="activeTab = 'comment'" :class="['tab-button', { active: activeTab === 'comment' }]">
          نظرات
        </button>

      </div>

      <!-- Tab Content -->
      <div class="tabs-content">
        <!-- Text Box Tab -->
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'text'" key="text" class="tab-panel">
            <productTabsInformation :description="props.description" />

          </div>

          <!-- Comment Form Tab -->
          <div v-else-if="activeTab == 'comment'" key="comment" class="tab-panel">
            <productTabsComment :comments="comments" />
          </div>

          <ul v-else-if="activeTab == 'specifications'" key="specifications" class="tab-panel mt-4">
            <li v-for="(item, index) in props.specifications" :key="index" class="grid grid-cols-[250px_1fr]">
              <span class="bg-gray-300 px-4 py-3">{{ item.title }}</span>
              <span class="bg-gray-100 px-4 py-3">{{item.values ? item.values.map(it => it.value).join(' , ') : ""
              }}</span>
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";

const props = defineProps({
  specifications: Array,
  description: {
    type: String,
    default: '',
  },
  comments: {
    type: Object,
    default: null,
  },
})
const activeTab = ref("text");
const textContent = ref("");

const commentForm = ref({
  name: "",
  email: "",
  comment: "",
  saveInfo: false,
});

const comments = ref([]);

const clearText = () => {
  const shouldClear = confirm("آیا مطمئن هستید که می‌خواهید متن را پاک کنید؟")
  if (shouldClear) {
    textContent.value = "";
  }
};

const submitComment = () => {


  const newComment = {
    name: commentForm.value.name,
    email: commentForm.value.email,
    comment: commentForm.value.comment,
    date: new Date().toLocaleDateString("fa-IR"),
  };

  comments.value.unshift(newComment);

  // Reset form
  commentForm.value.comment = "";
  if (!commentForm.value.saveInfo) {
    commentForm.value.name = "";
    commentForm.value.email = "";
  }

  toast.success('نظر شما با موفقیت ثبت شد!')
};
</script>

<style scoped>
.tab-button {
  padding: 10px 12px;
  border-radius: 8px;
}

.tab-button.active {
  background-color: var(--bg-secondary);
  color: var(--bg-primary);
}
</style>