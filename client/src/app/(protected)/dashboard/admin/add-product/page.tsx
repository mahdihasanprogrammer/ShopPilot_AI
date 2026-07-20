"use client";

import AddProductForm from "@/components/dashboard/admin/AddProductForm";
import { FiPackage, FiChevronRight, FiHome } from "react-icons/fi";
import Link from "next/link";

export default function AddProductPage() {
  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-5xl mx-auto w-full space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-text-neutral/50" aria-label="Breadcrumb">
        <Link href="/dashboard/admin" className="flex items-center gap-1 hover:text-primary transition-colors">
          <FiHome className="h-3 w-3" />
          Admin
        </Link>
        <FiChevronRight className="h-3 w-3" />
        <Link href="/dashboard/admin/manage-products" className="hover:text-primary transition-colors">
          Manage Products
        </Link>
        <FiChevronRight className="h-3 w-3" />
        <span className="text-text-neutral font-bold">Add Product</span>
      </nav>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bg-secondary pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10">
            <FiPackage className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text-neutral">
              Add New Product
            </h1>
            <p className="text-xs text-text-neutral/50 mt-0.5 font-medium">
              Fill in the details below. Fields marked with{" "}
              <span className="text-red-400 font-bold">*</span> are required.
            </p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-3xl border border-border bg-card shadow-md p-6 sm:p-10">
        <AddProductForm />
      </div>
    </main>
  );
}
