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

export default function Users() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [countryFilter, setCountryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [score, setScore] = useState<ScoreRow | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const students = useMemo(
    () => users.filter((u) => u.role === "student"),
    [users],
  );

  const countries = Array.from(
    new Set(users.map((u) => u.location?.country).filter(Boolean) as string[]),
  );

  const cities = Array.from(
    new Set(users.map((u) => u.location?.city).filter(Boolean) as string[]),
  );

  const universities = Array.from(
    new Set(
      users.map((u) => u.location?.university).filter(Boolean) as string[],
    ),
  );

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        search === "" ||
        student.firstname.toLowerCase().includes(search.toLowerCase()) ||
        student.lastname?.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "all" || student.status === filter;

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
  }, [
  students,
  search,
  filter,
  countryFilter,
  cityFilter,
  universityFilter
]);

  useEffect(() => {
    fetchUsers();
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
      <div className="p-6 border-b" style={{ borderColor: colors.border }}>
       <div className="mt-4">
  <div className="text-sm" style={{ color: colors.textSecondary }}>
    Total Students
  </div>
  <div className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>
    {students.length}
  </div>
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
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
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

            <div className="relative">
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
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              <FeatherChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
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
      <option key={c} value={c}>{c}</option>
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
      <option key={c} value={c}>{c}</option>
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
      <option key={u} value={u}>{u}</option>
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
              filteredStudents.map((u) => (
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
                    <StatusBadge status={u.status} />
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
                    <div style={{ color: colors.textPrimary }}>
                      {u.lastLogin
                        ? new Date(u.lastLogin).toLocaleDateString()
                        : "Never"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openStudent(u);
                        }}
                        className="p-1.5 rounded hover:bg-blue-50"
                        title="View Details"
                        style={{ color: colors.primary }}
                      >
                        <FeatherEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded hover:bg-gray-100"
                        title="Edit"
                        style={{ color: colors.textSecondary }}
                      >
                        <FeatherEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded hover:bg-red-50"
                        title="Delete"
                        style={{ color: colors.error }}
                      >
                        <FeatherTrash2 className="w-4 h-4" />
                      </button>
                    </div>
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
        <div className="text-sm" style={{ color: colors.textSecondary }}>
          Showing{" "}
          <span className="font-medium" style={{ color: colors.textPrimary }}>
            {filteredStudents.length}
          </span>{" "}
          of{" "}
          <span className="font-medium" style={{ color: colors.textPrimary }}>
            {students.length}
          </span>{" "}
          students
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-50"
            style={{
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary,
            }}
          >
            Previous
          </button>
          <button
            className="px-3 py-1.5 text-sm rounded-lg"
            style={{ background: colors.primary, color: colors.textPrimary }}
          >
            1
          </button>
          <button
            className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-50"
            style={{
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary,
            }}
          >
            2
          </button>
          <button
            className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-50"
            style={{
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary,
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
            className="w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
            style={{ background: colors.surface }}
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
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
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
                      <StatusBadge status={selectedUser?.status} />
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
                <div className="flex gap-6">
                  <button
                    className="pb-3 border-b-2 font-medium"
                    style={{
                      borderColor: colors.textPrimary,
                      color: colors.textPrimary,
                    }}
                  >
                    Scores & Ranks
                  </button>
                  <button
                    className="pb-3 hover:text-gray-700"
                    style={{ color: colors.textSecondary }}
                  >
                    Activity Log
                  </button>
                  <button
                    className="pb-3 hover:text-gray-700"
                    style={{ color: colors.textSecondary }}
                  >
                    Documents
                  </button>
                </div>
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: colors.textPrimary }}
                  >
                    Core Scores
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
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
                      {
                        label: "Education Score",
                        value: score?.educationScore,
                        color: colors.success,
                      },
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
                  </div>

                  <div className="mt-6">
                    <h4
                      className="text-sm font-medium mb-3"
                      style={{ color: colors.textPrimary }}
                    >
                      Additional Scores
                    </h4>
                    <div className="space-y-2">
                      <Pill label="Work Score" value={score?.workScore} />
                      <Pill label="Award Score" value={score?.awardScore} />
                      <Pill
                        label="Certification Score"
                        value={score?.certificationScore}
                      />
                      <Pill label="Project Score" value={score?.projectScore} />
                    </div>
                  </div>
                </div>

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

                  <div className="mt-6">
                    <h4
                      className="text-sm font-medium mb-3"
                      style={{ color: colors.textPrimary }}
                    >
                      Location
                    </h4>
                    <div
                      className="p-4 rounded-xl"
                      style={{ background: colors.background }}
                    >
                      <div
                        className="text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        {[score?.city, score?.state, score?.country]
                          .filter(Boolean)
                          .join(", ") || "Location not specified"}
                      </div>
                      <div
                        className="text-xs mt-2"
                        style={{ color: colors.textTertiary }}
                      >
                        Last updated:{" "}
                        {score?.updatedAt
                          ? new Date(score.updatedAt).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
