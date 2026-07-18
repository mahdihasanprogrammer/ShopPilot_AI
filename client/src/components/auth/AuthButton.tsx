"use client";

import { RiLoader4Line } from "react-icons/ri";

interface AuthButtonProps {
  children: React.ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function AuthButton({
  children,
  type = "submit",
  onClick,
  loading = false,
  disabled = false,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50"
    >
      {loading ? (
        <>
          <RiLoader4Line className="h-4.5 w-4.5 animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
