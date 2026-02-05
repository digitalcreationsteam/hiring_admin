import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API, { URL_PATH } from "../common/API";

export default function SetNewPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //   /* ================= REDIRECT SAFELY ================= */
  //   useEffect(() => {
  //     if (!email) {
  //       navigate("/forgot-password", { replace: true });
  //     }
  //   }, [email, navigate]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (loading) return;
    if (!email) {
      toast.error("Session expired. Please restart password reset.");
      navigate("/forgot-password", { replace: true });
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await API("post", URL_PATH.adminResetPassword, { email, password });

      toast.success("Password updated successfully");

      setTimeout(() => {
        navigate("/success-password");
      }, 1000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !loading) {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, password, confirmPassword]);

  /* ================= UI ================= */
  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
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
            security
          </p>

          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-3xl px-4 h-10 mb-5 border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black-900"
          />

          <label className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-3xl px-4 h-10 mb-6 border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black-900"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full h-10 rounded-3xl font-semibold transition
    ${
      loading
        ? "bg-violet-300 cursor-not-allowed"
        : "bg-violet-600 text-white hover:bg-violet-700"
    }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </>
  );
}
