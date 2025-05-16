import { getUuid } from '@common/utils'
import { EngineLayout, EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { resourceFuncAttr, funcCode, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import platform from '@design-any/interface/dist/enums/platform'

import { actionObj, object_InParam } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { isPromise } from '@vue/shared'
import { getLocale } from '@common/baseConfigs'
import fontActFuncBase from '../fontFuncBase'

// *************************************************************************
@resourceFuncAttr(getLocale().t('behav.LayoutMethod'), '', funcGroup.resoucesInPage, funcCode.methodsInPage, platform.universal, [], null)
export class methodsInPageMethod implements fontActFuncBase {
  currentActObj: actionObj
  currentBehavior: behavior

  currentLayout: EngineLayout
  currentPage: EnginePage

  async excute(inparams: object_InParam[]) {
    var params: any[] = []
    inparams.filter((o) => {
      params.push(o.val)
    })
    // ********************************
    let { layoutId, methodField } = this.currentActObj.resourceFilter
    let targetLayout: EngineLayout = null
    if (this.currentPage.Id === layoutId) {
      targetLayout = this.currentPage
    } else {
      targetLayout = this.currentPage.findLayoutRecursion(layoutId, this.currentPage.children)
    }

    if (!targetLayout) {
      window.console.error('Component not found')
      return
    }

    // ****调用**************
    let result = targetLayout[methodField].apply(targetLayout, params)
    if (isPromise(result)) {
      return await result
    } else {
      return result
    }
  }
}

@resourceFuncAttr(getLocale().t('behav.LayoutProperty'), '', funcGroup.resoucesInPage, funcCode.propertiesInPage, platform.universal, [{ key: getUuid(), name: 'input' }], { key: getUuid(), name: 'output' })
export class propertiesInPageMethod implements fontActFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let { layoutId, propField } = this.currentActObj.resourceFilter
    let targetLayout: EngineLayout = null
    if (this.currentPage.Id === layoutId) {
      targetLayout = this.currentPage
    } else {
      targetLayout = this.currentPage.findLayoutRecursion(layoutId, this.currentPage.children)
    }

    if (inparams[0]) {
      targetLayout[propField] = inparams[0].val
    }

    return targetLayout[propField]
  }
}

@resourceFuncAttr(getLocale().t('behav.LayoutBehavior'), '', funcGroup.resoucesInPage, funcCode.behaviorsInPage, platform.universal, [], null)
export class behaviorsInPageMethod implements fontActFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let { behaviorId } = this.currentActObj.resourceFilter
  }
}
// *************************************************************************
@resourceFuncAttr(getLocale().t('behav.BehaviorInparam'), '', funcGroup.currentBehaviorInparam, funcCode.behaviorInparam, platform.universal, [], null)
export class behaviorInparamMethod implements fontActFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let { behaviorName } = this.currentActObj.resourceFilter
  }
}
