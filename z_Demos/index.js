import Vue from 'vue'
import _axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import initSystem, { getRoutes, getConfig } from '@src/baseConfigs'
import { readJsonFile } from '@src/utils'
// ***********系统环境初始化*********************************
let configs = window.__globalConfig
import routes from './routes'
import appState from './appState'
let system = initSystem(routes, configs, appState)
// **************创建应用******************************
import Vant from 'vant'
require('vant/lib/index.css')
Vue.use(Vant)

import App from './views/App.vue'
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router: system.router,
  store: system.store,
  i18n: system.i18n,
  render: (h) => h(App)
})
