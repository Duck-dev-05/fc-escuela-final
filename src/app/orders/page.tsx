"use client";
import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaUsers, 
  FaClock, FaShieldAlt, FaHistory, FaCheckCircle, FaExclamationTriangle 
} from 'react-icons/fa';

interface Order {
  type: 'ticket' | 'membership';
  id: string;
  date: Date;
  details: {
    match?: {
      id: string;
      name: string;
      date: string;
      time: string;
      venue: string;
    };
    quantity?: number;
    category?: string;
    planId?: string;
    status?: string;
    endDate?: Date;
  };
}

function OrdersContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

   useEffect(() => {
     const handleMouseMove = (e: MouseEvent) => {
       setMousePos({
         x: (e.clientX / window.innerWidth) * 100,
         y: (e.clientY / window.innerHeight) * 100,
       });
     };
     window.addEventListener('mousemove', handleMouseMove);
     return () => window.removeEventListener('mousemove', handleMouseMove);
   }, []);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        } else {
          // Fallback to MOCK if empty for demonstrative purposes
          setOrders([
            {
              type: 'membership', id: 'M-7721', date: new Date('2025-01-15'),
              details: { 
                planId: 'Elite Vanguard', 
                status: 'expired', 
                endDate: new Date('2026-01-15') 
              },
            },
            {
              type: 'ticket', id: 'T-9902', date: new Date('2024-03-20'),
              details: {
                match: { id: 'm1', name: 'FC ESCUELA vs Real Madrid', date: '2024-04-12', time: '20:00', venue: 'Estadio Nacional' },
                quantity: 2, category: 'VIP HUD'
              },
            }
          ]);
        }
      } catch (err) {
        setError("Telemetry Retrieval Failure: Database offline.");
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchOrders();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
          <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs">Retrieving Transaction Logs...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') router.push('/login');

  const now = new Date();
  const membershipOrders = orders.filter(o => o.type === 'membership');
  const ticketOrders = orders.filter(o => o.type === 'ticket');
  const currentOrders = ticketOrders.filter(o => new Date(o.details.match?.date || '') > now);
  const pastOrders = ticketOrders.filter(o => new Date(o.details.match?.date || '') <= now);

  return (
    <div className="min-h-screen py-20 px-8 relative overflow-hidden bg-[#020202] selection:bg-yellow-500 selection:text-slate-950">
       {/* Neural_Orb & Cinematic Background */}
       <div className="absolute inset-0 pointer-events-none">
          <div 
             className="absolute w-[800px] h-[800px] rounded-full bg-yellow-500/[0.03] blur-[120px] transition-all duration-1000 ease-out z-0"
             style={{ 
                left: `${mousePos.x}%`, 
                top: `${mousePos.y}%`, 
                transform: 'translate(-50%, -50%)' 
             }} 
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-50 z-10" />
          <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-yellow-500/[0.03] to-transparent z-10" />
          
          {/* Ghost Typography */}
          <div className="absolute top-20 left-10 select-none pointer-events-none opacity-[0.03] whitespace-nowrap z-0">
             <span className="text-[20vw] font-black ghost-text leading-none uppercase italic tracking-tighter">ORDER_REGISTRY</span>
          </div>
       </div>

       <div className="max-w-[1400px] mx-auto relative z-20 pt-20">
          {/* Maximum Impact Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-28 gap-16 animate-slide-up">
              <div className="flex flex-col gap-10">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-[9px] text-yellow-500 font-black uppercase tracking-[0.6em]">
                       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                       Ledger_Access: Secure_03
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">REGISTRY: {session?.user?.id?.substring(0,8).toUpperCase() || 'UNA-000'}</span>
                 </div>
                 
                 <div className="relative group/header">
                    <div className="absolute -top-6 -left-6 w-8 h-8 border-t-2 border-l-2 border-yellow-500/20 group-hover/header:border-yellow-500 transition-colors" />
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] italic group-hover:scale-[1.02] transition-transform duration-700">
                       Order <br />
                       <span className="text-7xl md:text-9xl not-italic text-slate-800 tracking-[-0.05em] group-hover:text-white transition-colors">Registry</span>
                    </h1>
                 </div>
              </div>

              <div className="flex flex-col items-end gap-10 w-full lg:w-auto">
                 <div className="flex items-center gap-12 text-[10px] font-black text-slate-700 tracking-[0.4em] uppercase border-b border-white/5 pb-4 w-full justify-end">
                    <span>UNIT_FINANCIAL</span>
                    <span>//</span>
                    <span className="text-yellow-500/50 flex items-center gap-3 font-mono">
                       {now.toISOString().split('T')[0]} // {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
                 <div className="px-6 py-2 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-sm skew-x-[-15deg] shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                    <span className="block skew-x-[15deg]">{orders.length} ACTIVE_ENTRIES</span>
                 </div>
              </div>
          </div>
        {success === "1" && (
          <div className="glass-card border-green-500/50 bg-green-500/10 p-6 mb-10 flex items-center justify-center gap-4 animate-slide-up">
            <FaCheckCircle className="text-green-500 text-xl" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-white">Transaction Verified. Provisioning Complete.</span>
          </div>
        )}

         {/* Section Marker */}
         <div className="flex items-center gap-6 mb-12 animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group hover:border-yellow-500/50 transition-colors">
               <FaHistory className="text-yellow-500 text-2xl group-hover:scale-110 transition-transform" />
            </div>
            <div className="h-full flex flex-col justify-center">
               <h2 className="text-xs font-black text-yellow-500 uppercase tracking-[0.4em]">Transaction_Logs</h2>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 italic">Real-time financial telemetry</p>
            </div>
         </div>

        {/* Membership Section */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Protocol Clearances</h2>
          </div>
          <div className="grid gap-4">
            {membershipOrders.map(order => (
              <div key={order.id} className="glass-card hud-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white/[0.03] transition-all">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 glass-card border-yellow-500/20 flex items-center justify-center bg-yellow-500/5">
                      <FaShieldAlt className="text-yellow-500 text-xl" />
                   </div>
                   <div>
                      <h3 className="text-base font-black text-white uppercase tracking-widest">{order.details.planId} Protocol</h3>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Token: <span className="text-slate-300 font-mono">{order.id}</span></p>
                   </div>
                </div>
                <div className="flex items-center gap-8 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                   <div className="text-right">
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Start Date</p>
                      <p className="text-xs text-white font-bold">{new Date(order.date).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Cycle End</p>
                      <p className="text-xs text-yellow-500 font-bold">{order.details.endDate ? new Date(order.details.endDate).toLocaleDateString() : 'N/A'}</p>
                   </div>
                   <div className={`px-3 py-1 rounded-lg border ${(order.details.endDate && new Date(order.details.endDate) < now) ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${(order.details.endDate && new Date(order.details.endDate) < now) ? 'text-red-500' : 'text-green-500'}`}>{(order.details.endDate && new Date(order.details.endDate) < now) ? 'Ended' : order.details.status}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ticket Section */}
        {currentOrders.length > 0 && (
          <section className="mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Deployments</h2>
            </div>
            <div className="grid gap-6">
              {currentOrders.map(order => (
                <div key={order.id} className="glass-card hud-border p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 border-l border-b border-white/5 text-[9px] text-slate-600 font-mono">
                     ORD_REF: {order.id}
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 glass-card border-yellow-500/30 flex flex-col items-center justify-center bg-yellow-500/5 shrink-0">
                       <FaTicketAlt className="text-yellow-500 text-3xl mb-1" />
                       <span className="text-[8px] text-yellow-500 font-black uppercase">{order.details.quantity} Units</span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                       <h3 className="text-xl font-black text-white uppercase tracking-[0.1em] mb-3">{order.details.match?.name}</h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex items-center gap-3">
                             <FaCalendarAlt className="text-yellow-500/50 text-[10px]" />
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.details.match?.date}</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <FaMapMarkerAlt className="text-yellow-500/50 text-[10px]" />
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.details.match?.venue}</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <FaUsers className="text-yellow-500/50 text-[10px]" />
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.details.category} Sector</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <FaClock className="text-yellow-500/50 text-[10px]" />
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.details.match?.time} HRS</span>
                          </div>
                       </div>
                    </div>
                    <button className="btn-primary py-3 px-6 text-[10px]">Retrieve Key</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {orders.length === 0 && !loading && (
          <div className="glass-card hud-border p-20 text-center animate-slide-up">
            <FaTicketAlt className="mx-auto h-16 w-16 text-slate-800 mb-6" />
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">No Active Protocols</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 mb-8">Purchase history is currently void.</p>
            <button
              onClick={() => router.push('/tickets')}
              className="btn-primary"
            >
              Initialize Deployment
            </button>
          </div>
        )}
       </div>
    </div>
)
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}