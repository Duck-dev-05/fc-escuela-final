"use client";
import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaUsers, 
  FaClock, FaShieldAlt, FaHistory, FaCheckCircle, FaExclamationTriangle 
} from 'react-icons/fa';
import { format } from "date-fns";
import { motion } from "framer-motion";

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
                planId: 'Elite VIP', 
                status: 'expired', 
                endDate: new Date('2026-01-15') 
              },
            },
            {
              type: 'ticket', id: 'T-9902', date: new Date('2024-03-20'),
              details: {
                match: { id: 'm1', name: 'FC ESCUELA vs Real Madrid', date: '2024-04-12', time: '20:00', venue: 'Estadio Nacional' },
                quantity: 2, category: 'Main Stand'
              },
            }
          ]);
        }
      } catch (err) {
        setError("Unable to retrieve order history at this time.");
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchOrders();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading History...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const now = new Date();
  const membershipOrders = orders.filter(o => o.type === 'membership');
  const ticketOrders = orders.filter(o => o.type === 'ticket');
  const currentOrders = ticketOrders.filter(o => new Date(o.details.match?.date || '') > now);
  const pastOrders = ticketOrders.filter(o => new Date(o.details.match?.date || '') <= now);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 relative selection:bg-slate-200 selection:text-slate-900">
       
       <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Minimalist Editorial Header */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 border-b border-slate-200 pb-12 mb-12"
          >
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Order <span className="text-slate-400 font-light">History</span>
             </h1>
             <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                <span>Account: {session?.user?.email || 'N/A'}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="uppercase tracking-wider text-xs font-bold text-slate-400">{orders.length} Total Records</span>
             </div>
          </motion.div>

          {success === "1" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 p-5 rounded-2xl mb-12 flex items-center gap-4"
            >
              <FaCheckCircle className="text-green-500 text-xl shrink-0" />
              <div>
                 <h4 className="text-sm font-bold text-slate-900">Transaction Successful</h4>
                 <p className="text-xs text-slate-600 mt-0.5">Your payment has been verified and your account has been updated.</p>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-5 rounded-2xl mb-12 flex items-center gap-4">
              <FaExclamationTriangle className="text-red-500 text-xl shrink-0" />
              <p className="text-sm font-medium text-red-900">{error}</p>
            </div>
          )}

          {orders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-16 text-center shadow-sm"
            >
              <FaHistory className="mx-auto h-12 w-12 text-slate-300 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Order History</h3>
              <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">You haven't made any purchases or activated any memberships yet.</p>
              <button
                onClick={() => router.push('/tickets')}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                Browse Tickets
              </button>
            </motion.div>
          ) : (
            <div className="space-y-16">
              
              {/* Memberships Section */}
              {membershipOrders.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6 px-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                       <FaShieldAlt className="text-indigo-500 text-sm" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Active Memberships</h2>
                  </div>
                  <div className="grid gap-4">
                    {membershipOrders.map((order, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={order.id} 
                        className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start md:items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                              <span className="text-lg">👑</span>
                           </div>
                           <div>
                              <h3 className="text-base font-bold text-slate-900 mb-1">{order.details.planId}</h3>
                              <p className="text-xs text-slate-500 font-medium">Order ID: <span className="font-mono">{order.id}</span></p>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-6 md:gap-10 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                           <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Purchased</p>
                              <p className="text-sm text-slate-900 font-medium">{format(new Date(order.date), "MMM d, yyyy")}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                              <div className={`px-2.5 py-1 rounded-md inline-flex items-center text-[10px] font-bold uppercase tracking-wider border ${(order.details.endDate && new Date(order.details.endDate) < now) ? 'bg-slate-100/50 border-slate-200 text-slate-500' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                                 {(order.details.endDate && new Date(order.details.endDate) < now) ? 'Expired' : order.details.status || 'Active'}
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tickets Section */}
              {ticketOrders.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6 px-1">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                       <FaTicketAlt className="text-amber-500 text-sm" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Match Tickets</h2>
                  </div>
                  <div className="grid gap-4">
                    {ticketOrders.map((order, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={order.id} 
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row group hover:border-slate-300 transition-colors"
                      >
                        {/* Event Details */}
                        <div className="p-6 md:p-8 flex-1">
                           <div className="flex items-center justify-between mb-4">
                              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                                {order.details.quantity} x {order.details.category}
                              </span>
                              <span className="text-xs text-slate-400 font-mono">#{order.id}</span>
                           </div>
                           <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4">{order.details.match?.name}</h3>
                           
                           <div className="flex flex-wrap items-center gap-y-3 gap-x-6">
                              <div className="flex items-center gap-2">
                                 <FaCalendarAlt className="text-slate-400 text-sm shrink-0" />
                                 <span className="text-sm font-medium text-slate-600">{order.details.match?.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <FaClock className="text-slate-400 text-sm shrink-0" />
                                 <span className="text-sm font-medium text-slate-600">{order.details.match?.time} Hrs</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <FaMapMarkerAlt className="text-slate-400 text-sm shrink-0" />
                                 <span className="text-sm font-medium text-slate-600">{order.details.match?.venue}</span>
                              </div>
                           </div>
                        </div>

                        {/* Action Area */}
                        <div className="bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-6 md:p-8 flex flex-col items-center justify-center min-w-[200px] shrink-0">
                           <button className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                              View Ticket details
                           </button>
                           <p className="text-[10px] font-medium text-slate-400 mt-3 uppercase tracking-wider">Purchased: {format(new Date(order.date), "MMM d, yyyy")}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}
       </div>
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
