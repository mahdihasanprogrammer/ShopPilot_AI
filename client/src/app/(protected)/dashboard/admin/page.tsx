"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Order } from "@/types";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/admin/RevenueChart";
import CategoryChart from "@/components/dashboard/admin/CategoryChart";
import AdminOrdersTable from "@/components/dashboard/admin/AdminOrdersTable";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import { FiShoppingBag, FiLayers, FiDollarSign, FiUsers, FiPlus, FiGrid, FiArrowRight } from "react-icons/fi";
import { RiShieldUserLine } from "react-icons/ri";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();

  // Stats Metrics
  const [totalProducts, setTotalProducts] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Load flags
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      setLoadingStats(true);
      
      // 1. Fetch total products count from listing metadata
      const productsRes = await api.get<{ pagination: any }>("/products?limit=1");
      if (productsRes.success && productsRes.data) {
        setTotalProducts(productsRes.data.pagination.total);
      }

      // 2. Fetch all orders (admin role gets all user orders automatically)
      const ordersRes = await api.get<Order[]>("/orders");
      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data);
      }

      // 3. Fetch revenue analytics
      const revRes = await api.get<any>("/orders/analytics/revenue");
      if (revRes.success && revRes.data) {
        setRevenueData(revRes.data);
      }

      // 4. Fetch category sales distribution
      const catRes = await api.get<any>("/orders/analytics/by-category");
      if (catRes.success && catRes.data) {
        setCategoryData(catRes.data);
      }

      setLoadingStats(false);
    }

    if (session?.user && session.user.role === "admin") {
      fetchAdminData();
    }
  }, [session]);

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    const res = await api.patch<Order>(`/orders/${orderId}`, { status: newStatus });
    if (res.success && res.data) {
      // Sync list
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } else {
      alert(res.error || "Failed to update order status.");
    }
  };

  if (sessionPending || loadingStats) {
    return (
      <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-bg-secondary rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-bg-secondary rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 bg-bg-secondary rounded-2xl"></div>
          <div className="h-64 bg-bg-secondary rounded-2xl"></div>
        </div>
      </main>
    );
  }

  if (!session?.user || session.user.role !== "admin") return null;

  // Derive counts
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalUsersCount = new Set(orders.map((o) => o.userId)).size || 1; // Distinct customers count

  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-10">
      {/* Welcome & Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bg-secondary pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-neutral flex items-center gap-2">
            <RiShieldUserLine className="h-8 w-8 text-primary" />
            Admin Overview
          </h1>
          <p className="text-sm text-text-neutral/60 mt-1">
            Evaluate platform performance, monitor revenue, and update orders status.
          </p>
        </div>

        {/* Quick action controls */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => router.push("/dashboard/admin/manage-products")}
            className="flex items-center gap-1.5 rounded-xl border border-bg-secondary bg-background px-4 py-2.5 text-xs font-semibold text-text-neutral hover:bg-bg-secondary transition-all"
          >
            <FiGrid className="h-4 w-4" />
            Manage Items
          </button>
          <button
            onClick={() => router.push("/dashboard/admin/add-product")}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-sm"
          >
            <FiPlus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={FiLayers}
          color="text-primary"
        />
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={FiShoppingBag}
          color="text-accent"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={FiDollarSign}
          color="text-emerald-500"
        />
        <StatCard
          title="Total Customers"
          value={totalUsersCount}
          icon={FiUsers}
          color="text-amber-500"
        />
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div className="lg:col-span-1">
          <CategoryChart data={categoryData} />
        </div>
      </div>

      {/* Global Orders Manager Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-neutral">Global Transactions Manager</h3>
          <button
            onClick={() => router.push("/dashboard/admin/manage-orders")}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            View all orders
            <FiArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <AdminOrdersTable orders={orders.slice(0, 10)} onStatusUpdate={handleStatusUpdate} />
      </div>
    </main>
  );
}
