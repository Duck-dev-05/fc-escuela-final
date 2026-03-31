"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaStar, FaCrown, FaIdCard, FaLock, FaCalendarAlt, FaFingerprint, FaCheckCircle, FaExchangeAlt, FaBolt } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Club Fan",
    id: "free",
    price: "0",
    billing: "Forever",
    description: "Essential access for supporters.",
    icon: <FaIdCard className="h-6 w-6" />,
    features: [
      "Access to Public Match Hub",
      "Standard Match Statistics",
      "Community Forum Access",
      "Basic Profile Management"
    ],
    accent: "slate-500",
    buttonText: "Current Plan",
    disabled: true,
  },
  {
    name: "Pro Member",
    id: "price_1TGtrg09wIpZTJdbzNoTXoIE",
    price: "19",
    billing: "Per Month",
    description: "Comprehensive stats and priority access.",
    icon: <FaStar className="h-6 w-6" />,
    features: [
      "Full Data Analytics Suite",
      "Premium Match Replays",
      "Priority Ticket Reservations",
      "Advanced Scouting Reports",
      "Ad-Free Experience",
      "Pro Member Profile Badge"
    ],
    accent: "amber-500",
    buttonText: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Elite VIP",
    id: "price_1TGtrh09wIpZTJdbswMvJici",
    price: "199",
    billing: "Per Year",
    description: "The ultimate club experience.",
    icon: <FaCrown className="h-6 w-6" />,
    features: [
      "Everything in Pro Member",
      "VIP Match Day Hospitality",
      "Direct Coach Q&A Sessions",
      "All Editorial Content Unlocked",
      "Personal Club Mentor",
      "Exclusive Annual Gala Invite",
      "Save 15% Annually"
    ],
    accent: "slate-900",
    buttonText: "Upgrade to Elite",
  },
];

