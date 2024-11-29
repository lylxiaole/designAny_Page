import { getUuid } from '@common/utils'
import { EngineLayout, EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { actFuncBase, resourceFuncAttr, funcCode, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import platform from '@design-any/interface/dist/enums/platform'

import { actionObj, object_InParam } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { isPromise } from '@vue/shared'

@resourceFuncAttr('Parent Layout Method', '', funcGroup.resoucesInParentPage, funcCode.methodsInParentPage, platform.compContent, [], null)
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

    let topPage = this.currentPage.topLayout as EnginePage
    if (topPage.Id === layoutId) {
      targetLayout = topPage
    } else {
      targetLayout = topPage.findLayoutRecursion(layoutId, topPage.children)
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

@resourceFuncAttr('Parent Layout Property', '', funcGroup.resoucesInParentPage, funcCode.propertiesInParentPage, platform.compContent, [{ key: getUuid(), name: 'input' }], { key: getUuid(), name: 'output' })
export class propertiesInParentPage implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let { layoutId, propField } = this.currentActObj.resourceFilter
    let targetLayout: EngineLayout = null

    let topPage = this.currentPage.topLayout as EnginePage

    if (topPage.Id === layoutId) {
      targetLayout = topPage
    } else {
      targetLayout = topPage.findLayoutRecursion(layoutId, topPage.children)
    }

    if (inparams[0]) {
      targetLayout[propField] = inparams[0].val
    }

    return targetLayout[propField]
  }
}

// @resourceFuncAttr('Parent Layout Behavior', '', funcGroup.resoucesInParentPage, funcCode.behaviorsInParentPage, platform.universal, [], null)
// export class behaviorsInParentPage implements actFuncBase {
//   currentActObj: actionObj
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async excute(inparams: object_InParam[]) {
//     let { layoutId, propField } = this.currentActObj.resourceFilter
//     let targetLayout: EngineLayout = null
//     if (this.currentPage.Id === layoutId) {
//       targetLayout = this.currentPage
//     } else {
//       targetLayout = this.currentPage.findLayoutRecursion(layoutId, this.currentPage.children)
//     }

//     if (inparams[0]) {
//       targetLayout[propField] = inparams[0].val
//     }

//     return targetLayout[propField]
//   }
// }
