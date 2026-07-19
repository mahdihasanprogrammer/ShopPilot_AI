"use client";

import { Order } from "@/types";

interface RecentOrdersTableProps {
  orders: Order[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const getStatusBadge = (status: Order["status"]) => {
    const styles = {
      pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      paid: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
      shipped: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      delivered: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold border capitalize tracking-wider ${styles[status]}`}>
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
      <div className="card-premium border-dashed p-10 text-center text-text-neutral/40 text-xs font-semibold">
        No orders placed yet.
      </div>
    );
  }

  return (
    <div className="card-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-black/[0.01] border-b border-black/[0.04] text-text-neutral/40 font-bold uppercase tracking-wider text-[10px]">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-black/[0.03] last:border-b-0 hover:bg-black/[0.01] transition-colors">
                <td className="px-6 py-4.5 font-mono text-text-neutral font-bold">
                  #{o.id.slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4.5 text-text-neutral/70 font-semibold">
                  {formatDate(o.createdAt)}
                </td>
                <td className="px-6 py-4.5 text-text-neutral/70 font-semibold">
                  {o.items.reduce((acc, curr) => acc + curr.qty, 0)} items
                </td>
                <td className="px-6 py-4.5 text-text-neutral font-extrabold">
                  ${o.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4.5 text-right">
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
