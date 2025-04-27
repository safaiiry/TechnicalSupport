import { UploadOutlined } from '@ant-design/icons'
import { Modal, Form, Select, Input, Upload, Button } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { RcFile } from 'antd/es/upload'
import styles from './RequestForm.module.less'

type RequestFormProps = {
  open: boolean
  onClose: () => void
}

const typeOptions = [
  { value: 'Инцидент', label: 'Инцидент' },
  { value: 'Запрос', label: 'Запрос' },
]

const priorityOptions = [
  { value: 'Высокий', label: 'Высокий' },
  { value: 'Средний', label: 'Средний' },
  { value: 'Низкий', label: 'Низкий' },
]

const beforeUpload = (file: RcFile) => {
  const isLt20M = file.size / 1024 / 1024 < 20
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
  ]

  if (!isLt20M) {
    console.error('File must be smaller than 20MB!')
    return false
  }

  if (!allowedTypes.includes(file.type)) {
    console.error('File type not supported!')
    return false
  }

  return false // Prevent automatic upload
}

export const RequestForm = ({ open, onClose }: RequestFormProps) => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal title="Создание заявки" open={open} onCancel={onClose} footer={null} width={800} className={styles.modal}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <Form.Item label="Тип обращения" name="type" rules={[{ required: true, message: 'Выберите тип обращения' }]}>
            <Select options={typeOptions} placeholder="Выберите тип обращения" />
          </Form.Item>

          <Form.Item label="Приоритет" name="priority" rules={[{ required: true, message: 'Выберите приоритет' }]}>
            <Select options={priorityOptions} placeholder="Выберите приоритет" />
          </Form.Item>
        </div>

        <Form.Item
          label="Контактное лицо"
          name="contact"
          rules={[{ required: true, message: 'Введите контактное лицо' }]}
        >
          <Input placeholder="Введите ФИО контактного лица" />
        </Form.Item>

        <Form.Item label="Телефон" name="phone" rules={[{ required: true, message: 'Введите номер телефона' }]}>
          <Input placeholder="Введите номер телефона" />
        </Form.Item>

        <Form.Item label="Описание" name="description" rules={[{ required: true, message: 'Введите описание' }]}>
          <TextArea rows={4} placeholder="Опишите проблему или запрос" style={{ resize: 'none' }} maxLength={2048} />
        </Form.Item>

        <Form.Item
          label="Файлы"
          name="attachments"
          extra="Размер файла не должен превышать 20МБ. Поддерживаемые форматы: doc, docx, xls, xlsx, pdf, jpg, jpeg"
        >
          <Upload beforeUpload={beforeUpload} maxCount={5} multiple className={styles.upload}>
            <Button icon={<UploadOutlined />}>Прикрепить файлы</Button>
          </Upload>
        </Form.Item>

        <div className={styles.footer}>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="primary" htmlType="submit">
            Создать заявку
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
