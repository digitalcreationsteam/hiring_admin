"use client";
/*
 * Documentation:
 * Area Chart — https://app.subframe.com/3f5af6112821/library?component=Area+Chart_8aa1e7b3-5db6-4a62-aa49-137ced21a231
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface AreaChartRootProps
  extends React.ComponentProps<typeof SubframeCore.AreaChart> {
  stacked?: boolean;
  className?: string;
}

const AreaChartRoot = React.forwardRef<
  React.ElementRef<typeof SubframeCore.AreaChart>,
  AreaChartRootProps
>(function AreaChartRoot(
  { stacked = false, className, ...otherProps }: AreaChartRootProps,
  ref
) {
  return (
    <SubframeCore.AreaChart
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

export const AreaChart = AreaChartRoot;
