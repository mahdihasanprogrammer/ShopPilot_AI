"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiAlertTriangle, FiArrowLeft, FiHome } from "react-icons/fi";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <main className="flex-1 flex items-center justify-center p-6 bg-background min-h-[70vh]">
      <div className="w-full max-w-md rounded-2xl border border-bg-secondary bg-background p-8 text-center shadow-lg space-y-6 animate-scaleIn">
        {/* Warning Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center animate-pulse">
          <FiAlertTriangle className="h-8 w-8 text-red-500" />
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-text-neutral">
            Access Denied
          </h1>
          <p className="text-xs text-text-neutral/50 font-medium leading-relaxed">
            Your current account credentials do not possess matching permissions to view this resource. Dashboard access is strictly isolated by role.
          </p>
        </div>

        {/* Separator line */}
        <div className="border-t border-bg-secondary w-full"></div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-bg-secondary bg-background px-4 py-2.5 text-xs font-bold text-text-neutral hover:bg-bg-secondary transition-all"
          >
            <FiArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-sm"
          >
            <FiHome className="h-4 w-4" />
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
