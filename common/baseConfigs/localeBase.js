import { createI18n } from 'vue-i18n'

import messages from './i18n'
import 'moment/locale/zh-cn'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en'

let i18nlocal = null

export function initLocale() {
  if (i18nlocal) {
    return i18nlocal
  }
  i18nlocal = createI18n({
    locale: en,
    fallbackLocale: zhCn,
    messages
  })
  i18nlocal.global.locale = 'zh-cn'
  return i18nlocal
}

export function getLocale() {
  if (!i18nlocal) {
    initLocale()
  }
  return i18nlocal.global
}
