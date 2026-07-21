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
import { toast } from "sonner";

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
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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
    if (!validate()) {
      toast.error("Please enter email and password correctly.");
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await signIn.email({ email, password, callbackURL: callbackUrl });
      toast.success("Welcome back!");
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn.social({ provider: "google", callbackURL: callbackUrl });
    } catch (err: any) {
      toast.error(err.message || "Google authentication failed.");
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
      toast.success(`Logged in as Demo ${role}`);
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || `Demo ${role} login failed.`);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-border p-8 bg-card shadow-lg transition-all hover:shadow-xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-heading">Welcome Back</h1>
        <p className="mt-2 text-sm text-body/75">Sign in to your ShopPilot account</p>
      </div>

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
        <div className="absolute inset-0 w-full border-t border-border"></div>
        <span className="relative bg-card px-4 text-xs font-semibold uppercase tracking-wider text-muted">
          Or Continue With
        </span>
      </div>

      <GoogleButton onClick={handleGoogleLogin} disabled={loading} />

      {/* Demo Access */}
      <DemoLoginButton onSelectRole={handleDemoSelect} disabled={loading} />

      <p className="text-center text-xs text-body/75">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline cursor-pointer">
          Register Here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-background transition-colors duration-250">
      <Suspense
        fallback={
          <div className="w-full max-w-md animate-pulse border border-border rounded-2xl p-8 bg-card space-y-6">
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
