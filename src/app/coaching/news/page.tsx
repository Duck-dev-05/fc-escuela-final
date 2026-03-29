"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  FaRegNewspaper, FaImage, FaTag, FaUserSecret, 
  FaCloudUploadAlt, FaPaperPlane, FaArrowLeft, FaShieldAlt
} from 'react-icons/fa';
import Link from "next/link";
import NeuralBackdrop from "@/components/NeuralBackdrop";
import { newsApi } from "@/services/api";
import { toast } from "react-hot-toast";

export default function NewsEditorialTerminal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    category: "MATCH_REPORT",
    author: session?.user?.name || "COMMAND_UNIT"
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
      await newsApi.create(formData);
      toast.success("BROADCAST_AUTHORIZED: DATA_STREAM_LIVE");
      router.push("/news");
    } catch (err) {
      console.error(err);
      toast.error("PROTOCOL_ERROR: UPLOAD_FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-yellow-500/30 font-sans overflow-hidden py-32 px-8">
      <NeuralBackdrop ghostText="NEWS_EDIT" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/coaching" className="flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.4em] mb-12 group transition-all">
          <FaArrowLeft className="group-hover:-translate-x-2 transition-transform text-yellow-500/50" />
          Mission_Control // Return_Vantage
        </Link>

        {/* Dynamic Editorial Header */}
        <div className="mb-20 animate-slide-up">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 glass-card hud-border border-yellow-500/30 flex items-center justify-center bg-yellow-500/5">
                 <FaRegNewspaper className="text-yellow-500 text-xl" />
              </div>
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.6em] font-mono">Editorial_Terminal // Protocol_v2</span>
           </div>
           <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] italic">
              Broadcast <br />
              <span className="text-yellow-500 not-italic">Interface</span>
           </h1>
        </div>

        {/* Tactical Feed Form */}
        <form onSubmit={handleSubmit} className="space-y-12 animate-slide-up delay-100">
           <div className="grid md:grid-cols-2 gap-10">
              {/* Tactical Heading */}
              <div className="space-y-4">
                 <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                    <FaTag className="text-yellow-500/50" /> Article_Target
                 </label>
                 <input 
                    type="text"
                    required
                    placeholder="Enter briefing title..."
                    className="w-full bg-slate-950/40 border border-white/5 focus:border-yellow-500/40 focus:bg-slate-900/40 h-16 px-6 text-sm font-bold uppercase tracking-wide transition-all rounded-sm outline-none"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                 />
              </div>

              {/* Category Matrix */}
              <div className="space-y-4">
                 <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                    <FaShieldAlt className="text-yellow-500/50" /> News_Sector
                 </label>
                 <select 
                    className="w-full bg-slate-950/40 border border-white/5 focus:border-yellow-500/40 focus:bg-slate-900/40 h-16 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm outline-none cursor-pointer appearance-none"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                 >
                    <option value="MATCH_REPORT">MATCH_REPORT</option>
                    <option value="CLUB_ANNOUNCEMENT">CLUB_ANNOUNCEMENT</option>
                    <option value="SQUAD_UPDATE">SQUAD_UPDATE</option>
                    <option value="GENERAL_DATA">GENERAL_DATA</option>
                 </select>
              </div>
           </div>

           {/* Asset Link (Image URL) */}
           <div className="space-y-4">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                 <FaImage className="text-yellow-500/50" /> Intelligence_Asset_URI
              </label>
              <div className="relative group">
                 <input 
                    type="url"
                    required
                    placeholder="https://..."
                    className="w-full bg-slate-950/40 border border-white/5 focus:border-yellow-500/40 focus:bg-slate-900/40 h-16 px-6 text-[11px] font-mono transition-all rounded-sm outline-none"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                 />
                 <FaCloudUploadAlt className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-yellow-500 transition-colors" />
              </div>
           </div>

           {/* Analysis Body (Content) */}
           <div className="space-y-4">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                 <FaUserSecret className="text-yellow-500/50" /> Briefing_Telemetry
              </label>
              <textarea 
                 required
                 rows={10}
                 placeholder="Enter full mission description..."
                 className="w-full bg-slate-950/40 border border-white/5 focus:border-yellow-500/40 focus:bg-slate-900/40 p-8 text-sm leading-relaxed transition-all rounded-sm outline-none custom-scrollbar"
                 value={formData.content}
                 onChange={e => setFormData({ ...formData, content: e.target.value })}
              />
           </div>

           {/* Deployment Authorization */}
           <div className="pt-10 flex items-center justify-between border-t border-white/5">
              <div className="flex flex-col gap-2">
                 <span className="text-[9px] text-yellow-500/50 font-black uppercase tracking-[0.4em]">Author_Signal: {formData.author}</span>
                 <p className="text-[7px] text-slate-700 font-mono tracking-widest uppercase italic">Secure Registry active. Logging data to sector 7.</p>
              </div>

              <button 
                 type="submit"
                 disabled={loading}
                 className="group relative h-16 px-16 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-[0.5em] italic hover:bg-white transition-all disabled:opacity-50 overflow-hidden"
              >
                 {loading ? (
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-slate-900 animate-ping" />
                       STREAMING...
                    </div>
                 ) : (
                    <div className="flex items-center gap-4">
                       <FaPaperPlane className="group-hover:rotate-12 transition-transform" />
                       Authorize_Broadcast
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
