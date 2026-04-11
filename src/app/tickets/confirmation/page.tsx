'use client'

import { Suspense } from 'react'
import TicketConfirmation, { TicketConfirmationSkeleton } from '@/components/ticketing/TicketConfirmation'

export default function TicketsConfirmationPage() {
  return (
    <Suspense fallback={<TicketConfirmationSkeleton />}>
      <TicketConfirmation variant="tickets" />
    </Suspense>
  )
}
