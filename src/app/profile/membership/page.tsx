"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckIcon,
  StarIcon,
  SparklesIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

// ── Plan definitions ──────────────────────────────────────────────────────────
const plans = [
  {
    name: "Club Fan",
    id: "free",
    price: "0",
    billing: "Forever",
    period: "free",
    description: "Essential access for supporters.",
    icon: IdentificationIcon,
    features: [
      "Access to Public Match Hub",
      "Standard Match Statistics",
      "Community Forum Access",
      "Basic Profile Management",
    ],
    popular: false,
    disabled: true,
    buttonText: "Current Plan",
    theme: "default" as const,
  },
  {
    name: "Pro Member",
    id: "price_1TGtrg09wIpZTJdbzNoTXoIE",
    price: "19",
    billing: "/Month",
    period: "month",
    description: "Comprehensive stats and priority access.",
    icon: StarIcon,
    features: [
      "Full Data Analytics Suite",
      "Premium Match Replays",
      "Priority Ticket Reservations",
      "Advanced Scouting Reports",
      "Ad-Free Experience",
      "Pro Member Profile Badge",
    ],
    popular: true,
    disabled: false,
    buttonText: "Upgrade to Pro",
    theme: "amber" as const,
  },
  {
    name: "Elite VIP",
    id: "price_1TGtrh09wIpZTJdbswMvJici",
    price: "199",
    billing: "/Year",
    period: "year",
    description: "The ultimate club experience.",
    icon: SparklesIcon,
    features: [
      "Everything in Pro Member",
      "VIP Match Day Hospitality",
      "Direct Coach Q&A Sessions",
      "All Editorial Content Unlocked",
      "Personal Club Mentor",
      "Exclusive Annual Gala Invite",
      "Save 15% Annually",
    ],
    popular: false,
    disabled: false,
    buttonText: "Upgrade to Elite",
    theme: "dark" as const,
  },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function MembershipPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dbMembershipType, setDbMembershipType] = useState<string | null>(null);
  const [dbMemberships, setDbMemberships] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMembershipData() {
      if (!session) { setDataLoaded(true); return; }
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setDbMembershipType(data.user?.membershipType || "free");
          setDbMemberships(data.user?.memberships || []);
        }
      } catch (err) {
        console.error("Failed to load membership data", err);
      } finally {
        setDataLoaded(true);
      }
    }
    fetchMembershipData();
  }, [session]);

  const handleUpgrade = async (planId: string) => {
    if (!session) {
      router.push("/login?callbackUrl=/profile/membership");
      return;
    }
    try {
      setLoading(planId);
      const res = await fetch("/api/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate checkout");
    } finally {
      setLoading(null);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (!dataLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
          <p className="text-sm font-medium text-slate-600">Loading membership…</p>
        </div>
      </div>
    );
  }

  const actualMembership = dbMembershipType || (session?.user as any)?.membershipType || "free";
  const isPremium = actualMembership === "pro" || actualMembership === "elite";
  const activeMembershipDetails = dbMemberships[0];

  // ── Active Membership View ────────────────────────────────────────────────────
  if (isPremium && activeMembershipDetails) {
    const isElite = actualMembership === "elite";
    const activePlanDef = plans.find((p) =>
      isElite
        ? p.id === "price_1TGtrh09wIpZTJdbswMvJici"
        : p.id === "price_1TGtrg09wIpZTJdbzNoTXoIE"
    ) ?? plans[1];

    return (
      <div className="min-h-screen bg-slate-50 pb-20 pt-28 md:pt-32">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 border-b border-slate-200 pb-8"
          >
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
              My Account
            </p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Membership
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your active premium subscription and benefits.
            </p>
          </motion.div>

          {/* Active plan card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Card header */}
            <div className={`flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between md:p-8 ${isElite ? 'bg-slate-900' : 'bg-amber-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${isElite ? 'border-slate-700 bg-slate-800 text-amber-400' : 'border-amber-200 bg-white text-amber-600'}`}>
                  <activePlanDef.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${isElite ? 'text-white' : 'text-slate-900'}`}>
                    {activePlanDef.name}
                  </h2>
                  <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold text-emerald-700">Active</span>
                  </div>
                </div>
              </div>
              <div className={`text-sm ${isElite ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="text-[11px] font-semibold uppercase tracking-wider">ID </span>
                <span className="font-mono">{activeMembershipDetails.id.split("_").pop()}</span>
              </div>
            </div>

            {/* Card body */}
            <div className="grid md:grid-cols-3">
              {/* Meta */}
              <div className="border-b border-slate-100 p-6 md:border-b-0 md:border-r md:p-8">
                <h3 className="mb-6 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Subscription Details
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      <CalendarDaysIcon className="h-3.5 w-3.5" />
                      Member Since
                    </div>
                    <p className="text-base font-bold text-slate-900">
                      {new Date(activeMembershipDetails.startDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      <ArrowPathIcon className="h-3.5 w-3.5" />
                      Next Renewal
                    </div>
                    <p className="text-base font-bold text-slate-900">
                      {activeMembershipDetails.endDate
                        ? new Date(activeMembershipDetails.endDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
                        : "Auto-renews"}
                    </p>
                  </div>

                  {/* Upgrade nudge for Pro → Elite */}
                  {!isElite && (
                    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
                          <BoltIcon className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-900">Upgrade Available</p>
                      </div>
                      <p className="mb-4 text-xs leading-relaxed text-slate-500">
                        Unlock VIP hospitality, gala invites, and exclusive editorial content.
                      </p>
                      <button
                        onClick={() => handleUpgrade(plans[2].id)}
                        disabled={loading === plans[2].id}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-amber-500 hover:text-slate-950 disabled:opacity-50"
                      >
                        {loading === plans[2].id ? "Processing…" : "Upgrade to Elite — $199/yr"}
                      </button>
                    </div>
                  )}

                  {isElite && (
                    <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-center">
                      <StarSolid className="mx-auto mb-1 h-5 w-5 text-amber-500" />
                      <p className="text-xs font-bold text-amber-800">Top Tier Benefits Active</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="col-span-2 p-6 md:p-8">
                <h3 className="mb-6 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Included Features
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activePlanDef.features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isElite ? 'bg-slate-100' : 'bg-amber-100'}`}>
                        <CheckIcon className={`h-3 w-3 ${isElite ? 'text-slate-700' : 'text-amber-600'}`} />
                      </div>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Pricing View (free / unauthenticated) ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Hero section */}
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 pt-28 pb-14 md:pt-32 md:pb-20">
        <div className="absolute inset-0 -z-20">
          <Image src="/images/hero_final.jpg" alt="" fill priority className="object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-slate-50" />
        </div>
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl -z-10" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl -z-10" />

        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-2xl"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Premium Membership
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Elevate Your{" "}
              <span className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                Experience
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 md:text-base">
              Unlock premium analytics, priority ticketing, and exclusive editorial content by upgrading your membership tier.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing grid */}
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const isAmber = plan.theme === "amber";
            const isDark = plan.theme === "dark";

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={`relative flex flex-col rounded-3xl border p-8 transition ${
                  isAmber
                    ? "border-amber-400 bg-white shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/50 md:scale-[1.03]"
                    : isDark
                    ? "border-slate-200 bg-slate-900 shadow-md"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                {/* Popular ribbon */}
                {plan.popular && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2">
                    <div className="rounded-b-full bg-amber-500 px-4 py-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        Most Popular
                      </span>
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${
                  isAmber ? "bg-amber-100 text-amber-600" :
                  isDark   ? "bg-white/10 text-amber-400" :
                             "bg-slate-100 text-slate-500"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Plan name & description */}
                <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6 flex items-end gap-1">
                  <span className={`text-lg font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>$</span>
                  <span className={`text-5xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`mb-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.billing}
                  </span>
                </div>

                {/* CTA button */}
                <button
                  type="button"
                  onClick={() => !plan.disabled && handleUpgrade(plan.id)}
                  disabled={plan.disabled || loading === plan.id}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    plan.disabled
                      ? "bg-slate-100 text-slate-400"
                      : isAmber
                      ? "bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/25"
                      : isDark
                      ? "bg-white text-slate-950 hover:bg-amber-50"
                      : "bg-slate-900 text-white hover:bg-slate-700"
                  }`}
                >
                  {loading === plan.id ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing…
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </button>

                {/* Features */}
                <div className={`mt-8 flex-1 border-t pt-6 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <p className={`mb-4 text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Included benefits
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          isAmber ? 'bg-amber-100' : isDark ? 'bg-white/10' : 'bg-slate-100'
                        }`}>
                          <CheckIcon className={`h-3 w-3 ${
                            isAmber ? 'text-amber-600' : isDark ? 'text-amber-400' : 'text-slate-500'
                          }`} />
                        </div>
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-14 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
        >
          <p className="text-sm text-slate-500">
            Membership tiers are provisioned by the FC Escuela administrative unit.
            Access is subject to protocol verification and operational availability.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
