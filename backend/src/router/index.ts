import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { authTrpcRoute } from './auth'
import { createTicketTrpcRoute } from './createTicket'
import { getCategoriesTrpcRoute } from './getCategories'
import { getCategoryFieldsTrpcRoute } from './getCategoryFields'
import { getTicketTrpcRoute } from './getTicket'
import { getTicketsTrpcRoute } from './getTickets'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  auth: authTrpcRoute,
  createTicket: createTicketTrpcRoute,
  getCategories: getCategoriesTrpcRoute,
  getCategoryFields: getCategoryFieldsTrpcRoute,
  getTicket: getTicketTrpcRoute,
  getTickets: getTicketsTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
