import { lazy } from 'react'
import ErrorPage from '../pages/error-page'
import { UploadOutlined } from '@ant-design/icons'
import { adminRouters } from './admin'
export const router = [
  {
    path: '/',
    Component: lazy(() => import('../pages/home/index')),
    errorElement: <ErrorPage />,
    icon: <UploadOutlined />,
    title: '首页',
    meta: {},

    redirect: '/blog/home',
    children: [
      {
        path: '/blog/home',
        Component: lazy(() => import('../pages/home/Home')),
        title: '首页',
        meta: {},
      },
      {
        path: '/blog/article/details/:id',
        parent: '/blog/home',
        Component: lazy(() => import('../pages/home/Details')),
        title: '详情',
      },
    ],
    //   {
    //     path: '/pager1',
    //     Component: lazy(() => import('../pages/content')),
    //     title: '页面1',
    //     meta: {},
    //   },
    //   {
    //     path: '/pager2',
    //     Component: lazy(() => import('../pages/content')),
    //     title: '页面2',
    //     meta: {},
    //   },
    // ],
  },
  // {
  //   path: '/home',
  //   Component: lazy(() => import('../pages/home/index')),
  //   title: '首页',
  //   meta: {},
  // },

  {
    path: '/login',
    title: '登录',
    Component: lazy(() => import('../pages/login/index')),
  },
  ...adminRouters,
]
// const Routes = () => useRoutes(router)
// export default Routes
// export default router
