import type { NextPage } from 'next'
import css from './index.module.scss'
import type { ArticleList } from '../../pages'

type Props = {
  articleList: ArticleList
  name: string
}

const Typing: NextPage<Props> = ({ articleList, name }) => {
  return (
    <section className={css.typing}>
      <div className={css.name}>{name}</div>
      <article className={css.article}>
        {articleList.map(({ value, status }, index) => (
          <span
            className={`${css.letter_unit} ${css[status]} ${
              value === ' ' ? css.blank : ''
            }`}
            key={index}
          >
            {value}
          </span>
        ))}
      </article>
    </section>
  )
}

export default Typing
