import Vue from 'vue'

import Element from 'element-ui'
import VueI18n from 'vue-i18n'

import 'element-ui/lib/theme-chalk/index.css'
import localeEN from 'element-ui/lib/locale/lang/en' // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import localeZH from 'element-ui/lib/locale/lang/zh-CN' // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import messages from './i18n'
Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: localeZH.name,
  fallbackLocale: localeEN.name,
  messages
})
Vue.config.productionTip = false

export default (app) => {
  app.use(Element, { locale: localeZH })
  app.use(i18n)
}
