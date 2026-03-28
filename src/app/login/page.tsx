"use client";
export const dynamic = "force-dynamic";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useState, Suspense, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Turnstile from "@/components/cloudflare/turnstile";

function SignInPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

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
    if (!turnstileToken) {
      setError("Please complete the security challenge");
      return;
    }
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
      turnstileToken, // Pass token to backend if needed
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
    <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden animate-scan pt-32 pb-16">
      {/* Ghost Typography */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-10 whitespace-nowrap">
        <span className="text-[20vw] ghost-text leading-none uppercase">AUTH GATE</span>
      </div>

      <div className="max-w-md w-full glass-card hud-border p-10 animate-slide-up relative z-10 mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
            <Image src="/images/logo.jpg" alt="FC ESCUELA" width={80} height={80} className="rounded-xl relative border border-white/10" />
          </div>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-500 font-bold">Secure Access</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter text-center">Protocol <span className="text-yellow-500">Alpha</span></h2>
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-bold placeholder-white/20"
              placeholder="Operator Email"
              autoComplete="email"
            />
          </div>
          
          <div className="relative group">
             <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-0 bg-yellow-500 group-focus-within:h-8 transition-all duration-300" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-bold placeholder-white/20 pr-12"
              placeholder="Security Key"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4 flex items-center text-white/30 hover:text-yellow-500 transition-colors"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex justify-end">
            <a href="/auth/forgot-password" title="Recover Access?" className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest hover:text-white transition-colors">Recover Access?</a>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Cloudflare Turnstile */}
          <div className="flex justify-center mb-6">
            <Turnstile 
              siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
              onVerify={setTurnstileToken} 
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center h-14"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                <span className="uppercase tracking-[0.2em]">Verifying...</span>
              </div>
            ) : (
              <span className="uppercase tracking-[0.2em]">Initiate Session</span>
            )}
          </button>
        </form>

        <div className="flex items-center w-full my-8">
          <div className="flex-grow border-t border-white/5" />
          <span className="mx-4 text-white/20 text-[10px] font-black uppercase tracking-widest leading-none">External Link</span>
          <div className="flex-grow border-t border-white/5" />
        </div>

        <button
          className="w-full h-14 flex items-center justify-center gap-3 glass-card hud-border hover:bg-white/5 transition-all text-white font-black uppercase tracking-widest text-[10px]"
          onClick={() => signIn("google", { prompt: "select_account", callbackUrl: "/" })}
        >
          <FcGoogle className="h-5 w-5" />
          Sign in with Google
        </button>

        <div className="mt-10 text-center">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">New Operator?</span>
          <a href="/auth/register" className="ml-2 text-yellow-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors">Register Entry</a>
        </div>
      </div>
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