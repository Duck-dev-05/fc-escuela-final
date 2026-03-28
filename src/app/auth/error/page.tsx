"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaExclamationTriangle, FaSignInAlt, FaHome } from "react-icons/fa";

function AuthErrorPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    OAuthSignin: "Transmission error during provider handshake. Access denied.",
    OAuthCallback: "Callback sequence interrupted. Please re-initiate.",
    OAuthCreateAccount: "Unable to provision new social entity. Access denied.",
    EmailCreateAccount: "Registry entry failed for this email. Access denied.",
    Callback: "Authentication callback failure. Transmission terminated.",
    OAuthAccountNotLinked: "Entity already exists under a different security protocol.",
    EmailSignin: "Transmission failure in delivery. Check connection.",
    CredentialsSignin: "Validation failed. Security key or email mismatch.",
    AccessDenied: "Access denied. Insufficient clearance level.",
    Verification: "Security verification token expired. Please re-request.",
    Configuration: "System configuration error. Admin attention required.",
    default: "Unknown system failure. Protocol breached."
  };

  const message = error ? (errorMessages[error] || errorMessages.default) : errorMessages.default;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 relative overflow-hidden animate-scan pt-32 pb-16">
      {/* Ghost Typography */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-10 whitespace-nowrap">
        <span className="text-[20vw] ghost-text leading-none uppercase">ER_STATUS_403</span>
      </div>

      <div className="max-w-md w-full glass-card hud-border p-10 animate-slide-up relative z-10 mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
            <div className="w-20 h-20 glass-card hud-border border-red-500/50 flex items-center justify-center relative">
               <FaExclamationTriangle className="text-red-500 text-3xl animate-pulse" />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold">System Halt</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter text-center">Auth <span className="text-red-500">Failure</span></h2>
        </div>

        <div className="space-y-6 text-center">
          <p className="text-xs text-slate-400 font-medium leading-relaxed px-4">{message}</p>
          
          {error && (
             <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest bg-black/20 py-2 rounded border border-white/5">
                Error Vector: {error}
             </div>
          )}

          <div className="grid grid-cols-1 gap-4 pt-6">
            <Link href="/login" className="btn-primary flex items-center justify-center gap-3 h-14">
              <FaSignInAlt className="text-sm" />
              <span className="uppercase tracking-widest text-xs font-black">Return to Gate</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <div className="w-16 h-16 border-t-2 border-l-2 border-red-500 hud-border rounded-full animate-spin"></div>
           <p className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs">Diagnosing Breach...</p>
        </div>
      </div>
    }>
      <AuthErrorPageInner />
    </Suspense>
  );
}