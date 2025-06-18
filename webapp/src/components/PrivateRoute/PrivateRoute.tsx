import { JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { getItem } from '../../lib/storage'

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = getItem('token')
  return token ? children : <Navigate to="/login" />
}
