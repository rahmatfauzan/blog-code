"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, FileCode, User, Plus } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user: SupabaseUser | null;
}
interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  active: boolean;
  isHighlight?: boolean;
}

export function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();

  // Menu untuk user yang sudah login
  const authenticatedMenu = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      name: "Explore",
      href: "/explore",
      icon: Compass,
      active: pathname === "/explore" || pathname.startsWith("/snippet/"),
    },
    {
      name: "New",
      href: "/create",
      icon: Plus,
      active: pathname === "/create",
      isHighlight: true,
    },
    {
      name: "My Snippets",
      href: "/my-snippets",
      icon: FileCode,
      active: pathname === "/my-snippets",
    },
    {
      name: "Profile",
      href: `/u/${user?.user_metadata.username || ""}`,
      icon: User,
      active:
        pathname === `/u/${user?.user_metadata.username}` ||
        pathname.startsWith("/dashboard"),
    },
  ];

  // Menu untuk guest (belum login) - hanya 2 menu
  const guestMenu = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      name: "Explore",
      href: "/explore",
      icon: Compass,
      active: pathname === "/explore" || pathname.startsWith("/snippet/"),
    },
  ];

  const menu: MenuItem[] = user ? authenticatedMenu : guestMenu;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background Glassmorphism */}
      <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_16px_-2px_rgba(0,0,0,0.08)]" />

      {/* Navigasi */}
      <nav className="relative flex justify-around items-center h-16 px-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          // Tombol highlight (New/Login) dengan styling khusus
          if (item.isHighlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 relative"
              >
                <div className="relative">
                  {/* Floating Action Button Style */}
                  <div className="w-14 h-14 -mt-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-violet-500/40 flex items-center justify-center hover:shadow-violet-500/60 hover:scale-105 transition-all duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                  {item.name}
                </span>
              </Link>
            );
          }

          // Menu biasa
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all duration-300 relative",
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              )}
            >
              {/* Icon */}
              <div className="relative">
                <Icon
                  className={cn(
                    "w-6 h-6 transition-transform duration-300",
                    isActive && "scale-110"
                  )}
                />

                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    layoutId="mobileNavDot"
                    className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium tracking-tight transition-all",
                  isActive && "font-semibold"
                )}
              >
                {item.name}
              </span>

              {/* Bottom Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-full"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Safe Area Padding untuk iOS */}
      <div className="h-safe" />
    </div>
  );
}
