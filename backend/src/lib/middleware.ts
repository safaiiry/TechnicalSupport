import { TRPCError } from '@trpc/server'
import { trpc } from './trpc'

export const hasRole = (roles: ('user' | 'operator' | 'chief')[]) =>
  trpc.middleware(({ ctx, next }) => {
    if (!ctx.user || !roles.includes(ctx.user.role)) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }
    return next({ ctx })
  })

export const userProcedure = trpc.procedure.use(hasRole(['user', 'operator', 'chief']))
export const operatorProcedure = trpc.procedure.use(hasRole(['operator', 'chief']))
export const chiefProcedure = trpc.procedure.use(hasRole(['chief']))
