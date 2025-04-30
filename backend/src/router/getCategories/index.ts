import { trpc } from '../../lib/trpc'

export const getCategoriesTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const categories = await ctx.prisma.ticketCategory.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  return { categories }
})
