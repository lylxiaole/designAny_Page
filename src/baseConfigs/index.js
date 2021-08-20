import { initConfig, getConfig } from './configBase'
import { initRoutes, getRoutes } from './routeBase'
import { IRouteClass } from './routeClass'

import '../themeBase/global.less'

export default function initSystem(inroutes, configs) {
  initConfig(configs)
  initRoutes(inroutes)
}

export function getConfigByName(configName) {
  const configs = getConfig()
  // window.console.log('getConfigByName:', configs)
  // window.console.log('getConfigByName:', configs)
  const config = configs[configName]
  // window.console.log('getConfigByName:', encodeURI(config))
  if (config) {
    return config
  } else {
    throw new Error(`从配置文件中读取指定配置:${configName} 失败...`)
  }
}

export { getRoutes } from './routeBase'
export { getConfig } from './configBase'
export { IRouteClass }
