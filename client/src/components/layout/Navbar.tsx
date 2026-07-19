"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  HiOutlineShoppingCart,
  HiOutlineViewGrid,
  HiOutlineLogout,
  HiOutlineLogin,
} from "react-icons/hi";
import { RiSparklingFill } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import {
  FiUser,
  FiUserPlus,
  FiPackage,
  FiInfo,
  FiMail,
  FiMenu,
  FiX,
} from "react-icons/fi";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { data: sessionData, isPending: loading } = useSession();
  const user = sessionData?.user;
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-bg-secondary bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-1.5">
            <RiSparklingFill className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold tracking-tight text-transparent">
              ShopPilot AI
            </span>
          </Link>

          {/* Desktop Nav Link List */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/products"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all"
            >
              <FiPackage className="h-4 w-4" />
              Products
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all"
            >
              <FiInfo className="h-4 w-4" />
              About
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all"
            >
              <FiMail className="h-4 w-4" />
              Contact
            </Link>
            {user && (
              <>
                <Link
                  href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all"
                >
                  <HiOutlineViewGrid className="h-4 w-4" />
                  Dashboard
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Desktop Auth Controls / Mobile Hamburger trigger */}
        <div className="flex items-center gap-3">
          {/* Cart Drawer — only shown for non-admin users */}
          <CartDrawer />

          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded-lg bg-bg-secondary"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover border border-primary/30"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FiUser className="h-4 w-4" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-text-neutral">
                    {user.name?.split(" ")[0]}
                  </span>
                  {user.role === "admin" && (
                    <span className="flex items-center gap-0.5 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                      <MdAdminPanelSettings className="h-3 w-3" />
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 rounded-lg border border-bg-secondary bg-background px-3.5 py-1.5 text-sm font-medium text-text-neutral hover:bg-bg-secondary transition-all"
                >
                  <HiOutlineLogout className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-bg-secondary transition-all"
                >
                  <HiOutlineLogin className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark shadow-sm hover:shadow transition-all"
                >
                  <FiUserPlus className="h-4 w-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center p-2 rounded-xl border border-bg-secondary bg-background text-text-neutral/70 hover:text-primary transition-all"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-bg-secondary bg-background/95 backdrop-blur-md px-4 py-6 space-y-4 shadow-lg animate-fadeIn">
          <nav className="flex flex-col gap-2">
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all"
            >
              <FiPackage className="h-4 w-4 text-primary" />
              Products
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all"
            >
              <FiInfo className="h-4 w-4 text-primary" />
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all"
            >
              <FiMail className="h-4 w-4 text-primary" />
              Contact
            </Link>
            {user && (
              <>
                <Link
                  href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all"
                >
                  <HiOutlineViewGrid className="h-4 w-4 text-primary" />
                  Dashboard
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all"
                >
                  <HiOutlineShoppingCart className="h-4 w-4 text-primary" />
                  Checkout
                </Link>
              </>
            )}
          </nav>

          <div className="border-t border-bg-secondary pt-4">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded-lg bg-bg-secondary"></div>
            ) : user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2.5 px-4">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border border-primary/30"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FiUser className="h-4.5 w-4.5" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-text-neutral">{user.name}</p>
                    <span className="inline-block rounded bg-accent/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-accent tracking-wider mt-0.5">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 text-sm font-bold transition-all"
                >
                  <HiOutlineLogout className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-bg-secondary bg-background px-4 py-3 text-sm font-bold text-primary hover:bg-bg-secondary transition-all"
                >
                  <HiOutlineLogin className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-all shadow-sm"
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
