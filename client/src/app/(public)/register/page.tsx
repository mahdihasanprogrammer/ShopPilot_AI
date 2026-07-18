"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard/user",
      });

      // Redirect directly to dashboard on success
      router.push("/dashboard/user");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-bg-secondary">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-bg-secondary p-8 bg-background shadow-lg transition-all hover:shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-neutral">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-text-neutral/60">
            Sign up to start shopping with ShopPilot AI
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-xs font-semibold text-red-600 border border-red-100 animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-neutral/70 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-bg-secondary bg-background px-4 py-3 text-sm text-text-neutral focus:border-primary focus:outline-none transition-all"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-neutral/70 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-bg-secondary bg-background px-4 py-3 text-sm text-text-neutral focus:border-primary focus:outline-none transition-all"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-neutral/70 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-bg-secondary bg-background px-4 py-3 text-sm text-text-neutral focus:border-primary focus:outline-none transition-all"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-neutral/70 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-bg-secondary bg-background px-4 py-3 text-sm text-text-neutral focus:border-primary focus:outline-none transition-all"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-xs text-text-neutral/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </main>
  );
}
