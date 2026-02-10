// AdminPageLayout.tsx - Updated with your color palette
"use client";

import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FeatherHome,
  FeatherFile,
  FeatherUsers,
  FeatherPieChart,
  FeatherBriefcase,
  FeatherChevronRight,
  FeatherChevronDown,
  FeatherLogOut,
  FeatherSearch,
  FeatherBell,
  FeatherSettings,
  FeatherMenu,
  FeatherX,
} from "@subframe/core";
import { colors } from "../../common/colors";

const base =
  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all";
const inactive = `hover:bg-[${colors.background}] text-[${colors.textSecondary}] hover:text-[${colors.textPrimary}]`;
const active = `bg-[${colors.primary}10] text-[${colors.primary}] font-medium border-l-4 border-[${colors.primary}]`;

function Item({ to, icon, label, collapsed, badge }: any) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `${base} ${isActive ? active : inactive} ${
          collapsed ? "justify-center px-3" : ""
        }`
      }
    >
      <span className="w-5 h-5 flex items-center justify-center relative">
        {icon}
        {badge && (
          <span
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
            style={{ background: colors.error }}
          ></span>
        )}
      </span>
      {!collapsed && (
        <div className="flex-1 flex items-center justify-between">
          <span>{label}</span>
          {badge && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ background: `${colors.error}20`, color: colors.error }}
            >
              {badge}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
}

export default function AdminPageLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const isDocumentsRoute = useMemo(
    () => location.pathname.startsWith("/admin/documents"),
    [location.pathname],
  );

  const [documentsOpen, setDocumentsOpen] = useState(isDocumentsRoute);

  const adminName = localStorage.getItem("adminName") || "Admin";
  const adminInitials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login", { replace: true });
  };

  const notifications = [
    { id: 1, text: "New student registration", time: "2 min ago" },
    { id: 2, text: "Document requires approval", time: "1 hour ago" },
    { id: 3, text: "System backup completed", time: "Yesterday" },
  ];

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ background: colors.background }}
    >
      {/* Sidebar Backdrop for Mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative h-screen z-50
          flex flex-col transition-all duration-300
          ${collapsed ? "-translate-x-full lg:translate-x-0 w-20" : "w-64"}
        `}
        style={{
          background: colors.surface,
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        {/* Brand */}
<div
  className="h-16 px-4 border-b flex items-center"
  style={{ borderColor: colors.border }}
