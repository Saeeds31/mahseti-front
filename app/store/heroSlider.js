import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "@/composables/api/useApi";

export const useHeroSliderStore = defineStore("heroSlider", () => {
  const slides = ref([]);
  const pending = ref(false);
  const error = ref(null);

  const { getHome } = useApi();
  const fetchSlides = async () => {
    pending.value = true;
    error.value = null;

    try {
      const res = await getHome();

      slides.value =
        res?.data?.sliders || res?.sliders || res?.data?.data?.sliders || [];
    } catch (e) {
      error.value = e;
    } finally {
      pending.value = false;
    }
  };

  return { slides, pending, error, fetchSlides };
});
