import { z } from 'zod'
import { tickets } from '../../lib/tickets'
import { trpc } from '../../lib/trpc'

export const getTicketTrpcRoute = trpc.procedure.input(z.object({ ticketId: z.string() })).query(({ input }) => {
  const ticket = tickets.find((t) => t.id.toString() === input.ticketId)
  return { ticket: ticket || null }
})
