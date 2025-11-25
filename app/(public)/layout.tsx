import { Navbar } from "@/components/shared/navbar";
import { MobileNav } from "@/components/shared/mobile-nav"; // Import komponen baru
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user di server untuk dikirim ke MobileNav
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <MobileNav user={user} />
    </div>
  );
}
