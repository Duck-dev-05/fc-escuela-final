"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaUserPlus, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Turnstile from "@/components/cloudflare/turnstile";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
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
    if (!password) return { label: "", color: "bg-slate-200", width: "0%", status: "" };
    let score = 0;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch(score) {
      case 0:
      case 1: return { label: "WEAK", color: "bg-red-500", width: "25%", status: "INSUFFICIENT" };
      case 2: return { label: "AVERAGE", color: "bg-yellow-500", width: "50%", status: "VULNERABLE" };
      case 3: return { label: "STRONG", color: "bg-blue-500", width: "75%", status: "SECURE" };
      case 4: return { label: "ELITE", color: "bg-green-500", width: "100%", status: "OPTIMIZED" };
      default: return { label: "", color: "bg-slate-200", width: "0%", status: "" };
    }
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken && process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY) {
      setError("Please complete the security challenge.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Security keys do not match. Please re-verify.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          turnstileToken
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Registry Entry Confirmed. Access granted.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "Registry Failure Detected");
      }
    } catch (err) {
      setError("Transmission Failure: Terminal Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 relative overflow-hidden pt-32 pb-16">
      {/* Tactical Canvas Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanline-effect" />

      {/* Ghost Typography */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none text-slate-900/[0.03] whitespace-nowrap">
        <span className="text-[25vw] font-black leading-none uppercase tracking-tighter">NEW OPERATOR</span>
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
            <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
            <Image src="/images/logo.jpg" alt="FC ESCUELA" width={80} height={80} className="rounded-xl relative border border-white/10" />
          </div>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-500 font-bold">New Registry</span>
          </div>
          <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tighter text-center">Protocol <span className="text-yellow-600">Beta</span></h2>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
              <FaCheckCircle className="h-16 w-16 text-green-500 relative" />
            </div>
            <div className="text-green-500 font-black uppercase tracking-widest text-xs mb-4">{success}</div>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Redirecting to Authentication Gate...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-0 bg-yellow-500 group-focus-within:h-8 transition-all duration-500" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-950 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 transition-all font-bold placeholder-slate-400 shadow-inner"
                placeholder="Username"
              />
            </div>

            <div className="relative group">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-0 bg-yellow-500 group-focus-within:h-8 transition-all duration-500" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-950 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 transition-all font-bold placeholder-slate-400 shadow-inner"
                placeholder="Email Address"
              />
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-0 bg-yellow-500 group-focus-within:h-8 transition-all duration-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-950 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 transition-all font-bold placeholder-slate-400 shadow-inner pr-12"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-yellow-600 transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
                </button>
              </div>
              
              {form.password && (
                <div className="px-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Security Rating: {strength.status}</span>
                    <span className={`text-[8px] font-black tracking-widest uppercase ${strength.label === "WEAK" ? "text-red-500" : strength.label === "AVERAGE" ? "text-yellow-500" : "text-green-500"}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${strength.color} transition-all duration-500 ease-out`} 
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="relative group">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-0 bg-yellow-500 group-focus-within:h-8 transition-all duration-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-950 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 transition-all font-bold placeholder-slate-400 shadow-inner pr-12"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-yellow-600 transition-colors"
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                <FaExclamationTriangle />
                {error}
              </div>
            )}

            {/* Security Challenge Protocol */}
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold opacity-60">Security Protocol Verification</div>
              {process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ? (
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY as string}
                  onVerify={handleTurnstileVerify}
                  theme="light"
                />
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-[10px] text-yellow-700 font-bold uppercase tracking-widest text-center">
                  Turnstile Site Key Missing: Terminal Configuration Required
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center h-14"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                  <span className="uppercase tracking-[0.2em]">Registering...</span>
                </div>
              ) : (
                <span className="uppercase tracking-[0.2em]">Register</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-10 text-center">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Already have an account?</span>
          <Link href="/login" className="ml-2 text-yellow-600 font-black uppercase tracking-widest text-[10px] hover:text-slate-950 transition-colors border-b border-transparent hover:border-yellow-500 pb-1">Return to Login</Link>
        </div>
      </motion.div>
    </div>
  );
}
