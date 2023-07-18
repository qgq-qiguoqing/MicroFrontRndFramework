import { lazy } from 'react'
import {
  HighlightOutlined,
  BarsOutlined,
  UserOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
// import addArticle from '../pages/admin/articleManagement/AddArticle'
export const adminRouters = [
  {
    path: '/admin',
    Component: lazy(() => import('../pages/admin/index')),
    // errorElement: <ErrorPage />,
    // icon: <UploadOutlined />,
    title: '后台管理',
    meta: {},

    children: [
      {
        path: '/admin/classification',
        Component: lazy(
          () => import('../pages/admin/ClassificationManagement')
        ),
        title: '分类管理',
        icon: <BarsOutlined />,
      },
      {
        path: '/admin/article',
        Component: lazy(() => import('../pages/admin/articleManagement/List')),
        title: '文章管理',
        icon: <FileTextOutlined />,
      },
      {
        path: '/admin/article/add',
        Component: lazy(
          () => import('../pages/admin/articleManagement/AddArticle')
        ),
        parent: '/admin/article',
        title: '添加文章',
        display: true,
      },
      {
        path: '/admin/article/edit',
        Component: lazy(
          () => import('../pages/admin/articleManagement/AddArticle')
        ),
        title: '编辑文章',
        display: true,
      },
      {
        path: '/admin/personal',
        Component: lazy(() => import('../pages/admin/personal/Index')),
        title: '个人中心',
        icon: <UserOutlined />,
      },
      {
        path: '/admin/background',
        Component: lazy(() => import('../pages/admin/BManagement')),
        title: '背景管理',
        icon: <HighlightOutlined />,
      },
    ],
  },
]
