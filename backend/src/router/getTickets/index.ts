import { trpc } from '../../lib/trpc'

export const getTicketsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const tickets = await ctx.prisma.ticket.findMany()
  return { tickets }
})
