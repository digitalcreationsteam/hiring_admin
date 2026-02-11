// import React, { useEffect, useState } from "react";
// import API, { URL_PATH } from "../common/API";
// import { colors } from "../common/colors";
// import {
//   FeatherTrendingUp,
//   FeatherUsers,
//   FeatherBarChart2,
// } from "@subframe/core";

// /* =======================
//    SMALL UI COMPONENTS
// ======================= */

// function StatCard({
//   title,
//   value,
//   subtitle,
// }: {
//   title: string;
//   value: string | number;
//   subtitle?: string;
// }) {
//   return (
//     <div
//       className="rounded-xl p-5"
//       style={{
//         background: colors.surface,
//         border: `1px solid ${colors.border}`,
//       }}
//     >
//       <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>
//         {title}
//       </div>

//       <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
//         {value}
//       </div>

//       {subtitle && (
//         <div className="text-xs mt-1" style={{ color: colors.textTertiary }}>
//           {subtitle}
//         </div>
//       )}
//     </div>
//   );
// }

// function FunnelStep({
//   label,
//   users,
//   conversion,
// }: {
//   label: string;
//   users: number | string;
//   conversion?: string;
// }) {
//   return (
//     <div
//       className="rounded-xl p-4 text-center"
//       style={{
//         background: colors.surface,
//         border: `1px solid ${colors.border}`,
//       }}
//     >
//       <div className="text-xs" style={{ color: colors.textSecondary }}>
//         {label}
//       </div>

//       <div
//         className="text-xl font-bold mt-1"
//         style={{ color: colors.textPrimary }}
//       >
//         {users}
//       </div>

//       {conversion && (
//         <div className="text-xs mt-1" style={{ color: colors.success }}>
//           {conversion}
//         </div>
//       )}
//     </div>
//   );
// }

// /* =======================
//    MAIN ANALYTICS PAGE
// ======================= */

// interface FunnelData {
//   signup: {
//     users: number;
//     conversionToAssessmentStart: number;
//   };
//   assessmentStarted: {
//     users: number;
//     conversionToAssessmentComplete: number;
//   };
//   assessmentCompleted: {
//     users: number;
//     conversionToCaseStudy: number;
//   };
//   caseStudyStarted: {
//     users: number;
//   };
// }

// export default function Analytics() {
//   const [loading, setLoading] = useState(true);
  
//   const [caseMetrics, setCaseMetrics] = useState({
//     avgStarted: "--",
//     avgCompleted: "--",
//     completionRate: "--",
//     avgTime: "--",
//   });

//   const [funnelData, setFunnelData] = useState<FunnelData | null>(null);

//   useEffect(() => {
//     const fetchAllMetrics = async () => {
//       try {
//         // Fetch both case study metrics and funnel metrics in parallel
//         const [
//           avgStartedRes,
//           avgCompletedRes,
//           completionRateRes,
//           avgTimeRes,
//           funnelRes, 
//         ] = await Promise.all([
//           API("get", URL_PATH.avgCaseStudyStartedPerUser),
//           API("get", URL_PATH.avgCaseStudyStartedCompletedPerUser),
//           API("get", URL_PATH.caseStudyCompletionRate),
//           API("get", URL_PATH.avgTimePerCase),
//           API("get", URL_PATH.funnelMetrics),
//           API("get", URL_PATH.totalUser)
//         ]);

//         // Process case study metrics
//         const avgTimeMinutes = avgTimeRes?.data?.[0]?.avgTimeMinutes ?? 0;

//         setCaseMetrics({
//           avgStarted: avgStartedRes.avgCaseStudiesPerUser?.toFixed(2) ?? "0",
//           avgCompleted:
//             avgCompletedRes.data.averageCompletedPerUser?.toFixed(2) ?? "0",
//           completionRate:
//             `${completionRateRes.data.completionRate?.toFixed(1)}%`,
//           avgTime: `${avgTimeMinutes.toFixed(2)} min`,
//         });

//         // Process funnel metrics
//         if (funnelRes.success && funnelRes.funnel) {
//           setFunnelData(funnelRes.funnel);
//         }
//       } catch (err) {
//         console.error("❌ Analytics load failed", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllMetrics();
//   }, []);

