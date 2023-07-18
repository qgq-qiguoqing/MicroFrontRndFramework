import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: '/',
        component: () => import('@/page/main.vue'),
        children: [
            {
                path: '/page1',
                name: 'page1',
                component: () => import('@/page/Page1.vue'),
                meta: {
                    title: '主应用页面1'
                }

            },
            {
                path: '/page2',
                name: 'page2',
                component: () => import('@/page/Page2.vue'),
                meta: {
                    title: '主应用页面2'
                }

            },

        ]
    },
    // 通过动态路匹配子应用
    {
        path: "/:package/:pathName?",
        name: 'main',
        component: () => import('@/page/main.vue')
    },
    // 通过动态路匹配子应用
    {
        path: "/:package/:pathName/:action?",
        name: 'main',
        component: () => import('@/page/main.vue')
    }
]
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})


