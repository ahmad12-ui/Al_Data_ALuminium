"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HeroSlideForm } from "@/components/admin/HeroSlideForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import type { HeroSlideDTO } from "@/types";
import type { HeroSlideInput } from "@/lib/validations";

export default function AdminHeroSlidesPage() {
  const { toast } = useToast();
  const [slides, setSlides] = React.useState<HeroSlideDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<HeroSlideDTO | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<HeroSlideDTO | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/hero-slides");
    setSlides(await res.json());
    setLoading(false);
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const handleSubmit = async (data: HeroSlideInput) => {
    setSubmitting(true);
    try {
      const res = await fetch(editing ? `/api/hero-slides/${editing._id}` : "/api/hero-slides", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save slide.");
      toast({ title: editing ? "Slide updated." : "Slide created.", variant: "success" });
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (s: HeroSlideDTO) => {
    await fetch(`/api/hero-slides/${s._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    load();
  };

  const swapOrder = async (index: number, direction: -1 | 1) => {
    const target = slides[index + direction];
    const current = slides[index];
    if (!target) return;
    await Promise.all([
      fetch(`/api/hero-slides/${current._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: target.order }),
      }),
      fetch(`/api/hero-slides/${target._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: current.order }),
      }),
    ]);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/hero-slides/${deleteTarget._id}`, { method: "DELETE" });
      toast({ title: "Slide deleted.", variant: "success" });
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
          <h1 className="font-display text-2xl md:text-3xl text-brown-900">Hero Slides</h1>
          <p className="font-body text-warm-grey mt-1">{slides.length} total &middot; controls the homepage hero</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Slide
        </Button>
      </div>

      <div className="mt-8 border border-brown-200 bg-cream divide-y divide-brown-100">
        {loading ? (
          <p className="font-body text-sm text-warm-grey p-6">Loading...</p>
        ) : slides.length === 0 ? (
          <p className="font-body text-sm text-warm-grey p-6">No hero slides yet. The homepage will show a default hero until you add one.</p>
        ) : (
          slides.map((s, i) => (
            <div key={s._id} className="p-4 flex items-center gap-4">
              <div className="relative h-14 w-20 bg-brown-100 shrink-0 overflow-hidden">
                {s.image?.secure_url && <Image src={s.image.secure_url} alt={s.title} fill sizes="80px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm text-brown-900 truncate">{s.title}</p>
                <p className="font-body text-xs text-warm-grey truncate">{s.subtitle}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => swapOrder(i, -1)} disabled={i === 0} className="p-1.5 text-brown-600 disabled:opacity-30 focus-ring" aria-label="Move up">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button onClick={() => swapOrder(i, 1)} disabled={i === slides.length - 1} className="p-1.5 text-brown-600 disabled:opacity-30 focus-ring" aria-label="Move down">
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch checked={s.active} onCheckedChange={() => toggleActive(s)} />
                <button onClick={() => { setEditing(s); setDialogOpen(true); }} className="p-2 text-brown-600 hover:text-brown-900 focus-ring" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleteTarget(s)} className="p-2 text-destructive hover:opacity-70 focus-ring" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Hero Slide" : "Add Hero Slide"}</DialogTitle>
          </DialogHeader>
          <HeroSlideForm initial={editing || undefined} onSubmit={handleSubmit} submitting={submitting} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this slide?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
