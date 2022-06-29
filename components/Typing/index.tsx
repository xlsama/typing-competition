import type { NextPage } from 'next'
import css from './index.module.scss'
import type { ArticleList } from '../../pages'

type Props = {
  articleList: ArticleList
}

const Typing: NextPage<Props> = ({ articleList }) => {
  return (
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
  )
}

export default Typing
