<template>
  <div class="" dir="rtl">
    <div class="">
      <!-- Tab Headers -->
      <div class="flex gap-4">
        <button
          @click="activeTab = 'text'"
          :class="['tab-button', { active: activeTab === 'text' }]"
        >
          توضیحات
        </button>
        <button
          @click="activeTab = 'comment'"
          :class="['tab-button', { active: activeTab === 'comment' }]"
        >
          نظرات
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tabs-content">
        <!-- Text Box Tab -->
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'text'" key="text" class="tab-panel">
            <productTabsInformation :description="description" />

          </div>

          <!-- Comment Form Tab -->
          <div v-else key="comment" class="tab-panel">
            <productTabsComment :comments="comments" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
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
  const toast = useToast()

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

  toast.add({
    title: 'موفقیت',
    description: 'نظر شما با موفقیت ثبت شد!',
    color: 'green'
  })
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