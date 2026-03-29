"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  FaCalendarPlus, FaShieldAlt, FaMapMarkedAlt, FaTrophy, 
  FaClock, FaArrowLeft, FaCheckCircle, FaCrosshairs
} from 'react-icons/fa';
import Link from "next/link";
import NeuralBackdrop from "@/components/NeuralBackdrop";
import { matchApi } from "@/services/api";
import { toast } from "react-hot-toast";

export default function MatchDeploymentForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    homeTeam: "FC Escuela",
    awayTeam: "",
    date: "",
    time: "",
    venue: "Elite Arena",
    competition: "LIGA_VANGUARD",
    score: "",
    homePower: 85,
    awayPower: 75
  });

  if (status === "loading") return null;
  if (!session || (session.user as any)?.roles !== 'admin' && (session.user as any)?.roles !== 'coach') {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await matchApi.create(formData as any);
      toast.success("DEPLOYMENT_AUTHORIZED: SECTOR_SYNC_LIVE");
      router.push("/coaching/upcoming");
    } catch (err) {
      console.error(err);
      toast.error("PROTOCOL_ERROR: SYNC_FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-yellow-500/30 font-sans overflow-hidden py-32 px-8">
      <NeuralBackdrop ghostText="MATCH_DEPLOY" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/coaching/upcoming" className="flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.4em] mb-12 group transition-all">
          <FaArrowLeft className="group-hover:-translate-x-2 transition-transform text-yellow-500/50" />
          Tactical_Vantage // Ops_Registry
        </Link>

        {/* Dynamic Match Header */}
        <div className="mb-20 animate-slide-up">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 glass-card hud-border border-yellow-500/30 flex items-center justify-center bg-yellow-500/5">
                 <FaCalendarPlus className="text-yellow-500 text-xl" />
              </div>
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.6em] font-mono">Mission_Deployment // Ops_Registry</span>
           </div>
           <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] italic">
              Fixture <br />
              <span className="text-yellow-500 not-italic">Authorization</span>
           </h1>
        </div>

        {/* Tactical Feed Form */}
        <form onSubmit={handleSubmit} className="space-y-12 animate-slide-up delay-100">
           <div className="grid md:grid-cols-2 gap-10">
              {/* Home Team (Locked or Editable) */}
              <div className="space-y-4">
                 <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                    <FaShieldAlt className="text-yellow-500/50" /> Home_Sector
                 </label>
                 <input 
                    type="text"
                    required
                    className="w-full bg-slate-950/40 border border-white/5 focus:border-yellow-500/40 focus:bg-slate-900/40 h-16 px-6 text-sm font-black uppercase tracking-widest transition-all rounded-sm outline-none"
                    value={formData.homeTeam}
                    onChange={e => setFormData({ ...formData, homeTeam: e.target.value })}
                 />
              </div>

              {/* Away Team */}
              <div className="space-y-4">
                 <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                    <FaCrosshairs className="text-yellow-500/50" /> Opposition_Target
                 </label>
                 <input 
                    type="text"
                    required
                    placeholder="Enter target squad..."
                    className="w-full bg-slate-950/40 border border-white/5 focus:border-yellow-500/40 focus:bg-slate-900/40 h-16 px-6 text-sm font-black uppercase tracking-widest transition-all rounded-sm outline-none italic placeholder:text-slate-800"
                    value={formData.awayTeam}
                    onChange={e => setFormData({ ...formData, awayTeam: e.target.value })}
                 />
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-10">
              {/* Mission Date */}
              <div className="space-y-4">
                 <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                    <FaCalendarPlus className="text-yellow-500/50" /> Mission_Date
                 </label>
                 <input 
                    type="date"
                    required
                    className="w-full bg-slate-950/40 border border-white/5 focus:border-yellow-500/40 focus:bg-slate-900/40 h-16 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm outline-none cursor-pointer"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                 />
              </div>

              {/* Mission Time */}
              <div className="space-y-4">
                 <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                    <FaClock className="text-yellow-500/50" /> Sync_Time
                 </label>
                 <input 
                    type="time"
                    required
                    className="w-full bg-slate-950/40 border border-white/5 focus:border-yellow-500/40 focus:bg-slate-900/40 h-16 px-6 text-[10px] font-black uppercase tracking-[0.5em] transition-all rounded-sm outline-none cursor-pointer"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                 />
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-10">
              {/* Strategic Venue */}
              <div className="space-y-4">
                 <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                    <FaMapMarkedAlt className="text-yellow-500/50" /> Strategic_Venue
                 </label>
                 <input 
                    type="text"
                    required
                    className="w-full bg-slate-950/40 border border-white/5 focus:border-yellow-500/40 focus:bg-slate-900/40 h-16 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm outline-none"
                    value={formData.venue}
                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                 />
              </div>

              {/* Tournament Classification */}
              <div className="space-y-4">
                 <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                    <FaTrophy className="text-yellow-500/50" /> Op_Classification
                 </label>
                 <input 
                    type="text"
                    required
                    className="w-full bg-slate-950/40 border border-white/5 focus:border-yellow-500/40 focus:bg-slate-900/40 h-16 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm outline-none"
                    value={formData.competition}
                    onChange={e => setFormData({ ...formData, competition: e.target.value })}
                 />
              </div>
           </div>

           {/* Deployment Authorization */}
           <div className="pt-10 flex items-center justify-between border-t border-white/5">
              <div className="flex flex-col gap-2">
                 <span className="text-[9px] text-yellow-500/50 font-black uppercase tracking-[0.4em]">Authorized_By: {session?.user?.name?.toUpperCase()}</span>
                 <p className="text-[7px] text-slate-700 font-mono tracking-widest uppercase italic">Encryption: AES-Locked // Ops_Registry_v4</p>
              </div>

              <button 
                 type="submit"
                 disabled={loading}
                 className="group relative h-16 px-16 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-[0.5em] italic hover:bg-white transition-all disabled:opacity-50 overflow-hidden"
              >
                 {loading ? (
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-slate-900 animate-ping" />
                       DEPLOYING...
                    </div>
                 ) : (
                    <div className="flex items-center gap-4">
                       <FaCheckCircle className="group-hover:scale-110 transition-transform" />
                       Authorize_Deployment
                    </div>
                 )}
                 {/* Cinematic Scan Line */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
