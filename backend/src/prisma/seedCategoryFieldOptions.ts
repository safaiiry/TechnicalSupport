import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const data: { field_name: string; options: string[] }[] = [
    {
      field_name: 'department',
      options: [
        'Подразделения Первого проректора',
        'Подразделения проректора по научной деятельности',
        'Подразделения проректора по эксплуатации и развитию имущественного комплекса',
        'Подразделения проректора по образовательной деятельности',
        'Подразделения проректора по специальным программам',
        'Подразделения проректора по международной деятельности',
      ],
    },
    {
      field_name: 'building',
      options: ['Корпус №1.', 'Учебный центр №2.', 'Учебный центр №3, инженерный корпус'],
    },
    {
      field_name: 'floor',
      options: ['1', '2', '3'],
    },
    {
      field_name: 'work_type',
      options: ['заправка', 'ремонт'],
    },
    {
      field_name: 'request_type',
      options: ['Подключение интернета', 'подключение телефонии'],
    },
    {
      field_name: 'workstation_type',
      options: ['стационарный компьютер', 'моноблок', 'ноутбук', 'нетбук', 'планшет'],
    },
    {
      field_name: 'print_format',
      options: ['А3', 'А4'],
    },
    {
      field_name: 'print_type',
      options: ['цветной', 'черно-белый'],
    },
    {
      field_name: 'duplex_unit',
      options: ['Наличие', 'отсутствие'],
    },
    {
      field_name: 'used_option',
      options: ['Да', 'Нет'],
    },
    {
      field_name: 'equipment',
      options: ['Одна трубка', 'две трубки'],
    },
    {
      field_name: 'handsets_count',
      options: ['1', '4', '6'],
    },
    {
      field_name: 'auto_recording',
      options: ['Да', 'нет'],
    },
  ]

  for (const entry of data) {
    await prisma.ticketField.updateMany({
      where: { field_name: entry.field_name },
      data: { options: entry.options },
    })
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
