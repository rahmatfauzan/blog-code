import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useUser } from "@/lib/hook/use-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. Container Utama: H-Screen & Overflow Hidden (Supaya scroll ada di dalam area konten, bukan body)
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <aside className="hidden md:block shrink-0 h-full">
        <DashboardSidebar/>
      </aside>
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300">
        {/* Navbar */}
        <DashboardNavbar />

        {/* Konten Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
