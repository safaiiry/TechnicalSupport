import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Form, Input, DatePicker, Select, Spin, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SupportLayout from '../../components/Layout/Layout'
import { trpc } from '../../lib/trpc'
import styles from './TicketPage.module.less'

export const TicketPage = () => {
  const { ticketId } = useParams<{ ticketId: string }>()
  const [form] = Form.useForm()

  const { data, isLoading, isError, error } = trpc.getTicket.useQuery({
    ticketId: ticketId ?? '',
  })

  useEffect(() => {
    if (data?.ticket) {
      form.setFieldsValue({
        type: { id: data.ticket.typeName },
        priority: { id: data.ticket.priority },
        state: { id: data.ticket.stateName },
        dateCreated: dayjs(data.ticket.dateCreated),
        dateChanged: dayjs(data.ticket.dateChanged),
        authorFio: data.ticket.performerFIO,
        contactFullName: data.ticket.contacts?.split(',')[0],
        contacts: {
          phone: data.ticket.contacts?.split(',')[1]?.trim() || '',
        },
        performer: { id: data.ticket.performerFIO },
        description: data.ticket.description,
      })
    }
  }, [data, form])

  if (isLoading) {
    return <Spin />
  }
  if (isError) {
    return <div>Ошибка: {error.message}</div>
  }
  if (!data.ticket) {
    return <div>Заявка не найдена</div>
  }

  return (
    <SupportLayout>
      <div className={styles.ticketPage}>
        <div className={styles.ticketPage__header}>
          <Link to="/" className={styles.ticketPage__backButton}>
            <ArrowLeftOutlined />
          </Link>
          <h2>Заявка №{data.ticket.incNumber}</h2>
        </div>

        <div className={styles.ticketPage__content}>
          <div className={styles.ticketPage__form}>
            <Form form={form} layout="vertical">
              <div className={styles.ticketPage__row}>
                <Form.Item label="Тип обращения" name={['type', 'id']}>
                  <Select disabled />
                </Form.Item>
                <Form.Item label="Приоритет" name={['priority', 'id']}>
                  <Select disabled />
                </Form.Item>
              </div>

              <div className={styles.ticketPage__row}>
                <Form.Item label="Статус" name={['state', 'id']}>
                  <Select disabled />
                </Form.Item>
                <Form.Item label="Ответственный" name={['performer', 'id']}>
                  <Select disabled />
                </Form.Item>
              </div>

              <div className={styles.ticketPage__row}>
                <Form.Item label="Дата регистрации" name="dateCreated">
                  <DatePicker disabled />
                </Form.Item>
                <Form.Item label="Дата изменения" name="dateChanged">
                  <DatePicker disabled />
                </Form.Item>
              </div>

              <div className={styles.ticketPage__row}>
                <Form.Item label="Контактное лицо" name="contactFullName">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Телефон" name={['contacts', 'phone']}>
                  <Input disabled />
                </Form.Item>
              </div>

              <Form.Item label="Описание" name="description">
                <TextArea rows={4} disabled style={{ resize: 'none' }} maxLength={2048} />
              </Form.Item>

              <div className={styles.ticketPage__footer}>
                <Form.Item label="Файлы" name="attachments">
                  <Upload disabled />
                </Form.Item>

                <div className={styles.ticketPage__actions}>
                  <Button className={styles.ticketPage__historyButton}>История заявки</Button>
                  <Button type="primary">Сохранить</Button>
                </div>
              </div>
            </Form>
          </div>

          <div className={styles.ticketPage__chat}>
            <div className={styles.ticketPage__chatHeader}>
              <h3>Обсуждение</h3>
            </div>
            <div className={styles.ticketPage__chatContent}>{/* Chat messages will go here */}</div>
            <div className={styles.ticketPage__chatInput}>
              <TextArea rows={2} placeholder="Введите сообщение..." />
              <Button type="primary">Отправить</Button>
            </div>
          </div>
        </div>
      </div>
    </SupportLayout>
  )
}
