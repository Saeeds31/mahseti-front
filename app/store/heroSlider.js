import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "@/composables/api/useApi";

export const useHeroSliderStore = defineStore("heroSlider", () => {
  const slides = ref([]);
  const pending = ref(false);
  const error = ref(null);

  const { getHome } = useApi();

  // داده‌های دستی (دقیقاً مثل پروژه قبلی)
  const fallbackSlides = [
    {
      id: 1,
      title: "فعالیت با انرژی بیشتر",
      description: "بهترین لباس‌های ورزشی را برای باشگاه انتخاب کنید.",
      image1: "/sample/banner-1.svg",
      image2: "/sample/banner-2.svg",
      image3: "/sample/banner-3.svg",
      ctaText: "مشاهده محصولات",
      ctaLink: "/products",
    },
    {
      id: 2,
      title: "ویژه زمستان 1404",
      description: "کلکسیون جدید زمستان با کیفیت و ظاهر فوق‌العاده.",
      image1: "/sample/banner-1.svg",
      image2: "/sample/banner-2.svg",
      image3: "/sample/banner-3.svg",
      ctaText: "ورود به فروشگاه",
      ctaLink: "/products",
    },
  ];

  const fetchSlides = async () => {
    pending.value = true;
    error.value = null;

    try {
      const res = await getHome();

      const raw =
        res?.data?.sliders || res?.sliders || res?.data?.data?.sliders || [];

      slides.value = raw.length
        ? raw.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            ctaText: s.cta_text,
            ctaLink: s.cta_link || "/products",
            image1: s.image1,
            image2: s.image2,
            image3: s.image3,
          }))
        : fallbackSlides;
    } catch (e) {
      error.value = e;
      slides.value = fallbackSlides;
    } finally {
      pending.value = false;
    }
  };

  return { slides, pending, error, fetchSlides };
});
