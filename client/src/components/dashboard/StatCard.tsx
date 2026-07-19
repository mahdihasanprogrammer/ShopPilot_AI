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
    <div className="card-premium p-7 flex items-center justify-between">
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-neutral/40">
          {title}
        </p>
        <p className="text-3xl font-black text-text-neutral tracking-tight">
          {value}
        </p>
      </div>
      <div className={`p-3.5 rounded-2xl bg-black/[0.02] ${color}`}>
        <Icon className="h-5.5 w-5.5" />
      </div>
    </div>
  );
}
