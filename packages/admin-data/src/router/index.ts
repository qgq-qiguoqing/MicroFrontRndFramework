import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
/**
 * 编辑路由信息时字段name对应的值要和文件名一致，因为在vue3中会自动把文件名赋值给页面的name
 * 在处理页面缓存时需要用到页面的name
 *  */
export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'app',
        redirect: '/pageOne'
    },
    {
        path: '/pageOne',
        name: 'page1',
        component: () => import('@/page/page1.vue'),
        meta: {
            title: '子页面1'
        }
    },
    {
        path: '/pageTwo',
        name: 'page2',
        component: () => import('@/page/page2.vue'),
        meta: {
            title: '子页面2'
        }
    },
    {
        path: '/pageThree',
        name: 'page3',
        component: () => import('@/page/page3.vue'),

        meta: {
            title: '子页面3',
            parent: '/pageTwo',
        }
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
router.beforeEach((to) => {

    let paths = routes.map(it => it.path)
    if (!paths.includes(to.path)) {
        return false
    }
})
// export default router 