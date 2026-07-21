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
  FiPackage,
  FiList,
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

  const triggerAIAssistant = () => {
    setIsOpen(false);
    const bubble =
      document.getElementById("ai-chat-bubble") ||
      document.querySelector("[aria-label='Open AI chat']");
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

  const userNavItems: NavItem[] = [
    { label: "Overview", href: "/dashboard/user", icon: FiGrid },
    { label: "My Orders", href: "/dashboard/user/orders", icon: FiList },
    { label: "Profile", href: "/dashboard/user/profile", icon: FiUser },
    { label: "AI Assistant", onClick: triggerAIAssistant, icon: RiRobot2Line },
  ];

  const adminNavItems: NavItem[] = [
    { label: "Overview", href: "/dashboard/admin", icon: FiGrid },
    { label: "Manage Products", href: "/dashboard/admin/manage-products", icon: FiPackage },
    { label: "Add Product", href: "/dashboard/admin/add-product", icon: FiPlus },
    { label: "Manage Orders", href: "/dashboard/admin/manage-orders", icon: FiShoppingBag },
    { label: "Profile", href: "/dashboard/admin/profile", icon: FiUser },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const userInitial =
    session?.user?.name?.charAt(0).toUpperCase() ?? "?";

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border shadow-sm transition-colors duration-250">
      {/* ── Brand Header ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-primary/10">
            <RiSparklingFill className="h-4 w-4 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-base font-extrabold tracking-tight text-transparent">
            ShopPilot AI
          </span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 rounded-lg hover:bg-surface text-body/60 hover:text-heading transition-colors"
          aria-label="Close sidebar"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>

      {/* ── Role Badge ── */}
      <div className="px-5 py-3 border-b border-border">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
          <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
          {role}
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;

          const activeClasses =
            "bg-primary/10 text-primary font-bold border border-primary/20";
          const inactiveClasses =
            "text-body hover:text-heading hover:bg-surface font-medium border border-transparent";

          if (item.onClick) {
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] transition-all text-left ${inactiveClasses}`}
              >
                <Icon className="h-4 w-4 shrink-0 text-muted" />
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href || "#"}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] transition-all ${
                isActive ? activeClasses : inactiveClasses
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? "text-primary" : "text-muted"
                }`}
              />
              {item.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t border-border" />

        {/* Back to site */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-body hover:text-heading hover:bg-surface border border-transparent transition-all"
        >
          <FiHome className="h-4 w-4 shrink-0 text-muted" />
          Back to Store
        </Link>
      </nav>

      {/* ── User Profile + Sign Out ── */}
      <div className="px-4 py-4 border-t border-border space-y-3">
        {session?.user && (
          <div className="flex items-center gap-3 px-1.5 py-2 rounded-xl bg-surface border border-border">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="h-9 w-9 rounded-full object-cover border border-border shrink-0"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-extrabold border border-primary/20">
                {userInitial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-heading truncate">
                {session.user.name}
              </p>
              <p className="text-[11px] text-muted truncate leading-tight">
                {session.user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2.5 text-[13px] font-bold transition-all cursor-pointer"
        >
          <FiLogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden flex items-center justify-between px-5 py-3 bg-card border-b border-border w-full z-30 shadow-sm transition-colors duration-250">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10">
            <RiSparklingFill className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-base font-extrabold tracking-tight text-transparent">
            ShopPilot AI
          </span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl border border-border bg-surface text-body hover:text-primary hover:border-border-hover transition-all cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="h-5 w-5" />
        </button>
      </div>

      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* ── Mobile Drawer ── */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={toggleSidebar}
          />
          <div className="relative z-50 h-full animate-slideIn">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
