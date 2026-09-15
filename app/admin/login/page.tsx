"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Login failed.");
        return;
      }
      const redirect = searchParams.get("redirect") || "/admin";
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brown-950 px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="relative h-16 w-16 mb-4">
            <Image src="/logo/aldata-logo.png" alt="ALDATA" fill className="object-contain" sizes="64px" />
          </div>
          <h1 className="font-display text-2xl text-cream">ALDATA Admin</h1>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-brown-400 mt-1">
            Authorized Access Only
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 border border-brown-800 bg-brown-900/40 p-8">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-brown-300">Access Code</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-400" />
              <Input
                id="code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter admin code"
                className="pl-10 bg-brown-950 border-brown-700 text-cream placeholder:text-brown-500"
                autoFocus
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400 font-body">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || !code}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
