import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import fetch from '@/axios'
import { Divider, Avatar, Badge } from 'antd'
import { LikeTwoTone, LikeOutlined } from '@ant-design/icons'
import { getLocalStorage } from '@/use/index'
import './style.css'
const Details: React.FC = () => {
  const [content, setContent] = useState<any>({})
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isLeft, setIsLeft] = useState(true)
  const [likes, setLikes] = useState(0)
  const [isLike, setIsLike] = useState(false)
  const { id } = useParams()
  const getNumber = () => {
    fetch({
      api: 'like/getNumber',
      para: {
        id: content.id,
      },
    }).then((res: any) => {
      setLikes(res)
    })
  }
  const getIsLike = () => {
    fetch({
      api: 'like/getUserLike',
      para: {
        id: content.id,
      },
    }).then((res: any) => {
      setIsLike(res)
    })
  }
  async function getDetails() {
    try {
      setLoading(true)
      let res: any = await fetch({
        api: '/article/getContent',
        para: {
          id,
        },
      })
      setContent(res)
      let res2: any = await fetch({
        api: '/article/getList',
        para: {
          email: res.authorEmail,
          nameID: '',
          title: '',
          pagerIndex: 1,
          pagerSize: 999,
        },
      })
      setList(res2.list)
      getNumber()
      getIsLike()
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetails()
    const isMobile = /Mobile|iPhone|Android/i.test(navigator.userAgent)
    if (isMobile) {
      setIsLeft(false)
    } else {
      setIsLeft(true)
    }
  }, [])
  window.addEventListener('resize', () => {
    if (window.innerWidth < 750) {
      setIsLeft(false)
    } else {
      setIsLeft(true)
    }
  })
  const Sidebar = () => (
    <aside className="w-80 p-5 bg-white ml-2  overflow-x-hidden">
      <div className="text-xl text-slate-950	 mb-6">往期文章</div>
      <div className="w-full cursor-pointer">
        {list &&
          list.map((item: any) => (
            <Link to={'/blog/article/details/' + item.id} key={item.id}>
              <p
                style={{ fontSize: '14px' }}
                className=" text-slate-700 truncate pb-3">
                {item.title}
              </p>
            </Link>
          ))}
      </div>
    </aside>
  )
  const setLike = () => {
    fetch({
      api: '/like/set',
      para: {
        id,
        userName: getLocalStorage('userInfo').username,
        userEmail: getLocalStorage('userInfo').email,
      },
    }).then(() => {
      getNumber()
      getIsLike()
    })
  }
  return (
    <>
      <div className="flex h-full ">
        <div className="h-2/4 flex flex-col justify-center mr-5 cursor-pointer">
          <div style={{ left: '0px', zIndex: 999 }}>
            <Badge count={likes} overflowCount={999}>
              {isLike ? (
                <LikeTwoTone
                  onClick={() => {
                    setLike()
                  }}
                  style={{
                    fontSize: '26px',
                  }}
                />
              ) : (
                <LikeOutlined
                  onClick={() => {
                    setLike()
                  }}
                  style={{
                    fontSize: '26px',
                  }}
                />
              )}
            </Badge>
          </div>
        </div>
        <div className="overflow-x-hidden overflow-y-auto h-full bg-white  p-11 flex-1">
          <div className="text-3xl text-slate-950	 text-center mb-6">
            {content.title}
          </div>
          <div className="mt-10 flex items-center w-full">
            {content?.author && (
              <Avatar src={<img src={content?.author.avatar} alt="avatar" />} />
            )}
            <div className="ml-2">
              <p className="text-amber-500 text-sm">
                {content.author && content.author.username}
              </p>
              <p className="text-slate-600 text-sm">
                {content.updateTime && content.updateTime.split('T')[0]}
              </p>
            </div>
          </div>
          <Divider />
          <div
            className="box"
            dangerouslySetInnerHTML={{ __html: content.content }}></div>
        </div>

        {isLeft ? <Sidebar></Sidebar> : ''}
      </div>
    </>
  )
}
export default Details
