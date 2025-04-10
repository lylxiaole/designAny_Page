import { getUuid } from '@common/utils'
import { EngineLayout, EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { actFuncBase, resourceFuncAttr, funcCode, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import platform from '@design-any/interface/dist/enums/platform'

import { actionObj, object_InParam } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { isPromise } from '@vue/shared'
import { toRaw } from 'vue'

@resourceFuncAttr('Parent Layout Method', '', funcGroup.resoucesInParentPage, funcCode.methodsInParentPage, platform.tableCell, [], null)
export class methodsInParentPage implements actFuncBase {
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

    let parentPage = this.currentPage.parentLayout as EnginePage
    if (parentPage.Id === layoutId) {
      targetLayout = parentPage
    } else {
      targetLayout = parentPage.findLayoutRecursion(layoutId, parentPage.children)
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

@resourceFuncAttr('Parent Layout Property', '', funcGroup.resoucesInParentPage, funcCode.propertiesInParentPage, platform.tableCell, [{ key: getUuid(), name: 'input' }], { key: getUuid(), name: 'output' })
export class propertiesInParentPage implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let { layoutId, propField } = this.currentActObj.resourceFilter
    let targetLayout: EngineLayout = null

    let parentPage = this.currentPage.parentLayout as EnginePage

    if (parentPage.Id === layoutId) {
      targetLayout = parentPage
    } else {
      targetLayout = parentPage.findLayoutRecursion(layoutId, parentPage.children)
    }

    if (inparams[0]) {
      targetLayout[propField] = inparams[0].val
    }

    return targetLayout[propField]
  }
}

@resourceFuncAttr('Parent Layout Behavior', '', funcGroup.resoucesInParentPage, funcCode.behaviorsInParentPage, platform.tableCell, [], null)
export class behaviorsInParentPage implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let { behaviorId } = this.currentActObj.resourceFilter
  }
}

@resourceFuncAttr('Page Context', '', funcGroup.resoucesInPage, funcCode.pageContext, platform.tableCell, [], null)
export class pageContext implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let { contextKey } = this.currentActObj.resourceFilter

    let context = this.currentPage.pageContext.find((o) => o.key === contextKey)
    if (!context) {
      return null
    }
    if (inparams[0]) {
      let val = inparams[0].val
      context.val = toRaw(val)
    }

    return toRaw(context.val)
  }
}
