// Users.tsx - Updated with your color palette
import React, { useEffect, useMemo, useState } from "react";
import API from "../common/API";
import { URL_PATH } from "../common/URL_PATH";
import {
  FeatherEye,
  FeatherEdit,
  FeatherTrash2,
  FeatherFilter,
  FeatherDownload,
  FeatherRefreshCw,
  FeatherSearch,
  FeatherChevronDown,
  FeatherStar,
  FeatherMoreVertical,
} from "@subframe/core";
import { colors } from "../common/colors";

type UserRow = {
  _id: string;
  firstname: string;
  lastname?: string;
  email: string;
  role: "student" | "recruiter" | "admin";
  createdAt: string;
  updatedAt: string;
  status?: "active" | "pending" | "inactive";
  lastLogin?: string;

  location?: {
    country?: string;
    city?: string;
    university?: string;
  };
};

type ScoreRow = {
  userId: { _id: string; name?: string; email?: string } | string;
  awardScore?: number;
  certificationScore?: number;
  educationScore?: number;
  workScore?: number;
  projectScore?: number;
  experienceIndexScore?: number;
  skillIndexScore?: number;
  hireabilityIndex?: number;

  baselineScore?: number;
caseStudiesCompleted?: number;
avgCaseStudyTime?: number;


  city?: string;
  state?: string;
  country?: string;
  globalRank?: number;
  countryRank?: number;
  stateRank?: number;
  cityRank?: number;
  createdAt?: string;
  updatedAt?: string;
};

function Pill({ label, value }: { label: string; value: any }) {
  return (
    <div
      className="flex justify-between p-3 rounded-lg text-sm"
      style={{ background: `${colors.background}50` }}
    >
      <span style={{ color: colors.textSecondary }}>{label}</span>
      <span className="font-semibold" style={{ color: colors.textPrimary }}>
        {value ?? "-"}
      </span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{ background: `${colors.primary}10` }}
    >
      <div className="text-xs mb-2" style={{ color: colors.textSecondary }}>
        {label}
      </div>

      <div className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
        {value ?? "-"}
      </div>
    </div>
  );
}


function StatusBadge({ status }: { status?: string }) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return { bg: `${colors.success}20`, text: colors.success };
      case "pending":
        return { bg: `${colors.warning}20`, text: colors.warning };
      case "inactive":
        return { bg: `${colors.error}20`, text: colors.error };
      default:
        return { bg: `${colors.secondary}50`, text: colors.textSecondary };
    }
  };

  const color = getStatusColor();

  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: color.bg, color: color.text }}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
}

