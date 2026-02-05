// components/admin/AdminSignup.tsx
// ✅ SAME UI — STUDENT-LEVEL VALIDATION & FEATURES (NO API YET)

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FeatherShield,
  FeatherUsers,
  FeatherSettings,
} from "@subframe/core";
import { OAuthSocialButton } from "../ui";
import API, { URL_PATH, BASE_URL } from "../common/API";


function AdminSignup() {
  const navigate = useNavigate();

  // ------------------
  // Form state (FIXED)
  // ------------------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ------------------
  // Validation (REAL WORLD)
  // ------------------
  const validate = () => {
    setError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return false;
    }

    if (!lastName.trim()) {
      setError("Please enter your last name.");
      return false;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!password) {
      setError("Please enter your password.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    return true;
  };

  // ------------------
  // Submit handler (API-ready)
  // ------------------
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (loading) return;
  //   if (!validate()) return;

  //   setLoading(true);
  //   setError("");

  //   // ⛔ TEMP: simulate signup flow
  //   setTimeout(() => {
  //     setLoading(false);
  //     navigate("/admin/login");
  //   }, 900);

  //   /*
  //     🔌 FUTURE
  //     API("POST", "/admin/signup", {
  //       firstName,
  //       lastName,
  //       email,
  //       password,
  //     });
  //   */
  // };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (loading || !validate()) return;

  setLoading(true);
  setError("");

  try {
    const response = await API("POST", URL_PATH.adminSignup, {
      firstname: firstName,
      lastname: lastName,
      email,
      password,
    });

    if (!response?.success) {
      setError(response?.message || "Signup failed");
      return;
    }

    // 🔐 Store token (optional but good)
    localStorage.setItem("token", response.token);

    // ✅ After admin signup → go to admin login
    navigate("/admin/login", { replace: true });

  } catch (err: any) {
    setError(err?.message || "Unable to create admin account");
  } finally {
    setLoading(false);
  }
};

  // ------------------
  // OAuth placeholder
  // ------------------
  const handleOAuth = (provider: "google") => {
    console.log(`Admin signup OAuth: ${provider}`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 px-4 sm:px-6">
      <div className="w-full max-w-[870px] border border-neutral-border bg-white shadow-md rounded-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row w-full">

          {/* LEFT PANEL */}
          <div className="w-full lg:w-[64%] bg-neutral-50 px-6 py-8 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <img className="h-8 w-fit" src="/hiringLogo.png" alt="logo" />
              <h1 className="text-3xl leading-snug">
                Create your admin workspace
              </h1>
            </div>

            <div className="flex flex-col gap-4">
              <Divider />

              <Feature
                icon={<FeatherShield className="text-violet-600" />}
                title="Restricted access"
                desc="Only authorized admins can manage the platform"
              />

              <Feature
                icon={<FeatherUsers className="text-violet-600" />}
                title="Full user control"
                desc="Manage candidates, recruiters, and permissions"
              />

              <Feature
                icon={<FeatherSettings className="text-violet-600" />}
                title="Platform configuration"
                desc="Control assessments, hiring flow, and payments"
              />
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden lg:block w-[1px] bg-gray-300" />

          {/* RIGHT PANEL */}
          <div className="w-full lg:w-1/2 px-6 py-8 flex flex-col gap-4 bg-white">
            <div>
              <h2 className="text-[22px]">Admin Sign Up</h2>
              <p className="text-xs text-gray-500">
                Create a new admin account
              </p>
            </div>

            <Divider />

            {/* OAuth */}
            <div className="flex flex-col gap-2">
                  <OAuthSocialButton
                className="w-full h-9 border border-gray-400 rounded-full flex items-center justify-center gap-2 hover:bg-gray-100"
                logo="https://res.cloudinary.com/subframe/image/upload/v1711417516/shared/z0i3zyjjqkobzuaecgno.svg"
                onClick={() => handleOAuth("google")}
                aria-label="Sign up with Google"
              >
                Sign up with Google
              </OAuthSocialButton>
            </div>

            <Divider text="or continue with email" />

            {/* FORM */}
            <form
              className="flex flex-col gap-3 text-sm"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Email */}
              <div>
                <label className="mb-1 block text-xs text-neutral-700">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 w-full rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                />
              </div>

              {/* First + Last name */}
              <div className="flex gap-2">
                <input
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-8 w-1/2 rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                />
                <input
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-8 w-1/2 rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-xs text-neutral-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-8 w-full rounded-full border border-gray-400 px-3 outline-none focus:border-black"
                />
                <p className="ml-3 mt-1 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Error */}
              <div
                aria-live="polite"
                className="min-h-[1.25rem] text-xs text-red-600"
              >
                {error}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-9 text-white font-semibold rounded-full ${
                  loading
                    ? "bg-violet-900 cursor-wait"
                    : "bg-violet-700 hover:bg-violet-800"
                }`}
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>

            <Divider />

            <div className="text-xs text-center">
              Already have an admin account?{" "}
              <Link
                to="/admin/login"
                className="text-violet-600 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;

/* ---------- Helpers ---------- */

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
