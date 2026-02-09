export const URL_PATH = {
  /* 🔐 AUTH */
  adminLogin: "/admin/login",
  adminMe: "/admin/me",

  /* 👥 USER MANAGEMENT */
  users: "/admin/users",
  userById: (id: string) => `/admin/users/${id}`,
  updateUserRole: (id: string) => `/admin/users/${id}/role`,
  deleteUser: (id: string) => `/admin/users/${id}`,

  /* 📊 DASHBOARD STATS */
  adminStats: "/admin/stats",

  /* 🏆 RANKING */
  userScoreRanks: "/admin/user-score/ranks",

   /* 📍 PROFILE DATA (ADD THESE) */
  demographics: "/demographics",
  educations: "/educations",
};
