"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminShell from "@/components/admin/layout/AdminShell";
import Header from "@/components/admin/layout/Header";
import AdminButton from "@/components/admin/ui/AdminButton";
import { AdminInput, AdminTextarea } from "@/components/admin/ui/AdminInput";
import AdminSelect from "@/components/admin/ui/AdminSelect";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import Badge from "@/components/admin/ui/Badge";
import { CardSkeleton } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/hooks/useToast";
import { experienceApi } from "@/api/experience";
import { experienceSchema } from "@/lib/schemas";
import { EXPERIENCE_TYPES } from "@/lib/constants";
import type { Experience } from "@/lib/types";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
} from "lucide-react";

type ExperienceFormData = Omit<Experience, "id">;

export default function ExperiencePage() {
  const queryClient = useQueryClient();
  const addToast = useToast((s) => s.addToast);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["experience"],
    queryFn: experienceApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: experienceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      addToast("success", "Entry created");
      closeModal();
    },
    onError: () => addToast("error", "Failed to create entry"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Experience> }) =>
      experienceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      addToast("success", "Entry updated");
      closeModal();
    },
    onError: () => addToast("error", "Failed to update entry"),
  });

  const deleteMutation = useMutation({
    mutationFn: experienceApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      addToast("success", "Entry deleted");
      setDeleteTarget(null);
    },
    onError: () => addToast("error", "Failed to delete entry"),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
  });

  const isPresent = watch("isPresent");

  const openCreate = () => {
    setEditingEntry(null);
    reset({
      type: "Work",
      companyOrSchool: "",
      roleOrDegree: "",
      location: "",
      startDate: "",
      endDate: null,
      isPresent: false,
      description: "",
      logoUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (entry: Experience) => {
    setEditingEntry(entry);
    reset(entry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const onSubmit = (data: ExperienceFormData) => {
    if (data.isPresent) data.endDate = null;
    if (editingEntry) {
      updateMutation.mutate({ id: editingEntry.id, data });
    } else {
      createMutation.mutate(data as Omit<Experience, "id">);
    }
  };

  const filtered =
    filterType === "all"
      ? entries
      : entries.filter((e) => e.type === filterType);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });

  return (
    <AdminShell>
      <Header title="Experience" description="Manage your work & education timeline" />
      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {["all", ...EXPERIENCE_TYPES].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filterType === type
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {type === "all" ? "All" : type}
              </button>
            ))}
          </div>
          <AdminButton onClick={openCreate}>
            <Plus size={16} />
            Add Entry
          </AdminButton>
        </div>

        {/* Timeline */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p>No entries found. Add your first experience!</p>
          </div>
        ) : (
          <div className="relative space-y-4 pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {sorted.map((entry) => (
              <div
                key={entry.id}
                className="relative rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/15 transition-colors"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[23px] top-6 h-3 w-3 rounded-full border-2 ${
                    entry.type === "Work"
                      ? "border-blue-500 bg-blue-500/30"
                      : "border-green-500 bg-green-500/30"
                  }`}
                />

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={entry.type === "Work" ? "info" : "success"}>
                        {entry.type === "Work" ? (
                          <span className="flex items-center gap-1">
                            <Briefcase size={10} /> Work
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <GraduationCap size={10} /> Education
                          </span>
                        )}
                      </Badge>
                      {entry.isPresent && (
                        <Badge variant="success">Present</Badge>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      {entry.roleOrDegree}
                    </h3>
                    <p className="text-sm text-gray-400">{entry.companyOrSchool}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {entry.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(entry.startDate)} —{" "}
                        {entry.isPresent ? "Present" : entry.endDate ? formatDate(entry.endDate) : "N/A"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-3">{entry.description}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => openEdit(entry)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(entry)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingEntry ? "Edit Entry" : "New Entry"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AdminSelect
            label="Type"
            error={errors.type?.message}
            options={EXPERIENCE_TYPES.map((t) => ({ value: t, label: t }))}
            {...register("type")}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Company / School"
              placeholder="Google"
              error={errors.companyOrSchool?.message}
              {...register("companyOrSchool")}
            />
            <AdminInput
              label="Role / Degree"
              placeholder="Software Engineer"
              error={errors.roleOrDegree?.message}
              {...register("roleOrDegree")}
            />
          </div>
          <AdminInput
            label="Location"
            placeholder="San Francisco, CA"
            error={errors.location?.message}
            {...register("location")}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Start Date"
              type="date"
              error={errors.startDate?.message}
              {...register("startDate")}
            />
            <div>
              <AdminInput
                label="End Date"
                type="date"
                disabled={isPresent}
                error={errors.endDate?.message}
                {...register("endDate")}
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600"
                  {...register("isPresent")}
                  onChange={(e) => {
                    setValue("isPresent", e.target.checked);
                    if (e.target.checked) setValue("endDate", null);
                  }}
                />
                <span className="text-xs text-gray-400">Currently here</span>
              </label>
            </div>
          </div>
          <AdminTextarea
            label="Description / Responsibilities"
            placeholder="Describe your role..."
            error={errors.description?.message}
            {...register("description")}
          />
          <AdminInput
            label="Logo URL"
            placeholder="https://..."
            error={errors.logoUrl?.message}
            {...register("logoUrl")}
          />
          <div className="flex justify-end gap-3 pt-2">
            <AdminButton variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingEntry ? "Update" : "Create"}
            </AdminButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete Entry"
        message={`Are you sure you want to delete "${deleteTarget?.roleOrDegree} at ${deleteTarget?.companyOrSchool}"?`}
        isLoading={deleteMutation.isPending}
      />
    </AdminShell>
  );
}
