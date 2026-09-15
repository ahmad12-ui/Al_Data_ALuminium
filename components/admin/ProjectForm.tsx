"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Loader2 } from "lucide-react";
import type { ProjectDTO } from "@/types";

export function ProjectForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial?: Partial<ProjectDTO>;
  onSubmit: (data: ProjectInput) => Promise<void>;
  submitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initial?.name || "",
      description: initial?.description || "",
      price: initial?.price || "",
      location: initial?.location || "",
      date: initial?.date ? new Date(initial.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      category: initial?.category || "",
      images: initial?.images || [],
      featuredImage: initial?.featuredImage,
      featured: initial?.featured || false,
      order: initial?.order || 0,
      beforeImages: initial?.beforeImages || [],
      afterImages: initial?.afterImages || [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive font-body">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" placeholder="e.g. Interior Design" {...register("category")} />
          {errors.category && <p className="text-xs text-destructive font-body">{errors.category.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
          {errors.location && <p className="text-xs text-destructive font-body">{errors.location.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...register("date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (optional)</Label>
          <Input id="price" placeholder="e.g. PKR 1,200,000" {...register("price")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && <p className="text-xs text-destructive font-body">{errors.description.message}</p>}
      </div>

      <Controller
        control={control}
        name="images"
        render={({ field }) => (
          <ImageUploader folder="projects" images={field.value} onChange={field.onChange} label="Project Images (first = cover)" />
        )}
      />
      {errors.images && <p className="text-xs text-destructive font-body">{errors.images.message as string}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Controller
          control={control}
          name="beforeImages"
          render={({ field }) => (
            <ImageUploader folder="projects" images={field.value} onChange={field.onChange} multiple={false} label="Before Image (optional)" />
          )}
        />
        <Controller
          control={control}
          name="afterImages"
          render={({ field }) => (
            <ImageUploader folder="projects" images={field.value} onChange={field.onChange} multiple={false} label="After Image (optional)" />
          )}
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="featured"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
          <Label>Featured</Label>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="order">Order</Label>
          <Input id="order" type="number" className="w-24" {...register("order", { valueAsNumber: true })} />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {initial?.name ? "Save Changes" : "Create Project"}
      </Button>
    </form>
  );
}
