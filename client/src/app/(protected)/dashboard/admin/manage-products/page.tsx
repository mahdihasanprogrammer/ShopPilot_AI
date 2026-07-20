"use client";

import { useSession } from "@/lib/auth-client";
import ProductManageTable from "@/components/dashboard/admin/ProductManageTable";
import Link from "next/link";
import {
  FiLayers,
  FiPlus,
  FiChevronRight,
  FiHome,
  FiPackage,
} from "react-icons/fi";

export default function ManageProductsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const userId = session?.user?.id;

  // Breadcrumb root differs by role
  const dashboardHref = isAdmin ? "/dashboard/admin" : "/dashboard/user";
  const dashboardLabel = isAdmin ? "Admin" : "Dashboard";

  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-8">

      {/* ── Breadcrumb ── */}
      <nav
        className="flex items-center gap-1.5 text-xs font-semibold text-text-neutral/50"
        aria-label="Breadcrumb"
      >
        <Link
          href={dashboardHref}
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          <FiHome className="h-3 w-3" />
          {dashboardLabel}
        </Link>
        <FiChevronRight className="h-3 w-3" />
        <span className="text-text-neutral font-bold">Manage Products</span>
      </nav>

      {/* ── Page header ── */}
      <div className="rounded-2xl border border-border bg-card shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10">
            <FiLayers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-heading">
              Manage Products
            </h1>
            <p className="text-xs text-body/60 font-medium mt-0.5">
              {isAdmin
                ? "View, edit, or delete any product in the catalogue."
                : "View and edit your own listed products."}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/admin/add-product"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-all w-fit"
        >
          <FiPlus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* ── Stats strip (visible only when session is loaded) ── */}
      {session && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Role badge */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm hover:border-border-hover transition-all">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <FiPackage className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-body/50">
                Viewing as
              </p>
              <p className="text-sm font-extrabold text-heading capitalize">
                {session.user?.role ?? "user"}
              </p>
            </div>
          </div>

          {/* Scope info */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm hover:border-border-hover transition-all">
            <div className="p-2.5 rounded-xl bg-accent/10">
              <FiLayers className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-body/50">
                Catalogue Scope
              </p>
              <p className="text-sm font-extrabold text-heading">
                {isAdmin ? "All Products" : "Your Products Only"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Product table ── */}
      <ProductManageTable isAdmin={isAdmin} userId={userId} />
    </main>
  );
}
