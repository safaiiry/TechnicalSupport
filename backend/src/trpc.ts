import { initTRPC } from '@trpc/server'

const tickets = [
  {
    id: 1,
    incNumber: 'INC0001',
    typeName: 'Инцидент',
    priority: 'Высокий',
    description: 'Не работает интернет на 3 этаже',
    stateName: 'Открыт',
    contacts: 'Иванов И.И., +7 999 123-45-67',
    dateCreated: '2025-04-18',
    dateChanged: '2025-04-19',
    performerFIO: 'Петров П.П.',
  },
  {
    id: 2,
    incNumber: 'INC0002',
    typeName: 'Запрос',
    priority: 'Средний',
    description: 'Необходимо установить ПО',
    stateName: 'В работе',
    contacts: 'Сидорова А.А., +7 999 987-65-43',
    dateCreated: '2025-04-17',
    dateChanged: '2025-04-18',
    performerFIO: 'Кузнецов В.В.',
  },
  {
    id: 3,
    incNumber: 'INC0003',
    typeName: 'Инцидент',
    priority: 'Низкий',
    description: 'Мышь не работает',
    stateName: 'Закрыт',
    contacts: 'Тестов Т.Т., +7 912 345-67-89',
    dateCreated: '2025-04-15',
    dateChanged: '2025-04-16',
    performerFIO: 'Лебедев И.И.',
  },
  {
    id: 4,
    incNumber: 'INC0004',
    typeName: 'Запрос',
    priority: 'Высокий',
    description: 'Срочная замена принтера',
    stateName: 'Ожидание',
    contacts: 'Миронова Е.Ю., +7 916 456-78-90',
    dateCreated: '2025-04-10',
    dateChanged: '2025-04-12',
    performerFIO: 'Фролов А.А.',
  },
  {
    id: 5,
    incNumber: 'INC0005',
    typeName: 'Инцидент',
    priority: 'Средний',
    description: 'Сбой в работе 1С',
    stateName: 'Открыт',
    contacts: 'Дмитриев С.С., +7 926 321-54-76',
    dateCreated: '2025-04-19',
    dateChanged: '2025-04-20',
    performerFIO: 'Кириллов М.М.',
  },
]

const trpc = initTRPC.create()

export const trpcRouter = trpc.router({
  getTickets: trpc.procedure.query(() => {
    return { tickets }
  }),
})

export type TrpcRouter = typeof trpcRouter
