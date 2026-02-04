"use client";
/*
 * Documentation:
 * Topbar with center search — https://app.subframe.com/3f5af6112821/library?component=Topbar+with+center+search_3bd79561-0143-4651-931b-3b7260b0b798
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface NavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const NavItem = React.forwardRef<HTMLDivElement, NavItemProps>(function NavItem(
  {
    selected = false,
    icon = null,
    children,
    className,
    ...otherProps
  }: NavItemProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "group/e5d1ce67 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-1 hover:bg-neutral-50 active:bg-neutral-100",
        {
          "bg-neutral-100 hover:bg-neutral-100 active:bg-neutral-50": selected,
        },
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {icon ? (
        <SubframeCore.IconWrapper
          className={SubframeUtils.twClassNames(
            "text-heading-3 font-heading-3 text-subtext-color",
            { "text-default-font": selected }
          )}
        >
          {icon}
        </SubframeCore.IconWrapper>
      ) : null}
      {children ? (
        <span
          className={SubframeUtils.twClassNames(
            "grow shrink-0 basis-0 text-body-bold font-body-bold text-subtext-color group-hover/e5d1ce67:text-subtext-color",
            {
              "text-default-font group-hover/e5d1ce67:text-default-font group-active/e5d1ce67:text-default-font":
                selected,
            }
          )}
        >
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface TopbarWithCenterSearchRootProps
  extends React.HTMLAttributes<HTMLElement> {
  leftSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}

const TopbarWithCenterSearchRoot = React.forwardRef<
  HTMLElement,
  TopbarWithCenterSearchRootProps
>(function TopbarWithCenterSearchRoot(
  {
    leftSlot,
    centerSlot,
    rightSlot,
    className,
    ...otherProps
  }: TopbarWithCenterSearchRootProps,
  ref
) {
  return (
    <nav
      className={SubframeUtils.twClassNames(
        "flex w-full items-center justify-center gap-4 bg-default-background px-6 py-6",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-320 flex-none items-center justify-center gap-4">
        {leftSlot ? (
          <div className="flex grow shrink-0 basis-0 items-center gap-6">
            {leftSlot}
          </div>
        ) : null}
        <div className="flex items-center justify-end gap-4">
          {centerSlot ? (
            <div className="flex w-52 flex-none items-center justify-center gap-4">
              {centerSlot}
            </div>
          ) : null}
          {rightSlot ? (
            <div className="flex items-center justify-end gap-2">
              {rightSlot}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
});

export const TopbarWithCenterSearch = Object.assign(
  TopbarWithCenterSearchRoot,
  {
    NavItem,
  }
);
