"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminShell from "@/components/admin/layout/AdminShell";
import Header from "@/components/admin/layout/Header";
import AdminButton from "@/components/admin/ui/AdminButton";
import { AdminInput, AdminTextarea } from "@/components/admin/ui/AdminInput";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import Badge from "@/components/admin/ui/Badge";
import TagInput from "@/components/admin/ui/TagInput";
import { TableSkeleton } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/hooks/useToast";
import { projectsApi } from "@/api/projects";
import { projectSchema } from "@/lib/schemas";
import type { Project } from "@/lib/types";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  ExternalLink,
  Github,
  Search,
} from "lucide-react";

type ProjectFormData = Omit<Project, "id">;

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const addToast = useToast((s) => s.addToast);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<string>("all");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      addToast("success", "Project created");
      closeModal();
    },
    onError: () => addToast("error", "Failed to create project"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      addToast("success", "Project updated");
      closeModal();
    },
    onError: () => addToast("error", "Failed to update project"),
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      addToast("success", "Project deleted");
      setDeleteTarget(null);
    },
    onError: () => addToast("error", "Failed to delete project"),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      projectsApi.update(id, { featured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const openCreate = () => {
    setEditingProject(null);
    reset({
      title: "",
      shortDescription: "",
      fullDescription: "",
      techStack: [],
      thumbnailUrl: "",
      liveDemoUrl: "",
      githubUrl: "",
      featured: false,
      displayOrder: 0,
    });
    setIsModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    reset(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const onSubmit = (data: ProjectFormData) => {
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filtered = projects
    .filter((p) => {
      if (filterFeatured === "featured") return p.featured;
      if (filterFeatured === "regular") return !p.featured;
      return true;
    })
    .filter(
      (p) =>
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.techStack.some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        )
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <AdminShell>
      <Header title="Projects" description="Manage your portfolio projects" />
      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-sm text-white
                  placeholder:text-gray-500 focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="all" className="bg-[#0f0f0f]">All</option>
              <option value="featured" className="bg-[#0f0f0f]">Featured</option>
              <option value="regular" className="bg-[#0f0f0f]">Regular</option>
            </select>
            <span className="text-xs text-gray-500 font-mono">
              {filtered.length} project{filtered.length !== 1 && "s"}
            </span>
          </div>
          <AdminButton onClick={openCreate}>
            <Plus size={16} />
            Add Project
          </AdminButton>
        </div>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p>No projects found.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">#</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Title</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Tech Stack</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Featured</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Links</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                      {project.displayOrder}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-white">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {project.shortDescription}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((t) => (
                          <Badge key={t} variant="info">
                            {t}
                          </Badge>
                        ))}
                        {project.techStack.length > 3 && (
                          <Badge>+{project.techStack.length - 3}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          toggleFeatured.mutate({
                            id: project.id,
                            featured: !project.featured,
                          })
                        }
                        className={`rounded-lg p-1.5 transition-colors ${
                          project.featured
                            ? "text-yellow-400 hover:bg-yellow-500/10"
                            : "text-gray-600 hover:bg-white/10 hover:text-gray-400"
                        }`}
                      >
                        <Star size={16} fill={project.featured ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {project.liveDemoUrl && (
                          <a
                            href={project.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-gray-400 hover:text-white transition-colors"
                          >
                            <Github size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(project)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(project)}
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
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProject ? "Edit Project" : "New Project"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AdminInput
            label="Title"
            placeholder="My Awesome Project"
            error={errors.title?.message}
            {...register("title")}
          />
          <AdminInput
            label="Short Description"
            placeholder="Brief summary..."
            error={errors.shortDescription?.message}
            {...register("shortDescription")}
          />
          <AdminTextarea
            label="Full Description (Markdown supported)"
            placeholder="Detailed project description..."
            error={errors.fullDescription?.message}
            {...register("fullDescription")}
          />
          <Controller
            name="techStack"
            control={control}
            render={({ field }) => (
              <TagInput
                label="Tech Stack"
                value={field.value}
                onChange={field.onChange}
                placeholder="React, Node.js..."
                error={errors.techStack?.message}
              />
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Thumbnail URL"
              placeholder="https://..."
              error={errors.thumbnailUrl?.message}
              {...register("thumbnailUrl")}
            />
            <AdminInput
              label="Live Demo URL"
              placeholder="https://..."
              error={errors.liveDemoUrl?.message}
              {...register("liveDemoUrl")}
            />
            <AdminInput
              label="GitHub URL"
              placeholder="https://github.com/..."
              error={errors.githubUrl?.message}
              {...register("githubUrl")}
            />
            <AdminInput
              label="Display Order"
              type="number"
              error={errors.displayOrder?.message}
              {...register("displayOrder", { valueAsNumber: true })}
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500/50"
              {...register("featured")}
            />
            <span className="text-sm text-gray-300">Featured project</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <AdminButton variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingProject ? "Update" : "Create"}
            </AdminButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </AdminShell>
  );
}
