"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Code2, ArrowRight, Flame } from "lucide-react";
import { SnippetCard } from "@/components/shared/document-card";
import { SnippetWithAuthor } from "@/lib/types";
import { useRef } from "react";

interface TrendingSectionProps {
  trendingSnippets: SnippetWithAuthor[];
}

export function TrendingSection({ trendingSnippets }: TrendingSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // State Kosong
  if (!trendingSnippets || trendingSnippets.length === 0) {
    return (
      <section className=" bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
              Belum Ada Snippet Trending
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Jadilah yang pertama membuat snippet populer!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-24 md:py-32 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgb(139, 92, 246) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200/60 dark:border-orange-800/60 backdrop-blur-sm shadow-sm"
          >
            <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400 animate-pulse" />
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
              Trending Minggu Ini
            </span>
            <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            Snippet Paling{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent">
                Populer
              </span>
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Temukan kode terbaik yang paling banyak{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              dilihat
            </span>{" "}
            dan{" "}
            <span className="font-semibold text-violet-600 dark:text-violet-400">
              digunakan
            </span>{" "}
            oleh komunitas developer.
          </motion.p>
        </motion.div>

        {/* Grid Kartu */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12"
        >
          {trendingSnippets.map((snippet, index) => (
            <motion.div
              key={snippet.id}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative group"
            >
              {/* Trending Badge untuk top 3 */}
              {index < 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="absolute -top-3 -left-3 z-20 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 border-2 border-white dark:border-slate-900"
                >
                  <span className="text-white font-black text-sm">
                    #{index + 1}
                  </span>
                </motion.div>
              )}

              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

              <div className="relative">
                <SnippetCard snippet={snippet} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Code2 className="w-5 h-5" />
                Lihat Semua Koleksi
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>

              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.button>
          </Link>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
            className="mt-6 text-sm text-slate-500 dark:text-slate-400"
          >
            Jelajahi{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              1000+ snippets
            </span>{" "}
            dari komunitas
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
