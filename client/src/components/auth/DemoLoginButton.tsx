"use client";

import { RiFlashlightFill } from "react-icons/ri";

interface DemoLoginButtonProps {
  onSelectRole: (role: "user" | "admin") => void;
  disabled?: boolean;
}

export default function DemoLoginButton({
  onSelectRole,
  disabled = false,
}: DemoLoginButtonProps) {
  return (
    <div className="rounded-xl bg-bg-secondary/50 border border-bg-secondary p-4 space-y-3">
      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-text-neutral/70 uppercase tracking-wider">
        <RiFlashlightFill className="h-3.5 w-3.5 text-accent" />
        <span>Demo Access Accounts</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelectRole("user")}
          disabled={disabled}
          className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50"
        >
          Demo User
        </button>
        <button
          type="button"
          onClick={() => onSelectRole("admin")}
          disabled={disabled}
          className="rounded-lg bg-accent/10 px-3 py-2 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all duration-300 disabled:opacity-50"
        >
          Demo Admin
        </button>
      </div>
      <p className="text-[10px] text-text-neutral/50 text-center">
        Clicks will auto-fill credentials and submit login.
      </p>
    </div>
  );
}
