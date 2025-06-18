import { Collapse } from 'antd'
import SupportLayout from '../../components/Layout/Layout'
import styles from './FAQPage.module.less'

const { Panel } = Collapse

const faqItems = [
  {
    key: '1',
    question: 'Как отправить обращение?',
    answer:
      'Перейдите на страницу "Обратиться за помощью", выберите категорию и заполните форму заявки. После отправки вы можете следить за своим обращением во вкладке "Мои Обращения".',
  },
  {
    key: '2',
    question: 'Где посмотреть статус моей заявки?',
    answer:
      'Во вкладке "Мои обращения" отображается список всех ваших заявок и их текущий статус. Вы также можете открыть заявку, чтобы увидеть историю переписки.',
  },
  {
    key: '3',
    question: 'Что делать, если я не нашёл нужную категорию?',
    answer:
      'Напишите письмо на support@spmi.ru или обратитесь в 2316 аудиторию главного корпуса. Мы постараемся помочь и добавим недостающую категорию.',
  },
  {
    key: '4',
    question: 'Как изменить личные данные в профиле?',
    answer:
      'Изменение данных выполняет оператор технической поддержки. Уточните необходимую правку через вашу текущую заявку или создайте новую.',
  },
  {
    key: '5',
    question: 'Забыл пароль от системы. Что делать?',
    answer: 'Обратитесь к администратору системы для сброса пароля.',
  },
]

export const FAQPage = () => {
  return (
    <SupportLayout>
      <div className={styles.faqPage}>
        <h1 className={styles.title}>Часто задаваемые вопросы</h1>
        <Collapse accordion className={styles.collapse}>
          {faqItems.map((item) => (
            <Panel header={item.question} key={item.key}>
              <p>{item.answer}</p>
            </Panel>
          ))}
        </Collapse>
      </div>
    </SupportLayout>
  )
}

export default FAQPage
