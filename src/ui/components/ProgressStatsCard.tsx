"use client";
/*
 * Documentation:
 * ProgressStatsCard — https://app.subframe.com/3f5af6112821/library?component=ProgressStatsCard_6b09008a-45cd-43c2-8c51-8ffb41683c2a
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface ProgressStatsCardRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  easySolved?: React.ReactNode;
  mediumSolved?: React.ReactNode;
  hardSolved?: React.ReactNode;
  totalSolved?: React.ReactNode;
  totalProblems?: React.ReactNode;
  attemptingCount?: React.ReactNode;
  badgeCount?: React.ReactNode;
  badges?: React.ReactNode;
  recentBadgeName?: React.ReactNode;
  className?: string;
}

const ProgressStatsCardRoot = React.forwardRef<
  HTMLDivElement,
  ProgressStatsCardRootProps
>(function ProgressStatsCardRoot(
  {
    easySolved,
    mediumSolved,
    hardSolved,
    totalSolved,
    totalProblems,
    attemptingCount,
    badgeCount,
    badges,
    recentBadgeName,
    className,
    ...otherProps
  }: ProgressStatsCardRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm flex-wrap",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <div className="flex w-full items-center justify-center gap-8">
            <div className="flex flex-col items-end gap-1">
              <span className="text-caption-bold font-caption-bold text-[#34d399ff]">
                Easy
              </span>
              {easySolved ? (
                <span className="text-caption font-caption text-subtext-color">
                  {easySolved}
                </span>
              ) : null}
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="flex h-32 w-32 flex-none items-center justify-center px-4 py-4 relative">
                <div className="flex h-32 w-40 flex-none flex-col items-center justify-end rounded-full absolute border-8 border-solid border-t-[#34d399] border-r-[#facc15] border-b-transparent border-l-[#ef4444]" />
                <div className="flex flex-col items-center justify-center gap-1 relative z-10">
                  {totalSolved ? (
                    <span className="text-heading-1 font-heading-1 text-default-font">
                      {totalSolved}
                    </span>
                  ) : null}
                  {totalProblems ? (
                    <span className="text-body font-body text-subtext-color">
                      {totalProblems}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-caption-bold font-caption-bold text-[#facc15ff]">
                Medium
              </span>
              {mediumSolved ? (
                <span className="text-caption font-caption text-subtext-color">
                  {mediumSolved}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-caption-bold font-caption-bold text-[#ef4444ff]">
              Hard
            </span>
            {hardSolved ? (
              <span className="text-caption font-caption text-subtext-color">
                {hardSolved}
              </span>
            ) : null}
          </div>
          {attemptingCount ? (
            <span className="text-caption font-caption text-subtext-color">
              {attemptingCount}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex w-px flex-none flex-col items-center gap-2 self-stretch bg-neutral-border" />
      <div className="flex grow shrink-0 basis-0 flex-col items-start justify-between self-stretch">
        <div className="flex w-full flex-col items-start gap-2">
          <span className="text-body-bold font-body-bold text-default-font">
            Badges
          </span>
          {badgeCount ? (
            <span className="text-heading-1 font-heading-1 text-default-font">
              {badgeCount}
            </span>
          ) : null}
        </div>
        <div className="flex w-full grow shrink-0 basis-0 items-center gap-3">
          {badges ? (
            <div className="flex items-center gap-3">{badges}</div>
          ) : null}
        </div>
        <div className="flex w-full flex-col items-start gap-1">
          <span className="text-caption-bold font-caption-bold text-subtext-color">
            Most Recent Badge
          </span>
          {recentBadgeName ? (
            <span className="text-body font-body text-default-font">
              {recentBadgeName}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export const ProgressStatsCard = ProgressStatsCardRoot;
