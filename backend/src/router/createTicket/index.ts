import { z } from 'zod'
import { STATUS_NEW } from '../../lib/constants'
import { trpc } from '../../lib/trpc'

export const createTicketTrpcRoute = trpc.procedure
  .input(
    z.object({
      userId: z.string().uuid(),
      categoryId: z.string().uuid(),
      fieldValues: z.array(
        z.object({
          fieldId: z.string().uuid(),
          value: z.string(),
        })
      ),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const defaultStatus = await ctx.prisma.ticketStatus.findFirst({
      where: { id: STATUS_NEW },
    })

    if (!defaultStatus) {
      throw new Error('Default status not found')
    }

    const ticket = await ctx.prisma.ticket.create({
      data: {
        user_id: input.userId,
        category_id: input.categoryId,
        status_id: defaultStatus.id,
        field_values: {
          createMany: {
            data: input.fieldValues.map((fv) => ({
              field_id: fv.fieldId,
              value: fv.value,
            })),
          },
        },
      },
    })

    return { ticketId: ticket.id }
  })
