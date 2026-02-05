// src/common/API.js
// ✅ PURE JAVASCRIPT VERSION (No TypeScript)

import axios from "axios";

/* =========================================
   🌐 BASE URL
========================================= */
// export const BASE_URL = "http://localhost:5000/api";
// export const BASE_URL = "http://localhost:5001/api";
// export const BASE_URL = "https://unitalent.cloud/api";


const isDev = process.env.NODE_ENV === "development";

/* =========================================
   🔥 AXIOS INSTANCE
========================================= */
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

/* =========================================
   🔗 ALL API PATHS
========================================= */
export const URL_PATH = {
  /* ---------- AUTH ---------- */
  adminSignup: "/admin/signup",
  // checkEmailVerification: "/auth/verification-status",
 
  login: "/auth/login",

  // logout: "/auth/logout",
  // loginGoogle: "/auth/google",
  // loginLinkedin: "/auth/linkedin",

  /* ✅ Navigation endpoints */
  // getUserStatus: "/auth/user-status",
  // verifyRoute: "/auth/verify-route",

  /* ---------- EMAIL VERIFICATION ---------- */
  // verifyEmail: "/auth/verify",
  // resendVerification: "/auth/resend-verification",

  /* ---------- PASSWORD RESET ---------- */
  // forgotPassword: "/auth/forgot-password",
  // verifyResetCode: "/auth/verify-reset-code",
  // resetPassword: "/auth/reset-password",


};



/* =========================================
   🚀 API WRAPPER FUNCTION
========================================= */
export default async function API(method, url, data = {}, headers = {}) {
  try {
    // Get auth token and userId from localStorage
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const config = {
      method: method.toLowerCase(),
      url,
      headers: {
        // Add auth token if exists
        ...(token && { Authorization: `Bearer ${token}` }),
        // Add userId if exists
        ...(userId && { "user-id": userId }),
        // Merge custom headers
        ...headers,
      },
    };

    // Handle GET requests
    if (config.method === "get") {
      config.params = data;
    } else {
      // Handle POST/PUT/PATCH requests
      config.data = data;

      // Don't set Content-Type for FormData
      if (data instanceof FormData) {
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }

    // Make request
    const response = await apiClient(config);

    // Log in development
    if (isDev) {
      console.log(`✅ ${method.toUpperCase()} ${url}`, response.data);
    }

    return response.data;
  } catch (error) {
    // Log error in development
    if (isDev) {
      console.error(`❌ ${method.toUpperCase()} ${url}`, error);
    }

    // Handle response errors
    if (error.response) {
      const { data, status } = error.response;
      throw { ...data, status };
    }
    // Handle network errors
    else if (error.request) {
      throw {
        success: false,
        message: "No response from server. Check your connection.",
      };
    }
    // Handle other errors
    else {
      throw {
        success: false,
        message: error.message || "An unexpected error occurred.",
      };
    }
  }
}