"use client";
/*
 * Documentation:
 * Bar Chart — https://app.subframe.com/3f5af6112821/library?component=Bar+Chart_4d4f30e7-1869-4980-8b96-617df3b37912
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface BarChartRootProps
  extends React.ComponentProps<typeof SubframeCore.BarChart> {
  stacked?: boolean;
  className?: string;
}

const BarChartRoot = React.forwardRef<
  React.ElementRef<typeof SubframeCore.BarChart>,
  BarChartRootProps
>(function BarChartRoot(
  { stacked = false, className, ...otherProps }: BarChartRootProps,
  ref
) {
  return (
    <SubframeCore.BarChart
      className={SubframeUtils.twClassNames("h-80 w-full", className)}
      ref={ref}
      stacked={stacked}
      colors={[
        "#8b5cf6",
        "#ddd6fe",
        "#7c3aed",
        "#c4b5fd",
        "#6d28d9",
        "#a78bfa",
      ]}
      {...otherProps}
    />
  );
});

export const BarChart = BarChartRoot;
