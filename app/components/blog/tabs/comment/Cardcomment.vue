<template>
  <div class=" sm:px-6 py-5">

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
import { ref } from 'vue'
import CommentItem from './CommentItem.vue'

const comments = ref([
   {
      id: 1,
      name: 'ریجانه جفایی',
      avatar: 'https://i.pravatar.cc/150?img=1',
      date: 'امروز',
      rating: 5,
      text: 'محصول بسیار عالی و با کیفیتی بود. از خرید خودم راضی هستم و به همه توصیه می‌کنم. ارسال هم سریع بود.',
      likes: 2,
      dislikes: 8,
      replies: [
         {
            id: 101,
            name: 'مدیر فروشگاه',
            avatar: 'https://i.pravatar.cc/150?img=10',
            date: 'دیروز',
            text: 'ممنون از نظر لطف شما. خوشحالیم که محصول مورد پسند شما قرار گرفته است.',
            likes: 5,
            dislikes: 0
         }
      ]
   },
   {
      id: 2,
      name: 'امیر حسینی',
      avatar: 'https://i.pravatar.cc/150?img=2',
      date: 'دیروز',
      rating: 4,
      text: 'کیفیت خوبی داره اما قیمتش کمی بالاست. به هر حال من راضی هستم.',
      likes: 15,
      dislikes: 3,
      replies: []
   },
   {
      id: 3,
      name: 'سارا احمدی',
      avatar: 'https://i.pravatar.cc/150?img=3',
      date: '2 روز پیش',
      rating: 5,
      text: 'عالی عالی عالی! این سومین باریه که سفارش میدم. کیفیت بی‌نظیر و ارسال سریع.',
      likes: 28,
      dislikes: 1,
      replies: [
         {
            id: 102,
            name: 'مدیر فروشگاه',
            avatar: 'https://i.pravatar.cc/150?img=10',
            date: '2 روز پیش',
            text: 'از اعتماد شما سپاسگزاریم. حمایت شما انگیزه ماست برای ارائه بهترین خدمات.',
            likes: 12,
            dislikes: 0
         },
         {
            id: 103,
            name: 'رضا مرادی',
            avatar: 'https://i.pravatar.cc/150?img=4',
            date: '1 روز پیش',
            text: 'من هم همین تجربه رو داشتم. واقعا محصول خوبیه.',
            likes: 8,
            dislikes: 1
         }
      ]
   },
   {
      id: 4,
      name: 'محمد رضایی',
      avatar: 'https://i.pravatar.cc/150?img=5',
      date: '3 روز پیش',
      rating: 3,
      text: 'محصول متوسط بود. انتظار بیشتری داشتم با توجه به قیمتش.',
      likes: 7,
      dislikes: 12,
      replies: []
   },
   {
      id: 5,
      name: 'فاطمه کریمی',
      avatar: 'https://i.pravatar.cc/150?img=6',
      date: '1 هفته پیش',
      rating: 5,
      text: 'بهترین خریدی که تا حالا انجام دادم. واقعا ممنونم از فروشگاه.',
      likes: 34,
      dislikes: 2,
      replies: [
         {
            id: 104,
            name: 'مدیر فروشگاه',
            avatar: 'https://i.pravatar.cc/150?img=10',
            date: '1 هفته پیش',
            text: 'خوشحالیم که توانستیم رضایت شما را جلب کنیم. منتظر خریدهای بعدی شما هستیم.',
            likes: 18,
            dislikes: 0
         }
      ]
   }
])

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