"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  Clapperboard,
  HelpCircle,
  Images,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: Briefcase },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Videos", href: "/admin/videos", icon: Clapperboard },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Hero Slides", href: "/admin/hero-slides", icon: Images },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className={cn("flex flex-col bg-brown-950 text-cream", className)}>
      <div className="flex items-center gap-3 px-6 py-6 border-b border-brown-800">
        <div className="relative h-9 w-9">
          <Image src="/logo/aldata-logo.png" alt="ALDATA" fill className="object-contain" sizes="36px" />
        </div>
        <div>
          <p className="font-display text-base leading-none">ALDATA</p>
          <p className="font-body text-[9px] uppercase tracking-[0.2em] text-brown-400 mt-1">Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {LINKS.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-body rounded-sm transition-colors focus-ring",
                active ? "bg-brown-800 text-cream" : "text-brown-300 hover:bg-brown-900 hover:text-cream"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-brown-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-body text-brown-300 hover:bg-brown-900 hover:text-cream rounded-sm transition-colors focus-ring"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
