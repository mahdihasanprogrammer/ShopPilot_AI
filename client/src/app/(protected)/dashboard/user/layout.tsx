import { getUserSession } from "@/lib/session";
import { redirect } from "next/navigation";

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

export default async function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  const user = await getUserSession();
  
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/user");
  }
  
  if (user.role !== "user") {
    redirect("/forbidden");
  }

  return <>{children}</>;
}
