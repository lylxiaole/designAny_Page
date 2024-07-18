import { paramType, param } from '@behaviorEngine/index'
import { deepClone, getUuid } from '@common/utils'

export class LayoutMethod {
  methodName?: string = ''
  description?: string = ''
  inParams?: param[] = []
  hasOutParam: boolean = false
  behaviorIds?: string[] = [] //行为的Id
  methodField?: string
}

class LayoutMethodCache {
  target: any
  info: LayoutMethod[] = []
}

export const allDMethodCache: LayoutMethodCache[] = []

export function DMethodAttr(info?: LayoutMethod) {
  return function (target: any, methodField: any, detail: any) {
    info.methodField = methodField

    let targetCons = target.constructor
    let findCache = allDMethodCache.find((o) => o.target === targetCons)
    if (!findCache) {
      allDMethodCache.push({ target: targetCons, info: [] })
      findCache = allDMethodCache.find((o) => o.target === targetCons)
    }
    // **************************************
    let findProp = findCache.info.find((o) => o.methodField === methodField)
    if (!findProp) {
      var newperperty = deepClone(info)
      findCache.info.push(newperperty)
    }
  }
}
export function findOrginMethods(enginLayout) {
  if (enginLayout.lyl_orginMethods && enginLayout.lyl_orginMethods.length > 0) {
    return enginLayout.lyl_orginMethods
  }

  let resMethods = []
  for (let index = 0; index < allDMethodCache.length; index++) {
    const oneDPropCache = allDMethodCache[index]
    if (enginLayout == oneDPropCache.target || enginLayout.prototype instanceof oneDPropCache.target || enginLayout.prototype == oneDPropCache.target) {
      resMethods = oneDPropCache.info.concat(resMethods)
    }
  }
  enginLayout.lyl_orginMethods = deepClone(resMethods)
  return enginLayout.lyl_orginMethods
}
