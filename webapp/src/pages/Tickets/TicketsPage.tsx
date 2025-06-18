import { SearchOutlined } from '@ant-design/icons'
import { Button, Table, Input, Select, Form, Spin } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EmptyIcon from '../../assets/EmptyIcon.svg?react'
import SupportLayout from '../../components/Layout/Layout'
import { getViewTicketRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import styles from './TicketsPage.module.less'

export const TicketsPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [filters, setFilters] = useState<{
    number?: string
    category?: string
    status?: string
    created_at?: string
  }>({})

  const { data, isFetching, isError, error } = trpc.getTickets.getTickets.useQuery(filters)

  const { data: categoriesData } = trpc.getCategories.useQuery()
  const { data: statusesData } = trpc.getStatuses.useQuery()

  const handleSearch = () => {
    const values = form.getFieldsValue()
    setFilters({
      number: values.number || '',
      category: values.category || '',
      status: values.status || '',
      created_at: values.created_at || '',
    })
  }

  const columns = [
    {
      title: '№',
      dataIndex: 'index',
      width: 60,
    },
    {
      title: 'Номер',
      dataIndex: 'number',
      width: 100,
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      width: 200,
      sorter: { multiple: 1 },
    },
    {
      title: 'Контакт',
      dataIndex: 'contact',
      width: 150,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 100,
      render: (status: { id: string; name: string }) => {
        const colorMap: Record<string, string> = {
          'f29f93af-51ca-4791-b345-e0beecd46b43': '#D3EBFF',
          '74666b1d-251e-40bd-9e53-3065d861dd9c': '#FFF5D3',
          '95a55ae5-96a4-4f58-bc35-c551935ba4b8': '#DFF7E8',
        }

        const bgColor = colorMap[status.id] || '#eee'

        return (
          <span
            style={{
              backgroundColor: bgColor,
              borderRadius: '24px',
              padding: '4px 16px',
              fontSize: 12,
            }}
          >
            {status.name}
          </span>
        )
      },
    },
    {
      title: 'Дата обращения',
      dataIndex: 'created_at',
      width: 150,
      sorter: { multiple: 1 },
      render: (date: string) => new Date(date).toLocaleString('ru-RU'),
    },
    {
      title: 'Последнее изменение',
      dataIndex: 'updated_at',
      width: 160,
      sorter: { multiple: 1 },
      render: (date: string) => new Date(date).toLocaleString('ru-RU'),
    },
    {
      title: 'Ответственный',
      dataIndex: 'assignee',
      width: 150,
      ellipsis: true,
    },
  ]

  return (
    <SupportLayout>
      <div className={styles.pageLayout}>
        <Form form={form} layout="inline" onFinish={handleSearch} className={styles.header}>
          <Form.Item name="number" className={styles.formItem}>
            <Input placeholder="Номер" allowClear className={styles.input} />
          </Form.Item>
          <Form.Item name="category" className={styles.formItem}>
            <Select
              placeholder="Категория"
              className={styles.select}
              allowClear
              options={categoriesData?.categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Form.Item>
          <Form.Item name="status" className={styles.formItem}>
            <Select
              placeholder="Статус"
              className={styles.select}
              allowClear
              options={statusesData?.statuses.map((s) => ({ value: s.id, label: s.name }))}
            />
          </Form.Item>
          <Form.Item name="created_at" className={styles.formItem}>
            <Input placeholder="Дата обращения" allowClear className={styles.input} />
          </Form.Item>
          <Form.Item className={styles.formItem}>
            <Button icon={<SearchOutlined />} type="primary" htmlType="submit" className={styles.button}>
              Поиск
            </Button>
          </Form.Item>
        </Form>

        {isFetching ? (
          <Spin size="large" />
        ) : isError ? (
          <span>Ошибка: {error?.message}</span>
        ) : (
          <div className={styles.table}>
            <Table
              columns={columns}
              rowKey="id"
              dataSource={data?.tickets || []}
              pagination={{ showSizeChanger: false }}
              locale={{
                emptyText: (
                  <div className={styles.emptyBlock}>
                    <EmptyIcon />
                    <div className={styles.emptyText}>У вас пока нет заявок</div>
                  </div>
                ),
              }}
              onRow={(record) => ({
                onClick: () => navigate(getViewTicketRoute({ ticketId: String(record.id) })),
              })}
            />
          </div>
        )}
      </div>
    </SupportLayout>
  )
}
