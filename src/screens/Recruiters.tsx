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

export default function Recruiters() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<UserRow | null>(null);

  const recruiters = useMemo(
    () => users.filter((u) => u.role === "recruiter"),
    [users]
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await API("GET", URL_PATH.users);
        if (res?.success) setUsers(res.users || []);
      } catch (e) {
        console.error("Recruiters fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openRecruiter = (u: UserRow) => {
    setSelected(u);
    setOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl p-6 text-gray-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recruiters</h1>
          <p className="text-gray-600 mt-1">
            Click a recruiter to view details.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {loading ? "..." : recruiters.length}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-3 pr-4">Sr.No</th>
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Mobile No</th>
              <th className="py-3 pr-4">Email</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="py-6 text-gray-500" colSpan={4}>
                  Loading...
                </td>
              </tr>
            ) : recruiters.length === 0 ? (
              <tr>
                <td className="py-6 text-gray-500" colSpan={4}>
                  No recruiters found.
                </td>
              </tr>
            ) : (
              recruiters.map((u, idx) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => openRecruiter(u)}
                >
                  <td className="py-3 pr-4">{idx + 1}</td>
                  <td className="py-3 pr-4 font-medium text-blue-600">
                    {formatName(u)}
                  </td>
                  <td className="py-3 pr-4 text-gray-500">—</td>
                  <td className="py-3 pr-4">{u.email}</td>
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
            className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Recruiter Details</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selected ? formatName(selected) : ""}
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
              <Pill label="Email" value={selected?.email} />
              <Pill label="Role" value={selected?.role} />
              <Pill label="Mobile" value={"—"} />
              <Pill
                label="Created At"
                value={selected ? new Date(selected.createdAt).toLocaleString() : "-"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
