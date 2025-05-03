import type { inferRouterOutputs } from '@trpc/server'
import type { TrpcRouter } from '../router'

type RouterOutput = inferRouterOutputs<TrpcRouter>
export type TicketCategory = RouterOutput['getCategories']['categories'][number]
export type TicketField = RouterOutput['getCategoryFields']['fields'][number]
