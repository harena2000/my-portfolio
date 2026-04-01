"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminShell from "@/components/admin/layout/AdminShell";
import Header from "@/components/admin/layout/Header";
import AdminButton from "@/components/admin/ui/AdminButton";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import AdminSelect from "@/components/admin/ui/AdminSelect";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import Badge from "@/components/admin/ui/Badge";
import { TableSkeleton } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/hooks/useToast";
import { skillsApi } from "@/api/skills";
import { skillSchema } from "@/lib/schemas";
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from "@/lib/constants";
import type { Skill } from "@/lib/types";
import { Plus, Pencil, Trash2, GripVertical, Layers } from "lucide-react";

type SkillFormData = Omit<Skill, "id" | "order">;

export default function SkillsPage() {
  const queryClient = useQueryClient();
  const addToast = useToast((s) => s.addToast);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: skillsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: skillsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      addToast("success", "Skill created successfully");
      closeModal();
    },
    onError: () => addToast("error", "Failed to create skill"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Skill> }) =>
      skillsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      addToast("success", "Skill updated successfully");
      closeModal();
    },
    onError: () => addToast("error", "Failed to update skill"),
  });

  const deleteMutation = useMutation({
    mutationFn: skillsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      addToast("success", "Skill deleted");
      setDeleteTarget(null);
    },
    onError: () => addToast("error", "Failed to delete skill"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
  });

  const openCreate = () => {
    setEditingSkill(null);
    reset({ name: "", iconUrl: "", category: "", proficiency: "Intermediate" });
    setIsModalOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditingSkill(skill);
    reset(skill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const onSubmit = (data: SkillFormData) => {
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill.id, data });
    } else {
      createMutation.mutate(data as Omit<Skill, "id">);
    }
  };

  const filtered =
    filterCategory === "all"
      ? skills
      : skills.filter((s) => s.category === filterCategory);

  const grouped = filtered.reduce(
    (acc, skill) => {
      (acc[skill.category] = acc[skill.category] || []).push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  const profBadge = (p: string) => {
    const v = p === "Expert" ? "success" : p === "Intermediate" ? "info" : "warning";
    return <Badge variant={v}>{p}</Badge>;
  };

  return (
    <AdminShell>
      <Header title="Skills" description="Manage your technical skills" />
      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="all" className="bg-[#0f0f0f]">All Categories</option>
              {SKILL_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#0f0f0f]">{c}</option>
              ))}
            </select>
            <span className="text-xs text-gray-500 font-mono">
              {filtered.length} skill{filtered.length !== 1 && "s"}
            </span>
          </div>
          <AdminButton onClick={openCreate}>
            <Plus size={16} />
            Add Skill
          </AdminButton>
        </div>

        {/* Content */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Layers size={48} className="mb-4 opacity-30" />
            <p>No skills found. Add your first skill!</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">
                {category}
              </h3>
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 text-left">
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 w-8"></th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">Icon</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">Proficiency</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorySkills.map((skill) => (
                      <tr
                        key={skill.id}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <GripVertical size={14} className="text-gray-600 cursor-grab" />
                        </td>
                        <td className="px-4 py-3 text-sm text-white font-medium">
                          {skill.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                          {skill.iconUrl}
                        </td>
                        <td className="px-4 py-3">{profBadge(skill.proficiency)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(skill)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(skill)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSkill ? "Edit Skill" : "Add Skill"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AdminInput
            label="Name"
            placeholder="React"
            error={errors.name?.message}
            {...register("name")}
          />
          <AdminInput
            label="Icon URL or Slug"
            placeholder="react"
            error={errors.iconUrl?.message}
            {...register("iconUrl")}
          />
          <AdminSelect
            label="Category"
            error={errors.category?.message}
            options={SKILL_CATEGORIES.map((c) => ({ value: c, label: c }))}
            {...register("category")}
          />
          <AdminSelect
            label="Proficiency"
            error={errors.proficiency?.message}
            options={PROFICIENCY_LEVELS.map((p) => ({ value: p, label: p }))}
            {...register("proficiency")}
          />
          <div className="flex justify-end gap-3 pt-2">
            <AdminButton variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingSkill ? "Update" : "Create"}
            </AdminButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete Skill"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </AdminShell>
  );
}
