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
    <div className="card-premium p-8 space-y-6">
      <div className="flex flex-col items-center text-center space-y-3.5 pb-5 border-b border-black/[0.04]">
        <div className="relative h-20 w-20 rounded-full border border-black/[0.06] bg-black/[0.02] overflow-hidden flex items-center justify-center">
          {user.image ? (
            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <FiUser className="h-10 w-10 text-text-neutral/20" />
          )}
        </div>
        <div>
          <h3 className="text-base font-extrabold text-text-neutral">{user.name}</h3>
          <span className="inline-flex items-center gap-1 rounded-md bg-black/[0.04] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-neutral/60 mt-1.5">
            <FiShield className="h-3 w-3 text-text-neutral/40" />
            {user.role}
          </span>
        </div>
      </div>

      <div className="space-y-4 text-xs font-medium">
        <div className="flex items-center gap-3 text-text-neutral/60">
          <FiMail className="h-4 w-4 shrink-0 text-text-neutral/30" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-text-neutral/60">
          <FiCalendar className="h-4 w-4 shrink-0 text-text-neutral/30" />
          <span>Member since {formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