//   return (
//     <div className="space-y-6">
//       {/* PAGE TITLE */}
//       <div>
//         <h1
//           className="text-xl font-semibold"
//           style={{ color: colors.textPrimary }}
//         >
//           Analytics
//         </h1>
//         <p
//           className="text-sm mt-1"
//           style={{ color: colors.textSecondary }}
//         >
//           Funnel metrics and Case study performance
//         </p>
//       </div>

//       {/* FUNNEL METRICS */}
//       <div
//         className="rounded-xl p-5"
//         style={{
//           background: colors.surface,
//           border: `1px solid ${colors.border}`,
//         }}
//       >
//         <div className="flex items-center gap-2 mb-4">
//           <FeatherBarChart2 style={{ color: colors.primary }} />
//           <h2 className="font-semibold" style={{ color: colors.textPrimary }}>
//             Funnel Metrics
//           </h2>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
//           {/* Show only the 3 steps from API */}
//           <FunnelStep 
//             label="Signup" 
//             users={funnelData ? funnelData.signup.users : "..."} 
//           />
//           <FunnelStep 
//             label="Assessment" 
//             users={funnelData ? funnelData.assessmentStarted.users : "..."} 
//             conversion={funnelData ? `${funnelData.signup.conversionToAssessmentStart.toFixed(1)}%` : "..."}
//           />
//           <FunnelStep 
//             label="Case Study" 
//             users={funnelData ? funnelData.caseStudyStarted.users : "..."} 
//             conversion={funnelData ? `${funnelData.assessmentCompleted.conversionToCaseStudy.toFixed(1)}%` : "..."}
//           />
          
//           {/* Keep the other 3 steps as placeholders (not from API) */}
//           <FunnelStep label="Landing" users={10000} />
//           <FunnelStep label="Onboarding" users={4800} conversion="77%" />
//           <FunnelStep label="Dashboard" users={3200} conversion="82%" />
//         </div>
//       </div>

//       {/* CASE STUDY METRICS */}
//       <div
//         className="rounded-xl p-5"
//         style={{
//           background: colors.surface,
//           border: `1px solid ${colors.border}`,
//         }}
//       >
//         <div className="flex items-center gap-2 mb-4">
//           <FeatherTrendingUp style={{ color: colors.primary }} />
//           <h2 className="font-semibold" style={{ color: colors.textPrimary }}>
//             Case Study Metrics
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <StatCard
//             title="Avg Started / User"
//             value={loading ? "..." : caseMetrics.avgStarted}
//           />
//           <StatCard
//             title="Avg Completed / User"
//             value={loading ? "..." : caseMetrics.avgCompleted}
//           />
//           <StatCard
//             title="Completion Rate"
//             value={loading ? "..." : caseMetrics.completionRate}
//           />
//           <StatCard
//             title="Avg Time / Case Study"
//             value={loading ? "..." : caseMetrics.avgTime}
//           />
//         </div>
//       </div>
//       {/* ENGAGEMENT METRICS */}
//        <div
//         className="rounded-xl p-5"
//         style={{
//           background: colors.surface,
//           border: `1px solid ${colors.border}`,
//         }}
//       >
//         <div className="flex items-center gap-2 mb-4">
//           <FeatherUsers style={{ color: colors.primary }} />
//           <h2 className="font-semibold" style={{ color: colors.textPrimary }}>
//             Engagement Metrics
//           </h2>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           <StatCard title="Total Users" value="—" />
//           <StatCard title="Paying Users" value="—" />
//           <StatCard title="Daily Active Users" value="—" />
//           <StatCard title="Monthly Active Users" value="—" />
//           <StatCard title="New Users Today" value="—" />
//         </div>
//       </div>
//     </div>
//   );
// }

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

interface FunnelData {
  signup: {
    users: number;
    conversionToAssessmentStart: number;
  };
  assessmentStarted: {
    users: number;
    conversionToAssessmentComplete: number;
  };
  assessmentCompleted: {
    users: number;
    conversionToCaseStudy: number;
  };
  caseStudyStarted: {
    users: number;
  };
}

interface EngagementMetrics {
  totalUsers: number;
  payingUsers: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  newUsersToday: number;
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [engagementLoading, setEngagementLoading] = useState(true);
  
  const [caseMetrics, setCaseMetrics] = useState({
    avgStarted: "--",
    avgCompleted: "--",
    completionRate: "--",
    avgTime: "--",
  });

  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
  const [engagementData, setEngagementData] = useState<EngagementMetrics>({
    totalUsers: 0,
    payingUsers: 0,
    dailyActiveUsers: 0,
    monthlyActiveUsers: 0,
    newUsersToday: 0
  });

