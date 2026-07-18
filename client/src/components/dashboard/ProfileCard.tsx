"use client";

import { User } from "@/types";
import { FiUser, FiMail, FiShield, FiCalendar } from "react-icons/fi";

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-2xl border border-bg-secondary bg-background p-6 shadow-sm space-y-6 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-bg-secondary">
        <div className="relative h-20 w-20 rounded-full border-2 border-primary/20 bg-bg-secondary overflow-hidden flex items-center justify-center">
          {user.image ? (
            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <FiUser className="h-10 w-10 text-text-neutral/30" />
          )}
        </div>
        <div>
          <h3 className="text-base font-bold text-text-neutral">{user.name}</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary mt-1">
            <FiShield className="h-3 w-3" />
            {user.role}
          </span>
        </div>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="flex items-center gap-3 text-text-neutral/70">
          <FiMail className="h-4 w-4 shrink-0 text-text-neutral/40" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-text-neutral/70">
          <FiCalendar className="h-4 w-4 shrink-0 text-text-neutral/40" />
          <span>Member since {formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
