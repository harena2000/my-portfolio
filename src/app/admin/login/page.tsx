"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import AdminButton from "@/components/admin/ui/AdminButton";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import ToastContainer from "@/components/admin/ui/ToastContainer";
import { Lock } from "lucide-react";
import type { LoginCredentials } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const addToast = useToast((s) => s.addToast);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      await login(data);
      addToast("success", "Login successful");
      router.push("/admin/dashboard");
    } catch {
      addToast("error", "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/15 border border-blue-500/20">
            <Lock size={24} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            <span className="text-blue-500">Admin</span> Login
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-6"
        >
          <AdminInput
            label="Email"
            type="email"
            placeholder="admin@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <AdminInput
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <AdminButton type="submit" isLoading={isLoading} className="w-full">
            Sign In
          </AdminButton>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
