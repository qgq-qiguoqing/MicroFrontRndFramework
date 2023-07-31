import { ref, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { routes } from '@/router/index'
import { navigateToPage } from './index'

export function keepRoute() {
    const router = useRouter()
    const route = useRoute()
    let include = ref<Array<string>>([])
    function onGoPage(v: string, query: any) {
        let path = routes.map((e: any) => e.path)

        if (path.includes(v)) {
            router.replace({
                path: v,
                query,
            })
            let r = routes.filter((it) => it.path == v)[0].name as string
            if (!include.value.includes(r)) {
                include.value.push(r)
            }
        }
    }
    function addEvent() {
        nextTick(() => {
            window.top?.addEventListener('navigateToOther', (e: any) => {
                if (e && e.detail) {
                    if (e.detail.baseUrl && e.detail.baseUrl == 'vuePackage') {
                        try {
                            onGoPage(e.detail.url, e.detail.query)
                        } catch (error) {
                            console.log(error, 'error')
                        }
                    }
                }
            })
            // 页面关闭清除缓存
            window.top?.addEventListener('closeRoute', (e: any) => {
                if (e && e.detail) {
                    if (e.detail.baseUrl && e.detail.baseUrl == 'vuePackage') {
                        let r = routes.filter((it) => it.path == e.detail.url)[0]
                        include.value = include.value.filter((it) => it != r.name)
                    }
                }
            })
        })
        watch(route, (v) => {
            if (v) {
                navigateToPage(v.path, v.query)
            }
        })
    }
    return {
        include,
        onGoPage,
        addEvent,
        route,
        router,
        routes,
    }
}

export function filterRouter() { }
