import { Card, Row, Col, Spin } from 'antd'
import SupportLayout from '../../components/Layout/Layout'
import { trpc } from '../../lib/trpc'
import styles from './MainPage.module.less'

export const MainPage = () => {
  const { data, isLoading, isError, error } = trpc.getCategories.useQuery()
  const categories = data?.categories ?? []

  if (isLoading) {
    return (
      <SupportLayout>
        <Spin size="large" />
      </SupportLayout>
    )
  }

  if (isError) {
    return (
      <SupportLayout>
        <p>Ошибка загрузки: {error.message}</p>
      </SupportLayout>
    )
  }

  return (
    <SupportLayout>
      <div className={styles.mainPage}>
        <Row gutter={[16, 16]} justify="center">
          {categories.map((category) => (
            <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
              <Card hoverable className={styles.categoryCard}>
                <div className={styles.categoryTitle}>{category.name}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </SupportLayout>
  )
}
