import { initTRPC } from '@trpc/server'
import _ from 'lodash'
import { z } from 'zod'

const typeNames = ['Инцидент', 'Запрос']
const priorities = ['Высокий', 'Средний', 'Низкий']
const descriptions = [
  'Не работает интернет на 3 этаже',
  'Необходимо установить ПО',
  'Мышь не работает',
  'Срочная замена принтера',
  'Сбой в работе 1С',
]
const stateNames = ['Открыт', 'В работе', 'Закрыт', 'Ожидание']
const contacts = [
  'Иванов И.И., +7 999 123-45-67',
  'Сидорова А.А., +7 999 987-65-43',
  'Тестов Т.Т., +7 912 345-67-89',
  'Миронова Е.Ю., +7 916 456-78-90',
  'Дмитриев С.С., +7 926 321-54-76',
]
const performers = ['Петров П.П.', 'Кузнецов В.В.', 'Лебедев И.И.', 'Фролов А.А.', 'Кириллов М.М.']

function getRandomDate(base: string, offset = 0) {
  const date = new Date(base)
  date.setDate(date.getDate() + offset)
  return date.toISOString().slice(0, 10)
}

const tickets = _.times(100, (i) => {
  const createdOffset = _.random(-10, 0)
  const changedOffset = createdOffset + _.random(0, 3)

  return {
    id: i + 1,
    incNumber: `INC${(i + 1).toString().padStart(4, '0')}`,
    typeName: _.sample(typeNames),
    priority: _.sample(priorities),
    description: _.sample(descriptions),
    stateName: _.sample(stateNames),
    contacts: _.sample(contacts),
    dateCreated: getRandomDate('2025-04-20', createdOffset),
    dateChanged: getRandomDate('2025-04-20', changedOffset),
    performerFIO: _.sample(performers),
  }
})

const trpc = initTRPC.create()

export const trpcRouter = trpc.router({
  getTickets: trpc.procedure.query(() => {
    return { tickets }
  }),
  getTicket: trpc.procedure.input(z.object({ ticketId: z.string() })).query(({ input }) => {
    const ticket = tickets.find((t) => t.id.toString() === input.ticketId)
    return { ticket: ticket || null }
  }),
})

export type TrpcRouter = typeof trpcRouter
