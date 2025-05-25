import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function seed() {
  const usersToCreate = [
    {
      full_name: 'Иван Иванов',
      login: 'ivanov',
      email: 'ivanov@spmi.ru',
      password: 'ivn',
    },
    {
      full_name: 'Пётр Петров',
      login: 'petrov',
      email: 'petrov@spmi.ru',
      password: 'ptr',
    },
    {
      full_name: 'Анна Оператор',
      login: 'anna.operator',
      email: 'anna@spmi.ru',
      password: 'opr',
      role: 'operator',
    },
    {
      full_name: 'Елена Главная',
      login: 'elena.chief',
      email: 'elena@spmi.ru',
      password: 'adm',
      role: 'chief',
    },
  ]

  const roles = await Promise.all([
    prisma.operatorRole.upsert({
      where: { name: 'operator' },
      update: {},
      create: {
        name: 'operator',
        description: 'Оператор поддержки',
      },
    }),
    prisma.operatorRole.upsert({
      where: { name: 'chief' },
      update: {},
      create: {
        name: 'chief',
        description: 'Главный оператор',
      },
    }),
  ])

  for (const user of usersToCreate) {
    const password_hash = crypto.createHash('sha256').update(user.password).digest('hex')

    const createdUser = await prisma.user.create({
      data: {
        full_name: user.full_name,
        login: user.login,
        password_hash,
        email: user.email,
      },
    })

    if (user.role) {
      const role = roles.find((r) => r.name === user.role)
      if (role) {
        await prisma.operator.create({
          data: {
            user_id: createdUser.id,
            role_id: role.id,
          },
        })
      }
    }

    console.log(`${user.login} создан. Пароль: ${user.password}`)
  }

  console.log('✅ Все пользователи созданы.')
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
