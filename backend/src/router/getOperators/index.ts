import { trpc } from '../../lib/trpc'

export const getOperatorsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const operators = await ctx.prisma.operator.findMany({
    include: { user: true, role: true },
  })

  return {
    operators: operators.map((op) => ({
      id: op.id,
      full_name: op.user.full_name,
      role_id: op.role.id,
    })),
  }
})
