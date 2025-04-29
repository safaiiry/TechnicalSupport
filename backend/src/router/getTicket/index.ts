import { z } from 'zod'
import { trpc } from '../../lib/trpc'

export const getTicketTrpcRoute = trpc.procedure
  .input(z.object({ ticketId: z.string() }))
  .query(async ({ ctx, input }) => {
    const ticket = await ctx.prisma.ticket.findUnique({
      where: {
        id: input.ticketId,
      },
    })
    return { ticket }
  })
