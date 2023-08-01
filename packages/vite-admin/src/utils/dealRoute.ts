import { ref, nextTick, computed, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/router'
import { closeRoute } from '@/utils/jumper.ts'
import config from '@/assets/config'
import { navigateToPage } from '@/utils/jumper.ts'
// 处理跳转和记录路由
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
    function clearTab() {
        tabs.value = []
        window.localStorage.setItem('tabs', '[]')
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
        clearTab,
    }
}
export function dealDom(rootBox: Ref<any>, parentDom: string = 'iframeBox') {
    nextTick(() => {
        window.addEventListener('resize', () => {
            // nextTick(() => {
            if (rootBox.value && rootBox.value.offsetWidth) {
                let width = rootBox.value.offsetWidth
                let height = rootBox.value.offsetHeight
                let iframeBox = document.getElementById(parentDom)
                let iframeS = iframeBox?.getElementsByTagName('iframe')
                if (iframeS) {
                    for (let i = 0; i < iframeS.length; i++) {
                        iframeS[i].width = width
                        iframeS[i].height = height
                    }
                }
            }
        })
    })
}

export function dealIframe(
    rootBox: Ref<any>,
    parentDom: string = 'iframeBox',
    mainDom: string = 'adminBox'
) {
    const router = useRouter()
    const route = useRoute()
    function onGo(p: string, v: string, actions?: string) {
        let url = import.meta.env.DEV ? config[p] : '' // 环境地址
        let reactBox: any = document.getElementById(p)
        if (reactBox && !reactBox.children.length) {
            if (rootBox.value) {
                var iframe = document.createElement('iframe')
                iframe.src = url + p + '/' + v
                iframe.width = rootBox.value?.offsetWidth
                iframe.height = rootBox.value?.offsetHeight
                iframe.id = p
                reactBox?.appendChild(iframe)
                iframe.onload = function () {
                    navigateToPage(
                        p,
                        actions ? '/' + v + '/' + actions : '/' + v,
                        route.query
                    )
                }
            }
        } else {
            navigateToPage(
                p,
                actions ? '/' + v + '/' + actions : '/' + v,
                route.query
            )
        }
    }
    // 不使用watch监听路由变化，使用钩子就需要初始化的时候进行一次手动的跳转

    function addWatch() {
        nextTick(() => {
            router.beforeEach(async (v) => {
                let p = v.params.package as string
                let iframeBox = document.getElementById(parentDom)
                let iframeS = iframeBox?.getElementsByTagName('iframe')
                if (v.params && v.params.pathName) {
                    await onGo(
                        v.params.package as string,
                        v.params.pathName as string,
                        v.params.action as string
                    )
                    const adminBox = document.getElementById(mainDom)
                    if (adminBox) {
                        adminBox.style.display = 'none'
                    }
                    if (iframeS) {
                        for (let i = 0; i < iframeS.length; i++) {
                            let parentNode = iframeS[i].parentElement
                            if (parentNode) {
                                if (parentNode.id == p) {
                                    parentNode.style.display = 'block'
                                } else {
                                    parentNode.style.display = 'none'
                                }
                            }
                        }
                    }
                } else {
                    const adminBox = document.getElementById(mainDom)
                    if (adminBox) {
                        adminBox.style.display = 'block'
                    }
                    if (iframeS) {
                        for (let i = 0; i < iframeS.length; i++) {
                            let parentNode = iframeS[i].parentElement
                            if (parentNode) {
                                parentNode.style.display = 'none'
                            }
                        }
                    }
                }
            })
        })
    }
    async function initialization() {
        const adminBox = document.getElementById(mainDom)
        if (route.params.package) {
            await onGo(
                route.params.package as string,
                route.params.pathName as string,
                route.params.action as string
            )
            let iframeBox = document.getElementById(parentDom)
            let iframeS = iframeBox?.getElementsByTagName('iframe')
            let p = route.params.package as string
            if (adminBox) {
                adminBox.style.display = 'none'
            }

            if (iframeS) {
                for (let i = 0; i < iframeS.length; i++) {
                    let parentNode = iframeS[i].parentElement
                    if (parentNode) {
                        console.log(parentNode.id, p)
                        if (parentNode.id == p) {
                            parentNode.style.display = 'block'
                        } else {
                            parentNode.style.display = 'none'
                        }
                    }
                }
            }
        } else {
            if (adminBox) {
                adminBox.style.display = 'block'
            }
            router.push(route.path)
        }
    }
    return {
        addWatch,
        onGo,
        initialization,
    }
}
