"use client";

import { Order } from "@/types";

interface RecentOrdersTableProps {
  orders: Order[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const getStatusBadge = (status: Order["status"]) => {
    const styles: Record<string, string> = {
      pending:   "bg-amber-50  text-amber-700  border-amber-200",
      paid:      "bg-emerald-50 text-emerald-700 border-emerald-200",
      shipped:   "bg-blue-50   text-blue-700   border-blue-200",
      delivered: "bg-purple-50 text-purple-700  border-purple-200",
      cancelled: "bg-red-50    text-red-600     border-red-200",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border capitalize tracking-wider ${
          styles[status] ?? "bg-surface text-muted border-border"
        }`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted text-sm font-semibold">
        No orders placed yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-surface border-b border-border text-muted font-bold uppercase tracking-wider text-[10px]">
              <th className="px-5 py-3.5 whitespace-nowrap">Order ID</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Date</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Items</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Total</th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const orderId = o.id || (o as any)._id || "";
              const formattedId = orderId ? String(orderId).slice(-6).toUpperCase() : "N/A";
              return (
                <tr
                  key={orderId}
                  className="border-b border-border last:border-b-0 hover:bg-surface transition-colors"
                >
                  <td className="px-5 py-4 font-mono text-heading font-bold text-xs">
                    #{formattedId}
                  </td>
                  <td className="px-5 py-4 text-body text-xs font-medium">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-body text-xs font-medium">
                    {o.items.reduce((acc, curr) => acc + curr.qty, 0)} items
                  </td>
                  <td className="px-5 py-4 text-xs font-extrabold" style={{ color: "var(--secondary)" }}>
                    ${o.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {getStatusBadge(o.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
