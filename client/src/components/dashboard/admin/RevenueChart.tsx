"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useTheme } from "@/context/ThemeContext";

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center rounded-2xl border border-dashed border-border bg-card text-muted text-xs font-semibold">
        No revenue data compiled.
      </div>
    );
  }

  // Theme-aware colors for chart elements
  const gridStroke = isDark ? "#24344D" : "#E2E8F0";
  const axisColor = isDark ? "#94A3B8" : "#475569";
  const tooltipBg = isDark ? "#152238" : "#FFFFFF";
  const tooltipBorder = isDark ? "#24344D" : "#E2E8F0";
  const tooltipText = isDark ? "#F8FAFC" : "#1F2937";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
      <div>
        <h3 className="text-sm font-bold text-heading">Revenue Over Time</h3>
        <p className="text-xs text-muted mt-0.5">
          Sales growth and daily order volumes over the past 30 days.
        </p>
      </div>

      <div className="h-64 w-full text-xs font-semibold">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? "#818CF8" : "#4F46E5"} stopOpacity={0.35} />
                <stop offset="95%" stopColor={isDark ? "#818CF8" : "#4F46E5"} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke={axisColor}
              opacity={0.8}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={formatCurrency}
              stroke={axisColor}
              opacity={0.8}
              axisLine={false}
              tickLine={false}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderRadius: "12px",
                borderColor: tooltipBorder,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                color: tooltipText,
              }}
              formatter={(value: any, name: any) => [
                name === "revenue" ? formatCurrency(Number(value)) : value,
                name === "revenue" ? "Revenue" : "Orders Count",
              ]}
              labelFormatter={(label) => formatDate(String(label))}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={isDark ? "#818CF8" : "#4F46E5"}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revenueGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
