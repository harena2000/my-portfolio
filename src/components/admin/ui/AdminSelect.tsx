"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50
          transition-colors ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      >
        <option value="" className="bg-[#0f0f0f]">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0f0f0f]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);
AdminSelect.displayName = "AdminSelect";

export default AdminSelect;
