'use client'

import { Suspense } from 'react'
import TicketShop, { TicketShopSkeleton } from '@/components/ticketing/TicketShop'

export default function TicketingPage() {
  return (
    <Suspense fallback={<TicketShopSkeleton />}>
      <TicketShop variant="ticketing" />
    </Suspense>
  )
}
