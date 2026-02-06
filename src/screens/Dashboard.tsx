import React, { useEffect, useState } from "react";
import API from "../common/API";
import { URL_PATH } from "../common/URL_PATH";
import AdminSidebar from "ui/components/AdminSidebar";

export default function DashboardRight() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalRecruiters: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API("GET", URL_PATH.adminStats);

        if (res?.success && res?.data) {
          setStats({
            totalUsers: res.data.totalUsers ?? 0,
            totalStudents: res.data.totalStudents ?? 0,
            totalRecruiters: res.data.totalRecruiters ?? 0,
          });
        } else if (res?.success && Array.isArray(res?.stats)) {
          let students = 0;
          let recruiters = 0;

          res.stats.forEach((x: any) => {
            if (x._id === "student") students = x.count;
            if (x._id === "recruiter") recruiters = x.count;
          });

          setStats({
            totalUsers: students + recruiters,
            totalStudents: students,
            totalRecruiters: recruiters,
          });
        }
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="text-sm text-slate-500">Total Users</div>
        <div className="mt-2 text-3xl font-bold text-slate-900">
          {loading ? "..." : stats.totalUsers}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="text-sm text-slate-500">Total Students</div>
        <div className="mt-2 text-3xl font-bold text-slate-900">
          {loading ? "..." : stats.totalStudents}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="text-sm text-slate-500">Total Recruiters</div>
        <div className="mt-2 text-3xl font-bold text-slate-900">
          {loading ? "..." : stats.totalRecruiters}
        </div>
      </div>
    </div>
  );
}
