// AdminPageLayout.tsx - Updated with Location Filter
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from 'lucide-react';
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
  FeatherMapPin,
  FeatherLoader,
} from "@subframe/core";
import { colors } from "../../common/colors";
import API from "../../common/API";
import { URL_PATH } from "../../common/API";

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
        <div className="flex-1 text-white flex items-center justify-between">
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
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // ===============================
  // LOCATION FILTER STATE
  // ===============================
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [locationStats, setLocationStats] = useState<any>(null);

  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingLocationStats, setLoadingLocationStats] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);

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

  // ===============================
  // FETCH COUNTRIES
  // ===============================
  useEffect(() => {
    (async () => {
      try {
        setLoadingCountries(true);
        const res = await API("GET", URL_PATH.getAllCountries);
        
        if (res?.success && Array.isArray(res?.data)) {
          setCountries(res.data);
          if (res.data.length > 0) {
            setSelectedCountry(res.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch countries:", err);
        setCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    })();
  }, []);

  // ===============================
  // FETCH STATES WHEN COUNTRY CHANGES
  // ===============================
  useEffect(() => {
    if (!selectedCountry) return;

    (async () => {
      try {
        setLoadingStates(true);
        setSelectedState("");
        
        const res = await API("GET", URL_PATH.getStatesByCountry, { 
          country: selectedCountry 
        });
        
        if (res?.success && Array.isArray(res?.data)) {
          setStates(res.data);
          if (res.data.length > 0) {
            setSelectedState(res.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch states:", err);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    })();
  }, [selectedCountry]);

  // ===============================
  // FETCH USER COUNT BY LOCATION
  // ===============================
  useEffect(() => {
    if (!selectedCountry || !selectedState) return;

    (async () => {
      try {
        setLoadingLocationStats(true);
        
        const res = await API("GET", URL_PATH.getUsersByLocation, { 
          country: selectedCountry,
          state: selectedState
        });
        
        if (res?.success && res?.data) {
          setLocationStats(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch location stats:", err);
        setLocationStats(null);
      } finally {
        setLoadingLocationStats(false);
      }
    })();
  }, [selectedCountry, selectedState]);

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
          background: colors.primary,
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        {/* Brand */}
        <div
          className="h-16 px-4 border-b flex items-center"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-12">
            {!collapsed && (
              <div className="flex-1">
                <img
                  className="h-auto w-32 object-contain"
                  src="/WhiteLogo.png"
                  alt="Company logo"
                />
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className=" flex items-center justify-center lg:hidden w-5 h-5 p-1.5 rounded-md hover:bg-gray-100"
              style={{ color: colors.primary, backgroundColor: colors.white }}
            >
              <FeatherX className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <Item
            to="/admin/dashboard"
            icon={<FeatherHome style={{ color: colors.white }} />}
            label="Dashboard"
            collapsed={collapsed}
          />

          <Item
            to="/admin/users"
            icon={<FeatherUsers style={{ color: colors.white }} />}
            label="Students"
            collapsed={collapsed}
          />

          <Item
            to="/admin/analytics"
            icon={<FeatherPieChart style={{ color: colors.white }} />}
            label="Analytics"
            collapsed={collapsed}
          />

          <Item
            to="/admin/recruiters"
            icon={<FeatherBriefcase style={{ color: colors.white }} />}
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
              {!collapsed && (
                <>
                  {/* Empty section for documents */}
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

        {/* User Profile & Logout 
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
        */}
        
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

              {/* Settings 
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                style={{ color: colors.textSecondary }}
              >
                <FeatherSettings className="w-5 h-5" />
              </button>*/}

              {/* Divider 
              <div
                className="h-6 w-px"
                style={{ background: colors.border }}
              ></div>*/}

              {/* Logout button 
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50"
                style={{ color: colors.error }}
              >
                Logout
              </button>*/}

              {/* User Profile */}
              
                <div
                 onClick={() => setOpen(!open)}
                className="flex cursor-pointer items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: colors.textPrimary }}
                  >
                    <span className="text-white text-sm font-semibold">
                      {adminInitials}
                    </span>
                  </div>
                </div>

                {open && (
  <div className="absolute right-0 top-5  mt-10 w-1/3 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
    
    {/* Profile Header */}
    <div className="px-4 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center gap-3">
        {/* Square Avatar */}
        <div 
        style={{backgroundColor:colors.primary}}
        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">
            {/* Replace with user initials or image */}
            {adminInitials}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">
            ADMIN
          </p>
        </div>
      </div>
    </div>

    {/* Menu Items */}
    <div className="py-1">
      <button
        onClick={() => navigate("/my-profile")}
        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700 group"
      >
        <User className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        <span>My Profile</span>
      </button>

      <button
        onClick={() => navigate("/settings")}
        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700 group"
      >
        <Settings className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        <span>Settings</span>
      </button>
    </div>

    {/* Divider */}
    <div className="border-t"></div>

    {/* Logout Button */}
    <button
      onClick={logout}
      className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-50 transition-colors text-sm text-red-600 group"
    >
      <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-600" />
      <span>Logout</span>
    </button>
  </div>
)}

              
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-2">
          <Outlet context={{ 
            showLocationFilter, 
            setShowLocationFilter,
            countries,
            states,
            selectedCountry,
            setSelectedCountry,
            selectedState,
            setSelectedState,
            locationStats,
            loadingCountries,
            loadingStates,
            loadingLocationStats,
          }} />
        </div>
      </main>
    </div>
  );
}