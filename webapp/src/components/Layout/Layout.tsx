import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { Layout as AntLayout, Tooltip } from 'antd'
import React, { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import GornyEmblem from '../../assets/GornyEmblem.svg?react'
import { getItem, removeItem } from '../../lib/storage'
import styles from './Layout.module.less'

const { Header, Content } = AntLayout

type ISupportLayout = {
  children: ReactNode
}

export const SupportLayout: React.FC<ISupportLayout> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const role = getItem('role')

  const handleLogout = () => {
    localStorage.removeItem('token')
    removeItem('token')
    removeItem('role')
    removeItem('full_name')
    removeItem('user_id')
    navigate('/login')
  }

  return (
    <AntLayout className={styles.layout}>
      <Header className={styles.layout__header}>
        <GornyEmblem style={{ marginTop: '6px' }} />
        <div className={styles.layout__nav}>
          {role === 'user' && (
            <Link
              to="/"
              className={`${styles.layout__navItem} ${location.pathname === '/' ? styles.layout__navItem_active : ''}`}
            >
              Обратиться за помощью
            </Link>
          )}
          <Link
            to="/my-tickets"
            className={`${styles.layout__navItem} ${location.pathname === '/my-tickets' ? styles.layout__navItem_active : ''}`}
          >
            Мои обращения
          </Link>
          {role === 'chief' && (
            <Link
              to="/analytics"
              className={`${styles.layout__navItem} ${location.pathname === '/analytics' ? styles.layout__navItem_active : ''}`}
            >
              Аналитика
            </Link>
          )}
          <Link
            to="/faq"
            className={`${styles.layout__navItem} ${location.pathname === '/faq' ? styles.layout__navItem_active : ''}`}
          >
            FAQ
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.layout__user}>
            <UserOutlined />
          </div>
          <div className={styles.layout__user} onClick={handleLogout}>
            <Tooltip title="Выйти">
              <LogoutOutlined />
            </Tooltip>
          </div>
        </div>
      </Header>
      <Content className={styles.layout__content}>{children}</Content>
    </AntLayout>
  )
}

export default SupportLayout
