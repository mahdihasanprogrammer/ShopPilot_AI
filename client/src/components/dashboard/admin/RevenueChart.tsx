"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
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
      <div className="h-64 flex items-center justify-center rounded-2xl border border-dashed border-bg-secondary bg-background text-text-neutral/50 text-xs font-semibold">
        No revenue data compiled.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-bg-secondary bg-background p-6 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
      <div>
        <h3 className="text-sm font-bold text-text-neutral">Revenue Over Time</h3>
        <p className="text-xs text-text-neutral/50 mt-0.5">
          Sales growth and daily order volumes over the past 30 days.
        </p>
      </div>

      <div className="h-64 w-full text-xs font-semibold">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f0fa" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#1f2937"
              opacity={0.4}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={formatCurrency}
              stroke="#1f2937"
              opacity={0.4}
              axisLine={false}
              tickLine={false}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                borderColor: "#f3f0fa",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                color: "#1f2937",
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
              stroke="#7c3aed"
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
