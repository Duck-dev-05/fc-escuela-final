"use client";
export const dynamic = "force-dynamic";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useState, Suspense, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Turnstile from "@/components/cloudflare/turnstile";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback } from "react";

function SignInPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const [form, setForm] = useState({ email: "", password: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  let errorMessage = error;
  if (errorParam === 'OAuthAccountNotLinked') {
    errorMessage = 'An account already exists with this email, but it was registered using a different sign-in method. Please use the original method to log in.';
  }

  useEffect(() => {
    const lastEmail = typeof window !== 'undefined' ? localStorage.getItem("lastLoginEmail") : null;
    if (lastEmail) setForm(f => ({ ...f, email: lastEmail }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken && process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY) {
      setError("Please complete the security challenge.");
      return;
    }

    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
      turnstileToken: turnstileToken,
    });
    setLoading(false);
    if (res?.ok) {
      if (typeof window !== 'undefined') localStorage.setItem("lastLoginEmail", form.email);
      const callbackUrl = searchParams.get('callbackUrl') || "/";
      router.push(callbackUrl);
    } else {
      setError(res?.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 relative overflow-hidden pt-32 pb-16">
      {/* Tactical Canvas Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanline-effect" />
      
      {/* Ghost Typography */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none text-slate-900/[0.03] whitespace-nowrap">
        <span className="text-[25vw] font-black leading-none uppercase tracking-tighter">AUTH GATE</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full backdrop-blur-2xl bg-white/90 border border-slate-200/60 p-10 relative z-10 mx-4 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]"
      >
        {/* Tactical HUD Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-200/50 rounded-tl-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-200/50 rounded-tr-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-200/50 rounded-bl-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-slate-200/50 rounded-br-3xl pointer-events-none" />
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-yellow-500/10 blur-2xl rounded-full" />
            <Image src="/images/logo.jpg" alt="FC ESCUELA" width={80} height={80} className="rounded-xl relative border border-slate-200 shadow-xl" />
          </div>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-600 font-bold">Secure Access</span>
          </div>
          <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tighter text-center">Login <span className="text-yellow-600">Protocol</span></h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div className="relative group">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-0 bg-yellow-500 group-focus-within:h-8 transition-all duration-300" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-bold placeholder:text-slate-300"
              placeholder="Operator Email"
              autoComplete="email"
            />
          </div>

          <div className="relative group">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-0 bg-yellow-500 group-focus-within:h-8 transition-all duration-500" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-950 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 transition-all font-bold placeholder:text-slate-300 pr-12 shadow-inner"
              placeholder="Security Key"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-yellow-600 transition-colors"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex justify-end">
            <a href="/forgot-password" title="Recover Access?" className="text-[10px] text-yellow-600 font-bold uppercase tracking-widest hover:text-slate-900 transition-colors">Recover Access?</a>
          </div>

          {process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY && (
            <div className="flex justify-center py-2">
              <Turnstile 
                siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY as string} 
                onVerify={handleTurnstileVerify}
                theme="light"
              />
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-red-500/5 border border-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest text-center rounded-lg">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center h-14"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-950"></div>
                <span className="uppercase tracking-[0.2em]">Verifying...</span>
              </div>
            ) : (
              <span className="uppercase tracking-[0.2em]">Login</span>
            )}
          </button>
        </form>

        <div className="flex items-center w-full my-8">
          <div className="flex-grow border-t border-slate-100" />
          <span className="mx-4 text-slate-300 text-[10px] font-black uppercase tracking-widest leading-none">External Link</span>
          <div className="flex-grow border-t border-slate-100" />
        </div>

        <button
          className="w-full h-14 flex items-center justify-center gap-4 bg-slate-950 hover:bg-slate-900 rounded-xl border border-slate-800 transition-all text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg group overflow-hidden relative"
          onClick={() => signIn("google", { prompt: "select_account", callbackUrl: "/" })}
        >
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          <FcGoogle className="h-5 w-5 bg-white rounded-full p-0.5" />
          Sign in with Google
        </button>

        <div className="mt-10 text-center">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">New Operator?</span>
          <a href="/register" className="ml-2 text-yellow-600 font-black uppercase tracking-widest text-[10px] hover:text-slate-950 transition-colors border-b border-transparent hover:border-yellow-500 pb-1">Register Entry</a>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
          <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs">Loading Auth Gate...</p>
        </div>
      </div>
    }>
      <SignInPageInner />
    </Suspense>
  );
}