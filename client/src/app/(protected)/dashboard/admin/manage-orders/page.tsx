"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Order } from "@/types";
import Link from "next/link";
import {
  FiChevronRight,
  FiHome,
  FiShoppingBag,
  FiSearch,
  FiRefreshCw,
  FiLoader,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiTrendingUp,
  FiTruck,
} from "react-icons/fi";
import { RiLoader4Line } from "react-icons/ri";

export default function ManageOrdersPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await api.get<Order[]>("/orders");
    if (res.success && res.data) {
      setOrders(res.data);
    } else {
      setError(res.error || "Failed to load orders.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session?.user && isAdmin) {
      fetchOrders();
    }
  }, [session, isAdmin, fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingId(orderId);
    const res = await api.patch<Order>(`/orders/${orderId}`, { status: newStatus });
    setUpdatingId(null);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast("success", `Order #${orderId.slice(-6).toUpperCase()} updated to ${newStatus}.`);
    } else {
      showToast("error", res.error || "Failed to update order status.");
    }
  };

  // Live filter
  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.userId.toLowerCase().includes(q) ||
      o.items.some((item) => item.name.toLowerCase().includes(q))
    );
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Derive mini metrics
  const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const completedCount = orders.filter((o) => o.status === "delivered").length;

  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-xl animate-fadeIn ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <FiCheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <FiAlertTriangle className="h-4 w-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-text-neutral/50" aria-label="Breadcrumb">
        <Link href="/dashboard/admin" className="flex items-center gap-1 hover:text-primary transition-colors">
          <FiHome className="h-3 w-3" />
          Admin
        </Link>
        <FiChevronRight className="h-3 w-3" />
        <span className="text-text-neutral font-bold">Manage Orders</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bg-secondary pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10">
            <FiShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text-neutral">
              Manage Orders
            </h1>
            <p className="text-xs text-text-neutral/50 font-medium mt-0.5">
              Review checkout logs, verify transaction amounts, and manage fulfillment workflow.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary strip */}
      {!loading && !error && orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-bg-secondary bg-background p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-neutral/50">Total Processing Value</p>
              <p className="text-2xl font-black text-text-neutral mt-0.5">${totalSales.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500">
              <FiTrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="rounded-2xl border border-bg-secondary bg-background p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-neutral/50">Pending Fulfillment</p>
              <p className="text-2xl font-black text-amber-600 mt-0.5">{pendingCount} order{pendingCount !== 1 ? "s" : ""}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-500">
              <FiClock className="h-5 w-5" />
            </div>
          </div>
          <div className="rounded-2xl border border-bg-secondary bg-background p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-neutral/50">Delivered & Closed</p>
              <p className="text-2xl font-black text-purple-600 mt-0.5">{completedCount} order{completedCount !== 1 ? "s" : ""}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-500">
              <FiTruck className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}

      {/* Filter and search toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-neutral/30" />
          <input
            id="order-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, Customer, or Product..."
            className="w-full rounded-xl border border-bg-secondary bg-background pl-10 pr-4 py-2.5 text-sm font-medium text-text-neutral placeholder:text-text-neutral/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-bg-secondary bg-background px-4 py-2.5 text-xs font-bold text-text-neutral/60 hover:text-primary hover:bg-bg-secondary transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <FiRefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Table grid */}
      <div className="rounded-2xl border border-bg-secondary bg-background overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-2">
            <FiLoader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs font-semibold text-text-neutral/50">Compiling transactions catalogue...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
              <FiAlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-sm font-bold text-red-500">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-1 flex items-center gap-1.5 rounded-xl bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
            >
              <FiRefreshCw className="h-3.5 w-3.5" /> Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
            <div className="p-5 rounded-2xl bg-bg-secondary border border-bg-secondary text-text-neutral/20">
              <FiShoppingBag className="h-10 w-10" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-text-neutral">No orders located</p>
              <p className="text-xs text-text-neutral/50 font-medium max-w-xs leading-relaxed mt-0.5">
                Either no checkouts have occurred on the store, or your query parameter did not find matching matches.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-bg-secondary/40 border-b border-bg-secondary text-text-neutral/50 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Products Purchased</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date Placed</th>
                  <th className="px-6 py-4 text-right">Status / Step</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => {
                  const isUpdating = updatingId === o.id;
                  return (
                    <tr
                      key={o.id}
                      className="border-b border-bg-secondary/50 last:border-b-0 hover:bg-bg-secondary/10 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-4 font-mono font-bold text-text-neutral text-xs">
                        #{o.id.slice(-6).toUpperCase()}
                      </td>

                      {/* Customer ID */}
                      <td className="px-6 py-4 font-mono text-text-neutral/60 text-xs">
                        {o.userId.slice(-6).toUpperCase()}
                      </td>

                      {/* Product Name list */}
                      <td className="px-6 py-4 text-text-neutral font-medium">
                        <div className="space-y-0.5 max-w-xs">
                          {o.items.map((item, idx) => (
                            <p key={idx} className="truncate">
                              {item.name} <span className="text-text-neutral/40 font-semibold">x{item.qty}</span>
                            </p>
                          ))}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="px-6 py-4 font-extrabold text-text-neutral text-xs">
                        ${o.totalAmount.toFixed(2)}
                      </td>

                      {/* Created date */}
                      <td className="px-6 py-4 text-text-neutral/50 font-semibold">
                        {formatDate(o.createdAt)}
                      </td>

                      {/* Status / Step selection */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isUpdating && <RiLoader4Line className="h-4 w-4 animate-spin text-primary" />}
                          <select
                            value={o.status}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(o.id, e.target.value as Order["status"])}
                            className={`rounded-xl border border-bg-secondary bg-background px-3 py-1.5 text-xs font-bold text-text-neutral focus:border-primary focus:outline-none transition-all shadow-sm cursor-pointer ${
                              o.status === "delivered" ? "text-purple-600 border-purple-200 bg-purple-50/20" :
                              o.status === "shipped" ? "text-blue-600 border-blue-200 bg-blue-50/20" :
                              o.status === "paid" ? "text-green-600 border-green-200 bg-green-50/20" :
                              "text-amber-600 border-amber-200 bg-amber-50/20"
                            }`}
                          >
                            <option value="pending" className="text-amber-600 font-semibold">Pending</option>
                            <option value="paid" className="text-green-600 font-semibold">Paid</option>
                            <option value="shipped" className="text-blue-600 font-semibold">Shipped</option>
                            <option value="delivered" className="text-purple-600 font-semibold">Delivered</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
