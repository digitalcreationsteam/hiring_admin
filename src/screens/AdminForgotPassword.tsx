import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import API, { URL_PATH } from "../common/API";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // RESET PASSWORD API=========
  const handleSubmit = async () => {
    if (loading) return;
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      await API("POST", URL_PATH.adminForgotPassword, { email });
      toast.success("Verification code sent to your email");

      setTimeout(() => {
        navigate("/verify-code", { state: { email } });
      }, 3000); // 3 sec is perfect for UX
    } catch (err: any) {
      toast.error(err?.message || "Unable to send reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="min-h-screen bg-[#EEF4FF] flex items-center justify-center px-4">
        <div className="bg-white w-full border border-neutral-300  max-w-md rounded-3xl p-6">
          <button onClick={() => navigate(-1)} className="mb-6">
            ←
          </button>

          <h2 className="text-[24px] mb-2">Forgot password</h2>
          <p className="text-gray-400 mb-6">
            Please enter your email to reset the password
          </p>

          <label className="block  mb-2">Your Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-10 border rounded-3xl border border-gray-300 px-4 py-3 mb-10 border-focus-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full h-10 rounded-3xl ${
              loading
                ? "bg-violet-300 cursor-not-allowed"
                : "bg-violet-600 text-white"
            }`}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </div>
      </div>
    </>
  );
}
