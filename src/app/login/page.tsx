"use client";
export const dynamic = "force-dynamic";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useState, Suspense, useEffect, useCallback } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Turnstile from "@/components/cloudflare/turnstile";
import { motion } from "framer-motion";

function SignInPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [form, setForm] = useState({ email: "", password: "" });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  let errorMessage = error;
  if (errorParam === "OAuthAccountNotLinked") {
    errorMessage =
      "An account already exists with this email, but it was registered using a different sign-in method. Please use the original method to log in.";
  }

  useEffect(() => {
    const lastEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("lastLoginEmail")
        : null;
    if (lastEmail) setForm((f) => ({ ...f, email: lastEmail }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const callbackUrl = searchParams.get("callbackUrl") || "/";

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
      turnstileToken: turnstileToken || "",
    });
    setLoading(false);
    if (res?.ok) {
      if (typeof window !== "undefined")
        localStorage.setItem("lastLoginEmail", form.email);
      router.push(callbackUrl);
    } else {
      setError(res?.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left: Branded Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between overflow-hidden bg-slate-950"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #f59e0b40 0%, transparent 60%), radial-gradient(circle at 80% 20%, #f59e0b20 0%, transparent 50%)'
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 p-12 flex items-center gap-3">
          <Image src="/images/logo.jpg" alt="FC Escuela" width={44} height={44} className="rounded-xl border border-white/10 shadow-lg" />
          <span className="text-white font-black text-xl tracking-tight">FC <span className="text-amber-400">Escuela</span></span>
        </div>

        <div className="relative z-10 px-12 pb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Member Portal</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight mb-4">
            Welcome<br />
            <span className="text-amber-400">Back</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Sign in to access match tickets, member content, and your personal dashboard.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: 'Live Fixtures', value: '4+' },
              { label: 'Academy Players', value: '12' },
              { label: 'Members', value: '500+' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </motion.div>

      {/* Right: Form Panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex items-center justify-center p-6 sm:p-12"
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image src="/images/logo.jpg" alt="FC Escuela" width={40} height={40} className="rounded-xl border border-slate-200 shadow" />
            <span className="text-slate-900 font-black text-lg tracking-tight">FC <span className="text-amber-500">Escuela</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">Sign in</h2>
            <p className="text-slate-500 text-sm mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all placeholder:text-slate-400"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                <a href="/auth/forgot-password" className="text-[10px] text-amber-600 font-bold uppercase tracking-widest hover:text-amber-700 transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all placeholder:text-slate-400 pr-12"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-amber-500 transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
                </button>
              </div>
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
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-slate-950 hover:bg-amber-500 text-white hover:text-slate-950 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-slate-950/10"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-xs font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            className="w-full h-12 flex items-center justify-center gap-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all text-slate-700 font-semibold text-sm shadow-sm hover:shadow"
            onClick={() => signIn("google", { prompt: "select_account", callbackUrl })}
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-amber-600 font-bold hover:text-amber-700 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-amber-500 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Loading…</p>
          </div>
        </div>
      }
    >
      <SignInPageInner />
    </Suspense>
  );
}