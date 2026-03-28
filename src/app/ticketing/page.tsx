'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { CalendarIcon, MapPinIcon, TicketIcon, UserGroupIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Ticket {
  id: string;
  match: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  status: string;
  matchId: string;
  availableSeats: number | null;
}

function TicketsContent() {
  const router = useRouter()
  const { data: session, status: authStatus } = useSession()
  const searchParams = useSearchParams()
  const matchId = searchParams.get('match')
  
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    quantity: 1,
    category: 'standard',
  })

  useEffect(() => {
    const fetchTickets = async () => {
      if (!session) return;
      try {
        const response = await fetch('/api/tickets')
        const data = await response.json()
        setTickets(data)
        if (matchId) {
          const selected = data.find((t: Ticket) => t.matchId === matchId)
          if (selected) setSelectedTicket(selected)
        }
      } catch (err) {
        setError('Failed to load tickets')
        console.error('Error fetching tickets:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [matchId, session])

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login?callbackUrl=/ticketing');
    }
  }, [authStatus, session, router]);

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setFormData({ ...formData, quantity: 1 })
    router.push(`/ticketing?match=${ticket.matchId}`)
  }

  const calculatePrice = () => {
    const basePrice = selectedTicket?.price || 0
    const multiplier = {
      standard: 1,
      premium: 1.5,
      vip: 2
    }[formData.category] || 1
    return basePrice * formData.quantity * multiplier
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast.error('Please sign in to purchase tickets')
      return
    }
    if (!selectedTicket) {
      toast.error('Please select a match')
      return
    }
    try {
      setProcessing(true)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: selectedTicket.matchId,
          quantity: formData.quantity,
          category: formData.category,
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create checkout session')
      }
      const { sessionId } = await response.json()
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')
      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) throw new Error(error.message || 'Payment failed')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to process payment')
      console.error('Error processing payment:', err)
    } finally {
      setProcessing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }))
  }

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
          <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs">Syncing Tickets...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="glass-card hud-border p-10 max-w-lg text-center">
          <h3 className="text-yellow-500 font-black uppercase tracking-tighter text-2xl mb-4">Access Denied</h3>
          <p className="text-slate-400 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry Access</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 relative overflow-hidden animate-scan">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-20 whitespace-nowrap">
        <span className="text-[20vw] ghost-text leading-none uppercase">TICKET HUB</span>
      </div>

      <div className="container-custom relative z-10">
        <div className="mb-16 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-500 font-bold">Secure Booking</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase mb-4">
            Match <span className="text-yellow-500">Tickets</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Reserve your place in the theatre of dreams. Official club ticketing portal.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Available Fixtures</h2>
              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">{tickets.length} Matches Found</span>
            </div>
            
            <div className="space-y-4">
              {tickets.map((ticket, idx) => (
                <button
                  key={ticket.id}
                  onClick={() => handleTicketSelect(ticket)}
                  className={`w-full group relative transition-all duration-500 animate-slide-up ${
                    selectedTicket?.id === ticket.id ? 'z-20 scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`glass-card hud-border p-6 text-left transition-all duration-500 ${
                    selectedTicket?.id === ticket.id 
                      ? 'bg-yellow-500/10 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.1)]' 
                      : 'hover:bg-white/5'
                  }`}>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[10px] font-black px-2 py-0.5 bg-white/10 text-white uppercase tracking-widest rounded-sm border border-white/10">Match Day</span>
                          <span className="text-[10px] font-black px-2 py-0.5 bg-yellow-500 text-slate-900 uppercase tracking-widest rounded-sm">Confirmed</span>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-yellow-500 transition-colors">
                          {ticket.match}
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <CalendarIcon className="h-4 w-4 mr-2 text-yellow-500" />
                            {ticket.date}
                          </div>
                          <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <MapPinIcon className="h-4 w-4 mr-2 text-yellow-500" />
                            {ticket.venue}
                          </div>
                          <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-wider col-span-2 md:col-span-1">
                            <UserGroupIcon className="h-4 w-4 mr-2 text-yellow-500" />
                            {ticket.availableSeats || 'N/A'} Seats Left
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center md:items-end justify-center w-full md:w-auto p-4 md:p-0 border-t md:border-t-0 md:border-l border-white/10">
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Pass From</div>
                        <div className="text-3xl font-black text-white tracking-tighter mb-4">
                          ${ticket.price}
                        </div>
                        <div className={`px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-lg ${
                          ticket.status === "Available" 
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}>
                          {ticket.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 rounded-2xl relative">
            <div className="sticky top-32 glass-card hud-border p-8 animate-slide-up bg-pitch-navy/60">
              <div className="mb-8 border-b border-white/10 pb-4">
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Reservation</h2>
              </div>
              
              {!selectedTicket ? (
                <div className="text-center py-12">
                  <TicketIcon className="mx-auto h-16 w-16 text-white/10 mb-4 animate-pulse" />
                  <h3 className="text-white font-black uppercase tracking-tight text-lg mb-2">Initialize Selection</h3>
                  <p className="text-slate-500 text-sm">Select a fixture to begin the checkout process.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-1">Selected Fixture</div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 leading-tight">{selectedTicket.match}</h3>
                    <div className="text-xs text-slate-400 font-medium">
                      {selectedTicket.date} • {selectedTicket.time}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-white uppercase tracking-[0.2em] mb-3">
                        Tier Category
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['standard', 'premium', 'vip'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData(f => ({ ...f, category: cat }))}
                            className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-sm border transition-all ${
                              formData.category === cat 
                                ? 'bg-yellow-500 border-yellow-500 text-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="quantity" className="block text-[10px] font-black text-white uppercase tracking-[0.2em] mb-3">
                        Total Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        max={selectedTicket.availableSeats || 10}
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">
                      <span>Telemetry Data</span>
                      <span>{formData.quantity} Units</span>
                    </div>
                    <div className="flex justify-between items-center text-4xl font-black text-white tracking-tighter mb-8">
                      <span className="text-sm font-bold text-yellow-500 uppercase tracking-widest">Total cost</span>
                      <span>${calculatePrice()}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={selectedTicket?.status === "Sold Out" || processing}
                      className="btn-primary w-full disabled:opacity-30 flex items-center justify-center gap-3 h-14"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                          <span>Processing...</span>
                        </>
                      ) : selectedTicket?.status === "Sold Out" ? (
                        "Status: Sold Out"
                      ) : (
                        <>
                          <LockClosedIcon className="h-4 w-4" />
                          <span>Initiate Payment</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TicketsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
          <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs">Syncing Tickets...</p>
        </div>
      </div>
    }>
      <TicketsContent />
    </Suspense>
  );
}