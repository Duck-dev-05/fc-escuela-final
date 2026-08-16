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

/* ─── DARK THEME to match site design system ─────────────────────────── */

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
    <div className="min-h-screen flex" style={{ background: "rgb(8,8,8)" }}>
      {/* Left: Branded Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between overflow-hidden"
        style={{ background: "rgb(14,14,14)" }}
      >
        {/* Red mesh */}
        <div className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(239,68,68,0.12) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(220,38,38,0.06) 0%, transparent 50%)",
          }}
        />

        {/* Kit diagonal stripes */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, rgba(239,68,68,0.8) 0px, rgba(239,68,68,0.8) 2px, transparent 2px, transparent 28px)",
          }}
        />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(to right, rgb(220,38,38), rgb(239,68,68), rgba(255,255,255,0.6), rgb(239,68,68), rgb(220,38,38))" }}
        />

        <div className="relative z-10 p-12 flex items-center gap-3">
          <Image src="/images/logo.jpg" alt="FC Escuela" width={44} height={44}
            className="rounded-xl shadow-lg"
            style={{ border: "1px solid rgba(239,68,68,0.3)" }}
          />
          <span className="font-black text-xl tracking-tight" style={{ color: "#f8f8f8" }}>
            FC <span style={{ color: "rgb(239,68,68)" }}>Escuela</span>
          </span>
        </div>

        <div className="relative z-10 px-12 pb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "rgb(239,68,68)" }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgb(239,68,68)" }}>Member Portal</span>
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tight mb-4"
            style={{ color: "#f8f8f8", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
          >
            Welcome<br />
            <span style={{ color: "rgb(239,68,68)" }}>Back</span>
          </h1>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: "rgb(100,116,139)" }}>
            Sign in to access match tickets, member content, and your personal dashboard.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: 'Live Fixtures', value: '4+' },
              { label: 'Academy Players', value: '12' },
              { label: 'Members', value: '500+' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-black" style={{ color: "#f8f8f8" }}>{stat.value}</p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "rgb(71,85,105)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(239,68,68,0.4), transparent)" }}
        />
      </motion.div>

      {/* Right: Form Panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex items-center justify-center p-6 sm:p-12"
        style={{ background: "rgb(8,8,8)" }}
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image src="/images/logo.jpg" alt="FC Escuela" width={40} height={40}
              className="rounded-xl shadow"
              style={{ border: "1px solid rgba(239,68,68,0.3)" }}
            />
            <span className="font-black text-lg tracking-tight" style={{ color: "#f8f8f8" }}>
              FC <span style={{ color: "rgb(239,68,68)" }}>Escuela</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight"
              style={{ color: "#f8f8f8", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
            >
              Sign in
            </h2>
            <p className="text-sm mt-1" style={{ color: "rgb(100,116,139)" }}>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "rgb(100,116,139)" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#f8f8f8" }}
                onFocus={e => { e.target.style.border = "1px solid rgba(239,68,68,0.5)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "rgb(100,116,139)" }}>Password</label>
                <a href="/auth/forgot-password"
                  className="text-[10px] font-bold uppercase tracking-widest transition-colors"
                  style={{ color: "rgb(239,68,68)" }}
                >
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
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all pr-12"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#f8f8f8" }}
                  onFocus={e => { e.target.style.border = "1px solid rgba(239,68,68,0.5)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center transition-colors"
                  style={{ color: "rgb(71,85,105)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgb(239,68,68)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgb(71,85,105)")}
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
                  theme="dark"
                />
              </div>
            )}

            {errorMessage && (
              <div className="p-3 text-xs font-medium rounded-xl"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "rgb(248,113,113)" }}
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
              style={{ background: loading ? "rgba(239,68,68,0.5)" : "rgb(220,38,38)", color: "#fff", boxShadow: "0 0 24px rgba(220,38,38,0.30)" }}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }}
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs font-medium" style={{ color: "rgb(71,85,105)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <button
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "#f8f8f8" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.30)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; }}
            onClick={() => signIn("google", { callbackUrl })}
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm" style={{ color: "rgb(100,116,139)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold transition-colors" style={{ color: "rgb(239,68,68)" }}>
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
        <div className="min-h-screen flex items-center justify-center" style={{ background: "rgb(8,8,8)" }}>
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-10 w-10 rounded-full border-2 animate-spin"
              style={{ borderColor: "rgba(239,68,68,0.2)", borderTopColor: "rgb(239,68,68)" }}
            />
            <p className="text-sm font-medium" style={{ color: "rgb(71,85,105)" }}>Loading...</p>
          </div>
        </div>
      }
    >
      <SignInPageInner />
    </Suspense>
  );
}
