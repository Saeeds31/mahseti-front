<template>
  <div
    class="flex flex-col sm:flex-row gap-4 p-5 rounded-xl hover:shadow-md transition-shadow"
  >
    <!-- Avatar -->
    <figure class="flex-shrink-0 m-0 flex justify-center sm:block">
      <img
        :src="comment.avatar"
        :alt="comment.name"
        class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border"
      />
    </figure>

    <!-- Content -->
    <div class="flex-1">
      <div class="flex flex-col gap-2 mb-2">

        <!-- Name + Date -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <h3 class="text-sm sm:text-base font-semibold m-0">
            {{ comment.name }}
          </h3>
          <span class="text-xs sm:text-sm text-muted">
            {{ comment.date }}
          </span>
        </div>
      </div>

      <!-- Comment Text -->
      <p class="text-sm sm:text-base leading-relaxed mb-3 m-0">
        {{ comment.text }}
      </p>

      <!-- Buttons -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-wrap"
      >
        <!-- Reply Button -->
        <button
          v-if="!isReply"
          @click="toggleReply"
          class="bg-accent py-1.5 px-4 text-sm rounded-inner hover:opacity-80 transition"
        >
          {{ showReplyForm ? 'لغو' : 'پاسخ دهید' }}
        </button>

        <!-- Like / Dislike -->
        <div class="flex gap-3">
          <button
            @click="$emit('like', comment.id)"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary-fade transition"
          >
            <IconLike />
            <span class="text-sm font-medium">{{ comment.likes }}</span>
          </button>

          <button
            @click="$emit('dislike', comment.id)"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent transition"
          >
            <IconDislike />
            <span class="text-sm font-medium">{{ comment.dislikes }}</span>
          </button>
        </div>
      </div>

      <!-- Reply Form -->
      <div v-if="showReplyForm" class="mt-4 p-4 bg-accent rounded-inner">
        <textarea
          v-model="replyText"
          placeholder="پاسخ خود را بنویسید..."
          rows="3"
          class="w-full p-3 border rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-green-500"
        ></textarea>

        <button
          @click="submitReply"
          class="mt-2 btn text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!replyText.trim()"
        >
          ارسال پاسخ
        </button>
      </div>
    </div>
  </div>

  <!-- Replies -->
  <div
    v-if="comment.replies?.length"
    class="mr-2 sm:mr-10 mt-3 space-y-3 border-r pr-3"
  >
    <CommentItem
      v-for="reply in comment.replies"
      :key="reply.id"
      :comment="reply"
      :is-reply="true"
      @like="$emit('like', $event)"
      @dislike="$emit('dislike', $event)"
      @reply="$emit('reply', $event)"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  isReply: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['like', 'dislike', 'reply'])

const showReplyForm = ref(false)
const replyText = ref('')

const toggleReply = () => {
  showReplyForm.value = !showReplyForm.value
  if (!showReplyForm.value) replyText.value = ''
}

const submitReply = () => {
  if (!replyText.value.trim()) return

  emit('reply', {
    commentId: props.comment.id,
    text: replyText.value
  })

  replyText.value = ''
  showReplyForm.value = false
}
</script>
