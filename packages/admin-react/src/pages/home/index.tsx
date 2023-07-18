import {
  Link,
  Outlet,
  useParams,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import './style.css'
import { UserOutlined } from '@ant-design/icons'
import { Input, Dropdown } from 'antd'
import TransitionRoutes from '@/components/TransitionRoutes'
import type { MenuProps } from 'antd'
import fetch from '@/axios/index'
import { navigateToPage } from '@/utils/index'

const Index: React.FC = () => {
  const { Search } = Input
  const params = useParams()
  const location = useLocation()
  const [isH5, setIsH5] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<MenuProps['items']>([
    {
      key: '1',

      label: <div>请输入内容点击搜索</div>,
    },
  ])
  const [backgroundUrl, setBackgroundUrl] = useState('')
  const navigate = useNavigate()

  window.top?.addEventListener('navigateToOther', (e: any) => {
    if (e && e.detail) {
      if (e.detail.baseUrl && e.detail.baseUrl == 'blog') {
        try {
          navigate('/' + e.detail.baseUrl + e.detail.url, { replace: true })
        } catch (error) {
          console.log(error, 'error')
        }
      }
    }
  })
  window.addEventListener('resize', () => {
    if (window.innerWidth < 750) {
      setIsH5(true)
    } else {
      setIsH5(false)
    }
  })
  useEffect(() => {
    console.log(location, 'location')
    navigateToPage(location.pathname)
    // document.title = '首页' // 根据路由信息修改标题
  }, [location])
  useEffect(() => {
    const isMobile = /Mobile|iPhone|Android/i.test(navigator.userAgent)

    if (isMobile) {
      setIsH5(true)
    } else {
      setIsH5(false)
    }
    fetch({
      api: 'backgroundImage/get',
    }).then((res: any) => {
      setBackgroundUrl(res.url)
    })
  }, [])
  useEffect(() => {
    console.log(params, location)
  }, [params])
  const onSearch = (value: string) => {
    setLoading(true)
    fetch({
      api: '/article/getList',
      para: {
        title: value,
        pagerIndex: 1,
        pagerSize: 999,
      },
    })
      .then((res: any) => {
        if (res.list && res.list.length > 0) {
          setItems(
            res.list.map((item: any) => {
              return {
                key: item.id,
                label: (
                  <Link
                    replace
                    className="text-gray-700	"
                    to={`/blog/article/details/${item.id}`}>
                    {item.title}
                  </Link>
                ),
              }
            })
          )
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const Header = () => (
    <header className=" p-4 header_box">
      <nav className="container mx-auto flex justify-between items-center">
        <Link replace to="/" className="text-slate-800	 font-bold text-xl">
          个人博客
        </Link>
        <ul className="flex space-x-4">
          <li className="flex justify-center items-center">
            <Dropdown menu={{ items }}>
              <Search
                loading={loading}
                placeholder="请输入搜索内容"
                onSearch={onSearch}
                className="w-30"
              />
            </Dropdown>
          </li>
          {!isH5 ? (
            <>
              {/* <li>
                <Link to="/" className="text-slate-800	 hover:text-violet-700	">
                  首页
                </Link>
              </li> */}
              {/* <li>
                <Link
                  to="/contact"
                  className="text-slate-800	 hover:text-violet-700	">
                  联系方式
                </Link>
              </li> */}
            </>
          ) : (
            ''
          )}
          <li className="flex justify-center items-center">
            <Link
              replace
              to="/admin/article"
              className="text-gray-300 hover:text-violet-700	 flex align-center justify-center">
              <UserOutlined style={{ fontSize: '2rem', fontWeight: 500 }} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )

  const Footer = () => (
    <footer className="py-4">
      {/* <nav className="container mx-auto flex justify-center">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-gray-300 hover:text-white">
            首页
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-gray-300 hover:text-white">
            关于我
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-gray-300 hover:text-white">
            联系方式
          </Link>
        </li>
      </ul>
    </nav> */}
      <p className="text-center text-gray-300 ">版权信息 © 2023</p>
    </footer>
  )

  return (
    <div
      className={`w-screen h-screen flex flex-col ${
        backgroundUrl ? 'home' : 'bg-slate-100'
      }`}
      style={{
        background: backgroundUrl ? `url(${backgroundUrl}) no-repeat` : '',
      }}>
      <Header />

      <div className="flex-1 container mx-auto  mt-28 w-3/4 overflow-hidden">
        <TransitionRoutes>
          <Outlet />
        </TransitionRoutes>
      </div>
      <Footer />
    </div>
  )
}

export default Index
