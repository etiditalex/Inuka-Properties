"use client";

import { cn } from "@/lib/admin/utils";

type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export default function AdminButton({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: AdminButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 font-montserrat disabled:opacity-50",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        variant === "primary" &&
          "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-900/20 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl",
        variant === "secondary" &&
          "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg shadow-secondary-900/20 hover:from-secondary-600 hover:to-secondary-700",
        variant === "ghost" && "text-dark-600 hover:bg-dark-100",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        variant === "outline" &&
          "border border-dark-200 bg-white text-dark-700 hover:border-primary-300 hover:bg-primary-50",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  );
}
