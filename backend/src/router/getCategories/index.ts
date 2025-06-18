import { z } from 'zod'
import { trpc } from '../../lib/trpc'

export const getCategoriesTrpcRoute = trpc.procedure
  .input(z.void())
  .output(
    z.object({
      categories: z.array(z.object({ id: z.string(), name: z.string() })),
    })
  )
  .meta({ openapi: { method: 'GET', path: '/categories' } })
  .query(async ({ ctx }) => {
    const categories = await ctx.prisma.ticketCategory.findMany({
      select: {
        id: true,
        name: true,
      },
    })
    return { categories }
  })