>
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.primary }}>
              <span className="text-white font-bold text-lg">U</span>
            </div> */}
            {!collapsed && (
              <div className="flex-1">
                <img
                  className="h-auto"
                  src="/UniTalent.png"
                  alt="Company logo"
                />
                {/* <div className="font-bold" style={{ color: colors.textPrimary }}>UniTalhfjhent</div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>Admin Panel</div> */}
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
              style={{ color: colors.textSecondary }}
            >
              <FeatherX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <Item
            to="/admin/dashboard"
            icon={<FeatherHome style={{ color: colors.textSecondary }} />}
            label="Dashboard"
            collapsed={collapsed}
          />

          <Item
            to="/admin/users"
            icon={<FeatherUsers style={{ color: colors.textSecondary }} />}
            label="Students"
            collapsed={collapsed}
          />

          <Item
            to="/admin/analytics"
            icon={<FeatherPieChart style={{ color: colors.textSecondary }} />}
            label="Analytics"
            collapsed={collapsed}
          />

          <Item
            to="/admin/recruiters"
            icon={<FeatherBriefcase style={{ color: colors.textSecondary }} />}
            label="Recruiters"
            collapsed={collapsed}
          />

          {/* Documents Dropdown */}
          <div>
            <button
              onClick={() => setDocumentsOpen(!documentsOpen)}
              className={`${base} w-full ${
                isDocumentsRoute ? active : inactive
              } ${collapsed ? "justify-center px-3" : ""}`}
            >
              {/* <FeatherFile style={{ color: colors.textSecondary }} /> */}
              {!collapsed && (
                <>
                  {/* <span className="flex-1 text-left">Documents</span>
                  {documentsOpen ? (
                    <FeatherChevronDown
                      className="w-4 h-4"
                      style={{ color: colors.textSecondary }}
                    />
                  ) : (
                    <FeatherChevronRight
                      className="w-4 h-4"
                      style={{ color: colors.textSecondary }}
                    />
                  )} */}
                </>
              )}
            </button>

            {!collapsed && documentsOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <NavLink
                  to="/admin/documents/recruiters"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm rounded-lg transition-colors ${
                      isActive
                        ? `bg-[${colors.primary}10] text-[${colors.primary}]`
                        : `text-[${colors.textSecondary}] hover:bg-[${colors.background}]`
                    }`
                  }
                >
                  Recruiter Docs
                </NavLink>
                <NavLink
                  to="/admin/documents/students"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm rounded-lg transition-colors ${
                      isActive
                        ? `bg-[${colors.primary}10] text-[${colors.primary}]`
                        : `text-[${colors.textSecondary}] hover:bg-[${colors.background}]`
                    }`
                  }
                >
                  User Docs
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          {!collapsed ? (
            <div className="space-y-3">
              <div
                className="flex items-center gap-3 p-2 rounded-lg"
                style={{ background: colors.background }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: colors.textPrimary }}
                >
                  <span className="text-white font-semibold">
                    {adminInitials}
                  </span>
                </div>
                <div className="flex-1">
                  <div
                    className="font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {adminName}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    Administrator
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors hover:bg-red-50"
                style={{ color: colors.error }}
              >
                <FeatherLogOut className="w-5 h-5" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: colors.textPrimary }}
              >
                <span className="text-white font-semibold text-sm">
                  {adminInitials}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-50"
                title="Log out"
                style={{ color: colors.error }}
              >
                <FeatherLogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">

        {/* Top Header */}
        <header
          className="sticky top-0 z-40 border-b"
          style={{ background: colors.surface, borderColor: colors.border }}
        >
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="px-2 py-2 rounded-lg hover:bg-gray-100"
                style={{ color: colors.textSecondary }}
              >
                <FeatherMenu className="w-5 h-5" />
              </button>

              {/* Search */}
              <div className="relative rounded-full border border-gray-800 overflow-hidden">
                <FeatherSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: colors.textTertiary }}
                />

                <input
                  type="text"
                  placeholder="Search users, documents, settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full text-sm focus:outline-none"
                  style={{
                    background: colors.background,
                    color: colors.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 relative"
                  style={{ color: colors.textSecondary }}
                >
                  <FeatherBell className="w-5 h-5" />
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ background: colors.error }}
                  ></span>
                </button>

                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div
                      className="absolute right-0 mt-2 w-80 rounded-xl shadow-lg z-20"
                      style={{
                        background: colors.surface,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <div
                        className="p-4 border-b"
                        style={{ borderColor: colors.border }}
                      >
                        <div
                          className="font-semibold"
                          style={{ color: colors.textPrimary }}
                        >
                          Notifications
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: colors.textSecondary }}
                        >
                          You have {notifications.length} unread
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                            style={{ borderColor: colors.border }}
                          >
                            <div
                              className="font-medium"
                              style={{ color: colors.textPrimary }}
                            >
                              {notification.text}
                            </div>
                            <div
                              className="text-xs mt-1"
                              style={{ color: colors.textSecondary }}
                            >
                              {notification.time}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        className="p-3 border-t"
                        style={{ borderColor: colors.border }}
                      >
                        <button
                          className="w-full text-center text-sm hover:text-blue-700"
                          style={{ color: colors.primary }}
                        >
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Settings */}
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                style={{ color: colors.textSecondary }}
              >
                <FeatherSettings className="w-5 h-5" />
              </button>

              {/* Divider */}
              {/* Divider */}
              <div
                className="h-6 w-px"
                style={{ background: colors.border }}
              ></div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50"
                style={{ color: colors.error }}
              >
                Logout
              </button>

              {/* User Profile */}
              {collapsed && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      className="text-sm font-medium"
                      style={{ color: colors.textPrimary }}
                    >
                      {adminName}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      Admin
                    </div>
                  </div>

                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: colors.textPrimary }}
                  >
                    <span className="text-white text-sm font-semibold">
                      {adminInitials}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
