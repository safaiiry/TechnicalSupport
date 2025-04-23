import { UserOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React, { ReactNode } from 'react'
import styles from './Layout.module.less'

const { Header, Content } = Layout

type ISupportLayout = {
  children: ReactNode
}

export const SupportLayout: React.FC<ISupportLayout> = ({ children }) => {
  return (
    <Layout className={styles.layoutContainer}>
      <Header className={styles.layoutHeader}>
        <div className={styles.layoutTitle}>IT-отдел Горного университета</div>
        <UserOutlined />
      </Header>

      <Menu mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">Доступные заявки</Menu.Item>
        <Menu.Item key="2">Справочная информация</Menu.Item>
      </Menu>

      <Content className={styles.layoutContent}>{children}</Content>
    </Layout>
  )
}

export default SupportLayout
