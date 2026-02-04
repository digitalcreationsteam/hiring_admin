"use client";
/*
 * Documentation:
 * Line Chart — https://app.subframe.com/3f5af6112821/library?component=Line+Chart_22944dd2-3cdd-42fd-913a-1b11a3c1d16d
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface LineChartRootProps
  extends React.ComponentProps<typeof SubframeCore.LineChart> {
  className?: string;
}

const LineChartRoot = React.forwardRef<
  React.ElementRef<typeof SubframeCore.LineChart>,
  LineChartRootProps
>(function LineChartRoot(
  { className, ...otherProps }: LineChartRootProps,
  ref
) {
  return (
    <SubframeCore.LineChart
      className={SubframeUtils.twClassNames("h-80 w-full", className)}
      ref={ref}
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

export const LineChart = LineChartRoot;
