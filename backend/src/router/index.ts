import { trpc } from '../lib/trpc'
import { getTicketTrpcRoute } from './getTicket'
import { getTicketsTrpcRoute } from './getTickets'

export const trpcRouter = trpc.router({
  getTicket: getTicketTrpcRoute,
  getTickets: getTicketsTrpcRoute,
})

export type TrpcRouter = typeof trpcRouter
