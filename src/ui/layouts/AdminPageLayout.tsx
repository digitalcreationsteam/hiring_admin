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
import logo from "../../assets/logo.png";




const base =
  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition select-none";
const inactive = "text-white/60 hover:text-white hover:bg-white/10";
const active = "text-white bg-white/10";

function Item({
  to,
  icon,
  label,
  collapsed,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `${base} ${isActive ? active : inactive} ${collapsed ? "justify-center px-0" : ""}`
      }
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}


export default function AdminPageLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);


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
className={`flex flex-col shrink-0 h-full py-5 border-r border-white/10 transition-all duration-300 ${
  collapsed ? "w-[88px] px-3" : "w-[280px] px-4"
}`}
        style={{
          background:
            "linear-gradient(180deg, #15172B 0%, #14162A 40%, #121328 100%)",
        }}
      >
       {/* Brand */}
<div className="flex items-center gap-3 px-4 pb-6">
  <img
    src="/hiringLogo.png"
    alt="UniTalent Logo"
    className="w-42 h-12 object-contain rounded-xl bg-white p-1"
  />

  {!collapsed && (
    <div className="leading-tight">
      <div className="text-white font-semibold text-lg">UniTalent</div>
      {/* <div className="text-xs text-white/50">Admin</div> */}
    </div>
  )}
</div>



        {/* MENU */}
        <div className="flex flex-col gap-1">
          <Item
  to="/admin/dashboard"
  icon={<FeatherHome className="w-5 h-5" />}
  label="Dashboard"
  collapsed={collapsed}
/>

<Item
  to="/admin/users"
  icon={<FeatherUsers className="w-5 h-5" />}
  label="Users"
  collapsed={collapsed}
/>

<Item
  to="/admin/recruiters"
  icon={<FeatherHeadphones className="w-5 h-5" />}
  label="Recruiters"
  collapsed={collapsed}
/>


          {/* Jobs dropdown like screenshot */}
          <button
  type="button"
  onClick={() => setJobsOpen((v) => !v)}
  title={collapsed ? "Documents" : undefined}
  className={`${base} ${isJobsRoute ? active : inactive} ${
    collapsed ? "justify-center px-0" : ""
  }`}
>
  <span className="w-5 h-5 flex items-center justify-center">
    <FeatherBriefcase className="w-5 h-5" />
  </span>

  {!collapsed && (
    <>
      <span className="flex-1 text-left">Documents</span>
      {jobsOpen ? (
        <FeatherChevronDown className="w-4 h-4" />
      ) : (
        <FeatherChevronRight className="w-4 h-4" />
      )}
    </>
  )}
</button>

{!collapsed && (
          <div
            className={`ml-4 pl-3 border-l border-white/10 overflow-hidden transition-all ${
              jobsOpen ? "max-h-40" : "max-h-0"
            }`}
          >
            <NavLink
              to="/admin/documents/recruiters"
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive} py-2 text-[13px]`
              }
            >
              Recruiter Documents
            </NavLink>
            <NavLink
              to="/admin/documents/students"
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive} py-2 text-[13px]`
              }
            >
              User Documents
            </NavLink>
          </div>
          )}

          
        </div>

      {/* Bottom logout */}
<div className="mt-auto pt-6">
  <button
    onClick={logout}
    title={collapsed ? "Log out" : undefined}
    className={`
      ${base}
      w-full
      bg-red-50
      text-red-600
      hover:bg-red-100
      hover:text-red-700
      border border-red-100
      ${collapsed ? "justify-center px-0" : ""}
    `}
  >
    <span className="w-5 h-5 flex items-center justify-center">
      <FeatherLogOut className="w-5 h-5" />
    </span>
    {!collapsed && "Log out"}
  </button>
</div>


      </aside>

     {/* RIGHT CONTENT (Header + Pages) */}
<main className="flex-1 min-w-0 overflow-y-auto bg-slate-100">
  {/* TOP HEADER */}
  <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
    <div className="h-16 px-6 flex items-center justify-between gap-4">
      {/* Left: menu button + search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          type="button"
          className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center"
onClick={() => setCollapsed((v) => !v)}
        >
          ☰
        </button>

        <div className="flex items-center gap-2 flex-1 max-w-xl bg-slate-100 rounded-2xl px-4 h-10">
          <span className="text-slate-500">🔍</span>
          <input
            placeholder="Search"
            className="bg-transparent outline-none w-full text-sm text-slate-700 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right: admin name + initials */}
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight hidden sm:block">
          <div className="text-sm font-semibold text-slate-900">
            {localStorage.getItem("adminName") || "Admin"}
          </div>
          <div className="text-xs text-slate-500">Admin</div>
        </div>

        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-700">
          {(localStorage.getItem("adminName") || "Admin")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((x) => x[0])
            .join("")
            .toUpperCase()}
        </div>
      </div>
    </div>
  </div>

  {/* PAGE CONTENT */}
  <div className="p-6">
    <Outlet />
  </div>
</main>

    </div>
  );
}
