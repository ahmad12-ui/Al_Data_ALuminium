"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { ServiceDTO } from "@/types";
import type { ServiceInput } from "@/lib/validations";

export default function AdminServicesPage() {
  const { toast } = useToast();
  const [services, setServices] = React.useState<ServiceDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ServiceDTO | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<ServiceDTO | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/services");
    setServices(await res.json());
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (data: ServiceInput) => {
    setSubmitting(true);
    try {
      const res = await fetch(editing ? `/api/services/${editing._id}` : "/api/services", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save service.");
      toast({ title: editing ? "Service updated." : "Service created.", variant: "success" });
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFeatured = async (s: ServiceDTO) => {
    await fetch(`/api/services/${s._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !s.featured }),
    });
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/services/${deleteTarget._id}`, { method: "DELETE" });
      toast({ title: "Service deleted.", variant: "success" });
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
          <h1 className="font-display text-2xl md:text-3xl text-brown-900">Services</h1>
          <p className="font-body text-warm-grey mt-1">{services.length} total</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      <div className="mt-8 border border-brown-200 bg-cream overflow-x-auto">
        {loading ? (
          <p className="font-body text-sm text-warm-grey p-6">Loading...</p>
        ) : services.length === 0 ? (
          <p className="font-body text-sm text-warm-grey p-6">No services yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brown-200 text-xs uppercase tracking-wide text-warm-grey font-body">
                <th className="p-4">Service</th>
                <th className="p-4">Order</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id} className="border-b border-brown-100 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 bg-brown-100 shrink-0 overflow-hidden">
                        {s.image?.secure_url && <Image src={s.image.secure_url} alt={s.name} fill sizes="48px" className="object-cover" />}
                      </div>
                      <p className="font-body text-sm text-brown-900">{s.name}</p>
                    </div>
                  </td>
                  <td className="p-4 font-body text-sm text-brown-700">{s.order}</td>
                  <td className="p-4">
                    <button onClick={() => toggleFeatured(s)} className="focus-ring" aria-label="Toggle featured">
                      <Star className={cn("h-5 w-5", s.featured ? "fill-brown-500 text-brown-500" : "text-brown-300")} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditing(s); setDialogOpen(true); }} className="p-2 text-brown-600 hover:text-brown-900 focus-ring" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(s)} className="p-2 text-destructive hover:opacity-70 focus-ring" aria-label="Delete">
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
            <DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <ServiceForm initial={editing || undefined} onSubmit={handleSubmit} submitting={submitting} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this service?"
        description={`"${deleteTarget?.name}" will be permanently removed.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
