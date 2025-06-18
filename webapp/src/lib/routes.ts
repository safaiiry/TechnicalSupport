const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
}

export const getAllTicketsRoute = () => '/'

export const viewTicketRouteParams = getRouteParams({ ticketId: true })
export type ViewTicketsRouteParams = typeof viewTicketRouteParams
export const getViewTicketRoute = ({ ticketId }: ViewTicketsRouteParams) => `/tickets/${ticketId}`
export const getFaqRoute = () => '/faq'
