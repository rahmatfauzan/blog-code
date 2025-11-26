"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Menu Item Definisi
const MENU_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
];

interface NavMenuProps {
  isLoggedIn: boolean;
}

export function NavMenu({ isLoggedIn }: NavMenuProps) {
  const pathname = usePathname();

  const items = [
    ...MENU_ITEMS,
    ...(isLoggedIn
      ? [
          { href: "/my-snippets", label: "My Snippets" },
          { href: "/bookmarks", label: "Bookmarks" },
        ]
      : []),
  ];

  return (
    <nav className="hidden md:flex items-center gap-6">
      {items.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            )}
          >
            {/* Label Menu */}
            {link.label}

            {/* Garis Bawah Animasi (Spring) */}
            {isActive && (
              <motion.div
                layoutId="navbar-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
