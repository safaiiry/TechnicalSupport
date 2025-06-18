import { z } from 'zod'
import { trpc } from '../../lib/trpc'

export const getCategoryFieldsTrpcRoute = trpc.procedure
  .input(z.object({ categoryId: z.string().uuid() }))
  .output(z.object({ fields: z.array(z.any()) }))
  .meta({ openapi: { method: 'GET', path: '/categories/{categoryId}/fields' } })
  .query(async ({ ctx, input }) => {
    const fields = await ctx.prisma.ticketField.findMany({
      where: { category_id: input.categoryId },
      orderBy: { field_order: 'asc' },
    })

    return { fields }
  })
