import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './baseInfo'
Vue.use(Router)

// ***********************路由钩子处理*************************************
const router_beforeEach = async (to, from, next) => {
  // if (to.name !== 'Login' && !isAuthenticated)
  // next({ name: 'Login' })
  // else next()
  window.console.log('router_beforeEach:', from, to)
  next()
}
const router_beforeResolve = async (to) => {
  return true
  // TODO 获取数据或执行任何其他操作（如果用户无法进入页面时你希望避免执行的操作）的理想位置。
}

const router_afterEach = async (to, from, failure) => {
  if (!failure) {
    // TODO  分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用。
  } else {
    window.console.log('router_afterEach error')
  }
}
// ***********************路由注册*************************************
let routeConfigs = []
export function initRoutes(inroutes) {
  let newroutes = routes.concat(inroutes)
  routeConfigs = newroutes
  let router = new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: routeConfigs
  })

  // router.beforeEach(router_beforeEach)
  // router.beforeResolve(router_beforeResolve)
  // router.afterEach(router_afterEach)

  return router
}

export function getRoutes() {
  return routeConfigs
}
