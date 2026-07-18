"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { RiFlashlightFill } from "react-icons/ri";
import { MdWarning } from "react-icons/md";

// ---- Validation helpers ----
function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
  return null;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;
    if (!password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await signIn.email({ email, password, callbackURL: callbackUrl });
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setErrors({ form: err.message || "Invalid email or password. Please try again." });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn.social({ provider: "google", callbackURL: callbackUrl });
    } catch (err: any) {
      setErrors({ form: err.message || "Google authentication failed." });
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "user" | "admin") => {
    const demoEmail = role === "admin" ? "admin@shoppilot.com" : "user@shoppilot.com";
    const demoPassword = "Password123!";
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setErrors({});
    try {
      await signIn.email({ email: demoEmail, password: demoPassword });
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setErrors({ form: err.message || `Demo ${role} login failed.` });
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-bg-secondary p-8 bg-background shadow-lg transition-all hover:shadow-xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-text-neutral">Welcome Back</h1>
        <p className="mt-2 text-sm text-text-neutral/60">Sign in to your ShopPilot account</p>
      </div>

      {errors.form && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-xs font-semibold text-red-600 border border-red-100">
          <MdWarning className="h-4 w-4 shrink-0" />
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-neutral/70 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-neutral/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
              placeholder="name@example.com"
              className={`w-full rounded-xl border ${errors.email ? "border-red-400 bg-red-50/30" : "border-bg-secondary bg-background"} pl-10 pr-4 py-3 text-sm text-text-neutral focus:border-primary focus:outline-none transition-all`}
              disabled={loading}
            />
          </div>
          {errors.email && <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-red-500"><MdWarning className="h-3 w-3" />{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-neutral/70 mb-1.5">
            Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-neutral/40" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
              placeholder="••••••••"
              className={`w-full rounded-xl border ${errors.password ? "border-red-400 bg-red-50/30" : "border-bg-secondary bg-background"} pl-10 pr-12 py-3 text-sm text-text-neutral focus:border-primary focus:outline-none transition-all`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-neutral/40 hover:text-primary transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-red-500"><MdWarning className="h-3 w-3" />{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full mt-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In with Email"}
        </button>
      </form>

      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 w-full border-t border-bg-secondary"></div>
        <span className="relative bg-background px-4 text-xs font-semibold uppercase tracking-wider text-text-neutral/40">Or Continue With</span>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-bg-secondary bg-background py-3 text-sm font-semibold text-text-neutral hover:bg-bg-secondary transition-all disabled:opacity-50"
        disabled={loading}
      >
        <FcGoogle className="h-5 w-5" />
        Sign In with Google
      </button>

      {/* Demo Access */}
      <div className="rounded-xl bg-bg-secondary/50 border border-bg-secondary p-4 space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-text-neutral/70 uppercase tracking-wider">
          <RiFlashlightFill className="h-3.5 w-3.5 text-accent" />
          Demo Access Accounts
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => handleDemoLogin("user")} className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all duration-300" disabled={loading}>Demo User</button>
          <button onClick={() => handleDemoLogin("admin")} className="rounded-lg bg-accent/10 px-3 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-white transition-all duration-300" disabled={loading}>Demo Admin</button>
        </div>
        <p className="text-[10px] text-text-neutral/50 text-center">Clicks will auto-fill credentials and submit login.</p>
      </div>

      <p className="text-center text-xs text-text-neutral/60">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">Register Here</Link>
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
