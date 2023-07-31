import { ref, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/router'
import { closeRoute } from '@/utils/jumper.ts'

export function dealRoute() {
    const router = useRouter()
    const route = useRoute()
    const tabs = ref<Array<any>>([])
    const urls = computed(() => {
        return tabs.value.length ? tabs.value.map((e: any) => e.url) : []
    })
    tabs.value = JSON.parse(window.localStorage.getItem('tabs') || '[]')
    function onGo(v: string) {
        router.push(v)
    }
    // tab栏的操作
    function dealTabs(v: string, parent?: string) {

        let n = urls.value.indexOf(v)
        if (n == -1) {
            let children = routes[0].children as any[]
            let r = children?.map((it) => it.path)
            let i = r?.indexOf(v)

            if (i > -1) {
                if (parent) {
                    let j = urls.value.indexOf(parent)

                    tabs.value.splice(j + 1, 0, {
                        url: v,
                        title: children[i]?.meta?.title,
                    })
                    setTabs(j + 1)
                } else {
                    tabs.value.push({
                        url: v,
                        title: children[i]?.meta?.title,
                    })
                    setTabs(tabs.value.length - 1)
                }
            }
        } else {
            setTabs(n)
        }
    }

    function onTab(v: any, i: number) {
        router.push(v.url)
        setTabs(i)
    }
    function onClose(v: string, i: number) {
        let r = v.split('/').filter((it) => it)
        let len = tabs.value.length

        if (i === len - 1 && i != 0) {
            router.push(tabs.value[i - 1].url)
        } else if (i != 0) {
            router.push(tabs.value[i + 1].url)
        }
        tabs.value.splice(i, 1)
        if (tabs.value.length == 0) {
            router.push('/')
        }
        window.localStorage.setItem('tabs', JSON.stringify(tabs.value))
        closeRoute(r[0], '/' + r[1])
    }
    function setTabs(i: number) {
        tabs.value = tabs.value.map((it) => {
            it.activated = false
            return it
        })
        tabs.value[i].activated = true
        window.localStorage.setItem('tabs', JSON.stringify(tabs.value))
    }
    function addWatch() {
        nextTick(() => {
            router.afterEach((v) => {
                if (!v.params.pathName) {
                    if (v.query.parent || v.params.parent) {
                        let parent = (v.query.parent || v.params.parent) as string
                        dealTabs(v.path, parent)
                    } else {
                        dealTabs(v.path)
                    }
                }
            })
            // 收集子应用发过来的路由信息 通知主应用改变浏览器地址
            window.top?.addEventListener('message', (e) => {

                if (e.data.url) {

                    let url = e.data.url.includes(e.data.origin)
                        ? e.data.url
                        : '/' + e.data.origin + e.data.url
                    if (tabs.value.length) {
                        // let urls = tabs.value.map((e: any) => e.url)
                        let i = urls.value.indexOf(route.path)
                        tabs.value = tabs.value.map((it) => {
                            it.activated = false
                            return it
                        })
                        if (!urls.value.includes(url)) {
                            if (e.data.parentUrl) {
                                // 判断是否是页面的操作页面 如果是页面的操作页面则根据父页面的url判断位置，添加
                                let parentUrl = ''
                                // if (route.path.includes(e.data.origin)) {
                                //     parentUrl = e.data.parentUrl
                                // } else {
                                parentUrl = '/' + e.data.origin + e.data.parentUrl
                                // }
                                let j = urls.value.indexOf(parentUrl)

                                if (j > -1) {

                                    tabs.value.splice(j + 1, 0, {
                                        url: url,
                                        title: e.data.title,
                                        query: e.data.query,
                                        activated: true,
                                    })
                                }
                            } else {
                                tabs.value.push({
                                    url: url,
                                    title: e.data.title,
                                    query: e.data.query,
                                    activated: true,
                                })
                            }
                        } else if (tabs.value[i]) {
                            tabs.value[i].activated = true
                        }
                    } else {
                        tabs.value.push({
                            url: url,
                            title: e.data.title,
                            query: e.data.query,
                        })
                    }
                    window.localStorage.setItem('tabs', JSON.stringify(tabs.value))
                    if (route.path !== e.data.url && !route.path.includes(e.data.url)) {
                        router.replace({
                            path: url,
                            query: e.data.query,
                        })
                    }
                }
            })
        })
    }
    return {
        tabs,
        route,
        router,
        onGo,
        addWatch,
        closeRoute,
        onTab,
        onClose,
        setTabs,
        dealTabs,

    }
}
