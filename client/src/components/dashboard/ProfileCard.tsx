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

  const initial = user.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-all">
      {/* Header Profile Info Banner */}
      <div className="relative bg-gradient-to-r from-primary/10 to-accent/5 px-6 py-8 flex flex-col items-center text-center space-y-4 border-b border-border">
        {/* Avatar */}
        <div className="relative h-20 w-20 rounded-full border border-border bg-card overflow-hidden flex items-center justify-center shadow-sm">
          {user.image ? (
            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-extrabold text-primary">{initial}</span>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-heading">{user.name}</h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/[0.08] text-primary border border-primary/15">
            <FiShield className="h-3 w-3 shrink-0" />
            {user.role}
          </span>
        </div>
      </div>

      {/* Info Rows */}
      <div className="p-6 space-y-4 text-xs font-semibold">
        <div className="flex items-center gap-3.5 text-body bg-surface px-4 py-3 rounded-xl border border-border">
          <div className="p-2 rounded-lg bg-card border border-border text-body/50">
            <FiMail className="h-4 w-4 shrink-0" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-bold text-body/40 tracking-wider">Email Address</p>
            <p className="text-heading truncate font-bold mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 text-body bg-surface px-4 py-3 rounded-xl border border-border">
          <div className="p-2 rounded-lg bg-card border border-border text-body/50">
            <FiCalendar className="h-4 w-4 shrink-0" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-bold text-body/40 tracking-wider">Join Date</p>
            <p className="text-heading font-bold mt-0.5">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
