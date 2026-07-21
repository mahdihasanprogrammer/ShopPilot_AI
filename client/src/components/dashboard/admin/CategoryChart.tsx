"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useTheme } from "@/context/ThemeContext";

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

const COLORS = ["#6366F1", "#14B8A6", "#F43F5E", "#10B981", "#F59E0B", "#3B82F6"];

export default function CategoryChart({ data }: CategoryChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center rounded-2xl border border-dashed border-border bg-card text-muted text-xs font-semibold">
        No category sales data compiled.
      </div>
    );
  }

  // Theme-aware tooltip styling
  const tooltipBg = isDark ? "#152238" : "#FFFFFF";
  const tooltipBorder = isDark ? "#24344D" : "#E2E8F0";
  const tooltipText = isDark ? "#F8FAFC" : "#1F2937";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
      <div>
        <h3 className="text-sm font-bold text-heading">Sales by Category</h3>
        <p className="text-xs text-muted mt-0.5">
          Revenue distribution across multiple shopping sectors.
        </p>
      </div>

      <div className="h-64 w-full text-xs font-semibold">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderRadius: "12px",
                borderColor: tooltipBorder,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                color: tooltipText,
              }}
              formatter={(value: any) => [formatCurrency(Number(value)), "Sales"]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-[10px] text-body capitalize leading-relaxed font-semibold">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
