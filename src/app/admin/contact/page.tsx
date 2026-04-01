"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminShell from "@/components/admin/layout/AdminShell";
import Header from "@/components/admin/layout/Header";
import AdminButton from "@/components/admin/ui/AdminButton";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import Badge from "@/components/admin/ui/Badge";
import { TableSkeleton } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/hooks/useToast";
import { contactApi } from "@/api/contact";
import { CONTACT_STATUSES } from "@/lib/constants";
import type { ContactMessage } from "@/lib/types";
import {
  Trash2,
  Mail,
  MailOpen,
  Archive,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";

export default function ContactPage() {
  const queryClient = useQueryClient();
  const addToast = useToast((s) => s.addToast);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["contact", filterStatus],
    queryFn: () =>
      contactApi.getAll(filterStatus === "all" ? undefined : filterStatus),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactMessage["status"] }) =>
      contactApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      addToast("success", "Status updated");
    },
    onError: () => addToast("error", "Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: contactApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      addToast("success", "Message deleted");
      setDeleteTarget(null);
    },
    onError: () => addToast("error", "Failed to delete message"),
  });

  const unreadCount = messages.filter((m) => m.status === "Unread").length;

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (selectedIds.size === messages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(messages.map((m) => m.id)));
    }
  };

  const markAllRead = () => {
    const unread = messages.filter(
      (m) => m.status === "Unread" && (selectedIds.size === 0 || selectedIds.has(m.id))
    );
    unread.forEach((m) =>
      updateStatusMutation.mutate({ id: m.id, status: "Read" })
    );
  };

  const deleteSelected = () => {
    selectedIds.forEach((id) => deleteMutation.mutate(id));
    setSelectedIds(new Set());
  };

  const toggleExpand = (msg: ContactMessage) => {
    if (expandedId === msg.id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg.id);
      if (msg.status === "Unread") {
        updateStatusMutation.mutate({ id: msg.id, status: "Read" });
      }
    }
  };

  const statusBadge = (status: string) => {
    const v =
      status === "Unread" ? "warning" : status === "Read" ? "info" : "default";
    return <Badge variant={v}>{status}</Badge>;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <AdminShell>
      <Header
        title="Contact Messages"
        description={`Inbox — ${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`}
      />
      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {["all", ...CONTACT_STATUSES].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {status === "all" ? "All" : status}
                {status === "Unread" && unreadCount > 0 && (
                  <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <>
                <AdminButton variant="ghost" size="sm" onClick={markAllRead}>
                  <CheckCheck size={14} />
                  Mark Read
                </AdminButton>
                <AdminButton variant="danger" size="sm" onClick={deleteSelected}>
                  <Trash2 size={14} />
                  Delete ({selectedIds.size})
                </AdminButton>
              </>
            )}
            <AdminButton variant="ghost" size="sm" onClick={markAllRead}>
              <MailOpen size={14} />
              Mark All Read
            </AdminButton>
          </div>
        </div>

        {/* Messages List */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Mail size={48} className="mb-4 opacity-30" />
            <p>No messages found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Select all */}
            <div className="flex items-center gap-3 px-4 py-2">
              <input
                type="checkbox"
                checked={selectedIds.size === messages.length && messages.length > 0}
                onChange={selectAll}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600"
              />
              <span className="text-xs text-gray-500">
                Select all ({messages.length})
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl border transition-colors ${
                  msg.status === "Unread"
                    ? "border-blue-500/20 bg-blue-500/[0.03]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => toggleExpand(msg)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(msg.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelect(msg.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600"
                  />
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      msg.status === "Unread"
                        ? "bg-blue-600/20 text-blue-400"
                        : "bg-white/5 text-gray-500"
                    }`}
                  >
                    <User size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          msg.status === "Unread"
                            ? "font-semibold text-white"
                            : "text-gray-300"
                        }`}
                      >
                        {msg.senderName}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {msg.senderEmail}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(msg.status)}
                    <span className="text-xs text-gray-600 font-mono whitespace-nowrap">
                      {formatDate(msg.dateReceived)}
                    </span>
                    {expandedId === msg.id ? (
                      <ChevronUp size={16} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {expandedId === msg.id && (
                  <div className="border-t border-white/5 px-4 py-4 ml-[52px]">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      {msg.status !== "Read" && (
                        <AdminButton
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateStatusMutation.mutate({ id: msg.id, status: "Read" })
                          }
                        >
                          <MailOpen size={14} /> Mark Read
                        </AdminButton>
                      )}
                      {msg.status !== "Archived" && (
                        <AdminButton
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateStatusMutation.mutate({ id: msg.id, status: "Archived" })
                          }
                        >
                          <Archive size={14} /> Archive
                        </AdminButton>
                      )}
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(msg)}
                      >
                        <Trash2 size={14} /> Delete
                      </AdminButton>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete Message"
        message={`Delete message from "${deleteTarget?.senderName}"? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </AdminShell>
  );
}
