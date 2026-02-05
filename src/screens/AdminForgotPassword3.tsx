// components/admin/AdminSetNewPassword.tsx
// ✅ UI + VALIDATION + UX (NO API YET)

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AdminSetNewPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email: string | undefined = state?.email;

  // ------------------
  // State
  // ------------------
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ------------------
  // Safe redirect
  // ------------------
  useEffect(() => {
    if (!email) {
      navigate("forgot-password", { replace: true });
    }
  }, [email, navigate]);

  // ------------------
  // Validation
  // ------------------
  const validate = () => {
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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

      // After password reset → back to admin login
      navigate("/success-password", { replace: true });
    }, 1200);

    /*
      🔌 FUTURE
      await API("POST", "/admin/reset-password", { email, password });
      navigate("/admin/login", { replace: true });
    */
  };

  // ------------------
  // Keyboard support
  // ------------------
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !loading) {
        handleSubmit();
      }
      if (e.key === "Escape") {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loading, password, confirmPassword, navigate]);

  // ------------------
  // UI
  // ------------------
  return (
    <div className="min-h-screen bg-[#EEF4FF] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md border border-neutral-300 rounded-3xl p-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-6"
        >
          ←
        </button>

        <h2 className="text-[24px] mb-2">Set a new password</h2>

        <p className="text-gray-400 mb-6">
          Create a new password. Ensure it differs from previous ones for
          security.
        </p>

        {/* Password */}
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 mb-4 rounded-3xl border border-neutral-300 px-4 outline-none focus:border-black"
        />

        {/* Confirm */}
        <label className="block text-sm font-medium mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full h-10 mb-3 rounded-3xl border border-neutral-300 px-4 outline-none focus:border-black"
        />

        {/* Error */}
        <div
          aria-live="polite"
          className="min-h-[1.25rem] text-xs text-red-600 mb-2"
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
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}

export default AdminSetNewPassword;
