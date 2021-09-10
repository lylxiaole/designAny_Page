import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './baseInfo'

Vue.use(Router)

// ***********************路由注册*************************************
let routeConfigs = []
let currentRoute = {}
export function initRoutes(inroutes) {
  let newroutes = routes.concat(inroutes)
  routeConfigs = newroutes
  currentRoute = new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: routeConfigs
  })

  return currentRoute
}

export function getRoutes() {
  return routeConfigs
}

export function getCurrentRoute() {
  return currentRoute
}
