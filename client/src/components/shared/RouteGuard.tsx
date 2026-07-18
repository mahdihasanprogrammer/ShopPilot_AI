"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { RiLoader4Line } from "react-icons/ri";

// Admin-only route prefixes — regular users redirected to /dashboard/user
const ADMIN_ONLY_PREFIXES = [
  "/dashboard/admin",
  "/dashboard/items",
];

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Still loading session — wait before making decisions
    if (isPending) return;

    // No session at all — middleware should have caught this, but belt-and-suspenders
    if (!session?.user) {
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
      return;
    }

    // Check admin-only routes
    const isAdminRoute = ADMIN_ONLY_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (isAdminRoute && session.user.role !== "admin") {
      // Authenticated but wrong role — redirect to user dashboard, NOT login
      router.replace("/dashboard/user");
    }
  }, [isPending, session, pathname, router]);

  // Show centered spinner while session is loading or redirect is in flight
  if (isPending) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RiLoader4Line className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs font-semibold text-text-neutral/50 uppercase tracking-wider">
          Verifying session…
        </p>
      </div>
    );
  }

  // While redirecting (no session or wrong role), render nothing
  if (!session?.user) return null;

  const isAdminRoute = ADMIN_ONLY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (isAdminRoute && session.user.role !== "admin") return null;

  return <>{children}</>;
}
