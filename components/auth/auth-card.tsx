"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Code2 } from "lucide-react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  showFooter?: boolean;
}

export const AuthCard = ({
  children,
  title,
  subtitle,
  backButtonLabel,
  backButtonHref,
  showFooter = true,
}: AuthCardProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo dengan animasi elastic */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.6,
        }}
        className="mb-8 text-center"
      >
        <Link href="/" className="flex flex-col items-center group">
          <div className="flex items-center space-x-3 transition-transform group-hover:scale-105 duration-300">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="p-3 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/30"
            >
              <Code2 className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Code<span className="text-indigo-600">Box</span>
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Developer Documentation Platform
          </p>
        </Link>
      </motion.div>

      {/* Card dengan animasi elastic dari kecil ke besar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 24,
          mass: 1,
          delay: 0.1,
        }}
        whileHover={{ scale: 1.02 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="rounded-2xl shadow-2xl overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-0">
          {/* Header dengan animasi elastic terpisah */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white p-8 space-y-2 relative overflow-hidden">
            {/* Pola Dekoratif */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.4,
              }}
              className="text-2xl font-bold relative z-10"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.5,
              }}
              className="text-white text-sm relative z-10 leading-relaxed "
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Form Content dengan animasi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.4,
            }}
            className="px-6 md:px-8"
          >
            {children}
          </motion.div>

          {/* Footer dengan animasi */}
          {showFooter && backButtonLabel && backButtonHref && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.5,
              }}
              className="px-8 py-4 bg-slate-50 dark:bg-slate-950/50 text-center text-sm border-t border-slate-100 dark:border-slate-800"
            >
              <p className="text-slate-600 dark:text-slate-400">
                {backButtonHref === "/login"
                  ? "Sudah punya akun? "
                  : "Belum punya akun? "}
                <Link
                  href={backButtonHref}
                  className="font-bold text-indigo-600 hover:text-violet-600 hover:underline transition-colors"
                >
                  {backButtonLabel}
                </Link>
              </p>
            </motion.div>
          )}
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8"
        >
          © {new Date().getFullYear()} CodeBox. Built for Developers.
        </motion.p>
      </motion.div>
    </div>
  );
};
