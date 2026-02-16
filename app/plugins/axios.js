// plugins/axios.js
import axios from "axios";
import { getCookie as h3GetCookie } from "h3";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: process.server
      ? `${config.public.apiBase}/api/v1`
      : "/api-proxy/api/v1",
    timeout: 15000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  api.interceptors.request.use((configReq) => {
    let token = null;

    if (process.client) {
      token = localStorage.getItem("auth-token");
    } else {
      const event = nuxtApp.ssrContext?.event;
      if (event) {
        token = h3GetCookie(event, "auth-token");
      }
    }

    if (token) {
      configReq.headers.Authorization = `Bearer ${token}`;
    }

    return configReq;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (process.client) {
          localStorage.removeItem("auth-token");
          localStorage.removeItem("user");
        }
        navigateTo("/login");
      }

      console.error("Axios error:", error.response?.data || error.message);
      return Promise.reject(error);
    },
  );

  return {
    provide: { api },
  };
});