function formatLastLogin(lastLogin?: string, createdAt?: string) {
  const baseDate = lastLogin || createdAt;

  if (!baseDate) return { label: "Never", sub: null };

  const loginDate = new Date(baseDate);
  const today = new Date();

  const diffDays = Math.floor(
    (today.setHours(0, 0, 0, 0) - new Date(loginDate).setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return {
      label: "Today",
      sub: loginDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }

  if (diffDays === 1) {
    return { label: "Yesterday", sub: null };
  }

  return {
    label: loginDate.toLocaleDateString(),
    sub: null,
  };
}

function getUserStatus(
  lastLogin?: string,
  createdAt?: string,
): "active" | "inactive" {
  const now = Date.now();

  if (!lastLogin && createdAt) {
    const diffDays = Math.floor(
      (now - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );

    return diffDays <= 7 ? "active" : "inactive";
  }

  if (!lastLogin) return "inactive";

  const diffDays = Math.floor(
    (now - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24),
  );

  return diffDays >= 30 ? "inactive" : "active";
}

export default function Users() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
const limit = 5;


  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);


  const [payingUsers, setPayingUsers] = useState(0);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState("scores");
  
   const [open, setOpen] = useState(false);

  const [countryFilter, setCountryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");


  const handleBlockUser = (id: string) => {
  console.log("Block user:", id);
  setOpenMenuId(null);
};

const handleDeleteUser = (id: string) => {
  console.log("Delete user:", id);
  setOpenMenuId(null);
};

  
  useEffect(() => {
    setCityFilter("all");
    setUniversityFilter("all");
  }, [countryFilter]);

  useEffect(() => {
    setUniversityFilter("all");
  }, [cityFilter]);


  useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [open]);

useEffect(() => {
  const handleClickOutside = () => {
    setOpenMenuId(null);
  };

  if (openMenuId) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, [openMenuId]);


 
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [score, setScore] = useState<ScoreRow | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const students = useMemo(
    () => users.filter((u) => u.role === "student"),
    [users],
  );

  const countries = useMemo(() => {
    return Array.from(
      new Set(
        users.map((u) => u.location?.country).filter(Boolean) as string[],
      ),
    );
  }, [users]);

  const cities = useMemo(() => {
    return Array.from(
      new Set(
        users
          .filter(
            (u) =>
              countryFilter === "all" || u.location?.country === countryFilter,
          )
          .map((u) => u.location?.city)
          .filter(Boolean) as string[],
      ),
    );
  }, [users, countryFilter]);

  const universities = useMemo(() => {
    return Array.from(
      new Set(
        users
          .filter(
            (u) =>
              (countryFilter === "all" ||
                u.location?.country === countryFilter) &&
              (cityFilter === "all" || u.location?.city === cityFilter),
          )
          .map((u) => u.location?.university)
          .filter(Boolean) as string[],
      ),
    );
  }, [users, countryFilter, cityFilter]);

  const dailyActiveUsers = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);

    return students.filter((u) => {
      const activityDate = u.lastLogin || u.createdAt;
      return new Date(activityDate).setHours(0, 0, 0, 0) === today;
    }).length;
  }, [students]);

  const monthlyActiveUsers = useMemo(() => {
    const now = Date.now();

    return students.filter((u) => {
      const activityDate = u.lastLogin || u.createdAt;

      const diffDays = Math.floor(
        (now - new Date(activityDate).getTime()) / (1000 * 60 * 60 * 24),
      );

      return diffDays <= 30;
    }).length;
  }, [students]);

  const newUsersToday = useMemo(() => {
    const today = new Date();

    return users.filter((u) => {
      const d = new Date(u.createdAt);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    }).length;
  }, [users]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        search === "" ||
        student.firstname.toLowerCase().includes(search.toLowerCase()) ||
        student.lastname?.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        getUserStatus(student.lastLogin, student.createdAt) === filter;

      const matchesCountry =
        countryFilter === "all" || student.location?.country === countryFilter;

      const matchesCity =
        cityFilter === "all" || student.location?.city === cityFilter;

      const matchesUniversity =
        universityFilter === "all" ||
        student.location?.university === universityFilter;

      return (
        matchesSearch &&
        matchesFilter &&
        matchesCountry &&
        matchesCity &&
        matchesUniversity
      );
    });
  }, [students, search, filter, countryFilter, cityFilter, universityFilter]);


  useEffect(() => {
  setPage(1);
}, [search, filter, countryFilter, cityFilter, universityFilter]);

  const paginatedStudents = useMemo(() => {
  const start = (page - 1) * limit;
  return filteredStudents.slice(start, start + limit);
}, [filteredStudents, page]);

