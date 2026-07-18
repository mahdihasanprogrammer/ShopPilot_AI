"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/shared/AuthProvider";
import { signOut } from "@/lib/auth-client";

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
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold tracking-tight text-transparent">
              ShopPilot AI
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Explore Products
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            {user && (
              <>
                <Link
                  href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link href="/checkout" className="text-sm font-medium hover:text-primary transition-colors">
                  Checkout
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-16 animate-pulse rounded bg-bg-secondary"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-text-neutral">
                Hi, <span className="font-semibold text-primary">{user.name}</span>
                {user.role === "admin" && (
                  <span className="ml-1.5 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                    Admin
                  </span>
                )}
              </span>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-bg-secondary bg-background px-3.5 py-1.5 text-sm font-medium text-text-neutral hover:bg-bg-secondary transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-bg-secondary transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark shadow-sm hover:shadow transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
