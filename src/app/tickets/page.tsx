'use client'

import { Suspense } from 'react'
import TicketShop, { TicketShopSkeleton } from '@/components/ticketing/TicketShop'

export default function TicketsPage() {
  return (
    <Suspense fallback={<TicketShopSkeleton />}>
      <TicketShop variant="tickets" />
    </Suspense>
  )
}
