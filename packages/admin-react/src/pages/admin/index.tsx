import React, { useEffect, useState } from 'react'
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectNavList, increment } from '@/store/navSlice'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloseOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme, Dropdown } from 'antd'
import { adminRouters } from '@/router/admin'
import type { MenuProps } from 'antd'
import { navigateToPageTwo } from '@/utils/index'

// import { getNavList, setNavList } from '@/use/index'
// import TransitionRoutes from '../../components/TransitionRoutes'
type MenuItem = Required<MenuProps>['items'][number]
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: any[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const { Header, Sider, Content } = Layout
const routers: any[] =
  adminRouters[0].children.filter((it) => !it.display) || []

const App: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const navList = useSelector(selectNavList)
  const [nav, setNav] = useState<any[]>([])
  const [collapsed, setCollapsed] = useState(false)
  const [selectNav, setSelectNav] = useState<string[]>([
    '/admin/classification',
  ])
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  window.top?.addEventListener('navigateToOther', (e: any) => {
    if (e && e.detail) {
      if (e.detail.baseUrl && e.detail.baseUrl == 'admin') {
        try {
          navigate('/' + e.detail.baseUrl + e.detail.url, { replace: true })
        } catch (error) {
          console.log(error, 'error')
        }
      }
    }
  })
  useEffect(() => {
    navigateToPageTwo(location.pathname)
    // document.title = '首页' // 根据路由信息修改标题
  }, [location])
  useEffect(() => {
    setNav(JSON.parse(JSON.stringify(navList)))
  }, [navList])
  // 导航
  const dealMenu = (e: string, query?: any) => {
    navigate(e, { state: query, replace: true })
    setSelectNav([e])

    const path: string[] = nav && nav.length ? nav.map((it) => it.path) : []
    let navLists: any[] = []
    if (!path.includes(e)) {
      routers.forEach((item) => {
        if (nav.length) {
          if (!path.includes(e)) {
            if (item.path === e) {
              navLists = [
                ...nav.map((it) => {
                  it.active = false
                  it.isClose = false
                  return it
                }),
                { ...item, isClose: false, active: true },
              ]
            }
          }
        } else {
          if (item.path === e) {
            navLists = [
              {
                ...item,
                isClose: false,
                active: true,
              },
            ]
          }
        }
      })
    } else {
      navLists = [
        ...nav.map((it) => {
          if (it.path == e) {
            it.active = true
          } else {
            it.active = false
          }
          it.isClose = false
          return it
        }),
      ]
    }
    setNav(navLists)
    dispatch(increment(JSON.parse(JSON.stringify(navLists))))

    // setNavList([...nav])
  }
  const onMenu: MenuProps['onClick'] = (e) => {
    dealMenu(e.key)
  }
  // 头部导航
  const onNav: any['onClick'] = (e: any) => {
    dealMenu(e.path, e.query)
  }
  //  删除头部导航
  const onClose: any['onClick'] = (path: string) => {
    const paths: string[] = nav && nav.length ? nav.map((it) => it.path) : []
    let i = paths.indexOf(path)
    let navLists: any[] = []
    if (i == paths.length - 1) {
      // navigate(paths[i - 1])
      if (!nav[i - 1]) {
        navigate(routers[0].path, { replace: true })
        setSelectNav(routers[0].path)
      } else {
        navigate(nav[i - 1].path, { state: nav[i - 1].query, replace: true })
        setSelectNav([paths[i - 1]])
      }

      navLists = nav
        .map((it, index) => {
          if (index == i - 1) {
            it.active = true
          } else {
            it.active = false
          }
          return it
        })
        .filter((it) => it.path != path)

      // dispatch(increment(JSON.parse(JSON.stringify(nav))))
    } else if (i < paths.length - 1) {
      setSelectNav([paths[i + 1]])
      navigate(nav[i + 1].path, { state: nav[i + 1].query, replace: true })
      navLists = nav
        .map((it, index) => {
          if (index == i + 1) {
            it.active = true
          } else {
            it.active = false
          }
          return it
        })
        .filter((it) => it.path != path)
    }
    setNav(navLists)
    dispatch(increment(JSON.parse(JSON.stringify(navLists))))
    // setNavList([...nav])
  }
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div
          onClick={() => {
            localStorage.clear()
          }}>
          <Link to={'/login'}>退出登录</Link>
        </div>
      ),
    },
  ]
  return (
    <div>
      <Layout style={{ height: '100vh', width: '100vw' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            onClick={onMenu}
            selectedKeys={selectNav}
            defaultSelectedKeys={['/admin/classification']}
            items={routers.map((item: any) =>
              getItem(
                item?.title,
                item.path,
                item.icon,
                item.children && item.children.length
                  ? item.children.map((it: any) => {
                      return getItem(it?.title, it.path, it?.icon)
                    })
                  : ''
              )
            )}
          />
        </Sider>
        <Layout>
          <Header
            style={{ padding: 0, background: colorBgContainer }}
            className="flex items-center  justify-between ">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                boxShadow: 'none',
              }}
            />
            <Dropdown menu={{ items }} placement="bottom" className="mr-2">
              <UserOutlined style={{ fontSize: '2rem', fontWeight: 500 }} />
            </Dropdown>
          </Header>
          <div
            className="flex items-center shadow-md "
            style={{ margin: ' 0 ', padding: '10px ' }}>
            {nav && nav.length
              ? nav.map((it) => {
                  return (
                    <div
                      onClick={(e) => {
                        onNav(it)
                        e.stopPropagation()
                      }}
                      onMouseEnter={(e) => {
                        setNav([
                          ...nav.map((item: any) => {
                            if (it.path == item.path) {
                              it.isClose = true
                            }
                            return item
                          }),
                        ])

                        e.stopPropagation()
                      }}
                      onMouseLeave={(e) => {
                        setNav([
                          ...nav.map((item: any) => {
                            item.isClose = false
                            return item
                          }),
                        ])

                        e.stopPropagation()
                      }}
                      style={{
                        lineHeight: 1,
                        color: it.active ? 'rgb(22, 119, 255)' : '',
                      }}
                      className=" h-9 cursor-pointer flex items-center justify-center bg-white mr-2 rounded active_hover p-2"
                      key={it.path}>
                      {it.title}
                      {it.isClose ? (
                        <CloseOutlined
                          className="ml-2"
                          onClick={(e) => {
                            onClose(it.path)
                            e.stopPropagation()
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  )
                })
              : ''}
          </div>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: '12px',
            }}>
            <Outlet></Outlet>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default App