export default function MembershipPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dbMembershipType, setDbMembershipType] = useState<string | null>(null);
  const [dbMemberships, setDbMemberships] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAccurateMembershipData() {
      if (!session) {
        setDataLoaded(true);
        return;
      }
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setDbMembershipType(data.user?.membershipType || 'free');
          setDbMemberships(data.user?.memberships || []);
        }
      } catch (error) {
        console.error("Failed to sync database registry", error);
      } finally {
        setDataLoaded(true);
      }
    }
    fetchAccurateMembershipData();
  }, [session]);

  const handleUpgrade = async (priceId: string) => {
    if (!session) {
      router.push("/login?callbackUrl=/profile/membership");
      return;
    }

    setLoading(priceId);
    try {
      const res = await fetch("/api/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout Failure:", error);
    } finally {
      setLoading(null);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Registry...</p>
      </div>
    );
  }

  const actualMembership = dbMembershipType || (session?.user as any)?.membershipType || 'free';
  const isPremium = actualMembership === 'pro' || actualMembership === 'elite';
  const activeMembershipDetails = dbMemberships[0];

  if (isPremium && activeMembershipDetails) {
    const activePlanDef = plans.find((p) => 
      (actualMembership === 'pro' && p.id === 'price_1TGtrg09wIpZTJdbzNoTXoIE') ||
      (actualMembership === 'elite' && p.id === 'price_1TGtrh09wIpZTJdbswMvJici')
    ) || plans[1];

    const isElite = actualMembership === 'elite';

    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-24 relative selection:bg-slate-200 selection:text-slate-900">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 border-b border-slate-200 pb-12 mb-12"
          >
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                My <span className="text-slate-400 font-light">Membership</span>
             </h1>
             <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                <span>Manage your active premium subscription and benefits.</span>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white border rounded-[2rem] shadow-sm overflow-hidden ${isElite ? 'border-slate-300' : 'border-slate-200'}`}
          >
            {/* Header Area */}
            <div className={`p-8 md:p-12 border-b flex flex-col md:flex-row md:items-center justify-between gap-6 ${isElite ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center gap-6">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border ${isElite ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-amber-500 border-slate-200'}`}>
                    {activePlanDef.icon}
                 </div>
                 <div>
                    <h2 className={`text-3xl font-black tracking-tight leading-none mb-2 ${isElite ? 'text-white' : 'text-slate-900'}`}>{activePlanDef.name}</h2>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border ${isElite ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isElite ? 'text-emerald-400' : 'text-emerald-700'}`}>Active Status</span>
                    </div>
                 </div>
              </div>

               {/* Right side of header: ID */}
               <div className="text-left md:text-right">
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isElite ? 'text-slate-500' : 'text-slate-400'}`}>Registry ID</p>
                  <p className={`font-mono text-sm tracking-tight ${isElite ? 'text-slate-300' : 'text-slate-600'}`}>
                      {activeMembershipDetails.id.split('_').pop() || activeMembershipDetails.id}
                  </p>
               </div>
            </div>

            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
               {/* Metadata Column */}
               <div className="w-full md:w-1/3 p-8 md:p-12 space-y-8 bg-white">
                  <div>
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                      <FaCalendarAlt className="text-slate-300" /> Member Since
                    </p>
                    <p className="text-xl font-black text-slate-900">{new Date(activeMembershipDetails.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                      <FaExchangeAlt className="text-slate-300" /> Next Renewal
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      {activeMembershipDetails.endDate ? new Date(activeMembershipDetails.endDate).toLocaleDateString() : 'Auto-renews'}
                    </p>
                  </div>

                  {!isElite && (
                    <div className="pt-8 border-t border-slate-100">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                            <FaBolt className="text-amber-500 text-sm" />
                         </div>
                         <h4 className="text-base font-black text-slate-900 tracking-tight">Upgrade Available</h4>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
                         Unlock standard Elite features including match-day hospitality and exclusive annual gala invites.
                      </p>
                      <button 
                        onClick={() => handleUpgrade(plans[2].id)}
                        disabled={loading === plans[2].id}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-3"
                      >
                        {loading === plans[2].id ? 'Initializing...' : 'Upgrade to Elite ($199/yr)'}
                      </button>
                    </div>
                  )}

                  {isElite && (
                     <div className="pt-8 border-t border-slate-100 mt-auto">
                        <div className="px-6 py-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center gap-3">
                           <FaCrown className="text-amber-500" />
                           <span className="text-xs font-black uppercase tracking-widest text-amber-700">Top Tier Benefits Unlocked</span>
                        </div>
                     </div>
                  )}
               </div>

               {/* Features Column */}
               <div className="w-full md:w-2/3 p-8 md:p-12 bg-white flex flex-col justify-center">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Included Features</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    {activePlanDef.features.map((feature, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (i * 0.05) }}
                        key={feature} 
                        className="flex items-start gap-4"
                      >
                        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center shadow-sm border ${isElite ? 'bg-slate-50 border-slate-200' : 'bg-amber-50 border-amber-100'}`}>
                          <FaCheck className={`w-3 h-3 flex-shrink-0 ${isElite ? 'text-slate-900' : 'text-amber-500'}`} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 leading-snug pt-0.5">{feature}</span>
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

  // View 1: Free User / Pricing Screen
  return (
    <div className="min-h-screen bg-white pt-32 pb-24 relative selection:bg-slate-200 selection:text-slate-900">
      <div className="absolute top-24 left-1/2 -translate-x-1/2 select-none pointer-events-none text-slate-50 whitespace-nowrap z-0">
        <span className="text-[20vw] font-black leading-none tracking-tighter">MEMBERSHIP</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full shadow-sm">
             <FaLock className="text-slate-400 text-xs" />
             <span className="text-[11px] uppercase tracking-widest text-slate-600 font-bold">Premium Services</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Elevate Your <span className="text-slate-400 font-light">Experience</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Unlock premium analytics, priority ticketing, and exclusive editorial content by upgrading your membership tier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
             <motion.div
               key={plan.name}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1, ease: "easeOut" }}
               className={`relative bg-white border ${plan.popular ? 'border-amber-500 shadow-xl' : 'border-slate-200 shadow-sm'} p-10 md:p-12 rounded-[2rem] overflow-hidden group flex flex-col`}
             >
               {plan.popular && (
                 <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-8 py-1.5 transform rotate-45 translate-x-8 translate-y-3">
                   Most Popular
                 </div>
               )}

               <div className="mb-8 flex items-center justify-between">
                 <div className={`p-4 rounded-2xl ${plan.popular ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'}`}>
                    {plan.icon}
                 </div>
               </div>

               <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">{plan.name}</h3>
               <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed h-10">{plan.description}</p>

               <div className="flex items-baseline gap-1 mb-8">
                 <span className="text-3xl font-bold text-slate-400">$</span>
                 <span className="text-6xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                 <span className="text-slate-500 font-medium text-sm ml-1">
                   /{plan.billing.includes(' ') ? plan.billing.split(' ')[1] : plan.billing}
                 </span>
               </div>

               <button
                 onClick={() => !plan.disabled && handleUpgrade(plan.id)}
                 disabled={plan.disabled || loading === plan.id}
                 className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 ${
                   plan.disabled
                     ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                     : plan.popular
                       ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20'
                       : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
                   }`}
               >
                 {loading === plan.id ? (
                   <>
                     <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                     Processing...
                   </>
                 ) : (
                   plan.buttonText
                 )}
               </button>

               <div className="mt-12 flex-1">
                 <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Included Benefits</div>
                 <div className="space-y-4">
                   {plan.features.map((feature) => (
                     <div key={feature} className="flex items-start gap-4">
                       <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${plan.popular ? 'bg-amber-50' : 'bg-slate-50'}`}>
                         <FaCheck className={`w-3 h-3 ${plan.popular ? 'text-amber-500' : 'text-slate-400'}`} />
                       </div>
                       <span className="text-sm font-medium text-slate-700 leading-relaxed">{feature}</span>
                     </div>
                   ))}
                 </div>
               </div>
             </motion.div>
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto p-8 bg-slate-50 rounded-2xl text-center border border-slate-100">
          <p className="text-sm font-medium text-slate-500">
            Secure payments processed globally by Stripe. Cancel or modify your subscription at any time through your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}
