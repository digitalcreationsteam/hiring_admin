import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
        <p className="text-gray-600 mb-6">Sign in to continue</p>

        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Email"
        />
        <input
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Password"
          type="password"
        />

        <button className="w-full bg-violet-600 text-white py-2 rounded-lg font-semibold">
          Login
        </button>
      </div>
    </div>
  );
}
