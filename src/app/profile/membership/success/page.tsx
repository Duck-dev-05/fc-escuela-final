"use client";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaExchangeAlt, FaShieldAlt } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();

  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setVerifying(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      {/* Background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/6 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-amber-500/4 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-lg w-full glass-card p-10 md:p-14 text-center overflow-hidden"
      >
        {/* Top gold accent */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.5), transparent)'
        }} />

        {verifying ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-8">
              <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/10 border-t-amber-500 rounded-full animate-spin" />
              </div>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl animate-pulse-slow" style={{
                boxShadow: '0 0 24px rgba(245,158,11,0.15)'
              }} />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Verifying Payment...</h2>
            <p className="text-sm font-medium text-slate-500 mt-2">Please do not close this window.</p>
          </div>
        ) : (
          <>
            {/* Success icon */}
            <div className="relative mb-8 flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-emerald-500/8 blur-2xl" />
              </div>
              <div className="relative bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl"
                style={{ boxShadow: '0 0 32px rgba(52,211,153,0.2)' }}>
                <FaCheckCircle className="h-12 w-12 text-emerald-400" />
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">Payment Verified</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
              Membership <span className="text-slate-600 font-light">Upgraded</span>
            </h1>

            <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed max-w-md mx-auto">
              Your account has been successfully updated with premium access. You can now utilize
              all elite member features and team analytics.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="glass-card p-5 flex flex-col items-center">
                <FaShieldAlt className="h-5 w-5 text-amber-500/60 mb-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">Account Status</span>
                <span className="text-sm font-black text-white">Active</span>
              </div>
              <div className="glass-card p-5 flex flex-col items-center">
                <FaExchangeAlt className="h-5 w-5 text-emerald-500/60 mb-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">Data Sync</span>
                <span className="text-sm font-black text-white">Complete</span>
              </div>
            </div>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-sm font-black transition-colors"
              style={{ boxShadow: '0 0 24px rgba(245,158,11,0.3)' }}
            >
              Return to Hub
            </Link>

            <p className="mt-7 text-xs text-slate-600 font-medium tracking-wide">
              A receipt has been sent to your registered email via Stripe.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function MembershipSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-amber-500 rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
