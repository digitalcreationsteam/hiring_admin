

// AdminDashboardRight.tsx - Updated with your color palette
"use client";
import React, { useEffect, useState } from "react";
import API from "../common/API";
import { URL_PATH } from "../common/URL_PATH";
import { colors } from "../common/colors";
import LocationFilter from "../ui/components/LocationFilter";
import { 
  FeatherUsers, 
  FeatherUser, 
  FeatherBriefcase, 
  FeatherActivity,
  FeatherTrendingUp,
  FeatherFileText
} from "@subframe/core";

interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalRecruiters: number;
}

export default function AdminDashboardRight() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalStudents: 0,
    totalRecruiters: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // console.log("AdminDashboardRight Component Rendered");

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const statsRes = await API("GET", URL_PATH.adminStats);
  //       console.log(statsRes);
  //       if (statsRes?.success && statsRes?.data) {
  //         setStats(statsRes.data);
  //       } else if (statsRes?.success && Array.isArray(statsRes?.stats)) {
  //         let students = 0;
  //         let recruiters = 0;

  //         statsRes.stats.forEach((x: any) => {
  //           if (x._id === "student") students = x.count;
  //           if (x._id === "recruiter") recruiters = x.count;
  //         });

  //         setStats({
  //           totalUsers: students + recruiters,
  //           totalStudents: students,
  //           totalRecruiters: recruiters,
  //         });
  //       }
  //     } catch (err) {
  //       console.error("Dashboard fetch error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
  (async () => {
    try {
      const statsRes = await API("GET", URL_PATH.adminStats);
      console.log("Admin Stats Response:", statsRes);

      if (statsRes?.success) {
        let students = 0;
        let recruiters = 0;

        if (Array.isArray(statsRes?.stats)) {
          statsRes.stats.forEach((x: any) => {
            if (x._id === "student") students = x.count;
            if (x._id === "recruiter") recruiters = x.count;
          });
        }

        setStats({
          totalUsers: statsRes.count || 0,   // 👈 using backend count
          totalStudents: students,
          totalRecruiters: recruiters,
        });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  })();
}, []);


  const StatCard = ({ 
    title, 
    value, 
    icon, 
    trend, 
    description 
  }: { 
    title: string; 
    value: number; 
    icon: React.ReactNode;
    trend?: string;
    description?: string;
  }) => (
    <div
      className="rounded-xl p-5 transition-all duration-300 hover:shadow-lg"
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>
            {icon}
            <span>{title}</span>
          </div>
          <div className="text-2xl font-bold mt-2" style={{ color: colors.textPrimary }}>
            {loading ? "..." : value.toLocaleString()}
          </div>
          {description && (
            <div className="text-xs mt-1" style={{ color: colors.textTertiary }}>
              {description}
            </div>
          )}
        </div>
        {trend && (
          <div className={`text-xs px-2 py-1 rounded-full ${
            trend.startsWith('+') 
              ? `bg-[${colors.success}10] text-[${colors.success}]` 
              : `bg-[${colors.error}10] text-[${colors.error}]`
          }`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );

  const ActivityItem = ({ activity }: { activity: any }) => (
    <div className="flex items-start gap-3 py-3 border-b last:border-0" style={{ borderColor: colors.border }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mt-1" style={{ background: `${colors.primary}10` }}>
        {activity.icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
          {activity.title}
        </div>
        <div className="text-xs mt-1" style={{ color: colors.textTertiary }}>
          {activity.description}
        </div>
      </div>
      <div className="text-xs whitespace-nowrap" style={{ color: colors.textTertiary }}>
        {activity.time}
      </div>
    </div>
  );

  return (
    <div className="px-0 py-0 md:px-0 min-h-screen" style={{ background: colors.background }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
          </div>
          {/* <div className="text-xs px-3 py-1.5 rounded-full" style={{ background: `${colors.primary}10`, color: colors.primary }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div> */}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<FeatherUsers className="w-4 h-4" style={{ color: colors.primary }} />}
            // trend="+12%"
            description="Active users"
          />
          <StatCard 
            title="Students" 
            value={stats.totalStudents} 
            icon={<FeatherUser className="w-4 h-4" style={{ color: colors.primary }} />}
            description="Registered candidates"
          />
          <StatCard 
            title="Recruiters" 
            value={stats.totalRecruiters} 
            icon={<FeatherBriefcase className="w-4 h-4" style={{ color: colors.primary }} />}
            // trend="+5%"
            description="Company partners"
          />
        </div>
      </div>

      
      {/* =======================================
          LOCATION FILTER SECTION - RESPONSIVE
          ======================================= */}
      <div className="mb-8">
        <LocationFilter
          onFilterChange={(data) => {
            // Optional: Handle location filter changes
            console.log("Location stats updated:", data);
          }}
          showResults={true}
        />
      </div>
      
      {/* Activity & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div 
          className="lg:col-span-2 rounded-xl p-5"
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: colors.textPrimary }}>Recent Activity</h3>
            <button className="text-xs font-medium" style={{ color: colors.primary }}>
              View all →
            </button>
          </div>
          
          <div className="space-y-1">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="text-center py-8" style={{ color: colors.textTertiary }}>
                <FeatherActivity className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: colors.secondary }} />
                <p className="text-sm">No recent activity</p>
                <p className="text-xs mt-1">Activity will appear here as users interact</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {/* <div className="space-y-4">
          <div 
            className="rounded-xl p-5"
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${colors.primary}10` }}>
                <FeatherTrendingUp className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
              <h3 className="font-semibold" style={{ color: colors.textPrimary }}>Performance</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs" style={{ color: colors.textTertiary }}>Avg. Response Time</div>
                <div className="text-lg font-semibold" style={{ color: colors.textPrimary }}>2.4s</div>
              </div>
              <div>
                <div className="text-xs" style={{ color: colors.textTertiary }}>Uptime</div>
                <div className="text-lg font-semibold" style={{ color: colors.textPrimary }}>99.9%</div>
              </div>
            </div>
          </div>

          <div 
            className="rounded-xl p-5"
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${colors.success}10` }}>
                <FeatherFileText className="w-4 h-4" style={{ color: colors.success }} />
              </div>
              <h3 className="font-semibold" style={{ color: colors.textPrimary }}>Documents</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs" style={{ color: colors.textTertiary }}>Pending Reviews</div>
                <div className="text-lg font-semibold" style={{ color: colors.textPrimary }}>12</div>
              </div>
              <button className="w-full text-sm font-medium py-2 rounded-lg transition-colors" 
                style={{ 
                  background: `${colors.primary}10`,
                  color: colors.primary 
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${colors.primary}20`}
                onMouseLeave={(e) => e.currentTarget.style.background = `${colors.primary}10`}
              >
                Review Documents
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {/* System Status */}
      {/* <div 
        className="mt-6 rounded-xl p-5"
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'}`} />
            <div>
              <div className="font-medium" style={{ color: colors.textPrimary }}>
                System Status: {loading ? 'Loading...' : 'All systems operational'}
              </div>
              <div className="text-xs" style={{ color: colors.textTertiary }}>
                Last checked: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          <div className="text-xs" style={{ color: colors.textTertiary }}>
            API: Online • Database: Connected • Cache: Active
          </div>
        </div>
      </div> */}
    </div>
  );
}