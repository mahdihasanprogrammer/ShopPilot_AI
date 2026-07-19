"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Order } from "@/types";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import Link from "next/link";
import { FiChevronRight, FiHome, FiShoppingBag, FiLoader } from "react-icons/fi";

export default function UserOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const res = await api.get<Order[]>("/orders");
      if (res.success && res.data) {
        setOrders(res.data);
      }
      setLoading(false);
    }
    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-5xl mx-auto w-full space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-text-neutral/50" aria-label="Breadcrumb">
        <Link href="/dashboard/user" className="flex items-center gap-1 hover:text-primary transition-colors">
          <FiHome className="h-3 w-3" />
          Dashboard
        </Link>
        <FiChevronRight className="h-3 w-3" />
        <span className="text-text-neutral font-bold">My Orders</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bg-secondary pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10">
            <FiShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text-neutral">
              Purchase History
            </h1>
            <p className="text-xs text-text-neutral/50 font-medium mt-0.5">
              Review transaction receipts, shipment tracking state, and delivery invoices.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2">
          <FiLoader className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs font-semibold text-text-neutral/50">Compiling transaction records...</p>
        </div>
      ) : (
        <RecentOrdersTable orders={orders} />
      )}
    </main>
  );
}
