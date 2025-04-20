import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { getAllTicketsRoute, getViewTicketRoute, viewTicketRouteParams } from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import 'antd/dist/reset.css'

import { TicketPage } from './pages/Ticket/TicketPage'
import { TicketsPage } from './pages/Tickets/TicketsPage'

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path={getAllTicketsRoute()} element={<TicketsPage />} />
          <Route path={getViewTicketRoute(viewTicketRouteParams)} element={<TicketPage />} />
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}
