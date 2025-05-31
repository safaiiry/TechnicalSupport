import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { publicProcedure, router } from '../../lib/trpc'
import type { UserRole } from '../../types/roles'

const OPERATOR_ROLE_ID = '7f0f6124-8042-4588-b3bb-17d7deb089cb'
const CHIEF_ROLE_ID = '80669848-ca19-4d31-ab38-f9efdb0753a8'

export const authTrpcRoute = router({
  login: publicProcedure
    .input(
      z.object({
        login: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { login: input.login },
        include: {
          operator: {
            include: {
              role: true,
            },
          },
        },
      })

      if (!user || !(await bcrypt.compare(input.password, user.password_hash))) {
        throw new Error('Неверный логин или пароль')
      }

      let role: UserRole = 'user'
      const roleId = user.operator?.role?.id
      if (roleId === OPERATOR_ROLE_ID) {
        role = 'operator'
      }
      if (roleId === CHIEF_ROLE_ID) {
        role = 'chief'
      }

      const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
      })

      return {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          role,
        },
      }
    }),
})
