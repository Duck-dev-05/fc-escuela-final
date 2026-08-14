"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FaLock, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

interface MembershipGuardProps {
  children: React.ReactNode;
  tier?: "standard" | "yearly";
}

export default function MembershipGuard({ children, tier = "standard" }: MembershipGuardProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="animate-pulse bg-slate-100 rounded-2xl h-64 flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronizing Clearance...</span>
      </div>
    );
  }

  const membershipType = session?.user?.membershipType?.toLowerCase() || "free";
  
  // High-Security Access Logic
  const hasAccess = 
    tier === "standard" 
      ? (membershipType === "pro" || membershipType === "elite" || membershipType === "standard" || membershipType === "yearly")
      : (membershipType === "elite" || membershipType === "yearly");

  if (!hasAccess) {
    return (
      <div className="relative group">
        {/* Blurred Content Placeholder */}
        <div className="filter blur-xl opacity-30 select-none pointer-events-none transition-all duration-700">
          {children}
        </div>

        {/* Tactical Security Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full backdrop-blur-3xl bg-slate-900/90 border border-slate-700/50 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden"
          >
            {/* Background HUD Layer */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] scanline-effect" />
            
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
                <div className="relative bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-inner">
                  <FaLock className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[8px] uppercase tracking-[0.25em] text-red-500 font-bold">Unauthenticated Clearance</span>
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">
              {tier === "standard" ? "Standard" : "Elite"} Security Protocol <span className="text-yellow-500">Required</span>
            </h3>
            <p className="text-slate-400 text-[10px] mb-8 font-bold uppercase tracking-widest leading-relaxed">
              This intelligence module is restricted to {tier === "standard" ? "Standard Operator" : "Elite Commander"} personnel only. Please upgrade your master registry credentials to proceed.
            </p>

            <Link
              href="/profile/membership"
              className="flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all duration-300 w-full group/btn relative overflow-hidden"
            >
              <FaShieldAlt className="h-4 w-4" />
              <span>Upgrade Clearance</span>
              <FaArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500" />
            </Link>

            {/* Tactical Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-slate-700 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-slate-700 rounded-br-3xl" />
          </motion.div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
