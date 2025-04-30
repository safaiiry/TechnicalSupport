import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getCategoriesTrpcRoute } from './getCategories'
import { getTicketTrpcRoute } from './getTicket'
import { getTicketsTrpcRoute } from './getTickets'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  getCategories: getCategoriesTrpcRoute,
  getTicket: getTicketTrpcRoute,
  getTickets: getTicketsTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
