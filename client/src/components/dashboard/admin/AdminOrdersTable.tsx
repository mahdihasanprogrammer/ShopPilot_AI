"use client";

import { useState } from "react";
import { Order } from "@/types";
import { RiLoader4Line } from "react-icons/ri";

interface AdminOrdersTableProps {
  orders: Order[];
  onStatusUpdate: (orderId: string, newStatus: Order["status"]) => Promise<void>;
}

export default function AdminOrdersTable({ orders, onStatusUpdate }: AdminOrdersTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingId(orderId);
    try {
      await onStatusUpdate(orderId, newStatus);
    } finally {
      setUpdatingId(null);
    }
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
      <div className="rounded-2xl border border-dashed border-bg-secondary p-8 text-center text-text-neutral/50 text-xs font-semibold bg-background animate-fadeIn">
        No orders have been placed on the platform yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-bg-secondary bg-background overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-bg-secondary/40 border-b border-bg-secondary text-text-neutral/50 font-bold uppercase tracking-wider">
              <th className="px-6 py-3.5">Order ID</th>
              <th className="px-6 py-3.5">User ID</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Total Amount</th>
              <th className="px-6 py-3.5 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const isUpdating = updatingId === o.id;
              return (
                <tr key={o.id} className="border-b border-bg-secondary/50 last:border-b-0 hover:bg-bg-secondary/10 transition-colors">
                  <td className="px-6 py-4 font-mono text-text-neutral font-semibold">
                    #{o.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 font-mono text-text-neutral/60">
                    {o.userId.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-text-neutral/70 font-medium">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-text-neutral font-bold">
                    ${o.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2.5">
                    {isUpdating && <RiLoader4Line className="h-4 w-4 animate-spin text-primary" />}
                    <select
                      value={o.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as Order["status"])}
                      className={`rounded-xl border border-bg-secondary bg-background px-3 py-1.5 text-xs font-bold text-text-neutral focus:border-primary focus:outline-none transition-all shadow-sm ${
                        o.status === "delivered" ? "text-purple-600 border-purple-200" :
                        o.status === "shipped" ? "text-blue-600 border-blue-200" :
                        o.status === "paid" ? "text-green-600 border-green-200" :
                        "text-amber-600 border-amber-200"
                      }`}
                    >
                      <option value="pending" className="text-amber-600 font-semibold">Pending</option>
                      <option value="paid" className="text-green-600 font-semibold">Paid</option>
                      <option value="shipped" className="text-blue-600 font-semibold">Shipped</option>
                      <option value="delivered" className="text-purple-600 font-semibold">Delivered</option>
                    </select>
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
