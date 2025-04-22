import { PlusOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import SupportLayout from '../../components/Layout/Layout'
import { getViewTicketRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const TicketsPage = () => {
  const navigate = useNavigate()
  const { data, error, isLoading, isFetching, isError } = trpc.getTickets.useQuery()

  const columns = [
    {
      title: '№',
      dataIndex: 'id',
      width: 48,
      render: (index: number) => index,
    },
    {
      title: 'Номер',
      dataIndex: 'incNumber',
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Тип',
      dataIndex: 'typeName',
      width: 80,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      width: 80,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      width: '10%',
      ellipsis: true,
    },
    {
      title: 'Статус',
      dataIndex: 'stateName',
      width: 80,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Контакт',
      dataIndex: 'contacts',
      width: '15%',
      ellipsis: true,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'dateCreated',
      width: 120,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Последнее изменение',
      dataIndex: 'dateChanged',
      width: 120,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Ответственный',
      dataIndex: 'performerFIO',
      width: '15%',
      ellipsis: true,
      sorter: {
        multiple: 1,
      },
    },
  ]

  if (isLoading || isFetching) {
    return <span>Загрузка...</span>
  }

  if (isError) {
    return <span>Ошибка: {error.message}</span>
  }

  return (
    <SupportLayout>
      <Button type="primary" shape="round" icon={<PlusOutlined />}>
        Создать Заявку
      </Button>
      <Table
        columns={columns}
        rowKey="id"
        showSorterTooltip={false}
        dataSource={data?.tickets || []}
        onRow={(record) => ({ onClick: () => navigate(getViewTicketRoute({ ticketId: String(record.id) })) })}
      />
    </SupportLayout>
  )
}
