import React, { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FeatherHome,
  FeatherBriefcase,
  FeatherUsers,
  FeatherHeadphones,
  FeatherLayers,
  FeatherEdit,
  FeatherPieChart,
  FeatherGrid,
  FeatherDatabase,
  FeatherLock,
  FeatherAlertTriangle,
  FeatherChevronRight,
  FeatherChevronDown,
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

export default function AdminSidebar() {
  const location = useLocation();

  const isJobsOpen = useMemo(
    () => location.pathname.startsWith("/jobs"),
    [location.pathname]
  );

  const [jobsOpen, setJobsOpen] = useState(isJobsOpen);

  return (
    <aside
className="flex flex-col w-[280px] h-screen sticky top-0 px-4 py-5 border-r border-white/10"
      style={{
        background:
          "linear-gradient(180deg, ${colors.sidebar} 0%, #14162A 40%, #121328 100%)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 pb-5">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: colors.primary }}
        >
          H
        </div>
        <div className="leading-tight">
          <div className="text-white font-semibold text-lg">UniTalent</div>
          <div className="text-xs text-white/50">Admin</div>
        </div>
      </div>

      {/* Main menu */}
      <div className="flex flex-col gap-1">
        <Item to="/dashboard" icon={<FeatherHome className="w-5 h-5" />} label="Dashboard" />

        {/* Jobs with chevron (like screenshot) */}
        <button
          type="button"
          onClick={() => setJobsOpen((v) => !v)}
          className={`${base} ${location.pathname.startsWith("/jobs") ? active : inactive}`}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <FeatherBriefcase className="w-5 h-5" />
          </span>
          <span className="flex-1 text-left">Jobs</span>
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
            All Jobs
          </NavLink>
          <NavLink
            to="/jobs/create"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive} py-2 text-[13px]`
            }
          >
            Create Job
          </NavLink>
        </div>

        <Item to="/users" icon={<FeatherUsers className="w-5 h-5" />} label="Candidates" />
        <Item to="/support" icon={<FeatherHeadphones className="w-5 h-5" />} label="Support" />
      </div>

      {/* Section header */}
      <div className="mt-6 px-2 text-xs uppercase tracking-wider text-white/40">
        Components
      </div>

      <div className="mt-2 flex flex-col gap-1">
        <Item to="/components/features" icon={<FeatherEdit className="w-5 h-5" />} label="Features" />
        <Item to="/components/forms" icon={<FeatherPieChart className="w-5 h-5" />} label="Forms & Charts" />
        <Item to="/components/tables" icon={<FeatherGrid className="w-5 h-5" />} label="Tables" />
        <Item to="/components/apps" icon={<FeatherDatabase className="w-5 h-5" />} label="Apps & Widgets" />
        <Item to="/components/auth" icon={<FeatherLock className="w-5 h-5" />} label="Authentication" />
        <Item to="/components/misc" icon={<FeatherAlertTriangle className="w-5 h-5" />} label="Miscellaneous" />
      </div>

      {/* Bottom user area */}
      <div className="mt-auto pt-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div>
            <div className="text-white text-sm font-semibold leading-tight">Admin</div>
            <div className="text-white/50 text-xs">Online</div>
          </div>
        </div>

        <button className="text-white/60 hover:text-white">
          <FeatherLayers className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
