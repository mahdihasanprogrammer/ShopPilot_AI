"use client";

import { useSession } from "@/lib/auth-client";
import ProfileCard from "@/components/dashboard/ProfileCard";
import Link from "next/link";
import { FiChevronRight, FiHome, FiUser } from "react-icons/fi";

export default function UserProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex-grow flex items-center justify-center p-12">
        <div className="animate-pulse h-64 bg-bg-secondary w-full max-w-md rounded-2xl"></div>
      </div>
    );
  }

  if (!session?.user) return null;

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image || undefined,
    role: (session.user.role as "user" | "admin") || "user",
    createdAt: session.user.createdAt.toString(),
  };

  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-4xl mx-auto w-full space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-text-neutral/50" aria-label="Breadcrumb">
        <Link href="/dashboard/user" className="flex items-center gap-1 hover:text-primary transition-colors">
          <FiHome className="h-3 w-3" />
          Dashboard
        </Link>
        <FiChevronRight className="h-3 w-3" />
        <span className="text-text-neutral font-bold">Profile Settings</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bg-secondary pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10">
            <FiUser className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text-neutral">
              My Profile
            </h1>
            <p className="text-xs text-text-neutral/50 font-medium mt-0.5">
              Manage your personal credentials, contact address, and membership details.
            </p>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="max-w-md">
        <ProfileCard user={user} />
      </div>
    </main>
  );
}
