import { Pie, Column } from '@ant-design/plots'
import { Card, Spin, Statistic } from 'antd'
import SupportLayout from '../../components/Layout/Layout'
import { trpc } from '../../lib/trpc'
import styles from './AnalyticsPage.module.less'

export const AnalyticsPage = () => {
  const { data, isLoading, isError, error } = trpc.getAnalytics.overview.useQuery()

  if (isLoading) {
    return (
      <SupportLayout>
        <Spin size="large" />
      </SupportLayout>
    )
  }

  if (isError || !data) {
    return (
      <SupportLayout>
        <div>Ошибка: {error?.message}</div>
      </SupportLayout>
    )
  }

  const pieData = data.byOperator.map((item) => ({
    type: item.full_name,
    value: item.count,
  }))

  const columnData = data.byOperator.map((item) => ({
    name: item.full_name,
    value: item.count,
  }))

  return (
    <SupportLayout>
      <div className={styles.page}>
        <div className={styles.widgets}>
          <Card className={styles.widget}>
            <Statistic title="Всего заявок" value={data.totalTickets} />
          </Card>
          <Card className={styles.widget}>
            <Statistic title="Выполнено" value={data.completedTickets} />
          </Card>
          <Card className={styles.widget} title="Распределение заявок по операторам">
            <Pie data={pieData} angleField="value" colorField="type" legend={{ position: 'bottom' }} radius={0.8} />
          </Card>
          <Card className={styles.widget} title="Количество заявок по операторам">
            <Column
              data={columnData}
              xField="name"
              yField="value"
              legend={false}
              label={{ position: 'middle' }}
              color="#5B8FF9"
            />
          </Card>
        </div>
      </div>
    </SupportLayout>
  )
}
