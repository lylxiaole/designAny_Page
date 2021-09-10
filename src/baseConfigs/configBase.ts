import { configs } from './baseInfo'
export interface config {
  apiAddr?: string
  LOGINED_USER_SESSION?: string
}

let localConfigs: any = {}

export function initConfig(iconfigs: any) {
  window.console.log('initConfig:', iconfigs)
  let cloneconfig = { ...configs } as any
  for (const key in iconfigs) {
    cloneconfig[key] = iconfigs[key] as any
  }
  localConfigs = cloneconfig
}

export function getConfig() {
  return localConfigs
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
