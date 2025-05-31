import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password_hash = await bcrypt.hash('123', 10)

  await prisma.user.create({
    data: {
      full_name: 'Иван Иванов',
      login: 'ivanov',
      email: 'ivanov@example.com',
      password_hash,
    },
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
