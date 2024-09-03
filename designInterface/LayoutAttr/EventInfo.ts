import { factory } from '../bahaviorEngine/actionFactory'
import { param } from '../bahaviorEngine/behavior'
import { deepClone, getUuid } from '../utils/index'
import { EngineLayout, EnginePage } from '../LayoutInterface'

//布局的事件所包含的行为列表
export class LayoutEventBehaviors {
  eventName: string //布局的事件名称
  behaviorIds: string[] = [] //行为的Id
}

export class LayoutEvent {
  eventName?: string = ''
  description?: string = ''
  inParams?: param[] = []
  hasOutParam: boolean = false
  eventField?: string
}
class LayoutEventCache {
  target: any
  info: LayoutEvent[] = []
}

export const allEventCache: LayoutEventCache[] = []
function isPromise(obj: any): obj is Promise<any> {
  return obj instanceof Promise || (obj && typeof obj.then === 'function')
}
export function DEventAttr(info: LayoutEvent) {
  return function(target: EngineLayout, eventField: any, desc: any) {
    // ******重写方法，使方法和行为绑定********************************************
    const original = desc.value

    desc.value = function emitter(...args: any[]) {
      const emit = async (returnValue: any) => {
        let currentLayout = this as EngineLayout
        if (currentLayout.isDesigning == false) {
          let findEvent = currentLayout.behaviorBinds.find((o) => o.eventName === info.eventName)
          if (!findEvent) {
            return
          }

          let topPage = currentLayout.topLayout as EnginePage
          for (let index = 0; index < topPage.behaviors.length; index++) {
            const behav = topPage.behaviors[index]
            if (findEvent.behaviorIds.indexOf(behav.id) > -1) {
              let actFactory = new factory(currentLayout, topPage, behav)
              await actFactory.exacteAction()
            }
          }
        }
      }

      //
      const returnval: any = original.apply(this, args)
      if (isPromise(returnval)) {
        returnval.then(emit)
      } else {
        emit(returnval)
      }
      return returnval
    }
    // **************************************************
    info.eventField = eventField
    let targetCons = target.constructor
    let findCache = allEventCache.find((o) => o.target === targetCons)
    if (!findCache) {
      allEventCache.push({ target: targetCons, info: [] })
      findCache = allEventCache.find((o) => o.target === targetCons)
    }
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
