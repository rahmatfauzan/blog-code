"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Code2, ArrowRight, Terminal } from "lucide-react";

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

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
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

      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-200/20 dark:bg-violet-900/20 rounded-full blur-3xl" />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex items-center justify-center py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center space-y-10"
        >
          {/* Simple Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
              <Terminal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Personal Code Repository</span>
            </div>
          </motion.div>

          {/* Clean heading with darker text */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Simpan, Atur, &{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                Gunakan Kembali
              </span>
            </h1>
          </motion.div>

          {/* Darker description text */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-700 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed"
          >
            Satu tempat terpusat untuk semua{" "}
            <span className="text-slate-900 dark:text-white font-semibold">
              snippet kode
            </span>
            ,{" "}
            <span className="text-slate-900 dark:text-white font-semibold">
              konfigurasi
            </span>
            , dan catatan teknis Anda.
          </motion.p>

          {/* CTA Buttons */}
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

      {/* Scroll Down Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={scrollToNextSection}
        className="absolute bottom-20 sm:bottom-24 md:bottom-16 left-1/2 -translate-x-1/2 z-20 cursor-pointer group"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Circular ring with arrow */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-slate-400 dark:border-slate-600 group-hover:border-indigo-600 dark:group-hover:border-indigo-500 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-500 transition-colors"
              fill="none"
              strokeWidth="2.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </motion.button>
    </section>
  );
}
