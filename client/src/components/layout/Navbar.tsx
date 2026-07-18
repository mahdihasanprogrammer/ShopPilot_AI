"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/shared/AuthProvider";
import { signOut } from "@/lib/auth-client";
import { HiOutlineShoppingCart, HiOutlineViewGrid, HiOutlineLogout, HiOutlineLogin } from "react-icons/hi";
import { RiSparklingFill } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import { FiUser, FiUserPlus, FiPackage, FiInfo, FiMail } from "react-icons/fi";

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        }
      }
    });
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

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/products" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all">
              <FiPackage className="h-4 w-4" />
              Products
            </Link>
            <Link href="/about" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all">
              <FiInfo className="h-4 w-4" />
              About
            </Link>
            <Link href="/contact" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all">
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
                <Link href="/checkout" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-neutral/70 hover:text-primary hover:bg-bg-secondary transition-all">
                  <HiOutlineShoppingCart className="h-4 w-4" />
                  Checkout
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Auth Controls */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-bg-secondary"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="h-7 w-7 rounded-full object-cover border border-primary/30" />
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
      </div>
    </header>
  );
}
