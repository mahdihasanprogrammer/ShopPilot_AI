"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  FiUser,
} from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import CartDrawer from "./CartDrawer";

// ── Avatar component ──────────────────────────────────────────────
function UserAvatar({
  name,
  image,
  size = "md",
}: {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const dims = { sm: "h-7 w-7 text-[11px]", md: "h-8 w-8 text-sm", lg: "h-10 w-10 text-base" };
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";

  if (image) {
    return (
      <img
        src={image}
        alt={name ?? "User"}
        className={`${dims[size]} rounded-full object-cover border-2 border-primary/20`}
      />
    );
  }

  return (
    <div
      className={`${dims[size]} rounded-full bg-gradient-to-br from-primary to-secondary text-white font-extrabold flex items-center justify-center shrink-0`}
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
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";
  const dashboardHref = isAdmin ? "/dashboard/admin" : "/dashboard/user";

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/products", label: "Products", icon: FiPackage },
    { href: "/about",    label: "About",    icon: FiInfo },
    { href: "/contact",  label: "Contact",  icon: FiMail },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-border"
          : "bg-white/90 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md group-hover:shadow-lg transition-shadow">
            <RiSparklingFill className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-extrabold tracking-tight text-heading">
              Shop<span className="text-primary">Pilot</span>
              <span className="text-secondary"> AI</span>
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-body hover:text-heading hover:bg-surface"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted"}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-2">
          {/* Cart Drawer */}
          <CartDrawer />

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-border" />
            ) : user ? (
              /* Avatar Dropdown */
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-1.5 hover:border-border-hover hover:bg-surface transition-all duration-200 cursor-pointer shadow-sm"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  <UserAvatar name={user.name} image={user.image} size="sm" />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-heading leading-none">
                      {user.name?.split(" ")[0]}
                    </p>
                    {isAdmin && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-secondary">
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
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-border bg-card shadow-xl overflow-hidden animate-fadeIn">
                    {/* User info */}
                    <div className="px-4 py-4 border-b border-border bg-surface flex items-center gap-3">
                      <UserAvatar name={user.name} image={user.image} size="lg" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-heading truncate">{user.name}</p>
                        <p className="text-[11px] text-muted truncate">{user.email}</p>
                        <span
                          className={`mt-0.5 inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                            isAdmin
                              ? "bg-orange-100 text-orange-600"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {isAdmin ? "Admin" : "Member"}
                        </span>
                      </div>
                    </div>

                    {/* Dropdown items */}
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-body hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                      >
                        {isAdmin ? (
                          <MdAdminPanelSettings className="h-4.5 w-4.5 text-accent" />
                        ) : (
                          <FiGrid className="h-4 w-4 text-primary" />
                        )}
                        {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
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
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-body hover:text-heading hover:border-border-hover hover:bg-surface transition-all shadow-sm"
                >
                  <FiLogIn className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark shadow-sm hover:shadow-md transition-all"
                >
                  <FiUserPlus className="h-4 w-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-card text-body hover:text-heading hover:border-border-hover hover:bg-surface transition-all shadow-sm"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="h-4.5 w-4.5" />
            ) : (
              <FiMenu className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-1 shadow-lg animate-fadeIn">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-body hover:text-primary hover:bg-primary/5"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? "text-primary" : "text-muted"}`} />
                {label}
              </Link>
            );
          })}

          <div className="border-t border-border pt-3 mt-2">
            {loading ? (
              <div className="h-10 w-full animate-pulse rounded-xl bg-border" />
            ) : user ? (
              <div className="space-y-1">
                {/* Mobile user info */}
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface mb-2">
                  <UserAvatar name={user.name} image={user.image} size="md" />
                  <div>
                    <p className="text-sm font-bold text-heading">{user.name}</p>
                    <span className="text-[10px] font-black uppercase tracking-wider text-secondary">
                      {user.role}
                    </span>
                  </div>
                </div>
                <Link
                  href={dashboardHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-body hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <FiGrid className="h-4.5 w-4.5 text-primary" />
                  {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                >
                  <FiLogOut className="h-4.5 w-4.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-primary hover:bg-surface transition-all"
                >
                  <FiLogIn className="h-4.5 w-4.5" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-all shadow-sm"
                >
                  <FiUserPlus className="h-4.5 w-4.5" />
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
