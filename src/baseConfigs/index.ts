import { initConfig, getConfigByName } from './configBase'
import { initRoutes, getRoutes } from './routeBase'
import { initStore, getStore } from './vuexBase'
import { initLocale } from './localeBase'

import '../themeBase/global.less'

export default function initSystem(inroutes, configs, state) {
  initConfig(configs)
  let router = initRoutes(inroutes)
  let store = initStore(state)
  let i18n = initLocale()
  return { router, store, i18n }
}

export { getConfigByName }
export { getRoutes }
export { getStore }

export interface IRouteClass {
  meta?: any
  icon?: string
  name?: string
  path?: string
  redirect?: string
  hidden?: boolean
  component?: any
  children?: any[]
}
