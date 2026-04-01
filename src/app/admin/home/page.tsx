"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminShell from "@/components/admin/layout/AdminShell";
import Header from "@/components/admin/layout/Header";
import AdminButton from "@/components/admin/ui/AdminButton";
import { AdminInput, AdminTextarea } from "@/components/admin/ui/AdminInput";
import { CardSkeleton } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/hooks/useToast";
import { homeApi } from "@/api/home";
import { homeSchema } from "@/lib/schemas";
import type { HomeData } from "@/lib/types";
import { Save, Globe, Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function HomeEditorPage() {
  const queryClient = useQueryClient();
  const addToast = useToast((s) => s.addToast);

  const { data, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: homeApi.get,
  });

  const mutation = useMutation({
    mutationFn: homeApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home"] });
      addToast("success", "Home section updated successfully");
    },
    onError: () => addToast("error", "Failed to update home section"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<HomeData>({
    resolver: zodResolver(homeSchema),
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const onSubmit = (values: HomeData) => mutation.mutate(values);

  return (
    <AdminShell>
      <Header title="Home Section" description="Edit your hero / intro section" />
      <div className="p-6 max-w-3xl">
        {isLoading ? (
          <CardSkeleton />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                <Globe size={16} className="text-blue-400" />
                Basic Information
              </h2>
              <AdminInput
                label="Full Name"
                placeholder="Harena Rico"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
              <AdminInput
                label="Tagline / Subtitle"
                placeholder="Full-stack Mobile & Web Developer"
                error={errors.tagline?.message}
                {...register("tagline")}
              />
              <AdminTextarea
                label="Short Bio / Description"
                placeholder="Passionate developer..."
                error={errors.bio?.message}
                {...register("bio")}
              />
              <AdminInput
                label="Avatar / Profile Picture URL"
                placeholder="https://example.com/avatar.jpg"
                error={errors.avatarUrl?.message}
                {...register("avatarUrl")}
              />
            </div>

            {/* Social Links */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Social Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Github size={16} className="absolute left-3 top-9 text-gray-500" />
                  <AdminInput
                    label="GitHub"
                    placeholder="https://github.com/username"
                    className="pl-10"
                    error={errors.socialLinks?.github?.message}
                    {...register("socialLinks.github")}
                  />
                </div>
                <div className="relative">
                  <Linkedin size={16} className="absolute left-3 top-9 text-gray-500" />
                  <AdminInput
                    label="LinkedIn"
                    placeholder="https://linkedin.com/in/username"
                    className="pl-10"
                    error={errors.socialLinks?.linkedin?.message}
                    {...register("socialLinks.linkedin")}
                  />
                </div>
                <div className="relative">
                  <Twitter size={16} className="absolute left-3 top-9 text-gray-500" />
                  <AdminInput
                    label="Twitter"
                    placeholder="https://twitter.com/username"
                    className="pl-10"
                    error={errors.socialLinks?.twitter?.message}
                    {...register("socialLinks.twitter")}
                  />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-9 text-gray-500" />
                  <AdminInput
                    label="Email"
                    placeholder="hello@example.com"
                    className="pl-10"
                    error={errors.socialLinks?.email?.message}
                    {...register("socialLinks.email")}
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end">
              <AdminButton
                type="submit"
                isLoading={mutation.isPending}
                disabled={!isDirty}
              >
                <Save size={16} />
                Save Changes
              </AdminButton>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
