import { getUserSession } from "@/lib/session";
import { redirect } from "next/navigation";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default async function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const user = await getUserSession();
  
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/admin");
  }
  
  if (user.role !== "admin") {
    redirect("/forbidden");
  }

  return <>{children}</>;
}
