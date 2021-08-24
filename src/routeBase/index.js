import { HashRouter, BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import React, { Suspense, lazy } from 'react'
import Loadable from 'react-loadable'

const routes = [
  {
    title: '错误页',
    icon: '',
    hidden: true,
    path: '/error',
    component: require('@src/views/Error').default
  }
]

const createRoute = (routes) => {
  return (
    <Switch>
      {routes.map((route, index) => createFixRoute(route, index))}
      <Redirect from="/*" to="/" />
    </Switch>
  )
}
//该组件通过递归的方式，将所有route中带有children路由的父路由进行解构,最终用createBasicRoute函数来渲染
const createFixRoute = (route, index) => {
  const { path, component: RouteComponent, children } = route
  if (children) {
    return (
      <Route
        key={index}
        path={path}
        children={(props) => {
          let redirectPath = null
          return (
            <RouteComponent {...props}>
              <Switch>
                {children.map((child, index2) => {
                  const { path: childPath, redirect } = child
                  if (redirect) {
                    redirectPath = childPath
                  }
                  return createFixRoute({ ...child, path: path + childPath }, `${index}-${index2}`)
                })}
                <Redirect from={`${path}`} to={`${path}${redirectPath || children[0].path}`} />
              </Switch>
            </RouteComponent>
          )
        }}
      />
    )
  } else {
    return createBasicRoute(route, index)
  }
}

const createBasicRoute = (route, index) => {
  //  最基础的Router 用法
  const { path, component: Component } = route
  return (
    <Route
      exact
      key={index}
      path={path}
      component={(props) => {
        props.history.listen((path) => {
          //  路由监听
        })
        return <Component {...props} />
      }}
    />
  )
}

export default function concatRoute(inroutes) {
  let newroutes = routes.concat(inroutes)

  return (
    <Suspense fallback={<div />}>
      <HashRouter children={createRoute(newroutes)} />
    </Suspense>
  )
}
