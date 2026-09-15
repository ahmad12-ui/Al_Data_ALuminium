"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

export function ContactForm({ services }: { services: string[] }) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (data: ContactFormInput) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Something went wrong.");

      toast({
        title: "Thank you. Your message has been sent successfully.",
        variant: "success",
      });
      reset();
    } catch (err: any) {
      toast({
        title: "Message could not be sent.",
        description: err.message || "Please try again or contact us directly.",
        variant: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive font-body">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="03XXXXXXXXX" {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive font-body">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive font-body">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service</Label>
        <select
          id="service"
          className="h-11 w-full border border-brown-200 bg-cream px-4 text-sm font-body text-brown-900 focus-ring"
          {...register("service")}
        >
          <option value="">Select a service (optional)</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" placeholder="Tell us about your project..." rows={5} {...register("message")} />
        {errors.message && <p className="text-xs text-destructive font-body">{errors.message.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Send Message
      </Button>
    </form>
  );
}
