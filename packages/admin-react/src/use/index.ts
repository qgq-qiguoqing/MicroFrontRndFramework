
export const setLocalStorage = (name: string, v: any) => {


    localStorage.setItem(name, v)
}
export const getLocalStorage = (name: string) => {

    return localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name) || "") : null
}

export const setNavList = (nav: any) => {
    // let navList= getLocalStorage('navList')?JSON.parse(getLocalStorage('navList')||''):[]
    // let path
    localStorage.setItem('navList', JSON.stringify(nav))
}

export const getNavList = () => {
    return JSON.parse(localStorage.getItem('navList') || '[]')
}