"use client";

import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FeatherHome,
  FeatherBriefcase,
  FeatherUsers,
  FeatherHeadphones,
  FeatherChevronRight,
  FeatherChevronDown,
  FeatherLogOut,
} from "@subframe/core";
import { colors } from "../../common/colors";

const base =
  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition select-none";
const inactive = "text-white/60 hover:text-white hover:bg-white/10";
const active = "text-white bg-white/10";

function Item({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default function AdminPageLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isJobsRoute = useMemo(
    () => location.pathname.startsWith("/jobs"),
    [location.pathname]
  );

  const [jobsOpen, setJobsOpen] = useState(isJobsRoute);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside
        className="flex flex-col w-[280px] shrink-0 h-full px-4 py-5 border-r border-white/10"
        style={{
          background:
            "linear-gradient(180deg, #15172B 0%, #14162A 40%, #121328 100%)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 pb-6">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: colors.primary }}
          >
            H
          </div>
          <div className="leading-tight">
            <div className="text-white font-semibold text-lg">EmployX</div>
            <div className="text-xs text-white/50">Admin</div>
          </div>
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-1">
          <Item
            to="/dashboard"
            icon={<FeatherHome className="w-5 h-5" />}
            label="Dashboard"
          />

          <Item
            to="/users"
            icon={<FeatherUsers className="w-5 h-5" />}
            label="Users"
          />
          <Item
            to="/Recruiters"
            icon={<FeatherHeadphones className="w-5 h-5" />}
            label="Recruiters"
          />

          {/* Jobs dropdown like screenshot */}
          <button
            type="button"
            onClick={() => setJobsOpen((v) => !v)}
            className={`${base} ${isJobsRoute ? active : inactive}`}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <FeatherBriefcase className="w-5 h-5" />
            </span>
            <span className="flex-1 text-left">Documents</span>
            {jobsOpen ? (
              <FeatherChevronDown className="w-4 h-4" />
            ) : (
              <FeatherChevronRight className="w-4 h-4" />
            )}
          </button>

          <div
            className={`ml-4 pl-3 border-l border-white/10 overflow-hidden transition-all ${
              jobsOpen ? "max-h-40" : "max-h-0"
            }`}
          >
            <NavLink
              to="/jobs/all"
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive} py-2 text-[13px]`
              }
            >
              Recruiter Documents
            </NavLink>
            <NavLink
              to="/jobs/create"
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive} py-2 text-[13px]`
              }
            >
              User Documents
            </NavLink>
          </div>

          
        </div>

        {/* Bottom logout */}
      {/* Bottom logout */}
<div className="mt-auto pt-6">
  <button
    onClick={logout}
    className={`
      ${base}
      w-full
      bg-red-50
      text-red-600
      hover:bg-red-100
      hover:text-red-700
      border border-red-100
    `}
  >
    <span className="w-5 h-5 flex items-center justify-center">
      <FeatherLogOut className="w-5 h-5" />
    </span>
    Log out
  </button>
</div>

      </aside>

      {/* RIGHT CONTENT (Dashboard / Users / etc) */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
