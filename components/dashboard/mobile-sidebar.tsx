"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  FileCode2,
  PlusCircle,
  Settings,
  Bookmark,
  LogOut,
  X, // Kita import lagi X nya
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/lib/hook/use-user";

const sidebarItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Snippets", href: "/dashboard/snippets", icon: FileCode2 },
  { title: "Create New", href: "/dashboard/create", icon: PlusCircle },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

const menuItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

export function MobileSidebar() {
  const pathname = usePathname();
  const { user, profile } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();


  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast.success("Berhasil keluar");
      setOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Gagal logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userName = user?.user_metadata?.full_name || "User";
  const userAvatar = profile?.avatar_url || "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 mr-2"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        // [&>button]:hidden -> INI PENTING: Menghilangkan tombol close default bawaan Shadcn
        className="w-[300px] p-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full [&>button]:hidden"
      >
        {/* Hidden Title untuk Screen Reader (Biar gak error warning) */}
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
        <SheetDescription className="sr-only">
          Menu dashboard mobile
        </SheetDescription>

        {/* --- HEADER CUSTOM (Mac Dots + Logo + Close) --- */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/50 shrink-0">

          {/* Tengah: Logo CodeBox */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              CodeBox
            </span>
          </div>

          {/* Kanan: Custom Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* --- USER PROFILE --- */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <Avatar className="w-10 h-10 border border-slate-200 dark:border-slate-700">
              <AvatarImage src={userAvatar} />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-sm font-bold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-slate-500 truncate">Free Plan</p>
            </div>
          </div>
        </div>

        {/* --- MENU ITEMS --- */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>

          <AnimatePresence>
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <motion.div
                  key={item.href}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block"
                  >
                    <div
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />
                      )}

                      <Icon
                        className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isActive ? "text-indigo-600" : "text-slate-400"
                        )}
                      />
                      <span>{item.title}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </nav>

        {/* --- FOOTER LOGOUT --- */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
