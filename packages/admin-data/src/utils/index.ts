import { routes } from '../router/index.ts'
export function navigateToPage(v: string, query?: any) {
    let title = ''
    let parentUrl = ''
    function getTitle(n: any[]) {
        n.forEach(it => {
            if (it.path === v) {
                title = it.meta.title
                parentUrl = it.meta.parent
            }
            if (it.children) {
                getTitle(it.children)
            }
        });
    }
    getTitle(routes)
    window.top?.postMessage(
        {
            origin: 'vuePackage',
            url: v,
            query: query,
            title: title,
            parentUrl,
        },
        '*'
    )
}