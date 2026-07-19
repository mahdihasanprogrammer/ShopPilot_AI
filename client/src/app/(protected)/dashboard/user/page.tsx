"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Order } from "@/types";
import StatCard from "@/components/dashboard/StatCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import { FiShoppingBag, FiHeart, FiShoppingCart, FiArrowRight, FiLogOut, FiExternalLink } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import RecommendationsSection from "@/components/shared/RecommendationsSection";

export default function UserDashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function fetchUserOrders() {
      setLoadingOrders(true);
      const res = await api.get<Order[]>("/orders");
      if (res.success && res.data) {
        setOrders(res.data);
      }
      setLoadingOrders(false);
    }
    if (session?.user) {
      fetchUserOrders();
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (sessionPending) {
    return (
      <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-bg-secondary rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-bg-secondary rounded-2xl"></div>
          <div className="h-28 bg-bg-secondary rounded-2xl"></div>
          <div className="h-28 bg-bg-secondary rounded-2xl"></div>
        </div>
      </main>
    );
  }

  if (!session?.user) return null;

  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-10">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bg-secondary pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-neutral">
            Welcome back, {session.user.name.split(" ")[0]}!
          </h1>
          <p className="text-sm text-text-neutral/60 mt-1">
            Access your statistics, orders summary, and profile settings here.
          </p>
        </div>
        
        {/* Quick action controls */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => router.push("/products")}
            className="flex items-center gap-1.5 rounded-xl border border-bg-secondary bg-background px-4 py-2.5 text-xs font-semibold text-text-neutral hover:bg-bg-secondary transition-all"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push("/checkout")}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-sm"
          >
            Go to Checkout
            <FiArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-red-600 px-4 py-2.5 text-xs font-semibold hover:bg-red-100 transition-all"
          >
            <FiLogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Metric stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={FiShoppingBag}
          color="text-primary"
        />
        <StatCard
          title="My Wishlist"
          value={0} // placeholder wishlist count
          icon={FiHeart}
          color="text-rose-500"
        />
        <StatCard
          title="Cart Items"
          value={0} // placeholder cart items count
          icon={FiShoppingCart}
          color="text-accent"
        />
      </div>

      {/* AI Smart Recommendations */}
      <RecommendationsSection />

      {/* Grid of Profile vs Orders table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card Column */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-bold text-text-neutral">My Profile</h3>
          <ProfileCard
            user={{
              id: session.user.id,
              name: session.user.name,
              email: session.user.email,
              image: session.user.image || undefined,
              role: (session.user.role as "user" | "admin") || "user",
              createdAt: session.user.createdAt.toString(),
            }}
          />

          {/* Prompt to AI Chatbot widget */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-5 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <RiRobot2Line className="h-4.5 w-4.5" />
              <span>AI Shopping Companion</span>
            </div>
            <p className="text-xs text-text-neutral/70 leading-relaxed font-medium">
              Need buying advice? Simply launch the shopping companion to review order recommendations.
            </p>
            <button
              onClick={() => {
                // Emulate opening assistant bubble
                const bubble = document.getElementById("ai-chat-bubble");
                if (bubble) bubble.click();
              }}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              Launch Assistant
              <FiExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Recent Orders Column */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-text-neutral">Recent Orders</h3>
          {loadingOrders ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : (
            <RecentOrdersTable orders={orders} />
          )}
        </div>
      </div>
    </main>
  );
}
