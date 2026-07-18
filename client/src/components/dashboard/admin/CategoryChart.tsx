"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

const COLORS = ["#7c3aed", "#06b6d4", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6"];

export default function CategoryChart({ data }: CategoryChartProps) {
  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center rounded-2xl border border-dashed border-bg-secondary bg-background text-text-neutral/50 text-xs font-semibold">
        No category sales data compiled.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-bg-secondary bg-background p-6 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
      <div>
        <h3 className="text-sm font-bold text-text-neutral">Sales by Category</h3>
        <p className="text-xs text-text-neutral/50 mt-0.5">
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
                backgroundColor: "#fff",
                borderRadius: "12px",
                borderColor: "#f3f0fa",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                color: "#1f2937",
              }}
              formatter={(value: any) => [formatCurrency(Number(value)), "Sales"]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-[10px] text-text-neutral/70 capitalize leading-relaxed font-semibold">
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
