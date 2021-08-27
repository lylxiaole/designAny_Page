import Vue from 'vue'
import _axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import initSystem, { getRoutes, getConfig } from '@src/baseConfigs'
// ***********系统环境初始化*********************************
let configs = (await _axios.get('configs.json')).data
import routes from './routes'
import appState from './appState'
let system = initSystem(routes, configs, appState)
// **************创建应用******************************
require('@/assets/css/iconfont.css')
// require('@/assets/css/main.css')
// require('@/assets/css/color-dark.css')
import App from './views/App.vue'

const app = new Vue({
  el: '#app',
  render: (h) => h(App)
})
window.console.log('app', app)

// ***************添加应用插件*****************************
import installElementPlus from '@src/plugins/elementPc'
installElementPlus(app)
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(system.router)
app.use(system.store)
app.mount('#app')
