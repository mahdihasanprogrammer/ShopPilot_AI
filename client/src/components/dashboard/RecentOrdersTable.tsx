"use client";

import { Order } from "@/types";

interface RecentOrdersTableProps {
  orders: Order[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const getStatusBadge = (status: Order["status"]) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      paid: "bg-green-50 text-green-700 border-green-200",
      shipped: "bg-blue-50 text-blue-700 border-blue-200",
      delivered: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${styles[status]}`}>
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
      <div className="rounded-2xl border border-dashed border-bg-secondary p-8 text-center text-text-neutral/50 text-xs font-semibold">
        No orders placed yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-bg-secondary bg-background overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-bg-secondary/40 border-b border-bg-secondary text-text-neutral/50 font-bold uppercase tracking-wider">
              <th className="px-6 py-3.5">Order ID</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Items</th>
              <th className="px-6 py-3.5">Total Amount</th>
              <th className="px-6 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-bg-secondary/50 last:border-b-0 hover:bg-bg-secondary/10 transition-colors">
                <td className="px-6 py-4 font-mono text-text-neutral font-semibold">
                  #{o.id.slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4 text-text-neutral/70 font-medium">
                  {formatDate(o.createdAt)}
                </td>
                <td className="px-6 py-4 text-text-neutral/70 font-medium">
                  {o.items.reduce((acc, curr) => acc + curr.qty, 0)} items
                </td>
                <td className="px-6 py-4 text-text-neutral font-bold">
                  ${o.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  {getStatusBadge(o.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
