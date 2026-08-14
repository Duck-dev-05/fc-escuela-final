"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Turnstile from "@/components/cloudflare/turnstile";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { label: "", color: "bg-slate-200", width: "0%", score: 0 };
    let score = 0;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const map = [
      { label: "Weak", color: "bg-red-500", width: "25%", score: 1 },
      { label: "Fair", color: "bg-amber-500", width: "50%", score: 2 },
      { label: "Strong", color: "bg-blue-500", width: "75%", score: 3 },
      { label: "Excellent", color: "bg-emerald-500", width: "100%", score: 4 },
    ];
    return map[Math.max(0, score - 1)] || map[0];
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken && process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY) {
      setError("Please complete the security challenge.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Account created successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left: Branded Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-[45%] relative flex-col justify-between overflow-hidden bg-slate-950"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%, #f59e0b40 0%, transparent 60%), radial-gradient(circle at 20% 80%, #f59e0b20 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 p-12 flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="FC Escuela"
            width={44}
            height={44}
            className="rounded-xl border border-white/10 shadow-lg"
          />
          <span className="text-white font-black text-xl tracking-tight">
            FC <span className="text-amber-400">Escuela</span>
          </span>
        </div>

        <div className="relative z-10 px-12 pb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">
              Join the Club
            </span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight mb-4">
            Create your
            <br />
            <span className="text-amber-400">Account</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Become a member and unlock exclusive access to match tickets, academy news, and the full club experience.
          </p>

          <div className="mt-12 space-y-4">
            {[
              "Access match day tickets",
              "Follow academy progress",
              "Exclusive member content",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle className="text-amber-400 text-[9px]" />
                </div>
                <span className="text-slate-400 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </motion.div>

      {/* Right: Form Panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-sm py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image
              src="/images/logo.jpg"
              alt="FC Escuela"
              width={40}
              height={40}
              className="rounded-xl border border-slate-200 shadow"
            />
            <span className="text-slate-900 font-black text-lg tracking-tight">
              FC <span className="text-amber-500">Escuela</span>
            </span>
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center py-10 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <FaCheckCircle className="text-emerald-500 text-2xl" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">You're in!</h2>
              <p className="text-slate-500 text-sm">{success}</p>
              <p className="text-xs text-slate-400">Redirecting to login…</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-950 tracking-tight">
                  Create account
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Join the FC Escuela community today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all placeholder:text-slate-400"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all placeholder:text-slate-400"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all placeholder:text-slate-400 pr-12"
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-amber-500 transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {form.password && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-500`}
                          style={{ width: strength.width }}
                        />
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${
                        strength.score <= 1
                          ? "text-red-500"
                          : strength.score === 2
                          ? "text-amber-500"
                          : strength.score === 3
                          ? "text-blue-500"
                          : "text-emerald-500"
                      }`}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all placeholder:text-slate-400 pr-12"
                      placeholder="Repeat your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-amber-500 transition-colors"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5" />
                      )}
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

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl">
                    {error}
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
                      <span>Creating account…</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-amber-600 font-bold hover:text-amber-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
