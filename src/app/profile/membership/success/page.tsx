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
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setVerifying(false);
      return;
    }

    async function verifyTransaction() {
      try {
        const res = await fetch("/api/membership/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId })
        });

        if (res.ok) {
          // Force NextAuth to refresh the JWT session token with the new DB role
          await update();
        } else {
          console.error("Verification callback failed.");
        }
      } catch (err) {
        console.error("Network error during verification:", err);
      } finally {
        setVerifying(false);
      }
    }

    verifyTransaction();
  }, [searchParams, update]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-slate-200 selection:text-slate-900">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full bg-white border border-slate-200 p-10 md:p-14 rounded-[2rem] shadow-sm text-center relative overflow-hidden"
      >
        {verifying ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-6" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Verifying Payment...</h2>
            <p className="text-sm font-medium text-slate-500 mt-2">Please do not close this window.</p>
          </div>
        ) : (
          <>
            {/* Success Icon */}
            <div className="relative mb-8 flex justify-center">
              <div className="absolute inset-0 bg-emerald-100 blur-2xl rounded-full" />
              <div className="relative bg-emerald-50 p-5 rounded-full border border-emerald-100">
                <FaCheckCircle className="h-14 w-14 text-emerald-500" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">Payment Verified</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Membership <span className="text-slate-400 font-light">Upgraded</span>
            </h1>
            
            <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed max-w-md mx-auto">
              Your account has been successfully updated with premium access. You can now utilize all elite member features, analytics, and ticketing priorities.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                <FaShieldAlt className="h-5 w-5 text-slate-400 mb-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Account Status</span>
                <span className="text-sm font-black text-slate-900">Active</span>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                <FaExchangeAlt className="h-5 w-5 text-slate-400 mb-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Data Sync</span>
                <span className="text-sm font-black text-slate-900">Complete</span>
              </div>
            </div>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-colors"
            >
              Return to Hub
            </Link>

            <p className="mt-8 text-xs text-slate-400 font-medium tracking-wide">
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
       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
       </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
