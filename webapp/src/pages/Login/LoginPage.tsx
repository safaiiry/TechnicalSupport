import { Form, Input, Button, Checkbox } from 'antd'
import GornyEmblem from '../../assets/GornyAuthEmblem.svg?react'
import styles from './LoginPage.module.less'

export const LoginPage = () => {
  const [form] = Form.useForm()

  const handleSubmit = (values: { login: string; password: string }) => {
    console.info('Данные входа:', values)
    // TODO: интеграция с бекендом
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.leftPane} />
      <div className={styles.rightPane}>
        <GornyEmblem />
        <h3>Техническая поддержка Горного Университета</h3>

        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Form.Item label="Имя пользователя" name="login" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Пароль" name="password" rules={[{ required: true }]}>
            <Input.Password style={{ height: 50 }} />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Запомнить меня</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
