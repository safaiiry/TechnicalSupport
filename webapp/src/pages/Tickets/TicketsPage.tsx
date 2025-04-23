import { PlusOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import SupportLayout from '../../components/Layout/Layout'
import { getViewTicketRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import styles from './TicketsPage.module.less'

export const TicketsPage = () => {
  const navigate = useNavigate()
  const { data, error, isLoading, isFetching, isError } = trpc.getTickets.useQuery()

  const columns = [
    {
      title: '№',
      dataIndex: 'id',
      width: 60,
      render: (index: number) => index,
    },
    {
      title: 'Номер',
      dataIndex: 'incNumber',
      width: 120,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Тип',
      dataIndex: 'typeName',
      width: 100,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      width: 120,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Статус',
      dataIndex: 'stateName',
      width: 100,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Контакт',
      dataIndex: 'contacts',
      width: 200,
      ellipsis: true,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'dateCreated',
      width: 140,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Последнее изменение',
      dataIndex: 'dateChanged',
      width: 140,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Ответственный',
      dataIndex: 'performerFIO',
      width: 180,
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
      <div className={styles.ticketsPage}>
        <div className={styles.ticketsPage__header}>
          <Button type="primary" className={styles.ticketsPage__createButton} icon={<PlusOutlined />}>
            Создать Заявку
          </Button>
        </div>
        <div className={styles.ticketsPage__table}>
          <Table
            columns={columns}
            rowKey="id"
            showSorterTooltip={false}
            dataSource={data?.tickets || []}
            scroll={{ x: 1500 }}
            onRow={(record) => ({
              onClick: () => navigate(getViewTicketRoute({ ticketId: String(record.id) })),
            })}
            pagination={{
              showSizeChanger: false,
            }}
          />
        </div>
      </div>
    </SupportLayout>
  )
}
