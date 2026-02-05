import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./screens/AdminLogin";
import AdminSignup from "./screens/AdminSignup";
import Dashboard from "./screens/Dashboard";
import AdminForgotPassword from "./screens/AdminForgotPassword";
import AdminForgotPassword2 from "./screens/AdminForgotPassword2";
import AdminForgotPassword3 from "./screens/AdminForgotPassword3";
import AdminForgotPassword4 from "./screens/AdminForgotPassword4";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<AdminForgotPassword />} />
        <Route path= "/verify-code" element= {<AdminForgotPassword2 />}/> 
        <Route path="/set-password" element={<AdminForgotPassword3 />} />
        <Route path="/success-password" element={<AdminForgotPassword4 />} />

        <Route path="admin/signup" element={<AdminSignup />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
