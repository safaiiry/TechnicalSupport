import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { authTrpcRoute } from './auth'
import { createTicketTrpcRoute } from './createTicket'
import { getCategoriesTrpcRoute } from './getCategories'
import { getCategoryFieldsTrpcRoute } from './getCategoryFields'
import { getOperatorsTrpcRoute } from './getOperators'
import { getStatusesTrpcRoute } from './getStatuses'
import { getTicketTrpcRoute } from './getTicket'
import { getTicketsTrpcRoute } from './getTickets'
import { ticketMessagesTrpcRoute } from './ticketMessages'
import { updateTicketTrpcRoute } from './updateTicket'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  auth: authTrpcRoute,
  createTicket: createTicketTrpcRoute,
  getCategories: getCategoriesTrpcRoute,
  getCategoryFields: getCategoryFieldsTrpcRoute,
  getOperators: getOperatorsTrpcRoute,
  getStatuses: getStatusesTrpcRoute,
  getTicket: getTicketTrpcRoute,
  getTickets: getTicketsTrpcRoute,
  ticketMessages: ticketMessagesTrpcRoute,
  updateTicket: updateTicketTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
