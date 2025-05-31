import { PrismaClient } from '@prisma/client'
import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateExpressContextOptions } from '@trpc/server/adapters/express'
import jwt from 'jsonwebtoken'
import type { UserRole } from '../types/roles'

const prisma = new PrismaClient()

export const createAppContext = () => ({
  prisma,
  stop: async () => {
    await prisma.$disconnect()
  },
})

export type AppContext = inferAsyncReturnType<typeof createAppContext>

export const createContext = ({
  req,
}: CreateExpressContextOptions): AppContext & { user?: { id: string; role: UserRole } } => {
  const token = req.headers.authorization?.split(' ')[1]
  let user: { id: string; role: UserRole } | undefined

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: UserRole }
    } catch (e) {
      console.warn('Invalid token:', e)
    }
  }

  return {
    ...createAppContext(),
    user,
  }
}
