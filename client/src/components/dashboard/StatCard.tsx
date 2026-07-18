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
    <div className="rounded-2xl border border-bg-secondary bg-background p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-neutral/50">
          {title}
        </p>
        <p className="text-3xl font-extrabold text-text-neutral">
          {value}
        </p>
      </div>
      <div className={`p-3 rounded-xl bg-bg-secondary/60 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
