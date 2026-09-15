import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-offwhite">
      <AdminSidebar className="hidden lg:flex w-64 shrink-0 min-h-screen sticky top-0" />
      <div className="flex-1 min-w-0">
        <AdminHeader />
        <div className="p-5 md:p-10">{children}</div>
      </div>
    </div>
  );
}
