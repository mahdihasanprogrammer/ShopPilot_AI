"use client";

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdWarning } from "react-icons/md";
import { IconType } from "react-icons";

interface AuthInputProps {
  label: string;
  type: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  icon?: IconType;
}

export default function AuthInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  icon: Icon,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-xs font-bold uppercase tracking-wider text-muted">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
        )}
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-xl border ${
            error
              ? "border-red-400 bg-red-50/30 focus:ring-red-200"
              : "border-border bg-card hover:border-border-hover focus:border-primary focus:ring-primary/10"
          } ${Icon ? "pl-11" : "px-4"} ${
            isPassword ? "pr-12" : "pr-4"
          } py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
            tabIndex={-1}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5" />
            ) : (
              <AiOutlineEye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-red-500">
          <MdWarning className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
