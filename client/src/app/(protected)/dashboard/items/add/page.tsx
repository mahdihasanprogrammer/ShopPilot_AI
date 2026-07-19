"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";

export default function RedirectToAddProduct() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/admin/add-product");
  }, [router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <FiLoader className="h-6 w-6 animate-spin text-primary" />
      <p className="text-xs font-semibold text-text-neutral/50">Redirecting...</p>
    </div>
  );
}
