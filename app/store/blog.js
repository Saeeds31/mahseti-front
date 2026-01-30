import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    blogs: null,
    pagination: null
  }),
  actions: {
    setBlogs(data) {
      this.blogs = data.data
      this.pagination = {
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
        from: data.from,
        to: data.to
      }
    }
  }
})
