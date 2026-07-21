"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { RiSparklingFill } from "react-icons/ri";
import {
  FiUserPlus,
  FiPackage,
  FiInfo,
  FiMail,
  FiMenu,
  FiX,
  FiLogOut,
  FiLogIn,
  FiGrid,
  FiChevronDown,
} from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import CartDrawer from "./CartDrawer";
import ThemeToggle from "./ThemeToggle";

// ---- Avatar component with image or name initial fallback ----
function UserAvatar({
  name,
  image,
  size = "md",
}: {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-7 w-7 text-xs" : "h-8 w-8 text-sm";
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";

  if (image) {
    return (
      <img
        src={image}
        alt={name ?? "User"}
        className={`${dim} rounded-full object-cover border-2 border-primary/20 ring-2 ring-card`}
      />
    );
  }

  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-primary to-secondary text-white font-extrabold flex items-center justify-center ring-2 ring-card`}
    >
      {initial}
    </div>
  );
}

export default function Navbar() {
  const { data: sessionData, isPending: loading } = useSession();
  const user = sessionData?.user;
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";
  const dashboardHref = isAdmin ? "/dashboard/admin" : "/dashboard/user";

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/products", label: "Products", icon: FiPackage },
    { href: "/about", label: "About", icon: FiInfo },
    { href: "/contact", label: "Contact", icon: FiMail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md shadow-sm transition-colors duration-250">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md">
            <RiSparklingFill className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-lg font-black tracking-tight text-transparent hidden sm:block">
            ShopPilot AI
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-body hover:text-heading hover:bg-bg-secondary"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Cart drawer — only shown for logged-in non-admins */}
          <CartDrawer />

          {/* Desktop auth area */}
          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-border" />
            ) : user ? (
              /* ── Avatar dropdown ── */
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-bg-secondary transition-all cursor-pointer border border-transparent hover:border-border"
                  aria-label="User menu"
                >
                  <UserAvatar name={user.name} image={user.image} size="sm" />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-heading leading-none">
                      {user.name?.split(" ")[0]}
                    </p>
                    {isAdmin && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-accent mt-0.5 block">
                        Admin
                      </span>
                    )}
                  </div>
                  <FiChevronDown
                    className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown panel */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-card shadow-lg overflow-hidden animate-fadeIn">
                    {/* User info header */}
                    <div className="px-4 py-3.5 border-b border-border bg-bg-secondary/40 flex items-center gap-3">
                      <UserAvatar name={user.name} image={user.image} size="md" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-heading truncate">{user.name}</p>
                        <p className="text-[11px] text-body/75 truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Dropdown items */}
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-body hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                      >
                        {isAdmin ? (
                          <MdAdminPanelSettings className="h-4 w-4 text-accent" />
                        ) : (
                          <FiGrid className="h-4 w-4 text-primary" />
                        )}
                        {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                      >
                        <FiLogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest controls */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-body hover:text-heading hover:bg-bg-secondary transition-all cursor-pointer"
                >
                  <FiLogIn className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <FiUserPlus className="h-4 w-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-card text-body hover:text-heading hover:bg-bg-secondary transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <FiX className="h-4.5 w-4.5" /> : <FiMenu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Panel ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-5 space-y-2 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-border">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Appearance</span>
            <ThemeToggle showLabel />
          </div>

          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-body hover:text-heading hover:bg-bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </Link>
            );
          })}

          <div className="border-t border-border pt-3 mt-3">
            {loading ? (
              <div className="h-10 w-full animate-pulse rounded-xl bg-bg-secondary" />
            ) : user ? (
              <div className="space-y-2">
                {/* Mobile user info */}
                <div className="flex items-center gap-3 px-4 py-2 bg-bg-secondary/60 rounded-2xl border border-border">
                  <UserAvatar name={user.name} image={user.image} size="md" />
                  <div>
                    <p className="text-sm font-bold text-heading leading-tight">{user.name}</p>
                    <span className="text-[9px] font-black uppercase tracking-wider text-accent mt-0.5 block">
                      {user.role}
                    </span>
                  </div>
                </div>
                <Link
                  href={dashboardHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-body hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                >
                  <FiGrid className="h-4 w-4 text-primary" />
                  {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <FiLogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-primary hover:bg-bg-secondary transition-all cursor-pointer"
                >
                  <FiLogIn className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-all shadow-sm cursor-pointer"
                >
                  <FiUserPlus className="h-4 w-4" />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
