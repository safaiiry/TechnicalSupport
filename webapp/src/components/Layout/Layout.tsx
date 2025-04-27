import { UserOutlined } from '@ant-design/icons'
import { Layout as AntLayout } from 'antd'
import React, { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import GornyEmblem from '../../assets/GornyEmblem.svg?react'
import styles from './Layout.module.less'

const { Header, Content } = AntLayout

type ISupportLayout = {
  children: ReactNode
}

export const SupportLayout: React.FC<ISupportLayout> = ({ children }) => {
  const location = useLocation()

  return (
    <AntLayout className={styles.layout}>
      <Header className={styles.layout__header}>
        <GornyEmblem />
        <div className={styles.layout__nav}>
          <Link
            to="/new-ticket"
            className={`${styles.layout__navItem} ${location.pathname === '/new-ticket' ? styles.layout__navItem_active : ''}`}
          >
            Обратиться за помощью
          </Link>
          <Link
            to="/"
            className={`${styles.layout__navItem} ${location.pathname === '/' ? styles.layout__navItem_active : ''}`}
          >
            Мои обращения
          </Link>
          <Link
            to="/faq"
            className={`${styles.layout__navItem} ${location.pathname === '/faq' ? styles.layout__navItem_active : ''}`}
          >
            FAQ
          </Link>
        </div>
        <div className={styles.layout__user}>
          <UserOutlined />
        </div>
      </Header>
      <Content className={styles.layout__content}>{children}</Content>
    </AntLayout>
  )
}

export default SupportLayout
