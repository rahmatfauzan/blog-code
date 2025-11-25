"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code2,
  ArrowRight,
  Terminal,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  };

  return (
    <section className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgb(99, 102, 241) 1.5px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Floating Grid Elements */}
      <motion.div
        animate={floatingAnimation}
        className="absolute top-32 right-32 w-24 h-24 border-2 border-indigo-200/20 dark:border-indigo-800/20 rounded-lg rotate-12"
      />
      <motion.div
        animate={{
          ...floatingAnimation,
          transition: { ...floatingAnimation.transition, delay: 1 },
        }}
        className="absolute bottom-40 left-24 w-32 h-32 border-2 border-violet-200/20 dark:border-violet-800/20 rounded-lg -rotate-12"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex items-center justify-center py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center space-y-10"
        >
          {/* Badge with improved styling */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="group inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-900/80 dark:to-indigo-950/50 border border-slate-200/60 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 text-sm font-medium backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300">
              <Terminal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              <span>Personal Code Repository</span>
              <Sparkles className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
            </div>
          </motion.div>

          {/* Heading with improved typography */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Simpan, Atur, &{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
                  Gunakan Kembali
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Description with better contrast */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Satu tempat terpusat untuk semua{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              snippet kode
            </span>
            ,{" "}
            <span className="text-violet-600 dark:text-violet-400 font-semibold">
              konfigurasi
            </span>
            , dan catatan teknis Anda.
          </motion.p>

          {/* CTA Buttons - Smaller & Focused */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 flex items-center gap-2 group"
              >
                Mulai Gratis
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/explore">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Code2 className="h-4 w-4" />
                Jelajahi Snippets
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
