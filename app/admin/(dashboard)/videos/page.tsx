"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star, Video as VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoForm } from "@/components/admin/VideoForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { VideoDTO } from "@/types";
import type { VideoInput } from "@/lib/validations";

export default function AdminVideosPage() {
  const { toast } = useToast();
  const [videos, setVideos] = React.useState<VideoDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<VideoDTO | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<VideoDTO | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/videos");
    setVideos(await res.json());
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const handleSubmit = async (data: VideoInput) => {
    setSubmitting(true);
    try {
      const res = await fetch(editing ? `/api/videos/${editing._id}` : "/api/videos", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save video.");
      toast({ title: editing ? "Video updated." : "Video created.", variant: "success" });
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFeatured = async (v: VideoDTO) => {
    await fetch(`/api/videos/${v._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !v.featured }),
    });
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/videos/${deleteTarget._id}`, { method: "DELETE" });
      toast({ title: "Video deleted.", variant: "success" });
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
          <h1 className="font-display text-2xl md:text-3xl text-brown-900">Videos</h1>
          <p className="font-body text-warm-grey mt-1">{videos.length} total</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Video
        </Button>
      </div>

      <div className="mt-8 border border-brown-200 bg-cream overflow-x-auto">
        {loading ? (
          <p className="font-body text-sm text-warm-grey p-6">Loading...</p>
        ) : videos.length === 0 ? (
          <p className="font-body text-sm text-warm-grey p-6">No videos yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brown-200 text-xs uppercase tracking-wide text-warm-grey font-body">
                <th className="p-4">Video</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v._id} className="border-b border-brown-100 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 bg-brown-100 shrink-0 overflow-hidden flex items-center justify-center">
                        {v.thumbnail?.secure_url ? (
                          <Image src={v.thumbnail.secure_url} alt={v.name} fill sizes="48px" className="object-cover" />
                        ) : (
                          <VideoIcon className="h-5 w-5 text-brown-400" />
                        )}
                      </div>
                      <p className="font-body text-sm text-brown-900">{v.name}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <button onClick={() => toggleFeatured(v)} className="focus-ring" aria-label="Toggle featured">
                      <Star className={cn("h-5 w-5", v.featured ? "fill-brown-500 text-brown-500" : "text-brown-300")} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditing(v); setDialogOpen(true); }} className="p-2 text-brown-600 hover:text-brown-900 focus-ring" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(v)} className="p-2 text-destructive hover:opacity-70 focus-ring" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Video" : "Add Video"}</DialogTitle>
          </DialogHeader>
          <VideoForm initial={editing || undefined} onSubmit={handleSubmit} submitting={submitting} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this video?"
        description={`"${deleteTarget?.name}" will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
