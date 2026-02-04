"use client";
/*
 * Documentation:
 * ProgressIndicator — https://app.subframe.com/3f5af6112821/library?component=ProgressIndicator_26ce6777-77f5-4478-bfc3-54d12a323ca3
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface ProgressIndicatorRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  currentValue?: React.ReactNode;
  maxValue?: React.ReactNode;
  progressBar?: React.ReactNode;
  className?: string;
}

const ProgressIndicatorRoot = React.forwardRef<
  HTMLDivElement,
  ProgressIndicatorRootProps
>(function ProgressIndicatorRoot(
  {
    currentValue,
    maxValue,
    progressBar,
    className,
    ...otherProps
  }: ProgressIndicatorRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-start gap-2",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex items-end justify-center gap-2">
        {currentValue ? (
          <span className="text-heading-2 font-heading-2 text-brand-600">
            {currentValue}
          </span>
        ) : null}
        <div className="flex items-center justify-center gap-1">
          <span className="text-heading-3 font-heading-3 text-neutral-400">
            /
          </span>
          {maxValue ? (
            <span className="text-heading-3 font-heading-3 text-neutral-400">
              {maxValue}
            </span>
          ) : null}
        </div>
      </div>
      {progressBar ? (
        <div className="flex w-full flex-col items-start gap-2">
          {progressBar}
        </div>
      ) : null}
    </div>
  );
});

export const ProgressIndicator = ProgressIndicatorRoot;
