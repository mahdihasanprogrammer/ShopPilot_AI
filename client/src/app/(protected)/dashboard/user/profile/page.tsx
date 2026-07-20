"use client";

import { useSession, authClient } from "@/lib/auth-client";
import ProfileCard from "@/components/dashboard/ProfileCard";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiChevronRight, FiHome, FiUser, FiEdit3, FiLoader, FiImage } from "react-icons/fi";
import { toast } from "sonner";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Cookie",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Sugar",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buster",
];

export default function UserProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  if (isPending) {
    return (
      <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-5xl mx-auto w-full space-y-8">
        <div className="skeleton h-5 w-40 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="skeleton h-80 rounded-2xl col-span-1" />
          <div className="skeleton h-80 rounded-2xl col-span-2" />
        </div>
      </main>
    );
  }

  if (!session?.user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name field cannot be left blank.");
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
      } else {
        toast.success("Profile saved successfully.");
        await refetch();
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile details.");
    } finally {
      setIsSaving(false);
    }
  };

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image || undefined,
    role: (session.user.role as "user" | "admin") || "user",
    createdAt: session.user.createdAt.toString(),
  };

  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:px-12 max-w-5xl mx-auto w-full space-y-8 animate-premium-fade">
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
      <div className="rounded-2xl border border-border bg-card shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10">
            <FiUser className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-heading">
              Profile Settings
            </h1>
            <p className="text-xs text-body/60 font-medium mt-0.5">
              Update your account name, avatar, and manage credential parameters.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Live Card Preview */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-body/50">Current Profile</h2>
          <ProfileCard user={user} />
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-body/50">Modify Details</h2>
          
          <div className="rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-8">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="profile-name" className="block text-xs font-bold text-heading uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-body/40" />
                  <input
                    id="profile-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm font-semibold text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Preset Avatars Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                  Choose Preset Avatar
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {PRESET_AVATARS.map((avatarUrl, idx) => {
                    const isSelected = image === avatarUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(avatarUrl)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-surface hover:scale-105 transition-all p-1 flex items-center justify-center cursor-pointer ${
                          isSelected ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-border hover:border-border-hover"
                        }`}
                      >
                        <img src={avatarUrl} alt={`Preset ${idx + 1}`} className="h-full w-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Image URL */}
              <div className="space-y-2">
                <label htmlFor="profile-image" className="block text-xs font-bold text-heading uppercase tracking-wider">
                  Custom Avatar URL
                </label>
                <div className="relative">
                  <FiImage className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-body/40" />
                  <input
                    id="profile-image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm font-semibold text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <p className="text-[10px] text-body/50 font-medium">
                  Provide an external photo link or choose one of the high-quality preset avatars above.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <FiLoader className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <FiEdit3 className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
