"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { UserNav } from "@/components/shared/user-nav";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { useUser } from "@/lib/hook/use-user";
import { Button } from "../ui/button";

export function DashboardNavbar({
  user,
  profile,
}: {
  user: User;
  profile: any;
}) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* KIRI: Mobile Menu + Logo Mobile */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu untuk Mobile */}
          <MobileSidebar />

          {/* Logo hanya muncul di Mobile */}
          <Link
            href="/dashboard"
            className="flex md:hidden items-center gap-2 group"
          >
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-1.5 rounded-lg shadow-md shadow-indigo-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              CodeBox
            </span>
          </Link>
        </div>

        {/* KANAN: Actions */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Link href="/">
            <button className="w-full sm:w-auto text-xs border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              Home
            </button>
          </Link>
          {user && <UserNav user={user} profile={profile} />}
        </div>
      </div>
    </header>
  );
}
