"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { RiLoader4Line } from "react-icons/ri";

const ADMIN_ONLY_PREFIXES = [
  "/dashboard/admin",
  "/dashboard/items",
];

const USER_ONLY_PREFIXES = [
  "/dashboard/user",
];

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;

    // No session — redirect to login
    if (!session?.user) {
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
      return;
    }

    const userRole = session.user.role || "user";

    // 1. Admin-only check
    const isAdminRoute = ADMIN_ONLY_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (isAdminRoute && userRole !== "admin") {
      router.replace("/forbidden");
      return;
    }

    // 2. User-only check (mutual isolation: admins cannot visit user-only dashboard paths)
    const isUserRoute = USER_ONLY_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (isUserRoute && userRole !== "user") {
      router.replace("/forbidden");
      return;
    }
  }, [isPending, session, pathname, router]);

  // Loading spinner
  if (isPending) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RiLoader4Line className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs font-semibold text-text-neutral/50 uppercase tracking-wider">
          Verifying session credentials…
        </p>
      </div>
    );
  }

  // Pre-render guards
  if (!session?.user) return null;

  const userRole = session.user.role || "user";
  const isAdminRoute = ADMIN_ONLY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isUserRoute = USER_ONLY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isAdminRoute && userRole !== "admin") return null;
  if (isUserRoute && userRole !== "user") return null;

  return <>{children}</>;
}
