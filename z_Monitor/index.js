import Vue from 'vue'
import _axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import initSystem from '@src/baseConfigs'
import registerRouteHook from './serviceAPIs/routerHook'

// ***********系统环境初始化*********************************
let configs = window.__globalConfig
import routes from './routes'
import appState from './appState'
let system = initSystem(routes, configs, appState)
registerRouteHook(system.router, system.store)
// **************创建应用******************************
import Element from 'element-ui'
require('element-ui/lib/theme-chalk/index.css')
Vue.use(Element)
// **************创建应用******************************
import App from './views/App.vue'
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router: system.router,
  store: system.store,
  i18n: system.i18n,
  render: (h) => h(App)
})
