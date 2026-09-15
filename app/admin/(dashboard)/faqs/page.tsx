"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { faqSchema, type FaqInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { FaqDTO } from "@/types";

function FaqForm({ initial, onSubmit, submitting }: { initial?: Partial<FaqDTO>; onSubmit: (d: FaqInput) => Promise<void>; submitting: boolean }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FaqInput>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: initial?.question || "",
      answer: initial?.answer || "",
      order: initial?.order || 0,
      published: initial?.published ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input id="question" {...register("question")} />
        {errors.question && <p className="text-xs text-destructive font-body">{errors.question.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="answer">Answer</Label>
        <Textarea id="answer" rows={4} {...register("answer")} />
        {errors.answer && <p className="text-xs text-destructive font-body">{errors.answer.message}</p>}
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Controller control={control} name="published" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
          <Label>Published</Label>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="order">Order</Label>
          <Input id="order" type="number" className="w-24" {...register("order", { valueAsNumber: true })} />
        </div>
      </div>
      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {initial?.question ? "Save Changes" : "Create FAQ"}
      </Button>
    </form>
  );
}

export default function AdminFaqsPage() {
  const { toast } = useToast();
  const [faqs, setFaqs] = React.useState<FaqDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<FaqDTO | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<FaqDTO | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/faqs");
    setFaqs(await res.json());
    setLoading(false);
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const handleSubmit = async (data: FaqInput) => {
    setSubmitting(true);
    try {
      const res = await fetch(editing ? `/api/faqs/${editing._id}` : "/api/faqs", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save FAQ.");
      toast({ title: editing ? "FAQ updated." : "FAQ created.", variant: "success" });
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublished = async (f: FaqDTO) => {
    await fetch(`/api/faqs/${f._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !f.published }),
    });
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/faqs/${deleteTarget._id}`, { method: "DELETE" });
      toast({ title: "FAQ deleted.", variant: "success" });
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
          <h1 className="font-display text-2xl md:text-3xl text-brown-900">FAQs</h1>
          <p className="font-body text-warm-grey mt-1">{faqs.length} total</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>

      <div className="mt-8 border border-brown-200 bg-cream divide-y divide-brown-100">
        {loading ? (
          <p className="font-body text-sm text-warm-grey p-6">Loading...</p>
        ) : faqs.length === 0 ? (
          <p className="font-body text-sm text-warm-grey p-6">No FAQs yet.</p>
        ) : (
          faqs.map((f) => (
            <div key={f._id} className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-body text-sm text-brown-900 truncate">{f.question}</p>
                <p className="font-body text-xs text-warm-grey truncate">{f.answer}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublished(f)} className="p-2 text-brown-600 focus-ring" aria-label="Toggle published">
                  {f.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-brown-300" />}
                </button>
                <button onClick={() => { setEditing(f); setDialogOpen(true); }} className="p-2 text-brown-600 hover:text-brown-900 focus-ring" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleteTarget(f)} className="p-2 text-destructive hover:opacity-70 focus-ring" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          <FaqForm initial={editing || undefined} onSubmit={handleSubmit} submitting={submitting} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this FAQ?"
        description="This FAQ will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
