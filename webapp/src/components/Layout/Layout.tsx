import { UserOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React, { ReactNode } from 'react'

const { Header, Content } = Layout

type ISupportLayout = {
  children: ReactNode
}

export const SupportLayout: React.FC<ISupportLayout> = ({ children }) => {
  return (
    <Layout>
      <Header
        style={{
          background: 'linear-gradient(to right, #0d3c84, #1e88e5)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Техническая поддержка</div>
        <UserOutlined style={{ color: '#fff', fontSize: 18 }} />
      </Header>

      <Menu mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">Доступные заявки</Menu.Item>
        <Menu.Item key="2">Справочная информация</Menu.Item>
      </Menu>

      <Content style={{ padding: '24px', backgroundColor: '#fff', minHeight: 'calc(100vh - 112px)' }}>
        {children}
      </Content>
    </Layout>
  )
}

export default SupportLayout
