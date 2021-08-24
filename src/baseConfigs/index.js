import { initConfig, getConfigByName } from './configBase'
import { initRoutes, getRoutes } from './routeBase'
import { IRouteClass } from './routeClass'
import { initStore } from './storeBase'

import '../themeBase/global.less'

export default function initSystem(inroutes, configs, state) {
  initConfig(configs)
  let router = initRoutes(inroutes)
  let store = initStore(state)

  return { router, store }
}

export { getConfigByName }
export { getRoutes }
export { IRouteClass }
