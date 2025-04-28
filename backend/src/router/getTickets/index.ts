import { tickets } from '../../lib/tickets'
import { trpc } from '../../lib/trpc'

export const getTicketsTrpcRoute = trpc.procedure.query(() => {
  return { tickets }
})
