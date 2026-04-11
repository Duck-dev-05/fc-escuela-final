"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  TicketIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

interface OrderDetail {
  type: "ticket";
  id: string;
  date: string;
  quantity: number;
  category: string;
  match: {
    id: string;
    name: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    time: string;
    venue: string;
    competition: string;
  };
}

function OrderDetailContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load order details");
        }
        const data = await res.json();
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message || "Unable to load this ticket.");
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchOrder();
  }, [session, id]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
          <p className="text-sm font-medium text-slate-600">Loading ticket…</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") { router.push("/login"); return null; }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Ticket not found</h2>
          <p className="mt-2 text-sm text-slate-600">{error || "This ticket could not be loaded."}</p>
          <button
            onClick={() => router.push("/profile/orders")}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-amber-500 hover:text-slate-950"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to orders
          </button>
        </div>
      </div>
    );
  }

  const matchDate = new Date(order.match.date);
  const isPast = matchDate <= new Date();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-28 md:pt-32">
      <div className="container-custom px-4">

        {/* Back link */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <button
            type="button"
            onClick={() => router.push("/profile/orders")}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 transition hover:text-amber-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Order history
          </button>
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">

          {/* ── Ticket card ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-8"
          >
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
              {/* Top bar */}
              <div className={`h-1.5 w-full ${isPast ? "bg-slate-300" : "bg-amber-500"}`} />

              {/* Header */}
              <div className="border-b border-slate-100 p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isPast ? "bg-slate-100 text-slate-400" : "bg-amber-100 text-amber-600"}`}>
                      <TicketIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Digital Ticket</p>
                      <p className="font-mono text-xs text-slate-500">#{order.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold ring-1 ring-inset ${
                    isPast
                      ? "bg-slate-100 text-slate-500 ring-slate-200"
                      : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  }`}>
                    {isPast ? "Past" : "Upcoming"}
                  </span>
                </div>

                <h1 className="mt-6 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                  {order.match.name}
                </h1>

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDaysIcon className="h-4 w-4 text-amber-500" />
                    {format(matchDate, "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ClockIcon className="h-4 w-4 text-amber-500" />
                    {order.match.time}
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-px bg-slate-100 md:grid-cols-3">
                {[
                  { label: "Venue", value: order.match.venue, icon: MapPinIcon },
                  { label: "Category", value: order.category, icon: TicketIcon },
                  { label: "Tickets", value: `×${order.quantity}`, icon: UsersIcon },
                  { label: "Competition", value: order.match.competition, icon: TrophyIcon },
                  { label: "Home Team", value: order.match.homeTeam, icon: ShieldCheckIcon },
                  { label: "Away Team", value: order.match.awayTeam, icon: ShieldCheckIcon },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex flex-col gap-1 bg-white px-5 py-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* QR / Barcode section */}
              <div className="border-t border-dashed border-slate-200 bg-slate-50 p-6 md:p-8">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Entry pass</p>
                <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
                  {/* Simulated barcode */}
                  <div className="flex items-end gap-0.5">
                    {[...Array(18)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm bg-slate-900 ${i % 3 === 0 ? "w-1.5" : "w-0.5"} ${i % 5 === 0 ? "h-10" : "h-8"}`}
                        style={{ opacity: 0.5 + (i % 3) * 0.2 }}
                      />
                    ))}
                  </div>
                  <div className="mx-4 flex h-16 w-16 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                    <QrCodeIcon className="h-10 w-10 text-slate-900" />
                  </div>
                  <div className="flex items-end gap-0.5">
                    {[...Array(18)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm bg-slate-900 ${i % 2 === 0 ? "w-1" : "w-0.5"} ${i % 4 === 0 ? "h-10" : "h-8"}`}
                        style={{ opacity: 0.4 + (i % 4) * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-center text-xs text-slate-400">
                  Present this pass at the venue entrance. Valid for {order.quantity} {order.quantity === 1 ? "person" : "people"}.
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚽</span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Official Entry</p>
                    <p className="text-xs font-bold text-slate-900">{order.match.competition}</p>
                  </div>
                </div>
                <p className="font-mono text-xs text-slate-400">
                  Issued {format(new Date(order.date), "dd MMM yyyy")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4 lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
          >
            {/* Actions */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-slate-900">Ticket Actions</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Print ticket
                  <PrinterIcon className="h-4 w-4 text-slate-400" />
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Download PDF
                  <ArrowDownTrayIcon className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Admission info */}
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-amber-700" />
                <h3 className="text-sm font-bold text-amber-900">Admission Info</h3>
              </div>
              <p className="text-sm leading-relaxed text-amber-800">
                Show this digital pass at the venue entrance. The QR code is verified at the gate and is valid for{" "}
                <strong>{order.quantity}</strong> {order.quantity === 1 ? "admission" : "admissions"}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/profile/orders")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to orders
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}
