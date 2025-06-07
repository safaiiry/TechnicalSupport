import { z } from 'zod'
import { userProcedure } from '../../lib/middleware'
import { router } from '../../lib/trpc'
import type { UserRole } from '../../types/roles'

const CHIEF_ROLE_ID = '80669848-ca19-4d31-ab38-f9efdb0753a8'

export const ticketMessagesTrpcRoute = router({
  getMessages: userProcedure.input(z.object({ ticketId: z.string().uuid() })).query(async ({ ctx, input }) => {
    const comments = await ctx.prisma.comment.findMany({
      where: { ticket_id: input.ticketId },
      include: { user: true },
    })

    const responses = await ctx.prisma.response.findMany({
      where: { ticket_id: input.ticketId },
      include: { operator: { include: { user: true, role: true } } },
    })

    const messages = [
      ...comments.map((c) => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        author: c.user.full_name,
        role: 'user' as UserRole,
      })),
      ...responses.map((r) => ({
        id: r.id,
        content: r.content,
        created_at: r.created_at,
        author: r.operator.user.full_name,
        role: r.operator.role.id === CHIEF_ROLE_ID ? ('chief' as UserRole) : ('operator' as UserRole),
      })),
    ].sort((a, b) => a.created_at.getTime() - b.created_at.getTime())

    return { messages }
  }),

  sendMessage: userProcedure
    .input(z.object({ ticketId: z.string().uuid(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId, role } = ctx.user!

      if (role === 'user') {
        await ctx.prisma.comment.create({
          data: {
            ticket_id: input.ticketId,
            user_id: userId,
            content: input.content,
          },
        })
      } else {
        const operator = await ctx.prisma.operator.findUnique({
          where: { user_id: userId },
        })
        if (!operator) {
          throw new Error('OPERATOR_NOT_FOUND')
        }
        await ctx.prisma.response.create({
          data: {
            ticket_id: input.ticketId,
            operator_id: operator.id,
            content: input.content,
          },
        })
      }

      return { success: true }
    }),
})
