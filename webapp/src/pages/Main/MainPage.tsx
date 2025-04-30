import { Card, Row, Col, Spin } from 'antd'
import SupportLayout from '../../components/Layout/Layout'
import { trpc } from '../../lib/trpc'
import styles from './MainPage.module.less'
import { categoryIcons } from './icons'

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
        <div className={styles.header}>
          <div className={styles.title}>Чем мы можем вам помочь?</div>
          <div className={styles.subtitle}>
            Если вы не нашли интересующего Вас запроса, напишите, пожалуйста, об этом на <b>support@spmi.ru</b> или
            обратитесь в 2316 аудиторию главного корпуса.
          </div>
        </div>

        <Row gutter={[16, 16]} justify="center">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id]
            return (
              <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
                <Card hoverable className={styles.categoryCard}>
                  {Icon && <Icon className={styles.icon} />}
                  <div className={styles.categoryTitle}>{category.name}</div>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
    </SupportLayout>
  )
}
