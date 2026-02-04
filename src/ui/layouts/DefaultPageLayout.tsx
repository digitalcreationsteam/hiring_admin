"use client";
/*
 * Documentation:
 * Avatar — https://app.subframe.com/3f5af6112821/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 * Default Page Layout — https://app.subframe.com/3f5af6112821/library?component=Default+Page+Layout_a57b1c43-310a-493f-b807-8cc88e2452cf
 * Dropdown Menu — https://app.subframe.com/3f5af6112821/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 * Text Field — https://app.subframe.com/3f5af6112821/library?component=Text+Field_be48ca43-f8e7-4c0e-8870-d219ea11abfe
 * Topbar with center search — https://app.subframe.com/3f5af6112821/library?component=Topbar+with+center+search_3bd79561-0143-4651-931b-3b7260b0b798
 */

import React from "react";
import { FeatherLayoutDashboard } from "@subframe/core";
import { FeatherLogOut } from "@subframe/core";
import { FeatherSearch } from "@subframe/core";
import { FeatherSettings } from "@subframe/core";
import { FeatherUser } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import { Avatar } from "../components/Avatar";
import { DropdownMenu } from "../components/DropdownMenu";
import { TextField } from "../components/TextField";
import { TopbarWithCenterSearch } from "../components/TopbarWithCenterSearch";
import * as SubframeUtils from "../utils";

interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DefaultPageLayoutRoot = React.forwardRef<
  HTMLDivElement,
  DefaultPageLayoutRootProps
>(function DefaultPageLayoutRoot(
  { children, className, ...otherProps }: DefaultPageLayoutRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex h-screen w-full flex-col items-center",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <TopbarWithCenterSearch
        leftSlot={
          <>
            <img
              className="h-6 flex-none object-cover"
              src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
            />
            <div className="flex items-center gap-2">
              <TopbarWithCenterSearch.NavItem
                selected={true}
                icon={<FeatherLayoutDashboard />}
              >
                Dashboard
              </TopbarWithCenterSearch.NavItem>
              <TopbarWithCenterSearch.NavItem>
                Job Board
              </TopbarWithCenterSearch.NavItem>
              <TopbarWithCenterSearch.NavItem>
                Applications
              </TopbarWithCenterSearch.NavItem>
              <TopbarWithCenterSearch.NavItem>
                Improve Score
              </TopbarWithCenterSearch.NavItem>
            </div>
          </>
        }
        centerSlot={
          <TextField
            className="h-auto grow shrink-0 basis-0"
            variant="filled"
            label=""
            helpText=""
            icon={<FeatherSearch />}
          >
            <TextField.Input placeholder="Search" />
          </TextField>
        }
        rightSlot={
          <>
            <TopbarWithCenterSearch.NavItem>
              Messages
            </TopbarWithCenterSearch.NavItem>
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Avatar image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif">
                  A
                </Avatar>
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu>
                    <DropdownMenu.DropdownItem icon={<FeatherUser />}>
                      Profile
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherSettings />}>
                      Settings
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherLogOut />}>
                      Log out
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
          </>
        }
      />
      {children ? (
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 overflow-y-auto bg-default-background">
          {children}
        </div>
      ) : null}
    </div>
  );
});

export const DefaultPageLayout = DefaultPageLayoutRoot;