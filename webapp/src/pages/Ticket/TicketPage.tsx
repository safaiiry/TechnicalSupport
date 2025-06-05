import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Input, Row, Select, Spin, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
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

  if (isLoading) {
    return (
      <SupportLayout>
        <Spin size="large" />
      </SupportLayout>
    )
  }

  if (isError) {
    return <div>Ошибка: {error.message}</div>
  }

  if (!data.ticket) {
    return <div>Заявка не найдена</div>
  }

  const ticket = data.ticket

  function layoutByCustomPattern(fields: typeof ticket.field_values) {
    const total = fields.length

    const layouts: Record<number, number[]> = {
      8: [3, 2, 2, 1],
      9: [3, 2, 2, 2],
      10: [3, 1, 2, 2, 1, 1],
      11: [2, 1, 3, 3, 1, 1],
      13: [3, 3, 2, 1, 1, 1, 1, 1],
      14: [3, 2, 3, 3, 2, 1],
      15: [3, 2, 3, 3, 1, 1, 1, 1],
      16: [3, 2, 3, 3, 2, 1, 1, 1],
    }

    const pattern = layouts[total] ?? Array(Math.ceil(total / 3)).fill(3)
    const result: { fields: typeof ticket.field_values; span: number }[] = []

    let i = 0
    for (const count of pattern) {
      const group = ticket.field_values.slice(i, i + count)
      if (group.length === 0) {
        break
      }
      result.push({ fields: group, span: Math.floor(24 / count) })
      i += count
    }

    return result
  }

  return (
    <SupportLayout>
      <div className={styles.ticketPage}>
        <div className={styles.ticketPage__header}>
          <Link to="/my-tickets" className={styles.ticketPage__backButton}>
            <ArrowLeftOutlined />
          </Link>
          <h2>Заявка №{ticket.id.slice(0, 8).toUpperCase()}</h2>
        </div>

        <div className={styles.ticketPage__content}>
          <div className={styles.ticketPage__form}>
            <Form form={form} layout="vertical">
              {layoutByCustomPattern(ticket.field_values).map((group, idx) => (
                <Row gutter={16} key={idx}>
                  {group.fields.map((fv) => {
                    const field = fv.field
                    const value = fv.value

                    return (
                      <Col key={field.id} span={group.span}>
                        <Form.Item label={field.field_label} className={styles.formItem}>
                          {field.field_type === 'input' && <Input value={value} disabled />}
                          {field.field_type === 'date' && (
                            <DatePicker value={dayjs(value)} disabled style={{ width: '100%' }} />
                          )}
                          {field.field_type === 'select' && (
                            <Select
                              value={value}
                              disabled
                              className={styles.select}
                              options={
                                Array.isArray(field.options)
                                  ? (field.options as string[])
                                      .filter((opt): opt is string => typeof opt === 'string')
                                      .map((opt) => ({ label: opt, value: opt }))
                                  : []
                              }
                            />
                          )}
                        </Form.Item>
                      </Col>
                    )
                  })}
                </Row>
              ))}
              <div className={styles.ticketPage__footer}>
                <Form.Item label="Файлы">
                  <Upload
                    fileList={ticket.attachments.map((file: any) => ({
                      uid: file.id,
                      name: file.file_name,
                      url: file.file_url,
                    }))}
                    showUploadList={{ showDownloadIcon: true }}
                  />
                </Form.Item>

                <div className={styles.ticketPage__actions}>
                  <Button className={styles.ticketPage__historyButton}>История заявки</Button>
                  <Button type="primary" disabled>
                    Сохранить
                  </Button>
                </div>
              </div>
            </Form>
          </div>

          <div className={styles.ticketPage__chat}>
            <div className={styles.ticketPage__chatHeader}>
              <h3>Обсуждение</h3>
            </div>
            <div className={styles.ticketPage__chatContent}>
              <div className={styles.statusInfo}>
                <b>Статус обращения:</b> {ticket.status.name}
              </div>
            </div>
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
