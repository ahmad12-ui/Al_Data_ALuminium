"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { formatDate, cn } from "@/lib/utils";
import type { ProjectDTO } from "@/types";
import type { ProjectInput } from "@/lib/validations";

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = React.useState<ProjectDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ProjectDTO | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<ProjectDTO | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/projects");
    setProjects(await res.json());
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (p: ProjectDTO) => {
    setEditing(p);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: ProjectInput) => {
    setSubmitting(true);
    try {
      const res = await fetch(editing ? `/api/projects/${editing._id}` : "/api/projects", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save project.");
      toast({ title: editing ? "Project updated." : "Project created.", variant: "success" });
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFeatured = async (p: ProjectDTO) => {
    await fetch(`/api/projects/${p._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    });
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/projects/${deleteTarget._id}`, { method: "DELETE" });
      toast({ title: "Project deleted.", variant: "success" });
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-brown-900">Projects</h1>
          <p className="font-body text-warm-grey mt-1">{projects.length} total</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="mt-8 border border-brown-200 bg-cream overflow-x-auto">
        {loading ? (
          <p className="font-body text-sm text-warm-grey p-6">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="font-body text-sm text-warm-grey p-6">No projects yet. Add your first one.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brown-200 text-xs uppercase tracking-wide text-warm-grey font-body">
                <th className="p-4">Project</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const cover = p.featuredImage?.secure_url || p.images?.[0]?.secure_url;
                return (
                  <tr key={p._id} className="border-b border-brown-100 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 bg-brown-100 shrink-0 overflow-hidden">
                          {cover && <Image src={cover} alt={p.name} fill sizes="48px" className="object-cover" />}
                        </div>
                        <div>
                          <p className="font-body text-sm text-brown-900">{p.name}</p>
                          <p className="font-body text-xs text-warm-grey">{p.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-body text-sm text-brown-700">{p.category}</td>
                    <td className="p-4 font-body text-sm text-brown-700">{formatDate(p.date)}</td>
                    <td className="p-4">
                      <button onClick={() => toggleFeatured(p)} className="focus-ring" aria-label="Toggle featured">
                        <Star className={cn("h-5 w-5", p.featured ? "fill-brown-500 text-brown-500" : "text-brown-300")} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-brown-600 hover:text-brown-900 focus-ring" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-2 text-destructive hover:opacity-70 focus-ring" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <ProjectForm initial={editing || undefined} onSubmit={handleSubmit} submitting={submitting} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this project?"
        description={`"${deleteTarget?.name}" and its images will be permanently removed. This can't be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
