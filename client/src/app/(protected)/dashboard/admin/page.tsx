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
      <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-8">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="skeleton h-64 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!session?.user || session.user.role !== "admin") return null;

  // Derive counts
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalUsersCount = new Set(orders.map((o) => o.userId)).size || 1; // Distinct customers count

  return (
    <main className="flex-1 px-6 py-10 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-8">
      {/* Welcome & Admin Header */}
      <div className="rounded-2xl border border-border bg-card shadow-sm px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-heading flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10">
              <RiShieldUserLine className="h-5 w-5 text-primary" />
            </div>
            Admin Overview
          </h1>
          <p className="text-sm text-body/70 mt-1 ml-11">
            Monitor revenue, track orders, and manage your product catalogue.
          </p>
        </div>

        {/* Quick action controls */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => router.push("/dashboard/admin/manage-products")}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-heading hover:border-border-hover hover:bg-background transition-all"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={FiLayers}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={FiShoppingBag}
          color="text-orange-500"
          bgColor="bg-orange-500/10"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={FiDollarSign}
          color="text-emerald-600"
          bgColor="bg-emerald-500/10"
        />
        <StatCard
          title="Unique Customers"
          value={totalUsersCount}
          icon={FiUsers}
          color="text-amber-600"
          bgColor="bg-amber-500/10"
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-heading tracking-tight">Recent Orders</h3>
          <button
            onClick={() => router.push("/dashboard/admin/manage-orders")}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
          >
            View all
            <FiArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <AdminOrdersTable orders={orders.slice(0, 10)} onStatusUpdate={handleStatusUpdate} />
      </div>
    </main>
  );
}
