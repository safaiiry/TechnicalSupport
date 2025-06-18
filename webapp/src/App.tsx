import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { getAllTicketsRoute, getViewTicketRoute, viewTicketRouteParams } from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import 'antd/dist/reset.css'
import './styles/global.less'

import { AnalyticsPage } from './pages/Analytics/AnalyticsPage'
import { LoginPage } from './pages/Login/LoginPage'
import { MainPage } from './pages/Main/MainPage'
import { TicketPage } from './pages/Ticket/TicketPage'
import { TicketsPage } from './pages/Tickets/TicketsPage'
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute'

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path={getAllTicketsRoute()}
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-tickets"
            element={
              <PrivateRoute>
                <TicketsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <AnalyticsPage />
              </PrivateRoute>
            }
          />
          <Route
            path={getViewTicketRoute(viewTicketRouteParams)}
            element={
              <PrivateRoute>
                <TicketPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}
