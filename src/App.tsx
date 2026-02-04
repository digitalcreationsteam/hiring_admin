import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Default: redirect "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Optional: catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
