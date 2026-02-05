// components/admin/AdminForgotPassword.tsx
// ✅ UI + VALIDATION + UX (NO API YET)

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AdminForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ------------------
  // Validation
  // ------------------
  const validate = () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  // ------------------
  // Submit handler (API-ready)
  // ------------------
  const handleSubmit = () => {
    if (loading) return;
    if (!validate()) return;

    setLoading(true);

    // ⛔ TEMP: simulate success
    setTimeout(() => {
      setLoading(false);
      navigate("/verify-code", {
        state: { email },
      });
    }, 1500);

    /*
      🔌 FUTURE
      await API("POST", "/admin/forgot-password", { email });
      navigate("/admin/verify-code", { state: { email } });
    */
  };

  return (
    <div className="min-h-screen bg-[#EEF4FF] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl border border-neutral-300 p-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-gray-600 hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-[24px] mb-2">Forgot password</h2>
        <p className="text-gray-400 mb-6">
          Enter your admin email to reset your password
        </p>

        {/* Email */}
        <label className="block mb-2 text-sm">Email address</label>
        <input
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 rounded-3xl border border-gray-300 px-4 outline-none focus:border-black"
        />

        {/* Error */}
        <div
          aria-live="polite"
          className="min-h-[1.25rem] mt-2 text-xs text-red-600"
        >
          {error}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full h-10 rounded-3xl font-semibold transition ${
            loading
              ? "bg-violet-300 cursor-not-allowed"
              : "bg-violet-600 text-white hover:bg-violet-700"
          }`}
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default AdminForgotPassword;
