"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";
import { MdCheckCircle } from "react-icons/md";
import { LuImagePlus, LuX } from "react-icons/lu";
import { toast } from "sonner";

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
  const passed = rules.filter((r) => r.passed).length;
  const barColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const strengthLabels = ["Too weak", "Weak", "Medium", "Strong"];
  const textColors = ["text-red-500", "text-orange-500", "text-yellow-500", "text-green-500"];

  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < passed ? barColors[passed - 1] : "bg-bg-secondary"
            }`}
          />
        ))}
      </div>
      {passed > 0 && (
        <p className={`text-[10px] font-bold ${textColors[passed - 1]}`}>
          {strengthLabels[passed - 1]}
        </p>
      )}
      <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
        {rules.map((r) => (
          <li
            key={r.label}
            className={`flex items-center gap-1 text-[10px] font-medium ${
              r.passed ? "text-green-500" : "text-muted"
            }`}
          >
            {r.passed ? (
              <MdCheckCircle className="h-3 w-3 shrink-0 text-green-500" />
            ) : (
              <span className="h-3 w-3 shrink-0 rounded-full border border-border inline-block" />
            )}
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
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
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
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
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
    if (passErrors.length > 0) {
      newErrors.password = `Password must contain: ${passErrors.join(", ")}.`;
    }

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
    if (!validate()) {
      toast.error("Please fill in all registration fields correctly.");
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      let imageUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
        name || email
      )}`;
      if (avatar) imageUrl = await uploadToImgBB(avatar);

      await signUp.email({
        email,
        password,
        name,
        image: imageUrl,
        callbackURL: "/dashboard/user",
      });
      toast.success("Account created successfully!");
      router.push("/dashboard/user");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-background transition-colors duration-250">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border p-8 bg-card shadow-lg transition-all hover:shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-heading">Create Account</h1>
          <p className="mt-2 text-sm text-body/75">Sign up to start shopping with ShopPilot AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-2 pb-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Profile Avatar (Optional)
            </label>
            <div className="relative group cursor-pointer h-20 w-20 rounded-full border-2 border-dashed border-primary/30 bg-bg-secondary overflow-hidden hover:border-primary transition-all">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted">
                  <LuImagePlus className="h-6 w-6" />
                  <span className="text-[9px] font-medium">Upload</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={loading}
              />
            </div>
            {avatar && (
              <button
                type="button"
                onClick={() => {
                  setAvatar(null);
                  setAvatarPreview(null);
                }}
                className="flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:underline cursor-pointer"
              >
                <LuX className="h-3 w-3" /> Remove image
              </button>
            )}
          </div>

          {/* Name */}
          <AuthInput
            label="Full Name"
            type="text"
            value={name}
            onChange={(val) => {
              setName(val);
              setErrors((p) => ({ ...p, name: undefined }));
            }}
            placeholder="John Doe"
            error={errors.name}
            disabled={loading}
            icon={HiOutlineUser}
          />

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
          <div className="space-y-1">
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
            <PasswordStrengthMeter password={password} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <AuthInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(val) => {
                setConfirmPassword(val);
                setErrors((p) => ({ ...p, confirmPassword: undefined }));
              }}
              placeholder="••••••••"
              error={errors.confirmPassword}
              disabled={loading}
              icon={HiOutlineLockClosed}
            />
            {confirmPassword && !errors.confirmPassword && password === confirmPassword && (
              <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-green-500">
                <MdCheckCircle className="h-3.5 w-3.5" />
                Passwords match
              </p>
            )}
          </div>

          <AuthButton loading={loading}>Create Account</AuthButton>
        </form>

        <p className="text-center text-xs text-body/75">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline cursor-pointer">
            Sign In Here
          </Link>
        </p>
      </div>
    </main>
  );
}
