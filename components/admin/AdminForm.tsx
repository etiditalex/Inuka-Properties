"use client";

import { cn } from "@/lib/admin/utils";

type AdminInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function AdminInput({ label, error, hint, className, id, ...props }: AdminInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-dark-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
          error && "border-red-400 focus:border-red-400 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-dark-400">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

type AdminTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function AdminTextarea({ label, error, hint, className, id, ...props }: AdminTextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-dark-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
          error && "border-red-400",
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-dark-400">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

type AdminSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
};

export function AdminSelect({ label, options, className, id, ...props }: AdminSelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-dark-700">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm text-dark-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type AdminToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
};

export function AdminToggle({ label, checked, onChange, description }: AdminToggleProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-dark-200 bg-dark-50/50 p-4 transition hover:bg-dark-50">
      <div>
        <p className="text-sm font-medium text-dark-800">{label}</p>
        {description && <p className="mt-0.5 text-xs text-dark-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary-600" : "bg-dark-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </label>
  );
}
