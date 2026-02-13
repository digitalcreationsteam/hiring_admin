// components/admin/AdminLogin.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FeatherShield, FeatherUsers, FeatherSettings } from "@subframe/core";
import { OAuthSocialButton } from "../ui";
import API, { URL_PATH, BASE_URL } from "../common/API";
import { colors } from "common/colors";
// import { useAppDispatch } from "src/store/hooks";
// import { setToken } from "src/store/slices/authSlice";
// import { setUserProfile } from "src/store/slices/userSlice";
// import { setNavigation } from "src/store/slices/onboardingSlice";

function AdminLogin() {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    setError("");
    if (!email.trim()) return (setError("Email required"), false);
    if (!/\S+@\S+\.\S+/.test(email)) return (setError("Invalid email"), false);
    if (!password) return (setError("Password required"), false);
    return true;
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (loading || !validate()) return;

  //   setLoading(true);
  //   setError("");

  //   try {
  //     const response = await API("POST", URL_PATH.login, {
  //       email,
  //       password,
  //     });

  //     if (!response?.success) {
  //       setError("Invalid credentials");
  //       return;
  //     }

  //     // // ✅ SAME STATE HANDLING
  //     // dispatch(setToken(response.token));
  //     // dispatch(setUserProfile(response.user));

  //     // if (response.navigation) {
  //     //   dispatch(
  //     //     setNavigation({
  //     //       nextRoute: response.navigation.nextRoute,
  //     //       currentStep: response.navigation.currentStep,
  //     //       completedSteps: response.navigation.completedSteps,
  //     //       isOnboardingComplete: response.navigation.isOnboardingComplete,
  //     //       hasPayment: response.navigation.hasPayment,
  //     //     }),
  //     //   );
  //     // }

  //     if (response.user.role !== "admin") {
  //       setError("You are not authorized as admin");
  //       return;
  //     }

  //     navigate("/dashboard", { replace: true });
  //   } catch (err: any) {
  //     setError(err?.message || "Login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ------------------
  // OAuth handler (placeholder)
  // ------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (loading || !validate()) return;

  setLoading(true);
  setError("");

  try {
    const response = await API("POST", URL_PATH.login, {
      email,
      password,
    });

    if (!response?.success) {
      setError("Invalid credentials");
      return;
    }

    // 🔐 ROLE CHECK (CRITICAL)
    if (response.user.role !== "admin") {
      setError("You are not authorized as admin");
      return;
    }

    // 🔐 STORE TOKEN
    localStorage.setItem("token", response.token);

    // ✅ ADMIN REDIRECT
    navigate("/admin/dashboard", { replace: true });

  } catch (err: any) {
    setError(err?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  const handleOAuth = (provider: "google") => {
    console.log(`Admin OAuth: ${provider}`);
    // window.location.href = `${BASE_URL}/admin/auth/${provider}`;
  };

  return (
    <div className="min-h-screen w-full h-700 flex items-center justify-center bg-[#EEF4FF] px-4 sm:px-6">
      <div 
      className="w-full max-w-[520px] border bg-white shadow-md rounded-xl overflow-hidden">
<div className="flex justify-center w-full">
          {/* LEFT PANEL
          <div className="w-full lg:w-[64%] bg-neutral-50 px-6 py-8 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <img
                className="h-8 w-fit"
                src="/uniTalent.png"
                alt="Company logo"
              />{" "}
              <h1 className="text-3xl leading-snug">Welcome To UniTalent</h1>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-full h-[1px] bg-gray-300 my-4" />

              <Feature
                icon={<FeatherShield className="text-violet-600" />}
                title="Secure admin access"
                desc="Manage platform with role-based permissions"
              />

              <Feature
                icon={<FeatherUsers className="text-violet-600" />}
                title="Manage users"
                desc="View, approve, block and manage candidates & recruiters"
              />

              <Feature
                icon={<FeatherSettings className="text-violet-600" />}
                title="System controls"
                desc="Configure assessments, payments and platform settings"
              />
            </div>
          </div>

          {/* DIVIDER */}
          {/* <div className="hidden lg:block w-[1px] bg-gray-300" /> */} 

          {/* RIGHT PANEL */}
           <div className="w-full max-w-[520px] bg-neutral-50 px-6 py-8 flex flex-col justify-between">
            <div className="flex flex-col gap-4 w-fit items-center justify-center mx-auto">
              <img
                className="h-14 w-48 object-contain"
                src="/UniTalent.png"
                alt="Company logo"
              />{" "}
              {/* <h1 className="text-3xl leading-snug">Welcome To UniTalent</h1> */}
            </div>
           {/*
            <div>
              <h2 className="mt-4 text-[22px]">Admin Sign In</h2>
               <p className="text-xs text-gray-500">
                Access the admin dashboard
              </p> 
            </div>*/}

            <div className="w-full h-[1px] bg-gray-300 my-4" />

            {/* OAuth */}
            {/* <div className="flex flex-col gap-2">
              <OAuthSocialButton
                className="w-full h-10 sm:h-9 border border-gray-400 rounded-full flex items-center justify-center gap-2 hover:bg-gray-100"
                logo="https://res.cloudinary.com/subframe/image/upload/v1711417516/shared/z0i3zyjjqkobzuaecgno.svg"
                onClick={() => handleOAuth("google")}
                aria-label="Log in with Google"
              >
                Log in with Google
              </OAuthSocialButton>
            </div> */}

            {/* <Divider text="or continue with email" /> */}

            {/* FORM */}
            <form
              className="flex flex-col gap-3 text-sm"
              onSubmit={handleSubmit}
              noValidate
            >
              <label className="sr-only" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                inputMode="email"
                autoComplete="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 w-full rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                aria-required="true"
                aria-invalid={!!error}
              />

              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 w-full rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                aria-required="true"
              />

              <div className="flex justify-between items-center">
                <div />
                <Link
                  to="/forgot-password"
                  className="text-xs hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* error message */}
              <div
                aria-live="polite"
                className="min-h-[1.25rem] text-xs text-red-600"
              >
                {error}
              </div>

              <button
                style={{backgroundColor: colors.primary,
                        color: colors.white}}
                type="submit"
                disabled={loading}
                className={`w-full h-9 text-white font-semibold rounded-full transition ${
                  loading
                    ? "bg-violet-400 cursor-wait"
                    : "bg-violet-600 hover:bg-violet-700"
                }`}
              >
                {loading ? "Signing in..." : "Log in"}
              </button>
            </form>

            {/* <Divider />

            <div className="text-xs text-center">
              Don’t have an admin account?{" "}
              <Link
                to="/admin/signup"
                className="text-violet-600 font-semibold hover:underline"
              >
                Create admin
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

/* ---------- Helpers (UNCHANGED) ---------- */

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-100">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

function Divider({ text }: { text?: string }) {
  return (
    <div className="flex items-center my-4">
      <div className="flex-1 h-[1px] bg-gray-300" />
      {text && <span className="px-2 text-xs text-gray-500">{text}</span>}
      <div className="flex-1 h-[1px] bg-gray-300" />
    </div>
  );
}
