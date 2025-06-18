import { z } from 'zod'
import { trpc } from '../../lib/trpc'

export const getOperatorsTrpcRoute = trpc.procedure
  .input(z.void())
  .output(
    z.object({
      operators: z.array(
        z.object({
          id: z.string(),
          full_name: z.string(),
          role_id: z.string(),
        })
      ),
    })
  )
  .meta({ openapi: { method: 'GET', path: '/operators' } })
  .query(async ({ ctx }) => {
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
