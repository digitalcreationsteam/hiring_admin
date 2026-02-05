// components/admin/AdminVerifyCode.tsx
// ✅ SAME UI — FULL OTP UX + VALIDATION (NO API YET)

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AdminVerifyCode() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email: string | undefined = state?.email;

  // ------------------
  // State
  // ------------------
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const isOtpComplete = otp.every((d) => d !== "");

  // ------------------
  // Safe redirect
  // ------------------
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  // ------------------
  // OTP input handler
  // ------------------
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // ------------------
  // Paste full OTP
  // ------------------
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("Text").trim();
    if (!/^\d{6}$/.test(pasted)) return;

    const digits = pasted.split("");
    setOtp(digits);
    digits.forEach((_, i) => inputsRef.current[i]?.focus());
  };

  // ------------------
  // Verify handler (API-ready)
  // ------------------
  const handleVerify = () => {
    if (!email) return;

    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    // ⛔ TEMP: simulate verification success
    setTimeout(() => {
      setLoading(false);
      navigate("/set-password", { state: { email } });
    }, 1200);

    /*
      🔌 FUTURE
      await API("POST", "/admin/verify-reset-code", { email, otp: code });
      navigate("/admin/set-password", { state: { email } });
    */
  };

  // ------------------
  // Resend handler
  // ------------------
  const handleResend = () => {
    if (resendLoading || cooldown > 0) return;

    setResendLoading(true);

    // ⛔ TEMP: simulate resend
    setTimeout(() => {
      setResendLoading(false);
      setCooldown(30);
    }, 800);

    /*
      🔌 FUTURE
      await API("POST", "/admin/forgot-password", { email });
      setCooldown(30);
    */
  };

  // ------------------
  // Cooldown timer
  // ------------------
  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // ------------------
  // Keyboard support
  // ------------------
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isOtpComplete && !loading) {
        handleVerify();
      }
      if (e.key === "Escape") {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOtpComplete, loading, navigate]);

  // ------------------
  // UI
  // ------------------
  return (
    <div className="min-h-screen bg-[#EEF4FF] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl border border-neutral-300 p-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-6"
        >
          ←
        </button>

        <h2 className="text-[24px] mb-4">Check your email</h2>

        {email && (
          <p className="text-gray-400 mb-6">
            We sent a verification code to{" "}
            <span className="font-medium">
              {email.replace(/(.{3}).+(@.+)/, "$1***$2")}
            </span>
            <br />
            Enter the 6-digit code below
          </p>
        )}

        {/* OTP boxes */}
        <div className="flex justify-between mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              value={digit}
              maxLength={1}
              onPaste={handlePaste}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !otp[index] && index > 0) {
                  inputsRef.current[index - 1]?.focus();
                }
                if (e.key === "ArrowLeft" && index > 0) {
                  inputsRef.current[index - 1]?.focus();
                }
                if (e.key === "ArrowRight" && index < 5) {
                  inputsRef.current[index + 1]?.focus();
                }
              }}
              className="w-12 h-12 border border-neutral-300 rounded-2xl text-center text-lg font-semibold focus:outline-gray"
            />
          ))}
        </div>

        {/* Error */}
        <div className="min-h-[1.25rem] text-xs text-red-600 mb-2">{error}</div>

        {/* Verify */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full h-10 rounded-3xl font-semibold transition ${
            loading
              ? "bg-violet-300 cursor-not-allowed"
              : "bg-violet-600 text-white hover:bg-violet-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        {/* Resend */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Haven’t got the email?{" "}
          <span
            onClick={handleResend}
            className={`font-medium transition ${
              resendLoading || cooldown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-violet-600 cursor-pointer hover:underline"
            }`}
          >
            {resendLoading
              ? "Sending..."
              : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend email"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AdminVerifyCode;
