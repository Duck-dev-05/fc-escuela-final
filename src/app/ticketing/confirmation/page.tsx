'use client'

import { Suspense } from 'react'
import TicketConfirmation, { TicketConfirmationSkeleton } from '@/components/ticketing/TicketConfirmation'

export default function TicketingConfirmationPage() {
  return (
    <Suspense fallback={<TicketConfirmationSkeleton />}>
      <TicketConfirmation variant="ticketing" />
    </Suspense>
  )
}
