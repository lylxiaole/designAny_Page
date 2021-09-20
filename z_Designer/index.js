import Vue from 'vue'
import _axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import initSystem, { getRoutes, getConfig } from '@src/baseConfigs'
import registerRouteHook from './utils/routerHook'
// ***********系统环境初始化*********************************
let configs = window.__globalConfig
import routes from './routes'
import appState from './appState'
let system = initSystem(routes, configs, appState)
system.store.commit('system/set_permission_routes', getRoutes())
registerRouteHook(system.router, system.store)
// **************创建应用******************************
require('@src/assets/iconfont1/iconfont.css')
require('@src/assets/iconfont1/iconfont.js')

import Element from 'element-ui'
require('element-ui/lib/theme-chalk/index.css')
Vue.use(Element)

import App from './views/App.vue'
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router: system.router,
  store: system.store,
  i18n: system.i18n,
  render: (h) => h(App)
})