const totalPages = Math.ceil(filteredStudents.length / limit) || 1;

  useEffect(() => {
    fetchUsers();
    fetchPayingUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API("GET", URL_PATH.users);
      if (res?.success) setUsers(res.users || []);
    } catch (e) {
      console.error("Users fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayingUsers = async () => {
    try {
      const res = await API("GET", "/admin/paid-users");
      if (res?.success) {
        setPayingUsers(res.payingUsers);
      }
    } catch (e) {
      console.error("Paying users fetch error:", e);
    }
  };

  const openStudent = async (u: UserRow) => {
    setOpen(true);
    setSelectedUser(u);
    setScore(null);
    setDetailsLoading(true);

    try {
      const res = await API("GET", URL_PATH.userScoreRanks, {
        rankType: "all",
        page: 1,
        limit: 2000,
      });

      if (res?.success && Array.isArray(res.students)) {
        const match = res.students.find((s: any) => {
          const id = s?.userId?._id || s?.userId;
          return id === u._id;
        });

        if (match) {
          setScore({
            userId: match.userId,
            ...match,
            ...match.rank,
          });
        }
      }
    } catch (e) {
      console.error("Student details fetch error:", e);
    } finally {
      setDetailsLoading(false);
    }
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === filteredStudents.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredStudents.map((u) => u._id));
    }
  };

  const handleExport = () => {
    console.log("Exporting selected:", selectedRows);
  };

  const handleBulkAction = (action: string) => {
    console.log("Bulk action:", action, "on:", selectedRows);
  };

  return (
    <div
      className="rounded-xl"
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Header */}
      <div className="p-3 border-b" style={{ borderColor: colors.border }}>
        <div className="mt-4 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Students */}
          <div
            className="p-5 rounded-2xl border shadow-sm"
            style={{
              background: colors.surface,
              borderColor: colors.border,
            }}
          >
            <div
              className="text-xs mb-2"
              style={{ color: colors.textSecondary }}
            >
              Total Students
            </div>
            <div
              className="text-3xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              {students.length}
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: colors.textTertiary }}
            >
              Registered users
            </div>
          </div>

          {/* Daily Active */}
          <div
            className="p-5 rounded-2xl border shadow-sm"
            style={{
              background: `${colors.success}40`,
              borderColor: colors.border,
            }}
          >
            <div
              className="text-xs mb-2"
              style={{ color: colors.textSecondary }}
            >
              Daily Active Users
            </div>
            <div
              className="text-3xl font-bold"
              style={{ color: colors.success }}
            >
              {dailyActiveUsers}
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: colors.textTertiary }}
            >
              Logged in today
            </div>
          </div>

          {/* Monthly Active */}
          <div
            className="p-5 rounded-2xl border shadow-sm"
            style={{
              background: `${colors.primary}40`,
              borderColor: colors.border,
            }}
          >
            <div
              className="text-xs mb-2"
              style={{ color: colors.textSecondary }}
            >
              Monthly Active Users
            </div>
            <div
              className="text-3xl font-bold"
              style={{ color: colors.primary }}
            >
              {monthlyActiveUsers}
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: colors.textTertiary }}
            >
              Last 30 days
            </div>
          </div>
        </div>
        {/* New Users Today */}
        <div
          className="p-5 mt-5 rounded-2xl border shadow-sm"
          style={{
            background: `${colors.warning}40`,
            borderColor: colors.border,
          }}
        >
          <div className="text-xs mb-2" style={{ color: colors.textSecondary }}>
            New Users Today
          </div>

          <div className="text-3xl font-bold" style={{ color: colors.warning }}>
            {newUsersToday}
          </div>

          {/* <div
    className="text-xs mt-1"
    style={{ color: colors.textTertiary }}
  >
    Signed up today
  </div> */}
        </div>

        {/* Paying Users */}
        <div
          className="p-5 mt-5 rounded-2xl border shadow-sm"
          style={{
            background: `${colors.success}20`,
            borderColor: colors.border,
          }}
        >
          <div className="text-xs mb-2">Subscribers</div>

          <div className="text-3xl font-bold">{payingUsers}</div>
          {/* 
  <div className="text-xs mt-1">
    Successful subscriptions
  </div> */}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl mt-6 font-semibold"
              style={{ color: colors.textPrimary }}
            >
              Students
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              Manage and monitor student accounts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsers}
              className="p-2 rounded-lg hover:bg-gray-50"
              title="Refresh"
              style={{ color: colors.textSecondary }}
            >
              <FeatherRefreshCw className="w-5 h-5" />
            </button>
            {/* <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{ background: colors.primary, color: colors.textPrimary }}
            >
              <FeatherDownload className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button> */}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <FeatherSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: colors.textTertiary }}
              />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-full focus:outline-none"
                style={{
                  border: `1px solid ${colors.border}`,
                  background: colors.background,
                  color: colors.textPrimary,
                }}
              />
            </div>

            {/* <div className="relative shrink-0">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-full focus:outline-none"
                style={{
                  border: `1px solid ${colors.border}`,
                  background: colors.background,
                  color: colors.textPrimary,
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <FeatherChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: colors.textTertiary }}
              />
            </div> */}
            <div className="relative shrink-0 w-auto">
  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="
      appearance-none
      w-auto
      min-w-[130px]
      max-w-[180px]
      pl-4 pr-10
      py-2.5
      text-sm sm:text-base
      rounded-full
      focus:outline-none
      transition-all
    "
    style={{
      border: `1px solid ${colors.border}`,
      background: colors.background,
      color: colors.textPrimary,
    }}
  >
    <option value="all">All Status</option>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>

  <FeatherChevronDown
    className="
      absolute
      right-3
      top-1/2
      -translate-y-1/2
      w-4 h-4 sm:w-5 sm:h-5
      pointer-events-none
    "
    style={{ color: colors.textTertiary }}
  />
