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

  updateFields: protectedProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
        fields: z.array(
          z.object({
            fieldValueId: z.string().uuid(),
            value: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.prisma.ticket.findUnique({
        where: { id: input.ticketId },
        select: { user_id: true, status_id: true },
      })

      if (!ticket) {
        throw new Error('NOT_FOUND')
      }

      const COMPLETED_STATUS_ID = '95a55ae5-96a4-4f58-bc35-c551935ba4b8'
      if (ticket.status_id === COMPLETED_STATUS_ID) {
        throw new Error('TICKET_COMPLETED')
      }

      if (ctx.user!.role === 'user' && ctx.user!.id !== ticket.user_id) {
        throw new Error('FORBIDDEN')
      }

      for (const field of input.fields) {
        const existing = await ctx.prisma.ticketFieldValue.findUnique({
          where: { id: field.fieldValueId },
          include: { field: true },
        })

        if (!existing) {
          continue
        }

        if (existing.value !== field.value) {
          await ctx.prisma.ticketFieldValue.update({
            where: { id: field.fieldValueId },
            data: { value: field.value },
          })

          await ctx.prisma.comment.create({
            data: {
              ticket_id: input.ticketId,
              user_id: ctx.user!.id,
              content: `Значение в поле ${existing.field.field_label} изменилось с ${existing.value} на ${field.value}`,
            },
          })
        }
      }

      await ctx.prisma.ticket.update({
        where: { id: input.ticketId },
        data: { updated_at: new Date() },
      })

      return { success: true }
    }),
})
