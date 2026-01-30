import { useLoadingStore } from '~/store/loading'
import { useSettingStore } from '~/store/settings'

export const usePageLoading = () => {
  const loadingStore = useLoadingStore()
  const settingStore = useSettingStore()

  /**
   * این تابع تمام درخواست‌های یک صفحه را همزمان اجرا می‌کند
   * و تا زمانی که همه تکمیل نشوند، loading نمایش می‌دهد
   *
   * @param {Function[]} requests - آرایه‌ای از توابع که درخواست API را برمی‌گردانند
   * @param {string} loadingMessage - پیام نمایش در هنگام loading
   * @param {Function} getBaseFn - تابع برای دریافت base data
   * @returns {Promise<any[]>} - آرایه‌ای از نتایج درخواست‌ها
   */
  const loadPageWithBase = async (requests = [], loadingMessage = 'در حال بارگذاری...', getBaseFn = null) => {
    try {
      loadingStore.showLoading(loadingMessage)

      // ساخت آرایه‌ای از Promise ها
      const allRequests = []

      // اگر base هنوز لود نشده و getBaseFn داده شده، اضافه کن
      const hasSettings = settingStore.settings && typeof settingStore.settings === 'object' && Object.keys(settingStore.settings).length > 0

      if (getBaseFn && !hasSettings) {
        allRequests.push(
          getBaseFn().then(response => {
            if (response?.data) {
              settingStore.settings = response.data.settings || {}
              settingStore.menus = response.data.menus || []
              settingStore.user = response.data.user || null
            }
            return response
          })
        )
      }

      // اضافه کردن بقیه درخواست‌ها
      allRequests.push(...requests.map(req => req()))

      // اجرای همزمان همه درخواست‌ها
      const results = await Promise.all(allRequests)

      return results
    } catch (error) {
      console.error('خطا در بارگذاری صفحه:', error)
      throw error
    } finally {
      loadingStore.hideLoading()
    }
  }

  return {
    loadPageWithBase
  }
}
