import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { protectedProcedure, router } from '../../lib/trpc'

export const getTicketsTrpcRoute = router({
  getTickets: protectedProcedure
    .input(
      z.object({
        number: z.string().optional(),
        category: z.string().optional(),
        status: z.string().optional(),
        created_at: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id
      const role = ctx.user?.role

      const filters: Prisma.TicketWhereInput[] = []
      if (role === 'user') {
        filters.push({ user_id: userId })
      }

      if (role === 'operator') {
        filters.push({
          assigned_operator: {
            is: {
              user_id: userId,
            },
          },
        })
      }

      const andFilters: Prisma.TicketWhereInput[] = []
      if (filters.length > 0) {
        andFilters.push({ OR: filters })
      }
      if (input.category) {
        andFilters.push({ category_id: input.category })
      }
      if (input.status) {
        andFilters.push({ status_id: input.status })
      }
      if (input.created_at) {
        andFilters.push({
          created_at: {
            gte: new Date(input.created_at),
            lt: new Date(new Date(input.created_at).getTime() + 24 * 60 * 60 * 1000),
          },
        })
      }

      const where: Prisma.TicketWhereInput = andFilters.length ? { AND: andFilters } : {}

      const tickets = await ctx.prisma.ticket.findMany({
        where,
        include: {
          user: true,
          category: true,
          status: true,
          assigned_operator: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      })

      const filtered = input.number
        ? tickets.filter(
            (ticket) => ticket.id.slice(0, 8).toLowerCase() === input.number?.replace(/^№/, '').toLowerCase()
          )
        : tickets

      return {
        tickets: filtered.map((ticket, idx) => ({
          id: ticket.id,
          index: idx + 1,
          number: `№${ticket.id.slice(0, 8).toUpperCase()}`,
          category: ticket.category.name,
          department: '-',
          contact: ticket.user.full_name,
          status: {
            id: ticket.status.id,
            name: ticket.status.name,
          },
          created_at: ticket.created_at,
          updated_at: ticket.updated_at,
          assignee: ticket.assigned_operator?.user.full_name ?? '—',
        })),
      }
    }),
})
