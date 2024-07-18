import { paramType, param } from '@behaviorEngine/index'
import { deepClone, getUuid } from '@common/utils'

//布局的事件所包含的行为列表
export class LayoutEventBehaviors {
  eventName: string //布局的事件名称
  behaviorIds: string[] = [] //行为的Id
}

export class LayoutEvent {
  eventName?: string = ''
  description?: string = ''
  inParams?: param[] = []
  outParam?: param = null
  behaviorIds?: string[] = [] //行为的Id
  eventField?: string
}
class LayoutEventCache {
  target: any
  info: LayoutEvent[] = []
}

export const allEventCache: LayoutEventCache[] = []
export function DEventAttr(info: LayoutEvent) {
  return function (target: any, eventField: any, desc: any) {
    info.eventField = eventField
    let targetCons = target.constructor
    let findCache = allEventCache.find((o) => o.target === targetCons)
    if (!findCache) {
      allEventCache.push({ target: targetCons, info: [] })
      findCache = allEventCache.find((o) => o.target === targetCons)
    }
    // **************************************
    let findProp = findCache.info.find((o) => o.eventField === eventField)
    if (!findProp) {
      var newperperty = deepClone(info)
      findCache.info.push(newperperty)
    }
  }
}

export function findOrginEvents(enginLayout) {
  if (enginLayout.lyl_orginEvents && enginLayout.lyl_orginEvents.length > 0) {
    return enginLayout.lyl_orginEvents
  }

  let resEvents = []
  for (let index = 0; index < allEventCache.length; index++) {
    const oneDPropCache = allEventCache[index]
    if (enginLayout == oneDPropCache.target || enginLayout.prototype instanceof oneDPropCache.target || enginLayout.prototype == oneDPropCache.target) {
      resEvents = oneDPropCache.info.concat(resEvents)
    }
  }

  enginLayout.lyl_orginEvents = deepClone(resEvents)
  return enginLayout.lyl_orginEvents
}
