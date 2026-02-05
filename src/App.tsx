import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import Users from "./screens/Users";
import Recruiters from "./screens/Recruiters";
import StudentDocuments from "./screens/StudentDocuments";
import RecruiterDocuments from "./screens/RecruiterDocuments";

import AdminPageLayout from "./ui/layouts/AdminPageLayout"; // ✅ NOW USED

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* 🔥 ADMIN AREA WITH SIDEBAR */}
        <Route element={<AdminPageLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/recruiters" element={<Recruiters />} />
          <Route path="/documents/students" element={<StudentDocuments />} />
          <Route path="/documents/recruiters" element={<RecruiterDocuments />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
