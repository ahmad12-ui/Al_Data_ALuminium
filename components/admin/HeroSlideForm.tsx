"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroSlideSchema, type HeroSlideInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Loader2 } from "lucide-react";
import type { HeroSlideDTO } from "@/types";

export function HeroSlideForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial?: Partial<HeroSlideDTO>;
  onSubmit: (data: HeroSlideInput) => Promise<void>;
  submitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<HeroSlideInput>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      title: initial?.title || "",
      subtitle: initial?.subtitle || "",
      description: initial?.description || "",
      image: initial?.image,
      buttonText: initial?.buttonText || "Explore Projects",
      buttonLink: initial?.buttonLink || "/projects",
      order: initial?.order || 0,
      active: initial?.active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Spaces That Inspire" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive font-body">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" placeholder="Interior Design & Architectural Solutions" {...register("subtitle")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <Controller
        control={control}
        name="image"
        render={({ field }) => (
          <ImageUploader
            folder="hero"
            images={field.value ? [field.value] : []}
            onChange={(imgs) => field.onChange(imgs[0])}
            multiple={false}
            label="Slide Image"
          />
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="buttonText">Button Text</Label>
          <Input id="buttonText" {...register("buttonText")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buttonLink">Button Link</Label>
          <Input id="buttonLink" placeholder="/projects" {...register("buttonLink")} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Controller control={control} name="active" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
          <Label>Active</Label>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="order">Order</Label>
          <Input id="order" type="number" className="w-24" {...register("order", { valueAsNumber: true })} />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {initial?.title ? "Save Changes" : "Create Slide"}
      </Button>
    </form>
  );
}
