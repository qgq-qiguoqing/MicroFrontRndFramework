import { useEffect, Suspense } from 'react'
import './App.css'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { router } from './router'

const App: React.FC = () => {
  const Loading = () => (
    <>
      <div className="flex items-center justify-center min-h-screen loadsvg">
        <div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin "></div>
        <p className="ml-2">loading...</p>
      </div>
    </>
  )
  const routerViews = (routerItems: any[]) => {
    if (routerItems && routerItems.length) {
      return routerItems.map(({ path, Component, children, redirect }) => {
        return children && children.length ? (
          <Route
            path={path}
            key={path}
            element={
              <Suspense fallback={<Loading />}>
                <Component></Component>
              </Suspense>
            }>
            {routerViews(children)} // 递归遍历子路由
            {redirect ? (
              <Route path={path} element={<Navigate to={redirect} />}></Route>
            ) : (
              <Route
                path={path}
                element={<Navigate to={children[0].path} />}></Route>
            )}
          </Route>
        ) : (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<Loading />}>
                <Component></Component>
              </Suspense>
            }></Route>
        )
      })
    }
  }

  return (
    <Router>
      <Routes>{routerViews(router)}</Routes>
    </Router>
  )
}

export default App
