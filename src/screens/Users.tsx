import React, { useEffect, useMemo, useState } from "react";
import API from "../common/API";
import { URL_PATH } from "../common/URL_PATH";

type UserRow = {
  _id: string;
  firstname: string;
  lastname?: string;
  email: string;
  role: "student" | "recruiter" | "admin";
  createdAt: string;
  updatedAt: string;
};

type ScoreRow = {
  userId: { _id: string; name?: string; email?: string } | string;
  // scores
  awardScore?: number;
  certificationScore?: number;
  educationScore?: number;
  workScore?: number;
  projectScore?: number;
  experienceIndexScore?: number;
  skillIndexScore?: number;
  hireabilityIndex?: number;

  // location
  city?: string;
  state?: string;
  country?: string;

  // ranks
  globalRank?: number;
  countryRank?: number;
  stateRank?: number;
  cityRank?: number;

  createdAt?: string;
  updatedAt?: string;
};

function formatName(u: UserRow) {
  return `${u.firstname || ""} ${u.lastname || ""}`.trim();
}

function Pill({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between bg-gray-50 p-3 rounded-xl text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{value ?? "-"}</span>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [score, setScore] = useState<ScoreRow | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // only students
  const students = useMemo(
    () => users.filter((u) => u.role === "student"),
    [users]
  );

  // 1) fetch all users (your backend already has /admin/users)
  useEffect(() => {
    (async () => {
      try {
        const res = await API("GET", URL_PATH.users);
        // adminController.getAllUsers returns: { success, count, users }
        if (res?.success) setUsers(res.users || []);
      } catch (e) {
        console.error("Users fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) open modal + fetch score details (using existing /admin/user-score/ranks)
  const openStudent = async (u: UserRow) => {
    setOpen(true);
    setSelectedUser(u);
    setScore(null);
    setDetailsLoading(true);

    try {
      // We use ranks endpoint to find this student's score entry.
      // Your endpoint returns: { success, students: [...] }
      const res = await API("GET", URL_PATH.userScoreRanks, {
        rankType: "all",
        page: 1,
        limit: 2000, // enough to include all; if you have more, we’ll make a proper endpoint later
      });

      if (res?.success && Array.isArray(res.students)) {
        // each item: { userId, rank: {globalRank...} }
        // But in your controller you return rank fields only in "rank" object.
        // Your DB info shows score fields exist too (awardScore, hireabilityIndex etc).
        // If your API doesn't include scores, score will be null — that's OK.
        const match = res.students.find((s: any) => {
          const id = s?.userId?._id || s?.userId;
          return id === u._id;
        });

        // If your ranks endpoint currently only returns rank fields,
        // keep it as "score-like" object with rank only:
        if (match) {
          setScore({
            userId: match.userId,
            ...match, // if any fields exist
            ...match.rank, // rank fields (globalRank, etc)
          });
        }
      }
    } catch (e) {
      console.error("Student details fetch error:", e);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 text-gray-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-gray-600 mt-1">
            Click a student to view details.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {loading ? "..." : students.length}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-3 pr-4">Sr.No</th>
              <th className="py-3 pr-4">Student Name</th>
              <th className="py-3 pr-4">Mobile No</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Created</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="py-6 text-gray-500" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td className="py-6 text-gray-500" colSpan={5}>
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((u, idx) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => openStudent(u)}
                >
                  <td className="py-3 pr-4">{idx + 1}</td>
                  <td className="py-3 pr-4 font-medium text-blue-600">
                    {formatName(u)}
                  </td>
                  <td className="py-3 pr-4 text-gray-500">—</td>
                  <td className="py-3 pr-4">{u.email}</td>
                  <td className="py-3 pr-4 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Student Details</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedUser ? formatName(selectedUser) : ""}
                </p>
              </div>
              <button
                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Pill label="Email" value={selectedUser?.email} />
              <Pill label="Role" value={selectedUser?.role} />
              <Pill
                label="Created At"
                value={
                  selectedUser
                    ? new Date(selectedUser.createdAt).toLocaleString()
                    : "-"
                }
              />
              <Pill
                label="Updated At"
                value={
                  selectedUser
                    ? new Date(selectedUser.updatedAt).toLocaleString()
                    : "-"
                }
              />
              <Pill label="Mobile" value={"—"} />
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-gray-900">
                Scores / Rank / Location
              </div>

              {detailsLoading ? (
                <div className="text-gray-500 mt-3">Loading details...</div>
              ) : !score ? (
                <div className="text-gray-500 mt-3">
                  No score/rank data found for this student (or API doesn’t
                  return it yet).
                </div>
              ) : (
                <>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Pill label="Hireability Index" value={score.hireabilityIndex} />
                    <Pill label="Experience Index" value={score.experienceIndexScore} />
                    <Pill label="Skill Index" value={score.skillIndexScore} />
                    <Pill label="Education Score" value={score.educationScore} />
                    <Pill label="Work Score" value={score.workScore} />
                    <Pill label="Award Score" value={score.awardScore} />
                    <Pill label="Certification Score" value={score.certificationScore} />
                    <Pill label="Project Score" value={score.projectScore} />
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex justify-between bg-blue-50 p-3 rounded-xl text-sm">
                      <span className="text-blue-700">Global Rank</span>
                      <span className="font-bold text-blue-900">
                        {score.globalRank ?? "-"}
                      </span>
                    </div>
                    <div className="flex justify-between bg-blue-50 p-3 rounded-xl text-sm">
                      <span className="text-blue-700">Country Rank</span>
                      <span className="font-bold text-blue-900">
                        {score.countryRank ?? "-"}
                      </span>
                    </div>
                    <div className="flex justify-between bg-blue-50 p-3 rounded-xl text-sm">
                      <span className="text-blue-700">State Rank</span>
                      <span className="font-bold text-blue-900">
                        {score.stateRank ?? "-"}
                      </span>
                    </div>
                    <div className="flex justify-between bg-blue-50 p-3 rounded-xl text-sm">
                      <span className="text-blue-700">City Rank</span>
                      <span className="font-bold text-blue-900">
                        {score.cityRank ?? "-"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    Location:{" "}
                    <span className="font-medium text-gray-900">
                      {[score.city, score.state, score.country].filter(Boolean).join(", ") ||
                        "-"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
