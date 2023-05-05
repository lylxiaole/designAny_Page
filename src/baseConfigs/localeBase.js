import Vue from 'vue'
import { createI18n } from 'vue-i18n'

import messages from './i18n'
import 'moment/locale/zh-cn'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en'

export function initLocale() {
  const i18n = createI18n({
    locale: zhCn,
    fallbackLocale: en,
    messages
  })
  return i18n
}
