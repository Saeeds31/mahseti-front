<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-5">

    <!-- Title -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 my-6 pb-4 border-b-2 border-gray-200">
      <h2 class="text-lg sm:text-xl font-bold">نظرات کاربران</h2>
      <span class="text-sm sm:text-base text-gray-500">({{ comments.length }} نظر)</span>
    </div>

    <!-- Comments -->
    <div class="space-y-6">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @like="handleLike"
        @dislike="handleDislike"
        @reply="handleReply"
      />
    </div>

    <!-- No comments -->
    <div v-if="comments.length === 0" class="text-center py-16">
      <p class="text-base text-gray-500 m-0">
        هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهد!
      </p>
    </div>

  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import CommentItem from './CommentItem.vue'

const props = defineProps({
  comments: {
    type: Object,
    default: null,
  },
})

// استخراج کامنت‌ها از API response
const comments = computed(() => {
  if (!props.comments?.data) return []
  return props.comments.data
})

const findComment = (commentId) => {
   for (const comment of comments.value) {
      if (comment.id === commentId) return comment
      
      if (comment.replies) {
         const reply = comment.replies.find(r => r.id === commentId)
         if (reply) return reply
      }
   }
   return null
}

const handleLike = (commentId) => {
   const comment = findComment(commentId)
   if (comment) {
      comment.likes++
   }
}

const handleDislike = (commentId) => {
   const comment = findComment(commentId)
   if (comment) {
      comment.dislikes++
   }
}

const handleReply = ({ commentId, text }) => {
   const comment = comments.value.find(c => c.id === commentId)
   if (comment) {
      if (!comment.replies) {
         comment.replies = []
      }
      comment.replies.push({
         id: Date.now(),
         name: 'شما',
         avatar: 'https://i.pravatar.cc/150?img=20',
         date: 'الان',
         text,
         likes: 0,
         dislikes: 0
      })
   }
}
</script>