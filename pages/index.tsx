import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import css from '../styles/Home.module.scss'
import Typing from '../components/Typing'
import { useCallback, useEffect, useRef, useState } from 'react'
import LETTERS from '../constants/LETTERS'

import path from 'path'
import { readFileSync } from 'fs'

type Letter = {
  value: string
  status: string
}

export type ArticleList = Letter[]

type Props = {
  article: string
}

type User = {
  id: string
  name: string
  articleList: ArticleList
  currentIndex: number
}

type Users = User[]

const Home: NextPage<Props> = ({ article }) => {
  const initArticleList = useCallback((article: string) => {
    const articleList = []
    for (let letter of article) {
      articleList.push({
        value: letter,
        status: 'undone',
      })
    }

    return articleList
  }, [])

  const [users, setUsers] = useState<Users>([
    {
      id: '1',
      name: '张三',
      articleList: initArticleList(article),
      currentIndex: 0,
    },
    {
      id: '2',
      name: '李四',
      articleList: initArticleList(article),
      currentIndex: 0,
    },
  ])
  const ws = useRef<any>(null)

  const handleMessage = useCallback(
    ({ data, isSelf }: { data: string; isSelf: boolean }) => {
      console.log(data)

      const updateId = '2'

      const nextUsers = users.map(user => {
        const { id, articleList, currentIndex } = user
        if (id === updateId) {
          const { value } = articleList[currentIndex]

          if (data === 'Backspace') {
            const nextIndex = currentIndex - 1

            return {
              ...user,
              currentIndex: nextIndex,
              articleList: articleList.map((letter, index) =>
                index === nextIndex ? { ...letter, status: 'undone' } : letter
              ),
            }
          }

          const nextStatus = value === data ? 'right' : 'wrong'

          return {
            ...user,
            currentIndex: currentIndex + 1,
            articleList: articleList.map((letter, index) =>
              index === currentIndex
                ? { ...letter, status: nextStatus }
                : letter
            ),
          }
        }

        return user
      })

      setUsers(nextUsers)
    },
    [users]
  )

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3002/')

    ws.current.onopen = function () {
      console.log('open')
    }
  }, [])

  useEffect(() => {
    ws.current.onmessage = function (message: { data: string }) {
      handleMessage(JSON.parse(message.data))
    }
  }, [handleMessage])

  useEffect(() => {
    const keydownListener = ({ key }: { key: string }) => {
      if (!LETTERS.includes(key)) {
        return
      }

      ws.current.send(key)
    }

    document.addEventListener('keydown', keydownListener)

    return () => document.removeEventListener('keydown', keydownListener)
  }, [])

  return (
    <>
      <Head>
        <title>打字比赛</title>
      </Head>

      <main className={css.playground}>
        {users.map(user => (
          <Typing articleList={user.articleList} key={user.id} />
        ))}
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
