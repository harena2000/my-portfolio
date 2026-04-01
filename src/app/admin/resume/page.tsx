"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminShell from "@/components/admin/layout/AdminShell";
import Header from "@/components/admin/layout/Header";
import AdminButton from "@/components/admin/ui/AdminButton";
import { AdminInput, AdminTextarea } from "@/components/admin/ui/AdminInput";
import { CardSkeleton } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/hooks/useToast";
import { resumeApi } from "@/api/resume";
import { resumeSchema } from "@/lib/schemas";
import type { ResumeData } from "@/lib/types";
import {
  Save,
  Upload,
  Trash2,
  FileText,
  Plus,
  X,
  Award,
  Languages,
  GripVertical,
} from "lucide-react";

type ResumeFormData = {
  summary: string;
  skills: string[];
  certifications: { name: string; issuer: string; date: string; url: string }[];
  languages: { name: string; level: string }[];
};

export default function ResumePage() {
  const queryClient = useQueryClient();
  const addToast = useToast((s) => s.addToast);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [skillInput, setSkillInput] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["resume"],
    queryFn: resumeApi.get,
  });

  const updateMutation = useMutation({
    mutationFn: resumeApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
      addToast("success", "Resume content updated");
    },
    onError: () => addToast("error", "Failed to update resume"),
  });

  const uploadMutation = useMutation({
    mutationFn: resumeApi.uploadPdf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
      addToast("success", "PDF uploaded successfully");
    },
    onError: () => addToast("error", "Failed to upload PDF"),
  });

  const deletePdfMutation = useMutation({
    mutationFn: resumeApi.deletePdf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
      addToast("success", "PDF removed");
    },
    onError: () => addToast("error", "Failed to remove PDF"),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      summary: "",
      skills: [],
      certifications: [],
      languages: [],
    },
  });

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({ control, name: "certifications" });

  const {
    fields: langFields,
    append: appendLang,
    remove: removeLang,
  } = useFieldArray({ control, name: "languages" });

  const skills = watch("skills");

  useEffect(() => {
    if (data) {
      reset({
        summary: data.summary,
        skills: data.skills,
        certifications: data.certifications,
        languages: data.languages,
      });
    }
  }, [data, reset]);

  const onSubmit = (values: ResumeFormData) => {
    updateMutation.mutate(values);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        addToast("error", "Only PDF files are allowed");
        return;
      }
      uploadMutation.mutate(file);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setValue("skills", [...skills, skillInput.trim()], { shouldDirty: true });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skill),
      { shouldDirty: true }
    );
  };

  return (
    <AdminShell>
      <Header
        title="Resume"
        description="Upload PDF and edit resume content"
      />
      <div className="p-6 max-w-4xl space-y-6">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* ═══ PDF Upload Section ═══ */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                <FileText size={16} className="text-blue-400" />
                PDF Resume
              </h2>

              {data?.pdfUrl ? (
                <div className="space-y-4">
                  <iframe
                    src={data.pdfUrl}
                    className="w-full h-[400px] rounded-lg border border-white/10"
                    title="Resume PDF Preview"
                  />
                  <div className="flex gap-2">
                    <AdminButton
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={16} /> Replace PDF
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      onClick={() => deletePdfMutation.mutate()}
                      isLoading={deletePdfMutation.isPending}
                    >
                      <Trash2 size={16} /> Remove PDF
                    </AdminButton>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed
                    border-white/10 py-12 cursor-pointer hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-colors"
                >
                  <Upload size={32} className="text-gray-600 mb-3" />
                  <p className="text-sm text-gray-400">
                    Click to upload your resume PDF
                  </p>
                  <p className="text-xs text-gray-600 mt-1">PDF only, max 10MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              {uploadMutation.isPending && (
                <div className="flex items-center gap-2 text-sm text-blue-400">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Uploading...
                </div>
              )}
            </div>

            {/* ═══ Resume Content Editor ═══ */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Summary */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Summary / Objective
                </h2>
                <AdminTextarea
                  placeholder="A brief professional summary..."
                  error={errors.summary?.message}
                  {...register("summary")}
                />
              </div>

              {/* Skills */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Skills
                </h2>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill..."
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white
                      placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <AdminButton type="button" variant="secondary" onClick={addSkill}>
                    <Plus size={14} />
                  </AdminButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/15 px-3 py-1.5 text-xs text-blue-300"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-white transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                    <Award size={16} className="text-yellow-400" />
                    Certifications
                  </h2>
                  <AdminButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => appendCert({ name: "", issuer: "", date: "", url: "" })}
                  >
                    <Plus size={14} /> Add
                  </AdminButton>
                </div>
                {certFields.length === 0 ? (
                  <p className="text-sm text-gray-600">No certifications yet.</p>
                ) : (
                  <div className="space-y-3">
                    {certFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="rounded-lg border border-white/5 bg-white/[0.02] p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <GripVertical size={14} className="text-gray-600 mt-1" />
                          <button
                            type="button"
                            onClick={() => removeCert(index)}
                            className="rounded-lg p-1 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <AdminInput
                            placeholder="Certification name"
                            error={errors.certifications?.[index]?.name?.message}
                            {...register(`certifications.${index}.name`)}
                          />
                          <AdminInput
                            placeholder="Issuer"
                            error={errors.certifications?.[index]?.issuer?.message}
                            {...register(`certifications.${index}.issuer`)}
                          />
                          <AdminInput
                            placeholder="Date (e.g. 2024-01)"
                            error={errors.certifications?.[index]?.date?.message}
                            {...register(`certifications.${index}.date`)}
                          />
                          <AdminInput
                            placeholder="URL (optional)"
                            error={errors.certifications?.[index]?.url?.message}
                            {...register(`certifications.${index}.url`)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Languages */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                    <Languages size={16} className="text-green-400" />
                    Languages
                  </h2>
                  <AdminButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => appendLang({ name: "", level: "" })}
                  >
                    <Plus size={14} /> Add
                  </AdminButton>
                </div>
                {langFields.length === 0 ? (
                  <p className="text-sm text-gray-600">No languages added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {langFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <AdminInput
                            placeholder="Language"
                            error={errors.languages?.[index]?.name?.message}
                            {...register(`languages.${index}.name`)}
                          />
                          <AdminInput
                            placeholder="Level (e.g. Native, Fluent)"
                            error={errors.languages?.[index]?.level?.message}
                            {...register(`languages.${index}.level`)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLang(index)}
                          className="rounded-lg p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save */}
              <div className="flex justify-end">
                <AdminButton
                  type="submit"
                  isLoading={updateMutation.isPending}
                  disabled={!isDirty}
                >
                  <Save size={16} />
                  Save Resume Content
                </AdminButton>
              </div>
            </form>
          </>
        )}
      </div>
    </AdminShell>
  );
}
