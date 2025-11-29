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
      {/* 2. Sidebar Wrapper: 
          - Hapus 'fixed', 'inset-y-0', 'z-40'.
          - Hapus 'w-64' (Biarkan komponen Sidebar yang menentukan lebarnya sendiri via Framer Motion).
      */}
      <aside className="hidden md:block shrink-0 h-full">
        <DashboardSidebar />
      </aside>

      {/* 3. Main Content Wrapper:
          - Hapus 'md:pl-64' (Karena kita pakai Flex, dia otomatis di sebelah kanan sidebar).
          - Tambahkan 'overflow-hidden' agar Navbar tetap sticky di dalam area ini.
      */}
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300">
        {/* Navbar */}
        <DashboardNavbar/>

        {/* Konten Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
