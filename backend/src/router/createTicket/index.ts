import { z } from 'zod'
import { protectedProcedure, router } from '../../lib/trpc'

export const createTicketTrpcRoute = router({
  create: protectedProcedure
    .input(
      z.object({
        categoryId: z.string().uuid(),
        fields: z.array(
          z.object({
            fieldId: z.string().uuid(),
            value: z.string(),
          })
        ),
      })
    )
    .output(z.object({ ticketId: z.string().uuid() }))
    .meta({ openapi: { method: 'POST', path: '/tickets' } })
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user!.id

      const NEW_STATUS_ID = 'f29f93af-51ca-4791-b345-e0beecd46b43'

      const ticket = await ctx.prisma.ticket.create({
        data: {
          user_id: userId,
          category_id: input.categoryId,
          status_id: NEW_STATUS_ID,
        },
      })

      await ctx.prisma.ticketFieldValue.createMany({
        data: input.fields.map((f) => ({
          ticket_id: ticket.id,
          field_id: f.fieldId,
          value: f.value,
        })),
      })

      return { ticketId: ticket.id }
    }),
})
