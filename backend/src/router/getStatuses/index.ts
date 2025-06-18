import { z } from 'zod'
import { trpc } from '../../lib/trpc'

export const getStatusesTrpcRoute = trpc.procedure
  .input(z.void())
  .output(
    z.object({
      statuses: z.array(z.object({ id: z.string(), name: z.string() })),
    })
  )
  .meta({ openapi: { method: 'GET', path: '/statuses' } })
  .query(async ({ ctx }) => {
    const statuses = await ctx.prisma.ticketStatus.findMany({
      select: {
        id: true,
        name: true,
      },
    })
    return { statuses }
  })
