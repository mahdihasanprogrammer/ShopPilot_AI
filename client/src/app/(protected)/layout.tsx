"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { usePathname } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto">
          {children}
        </div>
      </div>
    );
  }

  // Non-dashboard protected routes (like /checkout) get a clean full-width experience without sidebar
  return <>{children}</>;
}
