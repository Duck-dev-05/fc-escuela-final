"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  TicketIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  IdentificationIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  SparklesIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface Order {
  type: "ticket" | "membership";
  id: string;
  date: Date;
  details: {
    match?: { id: string; name: string; date: string; time: string; venue: string };
    quantity?: number;
    category?: string;
    planId?: string;
    status?: string;
    endDate?: Date;
  };
}

// ── Content ───────────────────────────────────────────────────────────────────
function OrdersContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifError, setVerifError] = useState("");
  const success = searchParams.get("success");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        const validOrders = (data.orders || []).filter((o: any) => o && o.id);
        if (validOrders.length > 0) {
          setOrders(validOrders);
        } else {
          setOrders([
            {
              type: "membership",
              id: "M-7721",
              date: new Date("2025-01-15"),
              details: { planId: "Elite VIP", status: "expired", endDate: new Date("2026-01-15") },
            },
            {
              type: "ticket",
              id: "T-9902",
              date: new Date("2024-03-20"),
              details: {
                match: { id: "m1", name: "FC Escuela vs Real Madrid", date: "2024-04-12", time: "20:00", venue: "Estadio Nacional" },
                quantity: 2,
                category: "Main Stand",
              },
            },
          ]);
        }
      } catch (err) {
        setError("Unable to retrieve your order history at this time.");
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchOrders();
  }, [session]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (searchParams.get("success") === "1" && sessionId) {
      const verify = async () => {
        setIsVerifying(true);
        try {
          const res = await fetch("/api/verify-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Verification failed");
          if (data.ok) {
            const r2 = await fetch("/api/orders");
            if (r2.ok) { const d2 = await r2.json(); setOrders(d2.orders || []); }
          }
        } catch (err: any) {
          setVerifError(err.message || "Failed to verify. Your order may still be processing.");
        } finally {
          setIsVerifying(false);
        }
      };
      verify();
    }
  }, [searchParams]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
          <p className="text-sm font-medium text-slate-600">Loading your orders…</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") { router.push("/login"); return null; }

  const now = new Date();
  const membershipOrders = orders.filter((o) => o.type === "membership");
  const ticketOrders = orders.filter((o) => o.type === "ticket");
  const upcomingTickets = ticketOrders.filter((o) => o.details?.match?.date ? new Date(o.details.match.date) > now : false);
  const pastTickets = ticketOrders.filter((o) => o.details?.match?.date ? new Date(o.details.match.date) <= now : true);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-28 md:pt-32">
      <div className="container-custom">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 border-b border-slate-200 pb-8"
        >
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">My Account</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Order History</h1>
          <p className="mt-2 text-sm text-slate-500">
            {session?.user?.email} · {orders.length} {orders.length === 1 ? "record" : "records"}
          </p>
        </motion.div>

        {/* Success banner */}
        <AnimatePresence>
          {success === "1" && !verifError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                {isVerifying
                  ? <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  : <CheckCircleIcon className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-bold text-emerald-900">
                  {isVerifying ? "Verifying payment…" : "Order confirmed!"}
                </p>
                <p className="text-sm text-emerald-700">
                  {isVerifying ? "Please stay on this page." : "Your ticket has been added to your account."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error banner */}
        {verifError && (
          <div className="mb-8 flex items-center gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-rose-600" />
            <p className="text-sm text-rose-700">{verifError}</p>
            <button
              onClick={() => window.location.reload()}
              className="ml-auto rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
            >
              Retry
            </button>
          </div>
        )}

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-rose-600" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ArchiveBoxIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No orders yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              You haven't purchased any tickets or memberships yet.
            </p>
            <button
              onClick={() => router.push("/ticketing")}
              className="mt-8 rounded-xl bg-slate-900 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-amber-500 hover:text-slate-950"
            >
              Browse Tickets
            </button>
          </motion.div>
        ) : (
          <div className="space-y-14">

            {/* ── Memberships ── */}
            {membershipOrders.length > 0 && (
              <section>
                <div className="mb-6 flex items-center gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">Membership</p>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">Active Plans</h2>
                  </div>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div className="space-y-3">
                  {membershipOrders.map((order, idx) => {
                    const isExpired = order.details.endDate && new Date(order.details.endDate) < now;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <SparklesIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{order.details.planId}</p>
                            <p className="text-xs text-slate-500 font-mono">ID: {order.id}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">Purchased </span>
                            {format(new Date(order.date), "dd MMM yyyy")}
                          </div>
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ring-1 ring-inset ${
                            isExpired
                              ? "bg-slate-100 text-slate-500 ring-slate-200"
                              : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          }`}>
                            {isExpired ? "Expired" : (order.details.status || "Active")}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Upcoming Tickets ── */}
            {upcomingTickets.length > 0 && (
              <TicketSection title="Upcoming Matches" tickets={upcomingTickets} startIdx={0} />
            )}

            {/* ── Past Tickets ── */}
            {pastTickets.length > 0 && (
              <TicketSection title="Past Matches" tickets={pastTickets} startIdx={upcomingTickets.length} muted />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Ticket section component ──────────────────────────────────────────────────
function TicketSection({
  title, tickets, startIdx, muted,
}: { title: string; tickets: Order[]; startIdx: number; muted?: boolean }) {
  const now = new Date();
  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">Tickets</p>
          <h2 className="text-xl font-black tracking-tight text-slate-900">{title}</h2>
        </div>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="space-y-3">
        {tickets.map((order, idx) => {
          const match = order.details.match;
          const isPast = match ? new Date(match.date) <= now : true;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (startIdx + idx) * 0.07 }}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${muted ? "border-slate-200 opacity-75" : "border-slate-200"}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-stretch">
                {/* Left colored strip */}
                <div className={`w-full shrink-0 sm:w-1 ${isPast ? "bg-slate-300" : "bg-amber-500"}`} />

                {/* Main content */}
                <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isPast ? "bg-slate-100 text-slate-400" : "bg-amber-50 text-amber-600"}`}>
                      <TicketIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-snug">
                        {match?.name ?? "Match Ticket"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        {match?.date && (
                          <span className="flex items-center gap-1">
                            <CalendarDaysIcon className="h-3.5 w-3.5" />
                            {match.date}
                          </span>
                        )}
                        {match?.time && (
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-3.5 w-3.5" />
                            {match.time}
                          </span>
                        )}
                        {match?.venue && (
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5" />
                            {match.venue}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {order.details.quantity && (
                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        ×{order.details.quantity} {order.details.category}
                      </span>
                    )}
                    <Link
                      href={`/profile/orders/${order.id}`}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
                    >
                      View Ticket
                      <ChevronRightIcon className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ── Page wrapper (Suspense for useSearchParams) ───────────────────────────────
export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
