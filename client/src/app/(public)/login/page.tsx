"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import GoogleButton from "@/components/auth/GoogleButton";
import DemoLoginButton from "@/components/auth/DemoLoginButton";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { MdWarning } from "react-icons/md";

// ---- Validation helper ----
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

  const handleDemoSelect = async (role: "user" | "admin") => {
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
        <AuthInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(val) => {
            setEmail(val);
            setErrors((p) => ({ ...p, email: undefined }));
          }}
          placeholder="name@example.com"
          error={errors.email}
          disabled={loading}
          icon={HiOutlineMail}
        />

        {/* Password */}
        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(val) => {
            setPassword(val);
            setErrors((p) => ({ ...p, password: undefined }));
          }}
          placeholder="••••••••"
          error={errors.password}
          disabled={loading}
          icon={HiOutlineLockClosed}
        />

        <AuthButton loading={loading}>Sign In</AuthButton>
      </form>

      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 w-full border-t border-bg-secondary"></div>
        <span className="relative bg-background px-4 text-xs font-semibold uppercase tracking-wider text-text-neutral/40">
          Or Continue With
        </span>
      </div>

      <GoogleButton onClick={handleGoogleLogin} disabled={loading} />

      {/* Demo Access */}
      <DemoLoginButton onSelectRole={handleDemoSelect} disabled={loading} />

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
      <Suspense
        fallback={
          <div className="w-full max-w-md animate-pulse border border-bg-secondary rounded-2xl p-8 bg-background space-y-6">
            <div className="h-6 w-1/3 mx-auto rounded bg-bg-secondary"></div>
            <div className="h-10 w-full rounded bg-bg-secondary"></div>
            <div className="h-10 w-full rounded bg-bg-secondary"></div>
            <div className="h-12 w-full rounded bg-bg-secondary"></div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
