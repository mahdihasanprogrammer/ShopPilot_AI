"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      });
      
      // Better Auth redirects automatically on success, but manually direct for fallback
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "user" | "admin") => {
    const demoEmail = role === "admin" ? "admin@shoppilot.com" : "user@shoppilot.com";
    const demoPassword = "Password123!";

    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError(null);

    try {
      await signIn.email({
        email: demoEmail,
        password: demoPassword,
      });
      
      // On success, redirect
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || `Demo ${role} login failed.`);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-bg-secondary p-8 bg-background shadow-lg transition-all hover:shadow-xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-text-neutral">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-text-neutral/60">
          Sign in to your ShopPilot account
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

        <button
          type="submit"
          className="w-full mt-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In with Email"}
        </button>
      </form>

      {/* Social Provider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 w-full border-t border-bg-secondary"></div>
        <span className="relative bg-background px-4 text-xs font-semibold uppercase tracking-wider text-text-neutral/40">
          Or Continue With
        </span>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-bg-secondary bg-background py-3 text-sm font-semibold text-text-neutral hover:bg-bg-secondary transition-all disabled:opacity-50"
        disabled={loading}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign In with Google
      </button>

      {/* Demo Credentials Section */}
      <div className="rounded-xl bg-bg-secondary/50 border border-bg-secondary p-4 space-y-3">
        <div className="text-xs font-semibold text-text-neutral/70 uppercase tracking-wider text-center">
          ⚡ Demo Access Accounts
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleDemoLogin("user")}
            className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all duration-300"
            disabled={loading}
          >
            Demo User
          </button>
          <button
            onClick={() => handleDemoLogin("admin")}
            className="rounded-lg bg-accent/10 px-3 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-white transition-all duration-300"
            disabled={loading}
          >
            Demo Admin
          </button>
        </div>
        <p className="text-[10px] text-text-neutral/50 text-center">
          Clicks will auto-fill credentials and submit login.
        </p>
      </div>

      <p className="text-center text-xs text-text-neutral/60">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Register Here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-bg-secondary">
      <Suspense fallback={
        <div className="w-full max-w-md animate-pulse border border-bg-secondary rounded-2xl p-8 bg-background space-y-6">
          <div className="h-6 w-1/3 mx-auto rounded bg-bg-secondary"></div>
          <div className="h-4 w-1/2 mx-auto rounded bg-bg-secondary"></div>
          <div className="h-10 w-full rounded bg-bg-secondary"></div>
          <div className="h-10 w-full rounded bg-bg-secondary"></div>
          <div className="h-12 w-full rounded bg-bg-secondary"></div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
