import { Outlet, useNavigate } from 'react-router-dom'
import { router } from '../router'
import type { MenuProps } from 'antd'
import React from 'react'
import { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { Layout, Menu, theme, Button } from 'antd'
const { Header, Content, Footer, Sider } = Layout
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
const items: any[] = []

const getMenu = (e: any[]) => {
  e.forEach((item: any) => {
    if (item?.title) {
      items.push(item)
    }
    if (item?.children?.length) {
      getMenu(item?.children)
    }
  })
}
getMenu(router)
const rotuers: any[] = router[0].children || []
const App: React.FC = () => {
  const [nav, setNav] = useState<any[]>([rotuers[0]])
  const [collapsed, setCollapsed] = useState(false)
  const [selectNav, setSelectNav] = useState<string[]>(['/home'])
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const navigate = useNavigate()
  // 导航
  const dealMenu = (e: string) => {
    navigate(e, { replace: true })
    setSelectNav([e])
    const path: string[] = nav && nav.length ? nav.map((it) => it.path) : []
    items.forEach((item) => {
      if (nav.length) {
        if (!path.includes(item.path)) {
          if (item.path === e) {
            item.active = true
            setNav([
              ...nav.map((it) => {
                it.active = false
                return it
              }),
              item,
            ])
          }
        } else {
          // if(i>-1){
          setNav([
            ...nav.map((it) => {
              if (it.path == e) {
                it.active = true
              } else {
                it.active = false
              }
              return it
            }),
          ])
        }
        // }
      } else {
        if (item.path === e) {
          item.active = true
          setNav([item])
        }
      }
    })
  }
  const onMenu: MenuProps['onClick'] = (e) => {
    dealMenu(e.key)
  }
  // 头部导航
  const onNav: any['onClick'] = (e: string) => {
    dealMenu(e)
  }
  //  删除头部导航
  const onClose: any['onClick'] = (path: string) => {
    const paths: string[] = nav && nav.length ? nav.map((it) => it.path) : []
    let i = paths.indexOf(path)
    if ((i = paths.length - 1)) {
      setSelectNav([paths[i - 1]])
      setNav(
        nav
          .map((it, index) => {
            if (index == i - 1) {
              it.active = true
            } else {
              it.active = false
            }
            return it
          })
          .filter((it) => it.path != path)
      )
      navigate(paths[i - 1], { replace: true })
    } else if (i < paths.length - 1) {
      setSelectNav([paths[i + 1]])
      navigate(paths[i + 1], { replace: true })

      setNav(
        nav
          .map((it, index) => {
            if (index == i + 1) {
              it.active = true
            } else {
              it.active = false
            }
            return it
          })
          .filter((it) => it.path != path)
      )
    }
  }
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          onClick={onMenu}
          selectedKeys={selectNav}
          defaultSelectedKeys={['/home']}
          items={rotuers
            .filter((it: any) => it.meta)
            .map((item: any) =>
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
          style={{
            padding: 0,

            background: colorBgContainer,
          }}>
          <Button
            type={'text'}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '14px',
              border: 0,
              borderRadius: 0,
              boxShadow: 'none',
            }}
          />
        </Header>
        <Content style={{ margin: '0px 24px 16px ' }} className="flex flex-col">
          <div
            className="flex items-center shadow-md  "
            style={{ margin: ' 0 -24px 10px', padding: '10px ' }}>
            {nav && nav.length
              ? nav.map((it) => {
                  return (
                    <div
                      onClick={(e) => {
                        onNav(it.path)
                        e.stopPropagation()
                      }}
                      style={{
                        lineHeight: 1,
                        color: it.active ? 'rgb(22, 119, 255)' : '',
                      }}
                      className="w-20 h-9 cursor-pointer flex items-center justify-center bg-white mr-2 rounded active_hover"
                      key={it.path}>
                      {it.title}
                      {it.active && it.path != '/home' ? (
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
          <div
            className="rounded-md overflow-hidden shadow-lg"
            style={{
              padding: 24,
              height: '100%',
              width: '100%',
              flex: 1,
              background: colorBgContainer,
            }}>
            {/* <TransitionRoutes> */}
            <Outlet></Outlet>
            {/* </TransitionRoutes> */}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>2023年5月30日开始搭建</Footer>
      </Layout>
    </Layout>
  )
}

export default App
