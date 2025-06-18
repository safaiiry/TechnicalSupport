import { z } from 'zod'
import { trpc } from '../../lib/trpc'

export const getTicketTrpcRoute = trpc.procedure
  .input(z.object({ ticketId: z.string() }))
  .output(z.object({ ticket: z.any() }))
  .meta({ openapi: { method: 'GET', path: '/tickets/{ticketId}' } })
  .query(async ({ ctx, input }) => {
    const ticket = await ctx.prisma.ticket.findUnique({
      where: {
        id: input.ticketId,
      },
      include: {
        field_values: {
          include: {
            field: true,
          },
        },
        category: true,
        status: true,
        user: true,
        assigned_operator: {
          include: {
            user: true,
          },
        },
        attachments: true,
      },
    })

    return { ticket }
  })
