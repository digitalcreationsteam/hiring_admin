// src/screens/admin/Analytics.tsx
import React from "react";
import { colors } from "../common/colors";
import {
  FeatherTrendingUp,
  FeatherUsers,
  FeatherActivity,
  FeatherBarChart2,
} from "@subframe/core";

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
  users: number;
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

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          Funnel metrics, engagement data, and case study performance
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
          <StatCard title="Avg Started / User" value="2.4" />
          <StatCard title="Avg Completed / User" value="1.7" />
          <StatCard title="Completion Rate" value="71%" />
          <StatCard title="Avg Time / Case Study" value="12m 20s" />
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
          <StatCard title="Total Users" value="5,421" />
          <StatCard title="Paying Users" value="1,204" />
          <StatCard title="Daily Active Users" value="324" />
          <StatCard title="Monthly Active Users" value="2,842" />
          <StatCard title="New Users Today" value="47" />
        </div>
      </div>
    </div>
  );
}
