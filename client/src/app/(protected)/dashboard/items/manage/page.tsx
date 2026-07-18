"use client";

import { useSession } from "@/lib/auth-client";
import ProductManageTable from "@/components/dashboard/admin/ProductManageTable";
import Link from "next/link";
import { FiLayers, FiPlus, FiChevronRight } from "react-icons/fi";

export default function ManageProductsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-8">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-1.5 text-xs font-semibold text-text-neutral/50"
        aria-label="Breadcrumb"
      >
        <Link href="/dashboard/admin" className="hover:text-primary transition-colors">
          Admin
        </Link>
        <FiChevronRight className="h-3 w-3" />
        <span className="text-text-neutral font-bold">Manage Products</span>
      </nav>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bg-secondary pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10">
            <FiLayers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text-neutral">
              Manage Products
            </h1>
            <p className="text-xs text-text-neutral/50 font-medium mt-0.5">
              View, edit, or delete products from the catalogue.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/items/add"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-all w-fit"
        >
          <FiPlus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Table */}
      <ProductManageTable isAdmin={isAdmin} />
    </main>
  );
}
