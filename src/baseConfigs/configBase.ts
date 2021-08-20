import zhMessages from 'devextreme/localization/messages/zh.json'
import jaMessages from 'devextreme/localization/messages/ja.json'
import enMessages from 'devextreme/localization/messages/en.json'
import zhExtraMessages from '../locales/zh-CN.json'
import { locale, loadMessages } from 'devextreme/localization'
import { configs } from './baseInfo'
export interface config {
  apiAddr?: string
  LOGINED_USER_SESSION?: string
}

let localConfigs: any = {}

export function initConfig(iconfigs: any) {
  let cloneconfig = { ...configs } as any
  for (const key in iconfigs) {
    cloneconfig[key] = iconfigs[key] as any
  }
  localConfigs = cloneconfig
  // devextreme组件国际化.加载所有国际化字典,并根据浏览器语言自动设置.
  loadMessages(zhMessages)
  loadMessages(enMessages)
  loadMessages(jaMessages) // 日语
  loadMessages(zhExtraMessages) //补充官方缺失的部分中文字典
  locale(navigator.language)
}

export function getConfig() {
  return localConfigs
}
