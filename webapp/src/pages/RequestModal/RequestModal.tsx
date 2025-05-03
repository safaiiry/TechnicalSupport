import type { TicketCategory, TicketField } from '@technicalsupport/backend/src/lib/types'
import { Modal, Spin, Input, Select, DatePicker, Form, Button, Row, Col } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import { trpc } from '../../lib/trpc'
// import styles from './RequestModal.module.less'

type RequestModalProps = {
  open: boolean
  category: TicketCategory | null
  onClose: () => void
}

export const RequestModal: React.FC<RequestModalProps> = ({ open, category, onClose }) => {
  const [form] = useForm()

  const { data, isLoading } = trpc.getCategoryFields.useQuery(
    { categoryId: category?.id ?? '' },
    { enabled: !!category?.id }
  )

  const fields = data?.fields ?? []

  type GroupedField = {
    fields: typeof fields
    span: number
  }

  function layoutByCustomPattern(fields: TicketField[]): GroupedField[] {
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
    const result: GroupedField[] = []

    let i = 0

    for (const count of pattern) {
      const group = fields.slice(i, i + count)
      if (group.length === 0) {
        break
      }

      result.push({
        fields: group,
        span: Math.floor(24 / count),
      })

      i += count
    }

    return result
  }

  const renderField = (field: (typeof fields)[number]) => {
    switch (field.field_type) {
      case 'input':
        return <Input placeholder={field.placeholder ?? undefined} />

      case 'select':
        // eslint-disable-next-line no-case-declarations
        const options = (field.options ?? []) as string[]
        return (
          <Select placeholder={field.placeholder} style={{ height: 48, width: '100%' }}>
            {options.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        )

      case 'date':
        return <DatePicker placeholder={field.placeholder ?? undefined} style={{ width: '100%' }} />

      default:
        return null
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      console.info('Форма отправлена:', values)
      // TODO: отправка на бэкенд
    } catch (error) {
      console.warn('Ошибка валидации:', error)
    }
  }

  return (
    <Modal open={open} onCancel={onClose} title={category?.name} footer={null} destroyOnClose width={900}>
      {isLoading && <Spin />}
      {!isLoading && fields.length === 0 && <p>Нет доступных полей</p>}
      {!isLoading && fields.length > 0 && (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {layoutByCustomPattern(fields).map((group, groupIndex) => (
            <Row gutter={16} key={groupIndex}>
              {group.fields.map((field) => (
                <Col span={group.span} key={field.id}>
                  <Form.Item
                    name={field.id}
                    label={field.field_label}
                    rules={[{ required: field.is_required, message: 'Обязательное поле' }]}
                  >
                    {renderField(field)}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Отправить заявку
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}
