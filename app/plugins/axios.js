import axios from "axios";
import { useCookie } from "#app";
import { getCookie as h3GetCookie } from "h3"; // ایمپورت getCookie از h3

export default defineNuxtPlugin((nuxtApp) => {
  const api = axios.create({
    baseURL: "https://api.vitamixfruit.com/api/v1",
    timeout: 15000, // افزایش timeout به 15 ثانیه
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // برای ارسال کوکی‌ها در درخواست‌ها
  });

  // افزودن توکن به هر درخواست
  api.interceptors.request.use((config) => {
    let token = null;

    // تشخیص محیط (کلاینت یا سرور)
    if (process.client) {
      // سمت کلاینت: استفاده از localStorage
      token = localStorage.getItem("auth-token");
    } else {
      // سمت سرور: استفاده از getCookie از h3
      const event = nuxtApp.ssrContext?.event;
      if (event) {
        token = h3GetCookie(event, "auth-token");
      } else {
        console.log("No SSR event available");
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No auth token found");
    }

    return config;
  });

  // interceptor برای مدیریت خطاها
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("Axios error:", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api,
    },
  };
});