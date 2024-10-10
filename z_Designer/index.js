import { createApp } from 'vue'
import _axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import initSystem, { getRoutes, getConfig } from '@common/baseConfigs'
import registerRouteHook from './utils/routerHook'
// **************引用element Plus******************************
require('@common/assets/iconfont1/iconfont.css')
require('@common/assets/iconfont1/iconfont.js')
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// ************加载vxetable*********************************************
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
// ***********系统环境初始化*********************************
let configs = window.__globalConfig

import routes from './routes'
import appState from './appState'
let system = initSystem(routes, configs, appState)
system.store.commit('system/set_permission_routes', getRoutes())
registerRouteHook(system.router, system.store)
// ****************************************************
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')
// ************加载外部组件*************************************
// import '@/extand_components/designany.basiccomps.min.css'
// import '@/extand_components/designany.basiccomps.min.js'
import '@/extand_components/index.js'
// ***********初始化设计引擎************************************
import { init as designEngineInit } from '@designEngine/index'
designEngineInit(apiAddr())
// ***********初始化行为引擎**************************************
import { GetAll } from '@common/apis/designDictionary'
import { GetGroupApisAll } from '@common/apis/designThirtyApi'
import { GetGroupFuncsAll } from '@common/apis/designJSFunc'
import { init as behaviorEngineInit } from '@behaviorEngine/index'
behaviorEngineInit(apiAddr(), GetAll, GetGroupApisAll, GetGroupFuncsAll)
// *****************************************************
import App from './views/App.vue'
// ***************************************************
import contextmenu from 'v-contextmenu'
import 'v-contextmenu/dist/themes/default.css'
// *********************************************************
var currentApp = createApp(App)
currentApp.use(ElementPlus)
currentApp.use(VXETable)
currentApp.use(contextmenu)
currentApp.use(system.router)
currentApp.use(system.store)
currentApp.use(system.i18n)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  currentApp.component(key, component)
}

currentApp.mount('#app')
