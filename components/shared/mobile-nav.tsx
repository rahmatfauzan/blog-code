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

  // Menu untuk guest (belum login)
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
      {/* Background with better glassmorphism */}
      <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-8px_32px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_32px_-4px_rgba(0,0,0,0.3)]" />

      {/* Navigation */}
      <nav className="relative flex justify-around items-center h-16 px-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          // Highlight button (New/Create) - Floating style
          if (item.isHighlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-2xl blur-md opacity-50 group-hover:opacity-70 transition-opacity" />

                  {/* Main button */}
                  <div className="relative w-14 h-14 -mt-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 shadow-xl shadow-violet-500/30 group-hover:shadow-violet-500/50 flex items-center justify-center transition-all duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </motion.div>

                <span className="text-[10px] font-semibold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent mt-1.5">
                  {item.name}
                </span>
              </Link>
            );
          }

          // Regular menu items
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 relative group"
            >
              {/* Icon container */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                  )}
                />

                {/* Active dot indicator */}
                {isActive && (
                  <motion.div
                    layoutId="mobileNavDot"
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full shadow-sm shadow-indigo-500/50"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium tracking-tight transition-all duration-300",
                  isActive
                    ? "font-semibold text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                )}
              >
                {item.name}
              </span>

              {/* Bottom active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-t-full shadow-lg shadow-violet-500/30"
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

      {/* Safe area padding for iOS devices */}
      <div className="h-safe pb-safe" />
    </div>
  );
}
