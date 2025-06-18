import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import type { TicketFieldValue } from '@technicalsupport/backend/src/lib/types'
import { Button, Col, DatePicker, Form, Input, Row, Select, Spin, Upload, Modal, message, UploadFile } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import cn from 'classnames'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Completed from '../../assets/Completed.svg?react'
import InWork from '../../assets/InWork.svg?react'
import New from '../../assets/New.svg?react'
import SupportLayout from '../../components/Layout/Layout'
import { getItem } from '../../lib/storage'
import { trpc } from '../../lib/trpc'
import styles from './TicketPage.module.less'

export const TicketPage = () => {
  const { ticketId } = useParams<{ ticketId: string }>()
  const [form] = Form.useForm()
  const role = getItem('role')
  const isChief = role === 'chief'

  const { data, isLoading, isError, error, refetch } = trpc.getTicket.useQuery({
    ticketId: ticketId ?? '',
  })

  const statusIconMap: Record<string, React.ReactNode> = {
    'f29f93af-51ca-4791-b345-e0beecd46b43': <New />,
    '74666b1d-251e-40bd-9e53-3065d861dd9c': <InWork />,
    '95a55ae5-96a4-4f58-bc35-c551935ba4b8': <Completed />,
  }

  const { data: statusesData } = trpc.getStatuses.useQuery()
  const { data: operatorsData } = trpc.getOperators.useQuery(undefined, {
    enabled: isChief,
  })

  const updateStatus = trpc.updateTicket.updateStatus.useMutation()
  const assignOperator = trpc.updateTicket.assignOperator.useMutation()
  const updateFields = trpc.updateTicket.updateFields.useMutation()
  const sendMessageMutation = trpc.ticketMessages.sendMessage.useMutation()
  const uploadFileMutation = trpc.ticketAttachments.upload.useMutation()
  const deleteFileMutation = trpc.ticketAttachments.delete.useMutation()

  const { data: messagesData, refetch: refetchMessages } = trpc.ticketMessages.getMessages.useQuery(
    { ticketId: ticketId ?? '' },
    { enabled: !!ticketId }
  )

  const [messageText, setMessageText] = useState('')
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({})
  const [editingStatus, setEditingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState<string>()
  const [assignModal, setAssignModal] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState<string>()
  const [files, setFiles] = useState<UploadFile[]>([])

  useEffect(() => {
    if (!ticketId) {
      return
    }
    const id = setInterval(() => refetchMessages(), 5000)
    return () => clearInterval(id)
  }, [ticketId, refetchMessages])

  const COMPLETED_STATUS_ID = '95a55ae5-96a4-4f58-bc35-c551935ba4b8'
  const isCompleted = data?.ticket?.status.id === COMPLETED_STATUS_ID

  useEffect(() => {
    if (data?.ticket) {
      const initial: Record<string, string> = {}
      data.ticket.field_values.forEach((fv: TicketFieldValue) => {
        initial[fv.id] = fv.value
      })
      setFieldValues(initial)
      setPendingChanges({})
      const myId = getItem('user_id')
      const canEdit = myId === data.ticket.user.id
      setFiles(
        data.ticket.attachments.map((a: any) => ({
          uid: a.id,
          name: a.file_name,
          url: a.file_url,
          status: 'done',
          showRemoveIcon: canEdit,
        }))
      )
    }
  }, [data])

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
  if (!data?.ticket) {
    return <div>Заявка не найдена</div>
  }

  const ticket = data.ticket

  const colorMap: Record<string, string> = {
    'f29f93af-51ca-4791-b345-e0beecd46b43': '#D3EBFF',
    '74666b1d-251e-40bd-9e53-3065d861dd9c': '#FFF5D3',
    '95a55ae5-96a4-4f58-bc35-c551935ba4b8': '#DFF7E8',
  }

  const statusColor = colorMap[ticket.status.id] || '#eee'

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

  const startEdit = () => {
    setNewStatus(ticket.status.id)
    setEditingStatus(true)
  }

  const handleFieldChange = (fieldValueId: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldValueId]: value }))
    setPendingChanges((prev) => ({ ...prev, [fieldValueId]: value }))
  }

  const handleSaveFields = async () => {
    const updates = Object.entries(pendingChanges).map(([fieldValueId, value]) => ({
      fieldValueId,
      value,
    }))

    if (updates.length === 0) {
      return
    }

    try {
      await updateFields.mutateAsync({ ticketId: ticket.id, fields: updates })
      setPendingChanges({})
      refetch()
      refetchMessages()
    } catch {
      message.error('Не удалось обновить поле')
    }
  }

  const handleStatusSave = async () => {
    if (!newStatus) {
      return
    }
    await updateStatus.mutateAsync({ ticketId: ticket.id, statusId: newStatus })
    setEditingStatus(false)
    refetch()
  }

  const handleAssign = async () => {
    if (!selectedOperator) {
      return
    }
    await assignOperator.mutateAsync({ ticketId: ticket.id, operatorId: selectedOperator })
    setAssignModal(false)
    setSelectedOperator(undefined)
    refetch()
  }

  const handleUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const res = await uploadFileMutation.mutateAsync({
          ticketId: ticket.id,
          fileName: file.name,
          fileData: reader.result as string,
        })
        setFiles((prev) => [
          ...prev,
          {
            uid: res.attachment.id,
            name: res.attachment.file_name,
            url: res.attachment.file_url,
            status: 'done',
            showRemoveIcon: true,
          },
        ])
        refetch()
      } catch {
        message.error('Не удалось загрузить файл')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveFile = async (file: UploadFile) => {
    try {
      await deleteFileMutation.mutateAsync({ attachmentId: String(file.uid) })
      setFiles((prev) => prev.filter((f) => f.uid !== file.uid))
      refetch()
    } catch {
      message.error('Не удалось удалить файл')
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      return
    }
    try {
      await sendMessageMutation.mutateAsync({ ticketId: ticket.id, content: messageText })
      setMessageText('')
      refetchMessages()
    } catch {
      message.error('Не удалось отправить сообщение')
    }
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
                  {group.fields.map((fv: TicketFieldValue) => {
                    const field = fv.field
                    const editable = role === 'user' && !isCompleted
                    const value = fieldValues[fv.id]

                    return (
                      <Col key={field.id} span={group.span}>
                        <Form.Item label={field.field_label} className={styles.formItem}>
                          {field.field_type === 'input' && (
                            <Input
                              value={value}
                              disabled={!editable}
                              onChange={(e) => handleFieldChange(fv.id, e.target.value)}
                            />
                          )}
                          {field.field_type === 'date' && (
                            <DatePicker
                              value={value ? dayjs(value) : undefined}
                              disabled={!editable}
                              style={{ width: '100%' }}
                              onChange={(d) => d && handleFieldChange(fv.id, d.format('YYYY-MM-DD'))}
                            />
                          )}
                          {field.field_type === 'select' && (
                            <Select
                              value={value}
                              disabled={!editable}
                              className={styles.select}
                              onChange={(v) => handleFieldChange(fv.id, v)}
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
                <Form.Item>
                  <Upload
                    customRequest={({ file, onSuccess }) => {
                      handleUpload(file as File).then(() => onSuccess && onSuccess({}, file))
                    }}
                    fileList={files}
                    onRemove={handleRemoveFile}
                    showUploadList={{ showDownloadIcon: true }}
                    maxCount={3}
                    disabled={isCompleted || role !== 'user' || getItem('user_id') !== ticket.user.id}
                  >
                    {role === 'user' && getItem('user_id') === ticket.user.id && !isCompleted && (
                      <Button icon={<UploadOutlined />}>Загрузить</Button>
                    )}
                  </Upload>
                </Form.Item>
                {role === 'user' && getItem('user_id') === ticket.user.id && (
                  <div className={styles.ticketPage__actions}>
                    <Button
                      type="primary"
                      onClick={handleSaveFields}
                      disabled={isCompleted || Object.keys(pendingChanges).length === 0}
                    >
                      Сохранить
                    </Button>
                  </div>
                )}
              </div>
            </Form>
          </div>

          <div className={styles.ticketPage__chat}>
            <div className={styles.ticketPage__chatHeader}>
              <h3>Обсуждение</h3>
            </div>
            <div className={styles.ticketPage__chatContent}>
              <div className={styles.statusInfo} style={{ backgroundColor: statusColor }}>
                {statusIconMap[ticket.status.id]}
                <div>
                  <b>Статус обращения: </b>
                  {editingStatus ? (
                    <Select
                      value={newStatus}
                      onChange={(v) => setNewStatus(v)}
                      style={{ width: 200 }}
                      options={statusesData?.statuses.map((s) => ({
                        value: s.id,
                        label: s.name,
                      }))}
                    />
                  ) : (
                    <span>{ticket.status.name}</span>
                  )}
                  {isCompleted && (
                    <div className={styles.completedText}>
                      {' '}
                      Обращение завершено {new Date(ticket.updated_at).toLocaleDateString('ru-RU')}
                    </div>
                  )}
                </div>
                <div className={styles.icons}>
                  {(role === 'operator' || role === 'chief') &&
                    !isCompleted &&
                    (editingStatus ? (
                      <>
                        <CheckOutlined onClick={handleStatusSave} className={styles.actionIcon} />
                        <CloseOutlined
                          onClick={() => {
                            setEditingStatus(false)
                            setNewStatus(undefined)
                          }}
                          className={styles.actionIcon}
                        />
                      </>
                    ) : (
                      <EditOutlined onClick={startEdit} className={styles.actionIcon} />
                    ))}
                  {role === 'chief' && !editingStatus && !isCompleted && (
                    <ArrowRightOutlined onClick={() => setAssignModal(true)} className={styles.actionIcon} />
                  )}
                </div>
              </div>
              {messagesData?.messages.map((msg) => {
                const fullName = getItem('full_name')
                const isMine = msg.author === fullName
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      styles.ticketPage__message,
                      isMine ? styles.ticketPage__messageMine : styles.ticketPage__messageOther
                    )}
                  >
                    <div className={styles.ticketPage__messageMeta}>
                      <div className={styles.ticketPage__messageAuthor}>
                        <b>{isMine ? 'Вы' : msg.author}</b>
                        {msg.role !== 'user' && (
                          <div className={styles.ticketPage__messageRole}>
                            {msg.role === 'chief'
                              ? 'Главный оператор технической поддержки'
                              : 'Оператор технической поддержки'}
                          </div>
                        )}
                      </div>
                      <div>{new Date(msg.created_at).toLocaleString('ru-RU')}</div>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                  </div>
                )
              })}
            </div>
            <div className={styles.ticketPage__chatInput}>
              <TextArea
                rows={2}
                placeholder="Введите сообщение..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                autoSize={{ minRows: 2, maxRows: 5 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                disabled={isCompleted}
              />
              <Button
                type="primary"
                onClick={handleSendMessage}
                loading={sendMessageMutation.isLoading}
                disabled={isCompleted}
              >
                Отправить
              </Button>
            </div>
            <Modal
              open={assignModal}
              onCancel={() => setAssignModal(false)}
              onOk={handleAssign}
              title="Назначить оператора для обращения"
              cancelText="Отмена"
            >
              <Select
                style={{ width: '100%' }}
                placeholder="Оператор"
                value={selectedOperator}
                onChange={(v) => setSelectedOperator(v)}
                options={operatorsData?.operators.map((o) => ({
                  value: o.id,
                  label: o.full_name,
                }))}
              />
            </Modal>
          </div>
        </div>
      </div>
    </SupportLayout>
  )
}
