import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    // 1. Container Utama: H-Screen & Overflow Hidden (Supaya scroll ada di dalam area konten, bukan body)
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <aside className="hidden md:block shrink-0 h-full">
        <DashboardSidebar user={user}/>
      </aside>
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300">
        {/* Navbar */}
        <DashboardNavbar user={user} />

        {/* Konten Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
