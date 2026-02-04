// utils/authUtils.ts
// Utility functions to manage user data in localStorage

export interface UserData {
  token: string;
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  isVerified: boolean;
  socialLogin?: string;
}

/**
 * Get the JWT token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Get the full user object from localStorage
 */
export const getUser = (): UserData | null => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
};

/**
 * Get user ID
 */
export const getUserId = (): string | null => {
  return localStorage.getItem("userId");
};

/**
 * Get user email
 */
export const getUserEmail = (): string | null => {
  return localStorage.getItem("userEmail");
};

/**
 * Get user full name
 */
export const getUserName = (): string | null => {
  return localStorage.getItem("userName");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Clear all user data from localStorage (logout)
 */
export const clearUserData = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("signupEmail");
  console.log("✅ User data cleared");
};

/**
 * Get user display name (firstname + lastname)
 */
export const getUserDisplayName = (): string => {
  const user = getUser();
  if (user) {
    return `${user.firstname} ${user.lastname}`.trim();
  }
  return "User";
};
