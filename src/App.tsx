import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./screens/AdminLogin";
import AdminSignup from "./screens/AdminSignup";
import Dashboard from "./screens/Dashboard";
import AdminForgotPassword from "./screens/AdminForgotPassword";
import AdminForgotPassword2 from "./screens/AdminForgotPassword2";
import AdminForgotPassword3 from "./screens/AdminForgotPassword3";
import AdminForgotPassword4 from "./screens/AdminForgotPassword4";

import Users from "./screens/Users";
import Recruiters from "./screens/Recruiters";
import StudentDocuments from "./screens/StudentDocuments";
import RecruiterDocuments from "./screens/RecruiterDocuments";

import AdminPageLayout from "./ui/layouts/AdminPageLayout"; // ✅ NOW USED
import EmailVerification from "screens/EmailVerification";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/email-verification" element={<EmailVerification />} />

        <Route path="/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/verify-code" element={<AdminForgotPassword2 />} />
        <Route path="/set-password" element={<AdminForgotPassword3 />} />
        <Route path="/success-password" element={<AdminForgotPassword4 />} />

        {/* 🔥 ADMIN AREA WITH SIDEBAR */}
        <Route path="/admin" element={<AdminPageLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="recruiters" element={<Recruiters />} />
          <Route path="documents/students" element={<StudentDocuments />} />
          <Route path="documents/recruiters" element={<RecruiterDocuments />} />
        <Route path="admin/signup" element={<AdminSignup />} />
        </Route>
        


        {/* Admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* Fallback */} 
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public */}
        <Route path="/login" element={<AdminLogin />} />

        {/* 🔥 ADMIN AREA WITH SIDEBAR */}
        <Route element={<AdminPageLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/recruiters" element={<Recruiters />} />
          <Route path="/documents/students" element={<StudentDocuments />} />
          <Route path="/documents/recruiters" element={<RecruiterDocuments />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