</div>

            <div className="relative">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-full"
                style={{
                  border: `1px solid ${colors.border}`,
                  background: colors.background,
                  color: colors.textPrimary,
                }}
              >
                <option value="all">Country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <FeatherChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: colors.textTertiary }}
              />
            </div>

            <div className="relative">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-full"
                style={{
                  border: `1px solid ${colors.border}`,
                  background: colors.background,
                  color: colors.textPrimary,
                }}
              >
                <option value="all">City</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <FeatherChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: colors.textTertiary }}
              />
            </div>

            <div className="relative">
              <select
                value={universityFilter}
                onChange={(e) => setUniversityFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-full"
                style={{
                  border: `1px solid ${colors.border}`,
                  background: colors.background,
                  color: colors.textPrimary,
                }}
              >
                <option value="all">University</option>
                {universities.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>

              <FeatherChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: colors.textTertiary }}
              />
            </div>
          </div>

          {selectedRows.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                {selectedRows.length} selected
              </span>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1.5 text-sm rounded-lg hover:bg-red-50"
                style={{ color: colors.error }}
              >
                Delete
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-50"
                style={{ color: colors.textSecondary }}
              >
                Deactivate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className="border-b"
              style={{
                borderColor: colors.border,
                background: `${colors.background}50`,
              }}
            >
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedRows.length === filteredStudents.length &&
                    filteredStudents.length > 0
                  }
                  onChange={toggleAllRows}
                  className="rounded focus:ring-0"
                  style={{ borderColor: colors.border, color: colors.primary }}
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: colors.textSecondary }}
              >
                Student
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: colors.textSecondary }}
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: colors.textSecondary }}
              >
                Email
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: colors.textSecondary }}
              >
                Created
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: colors.textSecondary }}
              >
                Last Login
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: colors.textSecondary }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: colors.border }}>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className="animate-spin rounded-full h-8 w-8 border-b-2"
                      style={{ borderColor: colors.primary }}
                    ></div>
                    <div
                      className="mt-3"
                      style={{ color: colors.textSecondary }}
                    >
                      Loading students...
                    </div>
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <FeatherSearch
                      className="w-12 h-12 mb-3"
                      style={{ color: colors.secondary }}
                    />
                    <div style={{ color: colors.textSecondary }}>
                      No students found
                    </div>
                    <div
                      className="text-sm mt-1"
                      style={{ color: colors.textTertiary }}
                    >
                      Try adjusting your search or filter
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedStudents.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => openStudent(u)}
                >
                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(u._id)}
                      onChange={() => toggleRow(u._id)}
                      className="rounded focus:ring-0"
                      style={{
                        borderColor: colors.border,
                        color: colors.primary,
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: colors.lightprimary }}
                      >
                        <span className="text-gray-800 text-sm font-medium">
                          {u.firstname[0]}
                          {u.lastname?.[0] || u.firstname[1] || ""}
                        </span>
                      </div>
                      <div>
                        <div
                          className="font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          {u.firstname} {u.lastname}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: colors.textTertiary }}
                        >
                          ID: {u._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={getUserStatus(u.lastLogin, u.createdAt)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div style={{ color: colors.textPrimary }}>{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div style={{ color: colors.textPrimary }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: colors.textTertiary }}
                    >
                      {new Date(u.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const login = formatLastLogin(u.lastLogin, u.createdAt);
                      return (
                        <>
                          <div style={{ color: colors.textPrimary }}>
                            {login.label}
                          </div>
                          {login.sub && (
                            <div
                              className="text-xs"
                              style={{ color: colors.textTertiary }}
                            >
                              {login.sub}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </td>

                  <td
  className="px-6 py-4 relative"
  onClick={(e) => e.stopPropagation()}
>
  <button
    onClick={(e) => {
      e.stopPropagation();
      setOpenMenuId(openMenuId === u._id ? null : u._id);
    }}
    className="p-1.5 rounded hover:bg-gray-100"
  >
    <FeatherMoreVertical className="w-4 h-4" />
  </button>

  {openMenuId === u._id && (
    <div
className={`absolute right-6 w-40 rounded-lg shadow-lg border z-10 ${
    paginatedStudents.indexOf(u) >= paginatedStudents.length - 2
      ? "bottom-10"
      : "mt-2"
  }`}      style={{
        background: colors.surface,
        borderColor: colors.border,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => handleBlockUser(u._id)}
        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
      >
        Block
      </button>

      <button
        onClick={() => handleDeleteUser(u._id)}
        className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50"
        style={{ color: colors.error }}
      >
        Delete
      </button>
    </div>
  )}
</td>


                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    {/* Footer */}
<div
  className="px-6 py-4 border-t flex items-center justify-between"
  style={{ borderColor: colors.border }}
>
  {/* LEFT SIDE — SAME AS BEFORE */}
  <div className="text-sm" style={{ color: colors.textSecondary }}>
    Showing{" "}
    <span className="font-medium" style={{ color: colors.textPrimary }}>
      {paginatedStudents.length}
    </span>{" "}
    of{" "}
    <span className="font-medium" style={{ color: colors.textPrimary }}>
      {filteredStudents.length}
    </span>{" "}
    students
  </div>

  {/* RIGHT SIDE — PAGINATION */}
  <div className="flex items-center gap-2">
    {/* Previous */}
    <button
      disabled={page === 1}
      onClick={() => setPage((p) => p - 1)}
      className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-50"
      style={{
        border: `1px solid ${colors.border}`,
        color: colors.textSecondary,
        opacity: page === 1 ? 0.5 : 1,
      }}
    >
      Previous
    </button>

    {/* Page numbers */}
    {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((num) => (
      <button
        key={num}
        onClick={() => setPage(num)}
        className="px-3 py-1.5 text-sm rounded-lg"
        style={{
          background: page === num ? colors.primary : "transparent",
          color: page === num ? colors.white : colors.textSecondary,
          border: `1px solid ${colors.border}`,
        }}
      >
        {num}
      </button>
    ))}

    {/* Next */}
    <button
      disabled={page === totalPages || totalPages === 0}
      onClick={() => setPage((p) => p + 1)}
      className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-50"
      style={{
        border: `1px solid ${colors.border}`,
        color: colors.textSecondary,
        opacity: page === totalPages ? 0.5 : 1,
      }}
    >
      Next
    </button>
  </div>
</div>



      {/* DETAILS MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              background: colors.surface,
              height: "700px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="p-6 border-b"
              style={{ borderColor: colors.border }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    Student Details
                  </h2>
                  <p
                    className="text-sm mt-1"
                    style={{ color: colors.textSecondary }}
                  >
                    {selectedUser
                      ? `${selectedUser.firstname} ${selectedUser.lastname || ""}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 text-sm rounded-lg hover:bg-gray-50"
                    style={{
                      background: `${colors.textPrimary}10`,
                      color: colors.textPrimary,
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    style={{ color: colors.textSecondary }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col h-full">
              {/* Profile Overview */}
              <div
                className="mb-6 p-4 rounded-xl"
                style={{ background: colors.background }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: colors.textTertiary }}
                  >
                    <span className="text-white text-2xl font-bold">
                      {selectedUser?.firstname[0]}
                      {selectedUser?.lastname?.[0] ||
                        selectedUser?.firstname[1] ||
                        ""}
                    </span>
                  </div>
                  
                  <div>
                    <div
                      className="font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      {selectedUser?.firstname} {selectedUser?.lastname}
                    </div>
                    <div style={{ color: colors.textSecondary }}>
                      {selectedUser?.email}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <StatusBadge
                        status={getUserStatus(
                          selectedUser?.lastLogin,
                          selectedUser?.createdAt,
                        )}
                      />


                      <div
                        className="text-sm"
                        style={{ color: colors.textTertiary }}
                      >
                        Member since{" "}
                        {selectedUser
                          ? new Date(
                              selectedUser.createdAt,
                            ).toLocaleDateString()
                          : ""}
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div
                className="border-b mb-6"
                style={{ borderColor: colors.border }}
              >
                <div className="flex  gap-6">
                  {[
                    { key: "scores", label: "Ranks" },
                    { key: "progress", label: "Progress" },
                    // { key: "documents", label: "Documents" },
                    // { key: "activity", label: "Activity Log" },
                    
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className="pb-3 border-b-2 font-medium"
                      style={{
                        borderColor:
                          activeTab === tab.key
                            ? colors.textPrimary
                            : "transparent",
                        color:
                          activeTab === tab.key
                            ? colors.textPrimary
                            : colors.textSecondary,
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "scores" && (
                <div className="flex-1 overflow-y-auto pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Scores Grid */}
                    {/* <div className="flex-1 overflow-y-auto"> */}
                      {/* Left Column */}
                      {/* <div>
                        <h3
                          className="text-lg font-semibold mb-4"
                          style={{ color: colors.textPrimary }}
                        >
                          Core Scores
                        </h3>
                        <div className="grid grid-cols-1 gap-5">
                          {[
                            {
                              label: "Hireability Index",
                              value: score?.hireabilityIndex,
                              color: colors.success,
                            },
                            {
                              label: "Experience Index",
                              value: score?.experienceIndexScore,
                              color: colors.success,
                            },
                            {
                              label: "Skill Index",
                              value: score?.skillIndexScore,
                              color: colors.success,
                            },
                            // {
                            //   label: "Education Score",
                            //   value: score?.educationScore,
                            //   color: colors.success,
                            // },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-xl"
                              style={{ background: `${item.color}10` }}
                            >
                              <div
                                className="text-xs mb-1"
                                style={{ color: item.color }}
                              >
                                {item.label}
                              </div>
                              <div
                                className="text-2xl font-bold"
                                style={{ color: colors.textPrimary }}
                              >
                                {item.value ?? "-"}
                              </div>
                              <div
                                className="text-xs mt-1"
                                style={{ color: colors.textTertiary }}
                              >
                                {item.label.includes("Index")
                                  ? "Overall Score"
                                  : "Assessment"}
                              </div>
                            </div>
                          ))}
                        </div> */}

                        {/* <div className="mt-6">
                          <h4
                            className="text-sm font-medium mb-3"
                            style={{ color: colors.textPrimary }}
                          >
                            Additional Scores
                          </h4>

                          <div className="space-y-2">
                            <Pill label="Work Score" value={score?.workScore} />
                            <Pill
                              label="Award Score"
                              value={score?.awardScore}
                            />
                            <Pill
                              label="Certification Score"
                              value={score?.certificationScore}
                            />
                            <Pill
                              label="Project Score"
                              value={score?.projectScore}
                            />
                          </div>
                        </div> */}
                      {/* </div> */}

                      {/* Right Column */}
                      <div>
                        <h3
                          className="text-lg font-semibold mb-4"
                          style={{ color: colors.textPrimary }}
                        >
                          Rankings
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            {
                              label: "Global Rank",
                              value: score?.globalRank,
                              icon: (
                                <FeatherStar
                                  className="w-4 h-4"
                                  style={{ color: colors.warning }}
                                />
                              ),
                            },
                            {
                              label: "Country Rank",
                              value: score?.countryRank,
                              subtitle: score?.country,
                            },
                            {
                              label: "State Rank",
                              value: score?.stateRank,
                              subtitle: score?.state,
                            },
                            {
                              label: "City Rank",
                              value: score?.cityRank,
                              subtitle: score?.city,
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="border rounded-xl p-4"
                              style={{ borderColor: colors.border }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div
                                  className="text-xs"
                                  style={{ color: colors.textSecondary }}
                                >
                                  {item.label}
                                </div>
                                {item.icon}
                              </div>
                              <div
                                className="text-3xl font-bold"
                                style={{ color: colors.textPrimary }}
                              >
                                #{item.value ?? "-"}
                              </div>
                              <div
                                className="text-xs mt-1"
                                style={{ color: colors.textTertiary }}
                              >
                                {item.subtitle || "Worldwide"}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Location */}
                        <div
                          className="mb-6 p-4 rounded-xl"
                          style={{ background: colors.background }}
                        >
                          <h3
                            className="text-sm font-semibold mb-2"
                            style={{ color: colors.textPrimary }}
                          >
                            Location
                          </h3>

                          <div
                            className="text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            {[
                              selectedUser?.location?.city,
                              selectedUser?.location?.country,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Location not specified"}
                          </div>

                          <div
                            className="text-xs mt-1"
                            style={{ color: colors.textTertiary }}
                          >
                            {selectedUser?.location?.university ||
                              "University not specified"}
                          </div>
                        </div>
                      </div>
                    {/* </div> */}
                  </div>
                </div>
              )}

              {activeTab === "progress" && (
  <div className="flex-1 overflow-y-auto pb-6">
    <div className="grid grid-cols-2 gap-4">

      <StatCard
        label="Current Score"
        value={score?.hireabilityIndex}
      />

      <StatCard
        label="Initial Baseline Score"
        value={score?.baselineScore}
      />

      <StatCard
        label="Case Studies Completed"
        value={score?.caseStudiesCompleted}
      />

      <StatCard
        label="Avg Time per Case Study"
        value={
          score?.avgCaseStudyTime
            ? `${score.avgCaseStudyTime} min`
            : "-"
        }
      />

    </div>
  </div>
)}


              {/* Loading State */}
              {detailsLoading && (
                <div className="text-center py-8">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
                    style={{ borderColor: colors.primary }}
                  ></div>
                  <div className="mt-3" style={{ color: colors.textSecondary }}>
                    Loading student details...
                  </div>
                </div>
              )}

              {/* No Data State */}
              {!detailsLoading && !score && (
                <div className="text-center py-8">
                  <FeatherSearch
                    className="w-12 h-12 mx-auto mb-3"
                    style={{ color: colors.secondary }}
                  />
                  <div style={{ color: colors.textSecondary }}>
                    No score/rank data available
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: colors.textTertiary }}
                  >
                    This student hasn't completed their profile assessment yet
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
