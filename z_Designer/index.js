import { createApp } from 'vue'
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

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './views/App.vue'

var currentApp = createApp(App)
currentApp.use(ElementPlus)
currentApp.use(system.router)
currentApp.use(system.store)
currentApp.use(system.i18n)

currentApp.mount('#app')
