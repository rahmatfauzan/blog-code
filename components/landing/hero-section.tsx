"use client";

import { motion } from "framer-motion";
import { Code2, ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const words = [
    { text: "Simpan", direction: "left" as const },
    { text: "Atur", direction: "right" as const },
    { text: "&", direction: "left" as const },
    { text: "Gunakan", direction: "right" as const },
    { text: "Kembali", direction: "left" as const },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const getWordVariants = (direction: "left" | "right") => ({
    hidden: {
      opacity: 0,
      x: direction === "left" ? -150 : 150,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 150,
        mass: 0.8,
      },
    },
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden ">
      {/* Subtle floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-violet-400/10 dark:bg-violet-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center space-y-8"
        >
          {/* Floating badge */}
          <motion.div variants={fadeInUp} className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-sm font-medium shadow-sm"
            >
              <span className="text-slate-700 dark:text-slate-300">
                Personal Code Repository
              </span>
            </motion.div>
          </motion.div>

          {/* Main heading with word-by-word animation */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-white">
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    variants={getWordVariants(word.direction)}
                    className={
                      word.text === "&" ||
                      word.text === "Gunakan" ||
                      word.text === "Kembali"
                        ? "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent"
                        : ""
                    }
                  >
                    {word.text}
                  </motion.span>
                ))}
              </div>
            </h1>
          </div>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-md sm:text-lg md:text-xl text-slate-700 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Satu tempat terpusat untuk semua snippet kode, konfigurasi, dan
            catatan teknis Anda. Akses cepat, pencarian instan.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-500 dark:via-violet-500 dark:to-purple-500 text-white font-medium rounded-lg shadow-lg shadow-violet-500/25 dark:shadow-violet-500/40 hover:shadow-xl hover:shadow-violet-500/30 dark:hover:shadow-violet-500/50 transition-all duration-300 group"
            >
              Mulai Gratis
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Code2 className="h-4 w-4" />
              Jelajahi Snippets
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Smooth scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <span className="text-xs font-medium">Scroll</span>
          <svg
            className="w-5 h-5"
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}