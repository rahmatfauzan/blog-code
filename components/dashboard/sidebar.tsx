"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileCode2,
  PlusCircle,
  Settings,
  Bookmark,
  LogOut,
  ChevronLeft,
  Code2,
  User as UserIcon,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@supabase/supabase-js";

const sidebarItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Snippets", href: "/dashboard/snippets", icon: FileCode2 },
  { title: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { title: "Create New", href: "/dashboard/create", icon: PlusCircle },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // State
  const [isExpanded, setIsExpanded] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Fetch User Client-Side untuk Profile
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Gagal logout");
      return;
    }
    toast.success("Berhasil keluar");
    router.push("/login");
    router.refresh();
  };

  // Helper Data User
  const userName = user?.user_metadata?.full_name || "User";
  const userEmail = user?.email || "";
  const userAvatar = user?.user_metadata?.avatar_url || "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        animate={{ width: isExpanded ? 260 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 overflow-visible"
      >
        {/* --- HEADER: LOGO CODEBOX / MAC OS DOTS --- */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/50 flex-shrink-0">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  CodeBox
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="mac-dots"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="mx-auto flex gap-1.5"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- USER PROFILE SECTION --- */}
        <div className="p-4 pb-2 flex-shrink-0">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl transition-all duration-300",
              isExpanded
                ? "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                : "justify-center"
            )}
          >
            <Avatar className="w-9 h-9 border border-slate-200 dark:border-slate-700">
              <AvatarImage src={userAvatar} />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                {userInitial}
              </AvatarFallback>
            </Avatar>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex flex-col overflow-hidden whitespace-nowrap"
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {userName}
                  </span>
                  <span className="text-xs text-slate-500 truncate">
                    Free Plan
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- TOGGLE BUTTON (Bulat di tengah garis border) --- */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-34 -translate-y-1/2 z-50 w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group"
        >
          {isExpanded ? (
            <ChevronLeft className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          )}
        </button>

        {/* --- MENU LIST --- */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {isExpanded && (
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 animate-in fade-in">
              Main Menu
            </p>
          )}

          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            // Wrapper Link
            const LinkComponent = (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
                    !isExpanded && "justify-center px-2"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors flex-shrink-0",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500"
                    )}
                  />

                  {/* Label Teks */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="truncate overflow-hidden whitespace-nowrap"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {isActive && isExpanded && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full"
                    />
                  )}
                </div>
              </Link>
            );

            if (!isExpanded) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{LinkComponent}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-slate-900 text-white border-0 ml-2 font-medium"
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return LinkComponent;
          })}
        </div>

        {/* --- FOOTER (LOGOUT) --- */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto flex-shrink-0">
          {isExpanded ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ delay: 0.1 }}
                  className="truncate overflow-hidden whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              </AnimatePresence>
            </button>
          ) : (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="w-full h-10 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-red-600 text-white border-0 ml-2"
              >
                Sign Out
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
