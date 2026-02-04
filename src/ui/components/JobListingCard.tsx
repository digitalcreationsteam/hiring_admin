"use client";
/*
 * Documentation:
 * Avatar — https://app.subframe.com/3f5af6112821/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 * JobListingCard — https://app.subframe.com/3f5af6112821/library?component=JobListingCard_818a08ba-77f6-4495-8f49-09605aa1e17a
 */

import React from "react";
import * as SubframeUtils from "../utils";
import { Avatar } from "./Avatar";

interface JobListingCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName?: React.ReactNode;
  jobTitle?: React.ReactNode;
  location?: React.ReactNode;
  salary?: React.ReactNode;
  postedDate?: React.ReactNode;
  visaStatus?: React.ReactNode;
  experience?: React.ReactNode;
  tags?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const JobListingCardRoot = React.forwardRef<
  HTMLDivElement,
  JobListingCardRootProps
>(function JobListingCardRoot(
  {
    companyName,
    jobTitle,
    location,
    salary,
    postedDate,
    visaStatus,
    experience,
    tags,
    actions,
    children,
    className,
    ...otherProps
  }: JobListingCardRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-start gap-4 px-1 py-1",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full items-center gap-4">
        <Avatar
          variant="neutral"
          size="large"
          image="https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=64&h=64&fit=crop"
          square={true}
        >
          T
        </Avatar>
        <div className="flex grow shrink-0 basis-0 flex-col items-start justify-center gap-1">
          {companyName ? (
            <span className="w-full text-caption font-caption text-neutral-400">
              {companyName}
            </span>
          ) : null}
          {jobTitle ? (
            <span className="w-full text-heading-3 font-heading-3 text-neutral-800">
              {jobTitle}
            </span>
          ) : null}
        </div>
      </div>
      {children ? (
        <div className="flex w-full flex-wrap items-center gap-4">
          {children}
        </div>
      ) : null}
      <div className="flex w-full flex-wrap items-center gap-2">
        {tags ? (
          <div className="flex flex-wrap items-center gap-2">{tags}</div>
        ) : null}
      </div>
      <div className="flex w-full items-center gap-1">
        {actions ? (
          <div className="flex grow shrink-0 basis-0 items-center gap-1">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export const JobListingCard = JobListingCardRoot;
