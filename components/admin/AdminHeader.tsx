"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminHeader() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-brown-950 text-cream sticky top-0 z-40">
      <span className="font-display text-lg">ALDATA Admin</span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2 focus-ring" aria-label="Open admin menu">
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-brown-950 max-w-[280px]">
          <AdminSidebar className="h-full" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
