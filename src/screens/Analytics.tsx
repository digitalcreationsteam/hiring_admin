import React, { useEffect, useState } from "react";
import API, { URL_PATH } from "../common/API";
import { colors } from "../common/colors";
import {
  FeatherTrendingUp,
  FeatherUsers,
  FeatherBarChart2,
} from "@subframe/core";

/* =======================
   SMALL UI COMPONENTS
======================= */

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>
        {title}
      </div>

      <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
        {value}
      </div>

      {subtitle && (
        <div className="text-xs mt-1" style={{ color: colors.textTertiary }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function FunnelStep({
  label,
  users,
  conversion,
}: {
  label: string;
  users: number | string;
  conversion?: string;
}) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="text-xs" style={{ color: colors.textSecondary }}>
        {label}
      </div>

      <div
        className="text-xl font-bold mt-1"
        style={{ color: colors.textPrimary }}
      >
        {users}
      </div>

      {conversion && (
        <div className="text-xs mt-1" style={{ color: colors.success }}>
          {conversion}
        </div>
      )}
    </div>
  );
}

/* =======================
   MAIN ANALYTICS PAGE
======================= */

export default function Analytics() {
  const [loading, setLoading] = useState(true);

  const [caseMetrics, setCaseMetrics] = useState({
    avgStarted: "--",
    avgCompleted: "--",
    completionRate: "--",
    avgTime: "--",
  });

  // useEffect(() => {
  //   const fetchCaseStudyMetrics = async () => {
  //     try {
  //       const [
  //         avgStartedRes,
  //         avgCompletedRes,
  //         completionRateRes,
  //         avgTimeRes,
  //       ] = await Promise.all([
  //         API("get", URL_PATH.avgCaseStudyStartedPerUser),
  //         API("get", URL_PATH.avgCaseStudyStartedCompletedPerUser),
  //         API("get", URL_PATH.caseStudyCompletionRate),
  //         API("get", URL_PATH.avgTimePerCase),
  //       ]);

  //       // ⏱ Convert seconds → mm ss
  //       const totalSeconds = avgTimeRes.avgTimeSeconds || 0;
  //       const minutes = Math.floor(totalSeconds / 60);
  //       const seconds = totalSeconds % 60;

  //       setCaseMetrics({
  //         avgStarted: avgStartedRes.avg?.toFixed(2) ?? "0",
  //         avgCompleted: avgCompletedRes.avg?.toFixed(2) ?? "0",
  //         completionRate: `${completionRateRes.rate?.toFixed(1) ?? 0}%`,
  //         avgTime: `${minutes}m ${seconds}s`,
  //       });
  //     } catch (error) {
  //       console.error("❌ Failed to load analytics", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCaseStudyMetrics();
  // }, []);

//   useEffect(() => {
//   const fetchCaseStudyMetrics = async () => {
//     try {
//       const [
//         avgStartedRes,
//         avgCompletedRes,
//         completionRateRes,
//         avgTimeRes,
//       ] = await Promise.all([
//         API("get", URL_PATH.avgCaseStudyStartedPerUser),
//         API("get", URL_PATH.avgCaseStudyStartedCompletedPerUser),
//         API("get", URL_PATH.caseStudyCompletionRate),
//         API("get", URL_PATH.avgTimePerCase),
//       ]);

//       setCaseMetrics({
//         avgStarted: avgStartedRes.avgCaseStudiesPerUser?.toFixed(2),
//         avgCompleted:
//           avgCompletedRes.data.averageCompletedPerUser?.toFixed(2),
//         completionRate:
//           `${completionRateRes.data.completionRate?.toFixed(1)}%`,
//         avgTime:  
//       });
//     } catch (err) {
//       console.error("Analytics error", err);
//     } finally {
//       // 🔥 THIS IS WHAT WAS MISSING
//       setLoading(false);
//     }
//   };

//   fetchCaseStudyMetrics();
// }, []);

useEffect(() => {
  const fetchCaseStudyMetrics = async () => {
    try {
      const [
        avgStartedRes,
        avgCompletedRes,
        completionRateRes,
        avgTimeRes,
      ] = await Promise.all([
        API("get", URL_PATH.avgCaseStudyStartedPerUser),
        API("get", URL_PATH.avgCaseStudyStartedCompletedPerUser),
        API("get", URL_PATH.caseStudyCompletionRate),
        API("get", URL_PATH.avgTimePerCase),
      ]);

      const avgTimeMinutes =
        avgTimeRes?.data?.[0]?.avgTimeMinutes ?? 0;

      setCaseMetrics({
        avgStarted: avgStartedRes.avgCaseStudiesPerUser?.toFixed(2) ?? "0",
        avgCompleted:
          avgCompletedRes.data.averageCompletedPerUser?.toFixed(2) ?? "0",
        completionRate:
          `${completionRateRes.data.completionRate?.toFixed(1)}%`,
        avgTime: `${avgTimeMinutes.toFixed(2)} min`,
      });
    } catch (err) {
      console.error("❌ Analytics load failed", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCaseStudyMetrics();
}, []);




  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <div>
        <h1
          className="text-xl font-semibold"
          style={{ color: colors.textPrimary }}
        >
          Analytics
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: colors.textSecondary }}
        >
          Funnel metrics and Case study performance
        </p>
      </div>

      {/* FUNNEL METRICS (STATIC / PLACEHOLDER FOR NOW) */}
      <div
        className="rounded-xl p-5"
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FeatherBarChart2 style={{ color: colors.primary }} />
          <h2 className="font-semibold" style={{ color: colors.textPrimary }}>
            Funnel Metrics
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <FunnelStep label="Landing" users={10000} />
          <FunnelStep label="Signup" users={6200} conversion="62%" />
          <FunnelStep label="Onboarding" users={4800} conversion="77%" />
          <FunnelStep label="Assessment" users={3900} conversion="81%" />
          <FunnelStep label="Dashboard" users={3200} conversion="82%" />
          <FunnelStep label="Case Study" users={2400} conversion="75%" />
        </div>
      </div>

      {/* CASE STUDY METRICS */}
      <div
        className="rounded-xl p-5"
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FeatherTrendingUp style={{ color: colors.primary }} />
          <h2 className="font-semibold" style={{ color: colors.textPrimary }}>
            Case Study Metrics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Avg Started / User"
            value={loading ? "..." : caseMetrics.avgStarted}
          />
          <StatCard
            title="Avg Completed / User"
            value={loading ? "..." : caseMetrics.avgCompleted}
          />
          <StatCard
            title="Completion Rate"
            value={loading ? "..." : caseMetrics.completionRate}
          />
          <StatCard
            title="Avg Time / Case Study"
            value={loading ? "..." : caseMetrics.avgTime}
          />
        </div>
      </div>

      {/* ENGAGEMENT METRICS */}
      {/* <div
        className="rounded-xl p-5"
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FeatherUsers style={{ color: colors.primary }} />
          <h2 className="font-semibold" style={{ color: colors.textPrimary }}>
            Engagement Metrics
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total Users" value="—" />
          <StatCard title="Paying Users" value="—" />
          <StatCard title="Daily Active Users" value="—" />
          <StatCard title="Monthly Active Users" value="—" />
          <StatCard title="New Users Today" value="—" />
        </div>
      </div> */}
     </div>  
    
  )
}

