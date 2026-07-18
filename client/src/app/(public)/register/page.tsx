"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";
import { MdWarning, MdCheckCircle } from "react-icons/md";
import { LuImagePlus, LuX } from "react-icons/lu";

// ---- Validation helpers ----
function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
  return null;
}

function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 6) errors.push("At least 6 characters");
  if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("One number");
  return errors;
}

// ---- Password strength meter ----
function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const rules = [
    { label: "6+ characters", passed: password.length >= 6 },
    { label: "Uppercase (A-Z)", passed: /[A-Z]/.test(password) },
    { label: "Lowercase (a-z)", passed: /[a-z]/.test(password) },
    { label: "Number (0-9)", passed: /[0-9]/.test(password) },
  ];
  const passed = rules.filter(r => r.passed).length;
  const barColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const strengthLabels = ["Too weak", "Weak", "Medium", "Strong"];
  const textColors = ["text-red-500", "text-orange-500", "text-yellow-600", "text-green-600"];

  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passed ? barColors[passed - 1] : "bg-bg-secondary"}`} />
        ))}
      </div>
      {passed > 0 && (
        <p className={`text-[10px] font-bold ${textColors[passed - 1]}`}>{strengthLabels[passed - 1]}</p>
      )}
      <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
        {rules.map(r => (
          <li key={r.label} className={`flex items-center gap-1 text-[10px] font-medium ${r.passed ? "text-green-600" : "text-text-neutral/40"}`}>
            {r.passed
              ? <MdCheckCircle className="h-3 w-3 shrink-0 text-green-500" />
              : <span className="h-3 w-3 shrink-0 rounded-full border border-text-neutral/20 inline-block" />
            }
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string; email?: string; password?: string; confirmPassword?: string; form?: string;
  }>({});

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name || email)}`;
    }
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Failed to upload avatar. Please try again.");
    const result = await response.json();
    if (!result.success || !result.data?.url) throw new Error("Image upload failed.");
    return result.data.url;
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Full name is required.";
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;
    const passErrors = validatePassword(password);
    if (passErrors.length > 0) newErrors.password = `Password must contain: ${passErrors.join(", ")}.`;
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      let imageUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name || email)}`;
      if (avatar) imageUrl = await uploadToImgBB(avatar);

      await signUp.email({ email, password, name, image: imageUrl, callbackURL: "/dashboard/user" });
      router.push("/dashboard/user");
      router.refresh();
    } catch (err: any) {
      setErrors({ form: err.message || "Registration failed. Please try again." });
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-bg-secondary">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-bg-secondary p-8 bg-background shadow-lg transition-all hover:shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-text-neutral">Create Account</h1>
          <p className="mt-2 text-sm text-text-neutral/60">Sign up to start shopping with ShopPilot AI</p>
        </div>

        {errors.form && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-xs font-semibold text-red-600 border border-red-100">
            <MdWarning className="h-4 w-4 shrink-0" />
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-2 pb-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-neutral/70">Profile Avatar (Optional)</label>
            <div className="relative group cursor-pointer h-20 w-20 rounded-full border-2 border-dashed border-primary/30 bg-bg-secondary overflow-hidden hover:border-primary transition-all">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-text-neutral/40">
                  <LuImagePlus className="h-6 w-6" />
                  <span className="text-[9px] font-medium">Upload</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={loading} />
            </div>
            {avatar && (
              <button
                type="button"
                onClick={() => { setAvatar(null); setAvatarPreview(null); }}
                className="flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:underline"
              >
                <LuX className="h-3 w-3" /> Remove image
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-neutral/70 mb-1.5">Full Name</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-neutral/40" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                placeholder="John Doe"
                className={`w-full rounded-xl border ${errors.name ? "border-red-400 bg-red-50/30" : "border-bg-secondary bg-background"} pl-10 pr-4 py-3 text-sm text-text-neutral focus:border-primary focus:outline-none transition-all`}
                disabled={loading}
              />
            </div>
            {errors.name && <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-red-500"><MdWarning className="h-3 w-3" />{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-neutral/70 mb-1.5">Email Address</label>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-neutral/70 mb-1.5">Password</label>
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
              <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-neutral/40 hover:text-primary transition-colors" tabIndex={-1} aria-label="Toggle password">
                {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-red-500"><MdWarning className="h-3 w-3" />{errors.password}</p>}
            <PasswordStrengthMeter password={password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-neutral/70 mb-1.5">Confirm Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-neutral/40" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: undefined })); }}
                placeholder="••••••••"
                className={`w-full rounded-xl border ${errors.confirmPassword ? "border-red-400 bg-red-50/30" : "border-bg-secondary bg-background"} pl-10 pr-12 py-3 text-sm text-text-neutral focus:border-primary focus:outline-none transition-all`}
                disabled={loading}
              />
              <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-neutral/40 hover:text-primary transition-colors" tabIndex={-1} aria-label="Toggle confirm password">
                {showConfirm ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-red-500"><MdWarning className="h-3 w-3" />{errors.confirmPassword}</p>}
            {confirmPassword && !errors.confirmPassword && password === confirmPassword && (
              <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-green-600"><MdCheckCircle className="h-3.5 w-3.5" />Passwords match</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-text-neutral/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">Sign In Here</Link>
        </p>
      </div>
    </main>
  );
}
