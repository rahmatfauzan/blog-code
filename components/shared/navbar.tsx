import Link from "next/link";
import { Code2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { UserNav } from "./user-nav";
import { ThemeSwitcher } from "./theme-switcher";
import { cn } from "@/lib/utils";
import { NotificationBellWrapper } from "../notification/notification-bell-wrapper";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Menu Navigation (berbeda untuk logged in vs guest)
  const navLinks = user
    ? [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/my-snippets", label: "My Snippets" },
        { href: "/bookmarks", label: "Bookmarks" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/about", label: "About" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* KIRI: Logo CodeBox */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl group"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-1.5 rounded-lg shadow-md shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all group-hover:scale-105">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div className="font-bold text-xl md:text-2xl tracking-tight">
            <span className="text-slate-900 dark:text-white">Code</span>
            <span className="text-violet-600">Box</span>
          </div>
        </Link>

        {/* TENGAH: Menu Navigasi (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 font-medium"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* KANAN: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher - selalu tampil */}
          <ThemeSwitcher />

          {user ? (
            <>
              {/* Search Button (Desktop only) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Notification Bell */}
              <NotificationBellWrapper />

              {/* Create Snippet Button */}
              <Link href="/create">
                <Button
                  size="sm"
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-violet-500/20 transition-all hover:shadow-violet-500/40 border-0"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:inline">New Snippet</span>
                </Button>
              </Link>

              {/* User Avatar Dropdown */}
              <UserNav user={user} />
            </>
          ) : (
            // Guest Buttons
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-violet-500/20 transition-all hover:shadow-violet-500/40 border-0"
                >
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
