import { createRouter, createWebHistory, RouteRecordRaw, Router } from 'vue-router'

import { routes } from './baseInfo'

// ***********************路由注册*************************************
let routeConfigs = []
let currentRoute: Router = null
export function initRoutes(inroutes) {
  let newroutes = routes.concat(inroutes)
  routeConfigs = newroutes

  const currentRoute = createRouter({
    history: createWebHistory('/'),
    routes: routeConfigs,
    scrollBehavior: () => ({ y: 0 } as any)
  })

  return currentRoute
}

export function getRoutes() {
  return routeConfigs
}

export function getCurrentRoute() {
  return currentRoute
}
