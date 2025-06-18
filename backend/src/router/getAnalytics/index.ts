import { chiefProcedure } from '../../lib/middleware'
import { router } from '../../lib/trpc'

export const getAnalyticsTrpcRoute = router({
  overview: chiefProcedure.query(async ({ ctx }) => {
    const totalTickets = await ctx.prisma.ticket.count()
    const COMPLETED_STATUS_ID = '95a55ae5-96a4-4f58-bc35-c551935ba4b8'
    const completedTickets = await ctx.prisma.ticket.count({
      where: { status_id: COMPLETED_STATUS_ID },
    })

    const operators = await ctx.prisma.operator.findMany({
      include: {
        user: true,
        _count: { select: { assigned_tickets: true } },
      },
    })

    return {
      totalTickets,
      completedTickets,
      byOperator: operators.map((op) => ({
        id: op.id,
        full_name: op.user.full_name,
        count: op._count.assigned_tickets,
      })),
    }
  }),
})
