import { env } from 'echarts'
import { Message } from 'element-ui'

let currentRouter = null
let currentStore = null
// ***********************路由钩子处理*************************************
const router_beforeEach = async (to, from, next) => {
  window.console.log('router_beforeEach:', to)
  // start progress bar
  // set page title
  document.title = to.meta.title
  // determine whether the user has logged in
  // window.console.log('to router before:', hasToken)
  await hasTokenOption(to, from, next)
}

const router_afterEach = async (to, from, failure) => {}
async function hasTokenOption(to, from, next) {
  window.console.log('hasTokenOption')
  try {
    // next({ ...to, replace: true })
    if (process.env.NODE_ENV === 'development') {
      next()
    } else {
      //为了适应金陵石化的监控系统，做的改造。后期可去除
      if (window.beforeRouteChange) {
        window.beforeRouteChange(to)
      } else {
        next()
      }
    }
  } catch (error) {
    console.error('页面跳转时发生错误', error)
    // remove token and go to login page to re-login
    Message.error(error || 'Has Error')
  }
}

export default function registerRouteHook(router, store) {
  currentRouter = router
  currentStore = store
  router.beforeEach(router_beforeEach)
  router.afterEach(router_afterEach)
}
