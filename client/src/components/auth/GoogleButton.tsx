"use client";

import { FcGoogle } from "react-icons/fc";

interface GoogleButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
}

export default function GoogleButton({
  onClick,
  disabled = false,
  text = "Continue with Google",
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-heading hover:bg-bg-secondary transition-all disabled:opacity-50 cursor-pointer shadow-xs"
    >
      <FcGoogle className="h-5 w-5 shrink-0" />
      <span>{text}</span>
    </button>
  );
}
