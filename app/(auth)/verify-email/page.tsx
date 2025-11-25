"use client";

import { useEffect, useState, Suspense, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Mail,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { resendVerificationEmail } from "@/lib/actions/auth";

// Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    if (!email) return;

    startTransition(async () => {
      try {
        const result = await resendVerificationEmail(email);

        if (result.success) {
          toast.success("Email Terkirim!", {
            description: "Silakan cek inbox atau folder spam Anda.",
          });
          setCountdown(60);
        } else {
          toast.error("Gagal Mengirim", {
            description: result.error,
          });
        }
      } catch {
        toast.error("Terjadi Kesalahan Jaringan");
      }
    });
  };

  const checklistItems = [
    "Check your spam or junk folder",
    "Make sure the email address is correct",
    "Wait a few minutes for email delivery",
  ];

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 px-4 py-8">
      <AuthCard
        title="Verify Your Email"
        subtitle="We've sent you a verification link to complete your registration"
        showFooter={false}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Animated Mail Icon */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30">
                <Mail className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="absolute inset-0 rounded-full bg-indigo-400/20 animate-ping" />
            </motion.div>
          </motion.div>

          {/* Main Message */}
          <motion.div variants={itemVariants} className="mb-4 space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Email Verification Sent!
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              We've sent a verification link to
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm">
                {email || "your email address"}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-500">
              Click the link in the email to verify your account
            </p>
          </motion.div>

          {/* Checklist Box */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-4 text-left mb-4 border border-slate-200/80 dark:border-slate-700/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Didn't receive the email?
              </p>
            </div>

            <ul className="space-y-2">
              {checklistItems.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.08 }}
                  className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="space-y-3">
            <Button
              onClick={handleResend}
              disabled={isPending || countdown > 0 || !email}
              variant="outline"
              className="w-full h-10 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium transition-all hover:border-indigo-300 dark:hover:border-indigo-600 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend in {countdown}s
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <Link href="/login" className="block group">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Login
              </div>
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className=" border-t border-slate-100 dark:border-slate-800"
          >
          </motion.div>
        </motion.div>
      </AuthCard>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
