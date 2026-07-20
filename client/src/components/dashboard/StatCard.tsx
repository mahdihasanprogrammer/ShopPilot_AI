"use client";

import { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: IconType;
  color?: string;
  bgColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "text-primary",
  bgColor = "bg-primary/10",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm p-5 flex items-center justify-between gap-3 hover:shadow-md hover:border-border-hover transition-all">
      {/* Text block */}
      <div className="space-y-1 min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-body/50 truncate">
          {title}
        </p>
        <p className={`text-2xl font-extrabold tracking-tight truncate ${color}`}>
          {value}
        </p>
      </div>
      {/* Icon block */}
      <div className={`shrink-0 p-3 rounded-xl ${bgColor} ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
