"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  FiGrid,
  FiShoppingBag,
  FiPlus,
  FiUser,
  FiLogOut,
  FiHome,
  FiMenu,
  FiX,
  FiCompass,
} from "react-icons/fi";
import { RiRobot2Line, RiSparklingFill } from "react-icons/ri";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const role = session?.user?.role || "user";
  const isAdmin = role === "admin";

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  // AI Assistant trigger
  const triggerAIAssistant = () => {
    setIsOpen(false);
    const bubble = document.getElementById("ai-chat-bubble") || document.querySelector("[aria-label='Open AI chat']");
    if (bubble) {
      (bubble as HTMLButtonElement).click();
    }
  };

  interface NavItem {
    label: string;
    href?: string;
    icon: any;
    onClick?: () => void;
  }

  // Nav Items configuration
  const userNavItems: NavItem[] = [
    { label: "Overview", href: "/dashboard/user", icon: FiGrid },
    { label: "My Orders", href: "/dashboard/user/orders", icon: FiShoppingBag },
    { label: "Profile", href: "/dashboard/user/profile", icon: FiUser },
    { label: "AI Assistant", onClick: triggerAIAssistant, icon: RiRobot2Line },
  ];

  const adminNavItems: NavItem[] = [
    { label: "Overview", href: "/dashboard/admin", icon: FiGrid },
    { label: "Manage Products", href: "/dashboard/admin/manage-products", icon: FiShoppingBag },
    { label: "Add Product", href: "/dashboard/admin/add-product", icon: FiPlus },
    { label: "Manage Orders", href: "/dashboard/admin/manage-orders", icon: FiShoppingBag },
    { label: "Profile", href: "/dashboard/admin/profile", icon: FiUser },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-xl border-r border-black/[0.04] w-64 p-7 shadow-sm">
      {/* Header / Logo */}
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5" onClick={() => setIsOpen(false)}>
          <RiSparklingFill className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-lg font-bold tracking-tight text-transparent font-sans">
            ShopPilot AI
          </span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-text-neutral/60 hover:text-text-neutral transition-colors p-1"
          aria-label="Close sidebar"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;

          const activeClasses = "bg-primary/[0.06] text-primary font-bold shadow-xs";
          const inactiveClasses = "text-text-neutral/60 hover:text-text-neutral hover:bg-black/[0.02] font-medium transition-all duration-200";

          if (item.onClick) {
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all text-left text-text-neutral/60 hover:text-text-neutral hover:bg-black/[0.02] font-medium transition-all duration-200"
              >
                <Icon className="h-4 w-4 shrink-0 text-text-neutral/40" />
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href || "#"}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                isActive ? activeClasses : inactiveClasses
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-text-neutral/40"}`} />
              {item.label}
            </Link>
          );
        })}

        <div className="border-t border-black/[0.04] my-4 pt-4"></div>

        {/* Back to site */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-text-neutral/60 hover:text-text-neutral hover:bg-black/[0.02] transition-all duration-200"
        >
          <FiCompass className="h-4 w-4 shrink-0 text-text-neutral/40" />
          Back to Site
        </Link>
      </nav>

      {/* Bottom user profile + signout */}
      <div className="pt-4 border-t border-black/[0.04] space-y-4">
        {session?.user && (
          <div className="flex items-center gap-3 px-1">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="h-9 w-9 rounded-full object-cover border border-black/[0.06]"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/[0.06] text-primary">
                <FiUser className="h-4.5 w-4.5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-text-neutral truncate">{session.user.name}</p>
              <span className="inline-block rounded-md bg-black/[0.04] px-1.5 py-0.5 text-[9px] font-bold uppercase text-text-neutral/60 tracking-wider mt-0.5">
                {role}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-100/60 bg-red-50/50 hover:bg-red-50 text-red-600 px-4 py-2.5 text-xs font-bold transition-all duration-200"
        >
          <FiLogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header / Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-black/[0.04] w-full z-30">
        <Link href="/" className="flex items-center gap-1.5">
          <RiSparklingFill className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-lg font-bold tracking-tight text-transparent font-sans">
            ShopPilot AI
          </span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl border border-black/[0.04] bg-background text-text-neutral/70 hover:text-primary transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop Sidebar (fixed left) */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile Drawer (with backdrop) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-xs animate-fadeIn"
            onClick={toggleSidebar}
          ></div>

          {/* Sliding drawer content */}
          <div className="relative z-50 h-full animate-slideIn">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
