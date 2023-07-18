import React, { useState, useEffect } from 'react'
import fetch from '@/axios'
import { Tag, Space, Spin } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
const colors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
]
const Home: React.FC = () => {
  const [list, setList] = useState<any[]>([])
  const [hotList, setHotList] = useState<any[]>([])
  const [isH5, setIsH5] = useState(false)
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  window.addEventListener('resize', () => {
    if (window.innerWidth < 750) {
      setIsH5(true)
    } else {
      setIsH5(false)
    }
  })

  const getIndex = () => {
    fetch({
      api: '/article/getIndex',
      method: 'get',
    }).then((res: any) => {
      setList(res)
    })
  }
  useEffect(() => {
    const isMobile = /Mobile|iPhone|Android/i.test(navigator.userAgent)
    if (isMobile) {
      setIsH5(true)
    } else {
      setIsH5(false)
    }
    getIndex()
    fetch({
      api: '/article/getHot',
      method: 'get',
    }).then((res: any) => {
      setHotList(res)
    })
    fetch({
      api: 'classification/getListAll',
    }).then((res: any) => {
      setTags(res.list)
    })
  }, [])
  const Main = () => (
    <main className="container mx-auto py-8 overflow-y-auto ml-4  bg-white p-4">
      {/* <h1 className="text-3xl font-bold mb-4">最新文章</h1> */}
      {list.map((it) => {
        return (
          <article className="mb-4" key={it.id}>
            <h2 className="text-2xl font-bold truncate ">{it.title}</h2>
            <p className="text-gray-700 truncate py-2">{it.abstract}</p>
            <Link
              to={'/blog/article/details/' + it.id}
              className="text-blue-500 hover:underline">
              阅读更多
            </Link>
          </article>
        )
      })}

      {/* <article className="mb-4">
            <h2 className="text-2xl font-bold">文章标题</h2>
            <p className="text-gray-700">文章摘要</p>
            <Link to="/article" className="text-blue-500 hover:underline">
              阅读更多
            </Link>
          </article> */}
    </main>
  )
  const getList = (id: string) => {
    setLoading(true)
    fetch({
      api: '/article/getList',
      para: {
        pagerIndex: 1,
        pagerSize: 999,
        nameID: [id],
      },
    })
      .then((res: any) => {
        setLoading(false)
        setList(res.list)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const Sidebar = () => (
    <aside className="w-1/4  bg-white ">
      <div className=" p-4">
        <h2 className="text-xl font-bold mb-2">热门文章</h2>
        <ul className="space-y-2 truncate w-full overflow-y-auto">
          {hotList.map((it) => {
            return (
              <li key={it.id} className="truncatetext-gray-700	truncate ">
                <Link
                  className="text-gray-700	"
                  to={`/blog/article/details/${it.id}`}>
                  {it.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* 更多侧边栏内容... */}
    </aside>
  )
  return (
    <>
      <div className="px-5">
        <Space wrap className="cursor-pointer">
          <Tag color="#87d068" onClick={() => getIndex()}>
            全部
          </Tag>
          {tags.map((it, index) => {
            let color =
              index < colors.length
                ? colors[index]
                : colors[index - colors.length]
            return (
              <Tag
                key={it.nameID}
                onClick={() => getList(it.nameID)}
                color={color}>
                {it.name}
              </Tag>
            )
          })}
        </Space>
      </div>
      <div className="flex h-full p-5 rounded">
        {isH5 ? '' : <Sidebar />}

        <Main />
      </div>
    </>
  )
}
export default Home
