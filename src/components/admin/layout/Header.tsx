"use client";

import { useAuth } from "@/hooks/useAuth";
import { User } from "lucide-react";

interface HeaderProps {
  title: string;
  description?: string;
}

export default function Header({ title, description }: HeaderProps) {
  const user = useAuth((s) => s.user);

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md px-6 py-4">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
          <User size={16} className="text-gray-400" />
          <span className="text-sm text-gray-300 font-mono">
            {user?.name || user?.email || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
