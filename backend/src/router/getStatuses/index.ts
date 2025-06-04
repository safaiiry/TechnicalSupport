import { trpc } from '../../lib/trpc'

export const getStatusesTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const statuses = await ctx.prisma.ticketStatus.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  return { statuses }
})
