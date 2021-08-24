import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './baseInfo'

// ***********************路由钩子处理*************************************
const router_beforeEach = async (to, from, next) => {
  // if (to.name !== 'Login' && !isAuthenticated)
  // next({ name: 'Login' })
  // else next()
  next()
}
const router_beforeResolve = async (to) => {
  return true
  // TODO 获取数据或执行任何其他操作（如果用户无法进入页面时你希望避免执行的操作）的理想位置。
}

const router_afterEach = async (to, from, failure) => {
  if (!failure) {
    // TODO  分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用。
  }
}
// ***********************路由注册*************************************

let routeConfigs = []
export function initRoutes(inroutes) {
  let newroutes = routes.concat(inroutes)
  routeConfigs = newroutes
  window.console.log('routeConfigs:', routeConfigs)
  let router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes: routeConfigs // `routes: routes` 的缩写
  })
  router.beforeEach(router_beforeEach)
  router.beforeResolve(router_beforeResolve)
  router.afterEach(router_afterEach)

  return router
}

export function getRoutes() {
  return routeConfigs
}
