import { ArrowLeftOutlined } from '@ant-design/icons'
import { Tooltip, Button, Form, Row, Upload, Input, Modal, Select, DatePicker, Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { trpc } from '../../lib/trpc'

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
    <div className="ticket">
      <div className="ticket__header">
        <Tooltip title="К списку заявок">
          <Link to="/tickets" className="ticket__return-link">
            <ArrowLeftOutlined />
          </Link>
        </Tooltip>
        <h2>Заявка № {ticketId}</h2>
      </div>

      <div className="ticket__content">
        <Form form={form} name="ticket-form" layout="vertical" className="ticket-form">
          <div className="ticket-form__body">
            <Row className="ticket-form__row">
              <Form.Item label="Тип обращения" name={['type', 'id']}>
                <Select placeholder="Выберите тип обращения" disabled />
              </Form.Item>
              <Form.Item label="Модуль" name={['module', 'id']}>
                <Select placeholder="Выберите модуль" disabled />
              </Form.Item>
            </Row>

            <Row className="ticket-form__row">
              <Form.Item label="Приоритет" name={['priority', 'id']}>
                <Select placeholder="Выберите приоритет" disabled />
              </Form.Item>
              <Form.Item label="Статус" name={['state', 'id']}>
                <Select placeholder="Выберите статус" disabled />
              </Form.Item>
            </Row>

            <Row className="ticket-form__row">
              <Form.Item label="Дата регистрации" name="dateCreated">
                <DatePicker format="YYYY-MM-DD HH-mm-ss" className="ticket-form__date-picker" disabled />
              </Form.Item>
              <Form.Item label="Дата последнего изменения" name="dateChanged">
                <DatePicker format="YYYY-MM-DD HH-mm-ss" className="ticket-form__date-picker" disabled />
              </Form.Item>
            </Row>

            <Row className="ticket-form__row">
              <Form.Item label="Автор изменений" name="authorFio">
                <Input placeholder="ФИО автора последней редакции" disabled />
              </Form.Item>
              <Form.Item label="Контакт" name="contactFullName">
                <Input placeholder="ФИО заявителя" disabled />
              </Form.Item>
            </Row>

            <Row className="ticket-form__row">
              <Form.Item label="Телефон" name={['contacts', 'phone']}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="Электронная почта" name={['contacts', 'email']}>
                <Input disabled />
              </Form.Item>
            </Row>

            <Row className="ticket-form__row">
              <Form.Item label="Контрагент" name={['contacts', 'enterpriseName']}>
                <Input placeholder="Организация заявителя" disabled />
              </Form.Item>
              <Form.Item label="Ответственный" name={['performer', 'id']}>
                <Select placeholder="Выберите ответственного" disabled />
              </Form.Item>
            </Row>

            <Row className="ticket-form__row">
              <Form.Item label="Текст обращения" name="description">
                <TextArea rows={3} disabled />
              </Form.Item>
              <Form.Item label="Решение" name="solution">
                <TextArea rows={3} disabled />
              </Form.Item>
            </Row>
          </div>

          <Row className="ticket-form__footer">
            <Form.Item label="Файлы заявки:" name="attachments" valuePropName="fileList">
              <Upload className="ticket-form__upload" showUploadList={{ showRemoveIcon: false }} />
            </Form.Item>

            <Button className="ticket-form__history-button" shape="round" disabled>
              История заявки
            </Button>

            <Button type="primary" shape="round" htmlType="submit" disabled>
              Сохранить
            </Button>
          </Row>
        </Form>

        {/* Комментарии заявки (визуальная заглушка) */}
        <div className="ticket-comments">{/* TicketComments здесь могут быть добавлены отдельно, если нужно */}</div>
      </div>

      <Modal title="История заявки" open={false} onCancel={() => {}} footer={null} width="100%">
        {/* TicketHistory здесь может быть добавлен отдельно */}
      </Modal>
    </div>
  )
}
