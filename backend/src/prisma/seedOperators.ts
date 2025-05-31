import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const OPERATOR_ROLE_ID = '7f0f6124-8042-4588-b38b-17d7deb08988'
const CHIEF_ROLE_ID = '80669848-ca19-4d31-ab38-f9efdb0753a8'

async function createOperator(login: string, fullName: string, email: string, roleId: string) {
  const password_hash = await bcrypt.hash('123', 10)

  await prisma.user.create({
    data: {
      full_name: fullName,
      login,
      email,
      password_hash,
      operator: {
        create: {
          role: {
            connect: {
              id: roleId,
            },
          },
        },
      },
    },
    include: {
      operator: {
        include: { role: true },
      },
    },
  })
}

async function main() {
  await createOperator('operator', 'Оператор Один', 'operator@example.com', OPERATOR_ROLE_ID)
  await createOperator('chief', 'Главный Оператор', 'chief@example.com', CHIEF_ROLE_ID)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