  useEffect(() => {
    const fetchAllMetrics = async () => {
      try {
        // Fetch case study metrics and funnel metrics in parallel
        const [
          avgStartedRes,
          avgCompletedRes,
          completionRateRes,
          avgTimeRes,
          funnelRes
        ] = await Promise.all([
          API("get", URL_PATH.avgCaseStudyStartedPerUser),
          API("get", URL_PATH.avgCaseStudyStartedCompletedPerUser),
          API("get", URL_PATH.caseStudyCompletionRate),
          API("get", URL_PATH.avgTimePerCase),
          API("get", URL_PATH.funnelMetrics)
        ]);

        // Process case study metrics
        const avgTimeMinutes = avgTimeRes?.data?.[0]?.avgTimeMinutes ?? 0;

        setCaseMetrics({
          avgStarted: avgStartedRes.avgCaseStudiesPerUser?.toFixed(2) ?? "0",
          avgCompleted:
            avgCompletedRes.data.averageCompletedPerUser?.toFixed(2) ?? "0",
          completionRate:
            `${completionRateRes.data.completionRate?.toFixed(1)}%`,
          avgTime: `${avgTimeMinutes.toFixed(2)} min`,
        });

        // Process funnel metrics
        if (funnelRes.success && funnelRes.funnel) {
          setFunnelData(funnelRes.funnel);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("❌ Case study & funnel metrics load failed", err);
        setLoading(false);
      }
    };

    fetchAllMetrics();
  }, []);

  useEffect(() => {
    const fetchEngagementMetrics = async () => {
      try {
        // Fetch all engagement metrics in parallel
        const [
          totalUsersRes,
          payingUsersRes,
          dailyActiveRes,
          monthlyActiveRes,
          newUsersRes
        ] = await Promise.all([
          API("get", URL_PATH.totalUser),
          API("get", URL_PATH.payingUser),
          API("get", URL_PATH.dailyActiveUser),
          API("get", URL_PATH.monthlyActiveUser),
          API("get", URL_PATH.newUser)
        ]);

        setEngagementData({
          totalUsers: totalUsersRes.count,
          payingUsers: payingUsersRes.totalPayingUsers,
          dailyActiveUsers: dailyActiveRes.dailyActiveUser,
          monthlyActiveUsers: monthlyActiveRes.monthlyActiveUsers,
          newUsersToday: newUsersRes.newUsersToday,
        });
      } catch (err) {
        console.error("❌ Engagement metrics load failed", err);
      } finally {
        setEngagementLoading(false);
      }
    };

    fetchEngagementMetrics();
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

      {/* FUNNEL METRICS */}
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
          {/* Show only the 3 steps from API */}
          <FunnelStep 
            label="Signup" 
            users={funnelData ? funnelData.signup.users : "..."} 
          />
          <FunnelStep 
            label="Assessment" 
            users={funnelData ? funnelData.assessmentStarted.users : "..."} 
            conversion={funnelData ? `${funnelData.signup.conversionToAssessmentStart.toFixed(1)}%` : "..."}
          />
          <FunnelStep 
            label="Case Study" 
            users={funnelData ? funnelData.caseStudyStarted.users : "..."} 
            conversion={funnelData ? `${funnelData.assessmentCompleted.conversionToCaseStudy.toFixed(1)}%` : "..."}
          />
          
          {/* Keep the other 3 steps as placeholders (not from API) */}
          <FunnelStep label="Landing" users={10000} />
          <FunnelStep label="Onboarding" users={4800} conversion="77%" />
          <FunnelStep label="Dashboard" users={3200} conversion="82%" />
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
      <div
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
          <StatCard 
            title="Total Users" 
            value={engagementLoading ? "..." : engagementData.totalUsers} 
          />
          <StatCard 
            title="Paying Users" 
            value={engagementLoading ? "..." : engagementData.payingUsers} 
          />
          <StatCard 
            title="Daily Active Users" 
            value={engagementLoading ? "..." : engagementData.dailyActiveUsers} 
          />
          <StatCard 
            title="Monthly Active Users" 
            value={engagementLoading ? "..." : engagementData.monthlyActiveUsers} 
          />
          <StatCard 
            title="New Users Today" 
            value={engagementLoading ? "..." : engagementData.newUsersToday} 
          />
        </div>
      </div>
    </div>
  );
}
