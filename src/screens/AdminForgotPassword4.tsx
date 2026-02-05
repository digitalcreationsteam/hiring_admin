import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ResetPasswordSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        navigate("/login");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);


  // AUTO RE-DIRECT to LOGIN PAGE ========

//   useEffect(() => {
//   const timer = setTimeout(() => {
//     navigate("/login", { replace: true });
//   }, 5000);

//   return () => clearTimeout(timer);
// }, [navigate]);


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center">
            <span className="text-green-500 text-4xl">✓</span>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-[24px] mb-2">Password Changed!</h2>

        <p className="text-gray-500 mb-8">
          Your password has been changed successfully.
        </p>

        {/* Button (simple, consistent with your preference) */}
        <button
          onClick={() => navigate("/login", { replace: true })}
          className="w-full h-10 bg-violet-600 text-white rounded-3xl font-semibold hover:bg-violet-700 transition"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
