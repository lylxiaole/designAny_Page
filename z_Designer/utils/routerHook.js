import NProgress from 'nprogress' // progress bar
import { Message } from 'element-ui'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login', '/auth-redirect', '/register'] // no redirect whitelist
let currentRouter = null
let currentStore = null
// ***********************路由钩子处理*************************************

const router_beforeEach = async (to, from, next) => {
  window.console.log('router_beforeEach:', to)
  // start progress bar
  NProgress.start()
  // set page title
  document.title = to.meta.title
  // determine whether the user has logged in
  const hasToken = currentStore.state.system.token
  // window.console.log('to router before:', hasToken)
  if (hasToken) {
    await hasTokenOption(to, from, next)
  } else {
    await noTokenOption(to, from, next)
  }
}

const router_afterEach = async (to, from, failure) => {
  NProgress.done()
}

async function hasTokenOption(to, from, next) {
  if (to.path === '/login') {
    /**指定到login路由 */
    // if is logged in, redirect to the home page
    next({ path: '/' })
    NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    return
  }
  // determine whether the user has obtained his permission roles through getInfo
  if (currentStore.state.system.machineId) {
    /**已经登录并且有用户信息，指定到其它路由 */
    next()
    return
  }

  try {
    // next({ ...to, replace: true })
    next()
  } catch (error) {
    console.error('页面跳转时发生错误', error)
    // remove token and go to login page to re-login
    await currentStore.dispatch('user/resetToken')
    Message.error(error || 'Has Error')
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
}
async function noTokenOption(to, from, next) {
  /* has no token*/
  if (whiteList.indexOf(to.path) !== -1) {
    // in the free login whitelist, go directly
    next()
  } else {
    // other pages that do not have permission to access are redirected to the login page.
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
}

export default function registerRouteHook(router, store) {
  currentRouter = router
  currentStore = store
  router.beforeEach(router_beforeEach)
  router.afterEach(router_afterEach)
}
