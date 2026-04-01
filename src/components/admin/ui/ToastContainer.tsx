"use client";

import { useToast } from "@/hooks/useToast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const icons = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error: <AlertCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-blue-400" />,
};

const borders = {
  success: "border-green-500/30",
  error: "border-red-500/30",
  info: "border-blue-500/30",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-lg border ${borders[toast.type]}
            bg-[#1a1a1a] px-4 py-3 shadow-xl animate-in slide-in-from-right-full`}
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm text-white">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
