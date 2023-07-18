import { router } from '../router/index'
export function navigateToPage(v: string, query?: any) {
    let routes = [...router]
    let title = ''
    let parentUrl = ''

    function getTitle(n: any[]) {
        n.forEach((it) => {
            if (it.path.includes(v)) {
                title = it.title
                parentUrl = it.parent
            }
            if (it.children) {
                getTitle(it.children)
            }
        })
    }
    getTitle(routes)
    window.top?.postMessage(
        {
            origin: 'blog',
            url: v,
            query: query,
            title: title,
            parentUrl
        },
        '*'
    )
}
export function navigateToPageTwo(v: string, query?: any) {
    let routes = [...router]
    let title = ''
    let parentUrl = ''
    function getTitle(n: any[]) {
        n.forEach((it) => {
            if (it.path == v) {
                title = it.title
                parentUrl = it.parent
            }
            if (it.children) {
                getTitle(it.children)
            }
        })
    }
    getTitle(routes)
    window.top?.postMessage(
        {
            origin: 'admin',
            url: v,
            query: query,
            title: title,
            parentUrl
        },
        '*'
    )
}
