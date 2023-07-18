export function navigateToPage(baseUrl: string, url: string, query?: any) {
    const onGo = new CustomEvent('navigateToOther', {
        detail: { baseUrl: baseUrl, url: url, query: query },
    })

    window.top?.dispatchEvent(onGo)
}
export function closeRoute(baseUrl: string, url: string) {
    const onClose = new CustomEvent('closeRoute', {
        detail: { baseUrl: baseUrl, url: url },
    })
    window.top?.dispatchEvent(onClose)
}

