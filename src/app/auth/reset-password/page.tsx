"use client";
export const dynamic = "force-dynamic";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaShieldAlt, FaKey, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

function ResetPasswordPageInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuccess("Security Protocol Complete. Access Key reset successfully.");
    } else {
      setError(data.error || "Reset Sequence Interrupted");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden animate-scan">
      {/* Ghost Typography */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-10 whitespace-nowrap">
        <span className="text-[20vw] ghost-text leading-none uppercase">SECURITY</span>
      </div>

      <div className="max-w-md w-full glass-card hud-border p-10 animate-slide-up relative z-10 mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
            <Image src="/images/logo.jpg" alt="FC ESCUELA" width={80} height={80} className="rounded-xl relative border border-white/10" />
          </div>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <FaShieldAlt className="text-yellow-500 text-[10px]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-500 font-bold">Key Override</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter text-center">Protocol <span className="text-yellow-500">Omega</span></h2>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
              <FaCheckCircle className="h-16 w-16 text-green-500 relative" />
            </div>
            <div className="text-green-500 font-black uppercase tracking-widest text-xs mb-4">{success}</div>
            <Link href="/login" className="ml-2 text-yellow-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors">Return to Base</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-0 bg-yellow-500 group-focus-within:h-8 transition-all duration-300" />
              <div className="relative">
                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-bold placeholder-white/20"
                  placeholder="New Security Key"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                <FaExclamationTriangle />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center h-14"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                  <span className="uppercase tracking-[0.2em]">Processing...</span>
                </div>
              ) : (
                <span className="uppercase tracking-[0.2em]">Update Security Core</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
          <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs">Accessing Security Core...</p>
        </div>
      </div>
    }>
      <ResetPasswordPageInner />
    </Suspense>
  );
}