import React, { useMemo, useState } from "react";
import { FeatherMenu, FeatherSearch } from "@subframe/core";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || "A";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}

export default function AdminTopHeader({
  adminName,
  onSearch,
}: {
  adminName?: string;
  onSearch?: (q: string) => void;
}) {
  const [q, setQ] = useState("");

  const name = adminName || "Admin";
  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        {/* Left: burger + search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            type="button"
            className="h-11 w-11 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center"
            // optional: hook to sidebar collapse later
            onClick={() => {}}
          >
            <FeatherMenu className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-2 flex-1 max-w-xl bg-slate-100 rounded-2xl px-4 h-11">
            <FeatherSearch className="w-5 h-5 text-slate-500" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder="Search"
              className="bg-transparent outline-none w-full text-sm text-slate-700 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Right: admin name + avatar initials */}
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight hidden sm:block">
            <div className="text-sm font-semibold text-slate-900">{name}</div>
            <div className="text-xs text-slate-500">Admin</div>
          </div>

          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-700">
            {initials}
          </div>
        </div>
      </div>
    </div>
  );
}
