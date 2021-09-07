import Vue from 'vue'

import VueI18n from 'vue-i18n'
import localeEN from 'element-ui/lib/locale/lang/en' // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import localeZH from 'element-ui/lib/locale/lang/zh-CN' // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import messages from './i18n'

import 'moment/locale/zh-cn'
Vue.use(VueI18n)

export function initLocale() {
  const i18n = new VueI18n({
    locale: localeZH.name,
    fallbackLocale: localeEN.name,
    messages
  })
  return i18n
}
