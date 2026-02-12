import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API, { URL_PATH } from "../common/API";
import { colors } from "common/colors";

export default function VerifyResetCode() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const isOtpComplete = otp.every((digit) => digit !== "");


  /* ================= REDIRECT SAFELY ================= */
  //   useEffect(() => {
  //     if (!email) {
  //       navigate("/forgot-password", { replace: true });
  //     }
  //   }, [email, navigate]);

  /* ================= OTP HANDLERS ================= */

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
 
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };


  const handleVerify = async () => {

    if (!email) {
  toast.error("Session expired. Please try again.");
  navigate("/forgot-password", { replace: true });
  return;
}
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter 6 digit code");
      return;
    }

    try {
      setLoading(true);
      await API("post", URL_PATH. adminVerifyResetCode, { email, otp: code });

      toast.success("Code verified successfully");

      setTimeout(() => {
        navigate("/set-password", { state: { email } });
      }, 3000);
    } catch (err: any) {
      toast.error(err?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
  if (!email || resendLoading || cooldown > 0) return;

  try {
    setResendLoading(true);

    await API("post", URL_PATH. adminVerifyResetCode, { email });

    toast.success("Verification code sent");

    setCooldown(30); // 30 seconds cooldown
  } catch {
    toast.error("Unable to resend code");
  } finally {
    setResendLoading(false);
  }
};



  useEffect(() => {
  if (cooldown === 0) return;

  const timer = setInterval(() => {
    setCooldown((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [cooldown]);


// Enter Key to Verify OTP
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && isOtpComplete && !loading) {
      handleVerify();
    }

    if (e.key === "Escape") {
      navigate(-1);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => window.removeEventListener("keydown", handleKeyDown);
}, [isOtpComplete, loading, navigate]);

// Paste Full OTP (Ctrl / Cmd + V)
const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  const pastedData = e.clipboardData.getData("Text").trim();

  if (!/^\d{6}$/.test(pastedData)) return;

  const digits = pastedData.split("");
  setOtp(digits);

  digits.forEach((_, idx) => {
    inputsRef.current[idx]?.focus();
  });
};



  /* ================= UI ================= */

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="min-h-screen bg-[#EEF4FF] flex items-center justify-center px-4">
        <div className="bg-white w-full border border-neutral-300 max-w-md rounded-3xl p-6">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-6"
          >
            ←
          </button>

          <h2 className="text-[24px]  mb-4">Check your email</h2>

          {email && (
            <p className="text-gray-400 mb-6">
              We sent a reset link to{" "}
              <span className="font-medium">
                {email.replace(/(.{3}).+(@.+)/, "$1***$2")}
              </span>
              <br />
              enter 6 digit code that mentioned in the email
            </p>
          )}

          {/* OTP BOXES */}
          <div className="flex justify-between mb-6">
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

        <button
  style={{backgroundColor:colors.primary}}
  onClick={handleVerify}
  disabled={loading}
  className={`w-full h-10 rounded-3xl font-semibold transition
    ${
      loading
        ? "bg-violet-300 cursor-not-allowed"
        : "bg-violet-600 text-white hover:bg-violet-700"
    }`}
>
  {loading ? "Verifying..." : "Verify Code"}
</button>



          <p className="text-center text-sm text-gray-500 mt-4">
            Haven’t got the email?{" "}
            <span
            style={{color:colors.primary}}
  onClick={handleResend}
  className={`font-medium transition
    ${
      resendLoading || cooldown > 0
        ? `text-gray-400 cursor-not-allowed`
        : "cursor-pointer hover:underline"
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
    </>
  );
}
