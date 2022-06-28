import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import css from '../styles/Home.module.scss'
import { useCallback, useEffect, useState } from 'react'
import LETTERS from '../constants/LETTERS'

import path from 'path'
import { readFileSync } from 'fs'

type Letter = {
  value: string
  status: string
}

type ArticleList = Letter[]

type Props = {
  article: string
}

const Home: NextPage<Props> = ({ article }) => {
  const initArticleList = useCallback(
    (article: string) => {
      const articleList = []
      for (let letter of article) {
        articleList.push({
          value: letter,
          status: 'undone',
        })
      }

      return articleList
    },
    [article]
  )

  const [articleList, setArticleList] = useState<ArticleList>(
    initArticleList(article)
  )
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const keydownListener = ({ key }: any) => {
      // filter ctrl shift ...other, only match 26 letters and space
      if (!LETTERS.includes(key)) {
        return
      }

      const { value } = articleList[currentIndex]

      if (key === 'Backspace') {
        const nextIndex = currentIndex - 1
        setCurrentIndex(nextIndex)
        setArticleList(prevList =>
          prevList.map((item, index) =>
            index === nextIndex ? { ...item, status: 'undone' } : item
          )
        )
        return
      }

      const nextStatus = value === key ? 'right' : 'wrong'

      setArticleList(prevList =>
        prevList.map((item, index) =>
          index === currentIndex ? { ...item, status: nextStatus } : item
        )
      )
      setCurrentIndex(prevIndex => prevIndex + 1)
    }

    document.addEventListener('keydown', keydownListener)

    return () => document.removeEventListener('keydown', keydownListener)
  }, [currentIndex])

  return (
    <>
      <Head>
        <title>打字比赛</title>
      </Head>

      <main className={css.home}>
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
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const filePath = path.resolve('articles', '01.json')
  const data = readFileSync(filePath).toString()
  const { content } = JSON.parse(data)

  return {
    props: { article: content },
  }
}

export default Home
