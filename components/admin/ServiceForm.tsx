"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Loader2 } from "lucide-react";
import type { ServiceDTO } from "@/types";

export function ServiceForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial?: Partial<ServiceDTO>;
  onSubmit: (data: ServiceInput) => Promise<void>;
  submitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: initial?.name || "",
      description: initial?.description || "",
      image: initial?.image,
      featured: initial?.featured || false,
      order: initial?.order || 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive font-body">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && <p className="text-xs text-destructive font-body">{errors.description.message}</p>}
      </div>

      <Controller
        control={control}
        name="image"
        render={({ field }) => (
          <ImageUploader
            folder="services"
            images={field.value ? [field.value] : []}
            onChange={(imgs) => field.onChange(imgs[0])}
            multiple={false}
            label="Service Image"
          />
        )}
      />

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Controller control={control} name="featured" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
          <Label>Featured</Label>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="order">Order</Label>
          <Input id="order" type="number" className="w-24" {...register("order", { valueAsNumber: true })} />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {initial?.name ? "Save Changes" : "Create Service"}
      </Button>
    </form>
  );
}
