import { z } from 'zod'
import { protectedProcedure, router } from '../../lib/trpc'

export const updateTicketTrpcRoute = router({
  updateStatus: protectedProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
        statusId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!['operator', 'chief'].includes(ctx.user!.role)) {
        throw new Error('FORBIDDEN')
      }

      await ctx.prisma.ticket.update({
        where: { id: input.ticketId },
        data: { status_id: input.statusId },
      })

      return { success: true }
    }),
  assignOperator: protectedProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
        operatorId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user!.role !== 'chief') {
        throw new Error('FORBIDDEN')
      }

      await ctx.prisma.ticket.update({
        where: { id: input.ticketId },
        data: { assigned_operator_id: input.operatorId },
      })

      return { success: true }
    }),
})
