import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { type Express } from 'express'
import SuperJSON from 'superjson'
import { type TrpcRouter } from '../router'
import { createContext } from './ctx'

export const trpc = initTRPC.context<typeof createContext>().create({
  transformer: SuperJSON,
})

export const router = trpc.router
export const publicProcedure = trpc.procedure

export const applyTrpcToExpressApp = (expressApp: Express, trpcRouter: TrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext,
    })
  )
}
