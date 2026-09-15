"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const { register, handleSubmit, reset, control } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
  });
  const { fields } = useFieldArray({ control, name: "locations" });

  React.useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        reset({
          businessName: data.businessName,
          tagline: data.tagline,
          secondaryTagline: data.secondaryTagline,
          phone: data.phone,
          email: data.email,
          whatsapp: data.whatsapp,
          locations: data.locations?.length ? data.locations : [{ label: "", address: "" }],
          socialLinks: data.socialLinks || {},
          googleMaps: data.googleMaps || {},
          footerText: data.footerText,
        });
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: SiteSettingsInput) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save settings.");
      toast({ title: "Settings saved.", variant: "success" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="font-body text-sm text-warm-grey">Loading settings...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl text-brown-900">Site Settings</h1>
      <p className="font-body text-warm-grey mt-1">Business info, contact details, and footer content.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-3xl space-y-10">
        <section className="border border-brown-200 bg-cream p-6 space-y-5">
          <h2 className="font-display text-lg text-brown-900">Business</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" {...register("businessName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" {...register("tagline")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryTagline">Secondary Tagline</Label>
            <Input id="secondaryTagline" {...register("secondaryTagline")} />
          </div>
        </section>

        <section className="border border-brown-200 bg-cream p-6 space-y-5">
          <h2 className="font-display text-lg text-brown-900">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (with country code)</Label>
              <Input id="whatsapp" placeholder="923048762936" {...register("whatsapp")} />
            </div>
          </div>
        </section>

        <section className="border border-brown-200 bg-cream p-6 space-y-5">
          <h2 className="font-display text-lg text-brown-900">Locations</h2>
          {fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor={`locations.${i}.label`}>Label</Label>
                <Input id={`locations.${i}.label`} {...register(`locations.${i}.label` as const)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`locations.${i}.address`}>Address</Label>
                <Input id={`locations.${i}.address`} {...register(`locations.${i}.address` as const)} />
              </div>
            </div>
          ))}
        </section>

        <section className="border border-brown-200 bg-cream p-6 space-y-5">
          <h2 className="font-display text-lg text-brown-900">Google Maps Embeds</h2>
          <div className="space-y-2">
            <Label htmlFor="mapsDahrki">Dahrki Embed URL</Label>
            <Input id="mapsDahrki" placeholder="https://www.google.com/maps/embed?..." {...register("googleMaps.dahrki")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mapsSadiqabad">Sadiqabad Embed URL</Label>
            <Input id="mapsSadiqabad" placeholder="https://www.google.com/maps/embed?..." {...register("googleMaps.sadiqabad")} />
          </div>
        </section>

        <section className="border border-brown-200 bg-cream p-6 space-y-5">
          <h2 className="font-display text-lg text-brown-900">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" placeholder="https://instagram.com/..." {...register("socialLinks.instagram")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input id="facebook" placeholder="https://facebook.com/..." {...register("socialLinks.facebook")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input id="youtube" placeholder="https://youtube.com/..." {...register("socialLinks.youtube")} />
            </div>
          </div>
        </section>

        <section className="border border-brown-200 bg-cream p-6 space-y-5">
          <h2 className="font-display text-lg text-brown-900">Footer</h2>
          <div className="space-y-2">
            <Label htmlFor="footerText">Footer Text</Label>
            <Textarea id="footerText" rows={2} {...register("footerText")} />
          </div>
        </section>

        <Button type="submit" size="lg" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </Button>
      </form>
    </div>
  );
}
