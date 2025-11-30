import Link from "next/link";
import { Code2, Search, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { UserNav } from "./user-nav";
import { ThemeSwitcher } from "./theme-switcher";
import { NotificationBellWrapper } from "../notification/notification-bell-wrapper";
import { NavMenu } from "./nav-menu";

export async function Navbar( { user, profile }: { user: any; profile: any } ) {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-950/70">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* KIRI: Logo & Navigasi */}
        <div className="flex items-center gap-8">
          {/* Logo Brand - Enhanced */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-all duration-300 group-hover:scale-105">
                <Code2 className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="font-bold text-lg tracking-tight hidden sm:block">
              <span className="text-slate-900 dark:text-white">Code</span>
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Box
              </span>
            </div>
          </Link>

          {/* Navigasi Menu */}
          <NavMenu isLoggedIn={!!user} />
        </div>

        {/* KANAN: Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 hidden md:flex transition-all"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Divider */}
          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

          {/* User Authenticated */}
          {user ? (
            <>
              {/* Notification */}
              <NotificationBellWrapper />

              {/* Create Button - Enhanced Gradient */}
              <Link href="/dashboard/create" className="hidden sm:block">
                <Button
                  size="sm"
                  className="items-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 border-0 rounded-lg px-4 py-2 font-medium transition-all duration-300 group"
                >
                  <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Create</span>
                </Button>
              </Link>

              {/* User Menu */}
              <UserNav user={user} profile={profile} />
            </>
          ) : (
            // Guest Actions - Enhanced
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-all"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 text-white font-medium rounded-lg px-5 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 border-0"
                >
                  Daftar Gratis
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
