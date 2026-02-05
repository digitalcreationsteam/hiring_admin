// src/common/API.js
// ✅ PURE JAVASCRIPT (Admin Frontend)

import axios from "axios";

/* =========================================
   🌐 BASE URL
   (Your backend is mounted at /api in server.js)
========================================= */
export const BASE_URL = "http://localhost:5000/api";
// export const BASE_URL = "https://yourdomain.com/api";

const isDev = process.env.NODE_ENV === "development";

/* =========================================
   🔥 AXIOS INSTANCE
========================================= */
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ important for sessions/cookies
  headers: {
    Accept: "application/json",
  },
});

/* =========================================
   🚀 API WRAPPER FUNCTION
========================================= */
export default async function API(method, url, data = {}, headers = {}) {
  try {
    // ✅ Optional: If you store admin token / adminId in localStorage, this supports it.
    // If you don't use token in admin, it's fine—headers won't be added.
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const config = {
      method: method.toLowerCase(),
      url, // example: "/admin/stats"
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(userId && { "user-id": userId }),
        ...headers,
      },
    };

    // GET => params, others => data
    if (config.method === "get") {
      config.params = data;
    } else {
      config.data = data;

      // FormData => let browser set boundary
      if (data instanceof FormData) {
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }

    const response = await apiClient(config);

    if (isDev) {
      console.log(`✅ ${method.toUpperCase()} ${url}`, response.data);
    }

    return response.data;
  } catch (error) {
    if (isDev) {
      console.error(`❌ ${method.toUpperCase()} ${url}`, error);
    }

    // Axios response errors
    if (error.response) {
      const { data, status } = error.response;

      // Optional: handle unauthorized globally
      // if (status === 401) window.location.href = "/admin/login";

      throw { ...data, status };
    }

    // Network error
    if (error.request) {
      throw {
        success: false,
        message: "No response from server. Check your connection.",
      };
    }

    // Other error
    throw {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
}
