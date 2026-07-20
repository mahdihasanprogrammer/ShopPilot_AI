"use client";

import { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: IconType;
  color?: string;
}

export default function StatCard({ title, value, icon: Icon, color = "text-primary" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-border-hover transition-all duration-200">
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
          {title}
        </p>
        <p className="text-3xl font-black text-heading tracking-tight">
          {value}
        </p>
      </div>
      <div className={`p-3.5 rounded-2xl bg-surface border border-border ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
