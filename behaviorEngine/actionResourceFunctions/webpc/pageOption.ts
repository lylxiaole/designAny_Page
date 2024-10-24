import { getUuid } from '@common/utils'
import { EngineLayout, EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { actFuncBase, resourceFuncAttr, funcCode, funcGroup } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import funcStack from '@design-any/interface/dist/enums/funcStack'

import { actionObj, object_InParam } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { isPromise } from '@vue/shared'
import { ElNotification } from 'element-plus'

@resourceFuncAttr('Component Method', '', funcGroup.pageOption, funcCode.methodsInPage, funcStack.webpc, [], { key: getUuid(), name: 'output' })
export class methodsInPageMethod implements actFuncBase {
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

@resourceFuncAttr('Component Property', '', funcGroup.pageOption, funcCode.propertiesInPage, funcStack.webpc, [{ key: getUuid(), name: 'input' }], { key: getUuid(), name: 'output' })
export class propertiesInPageMethod implements actFuncBase {
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
// *************************************************************************
@resourceFuncAttr('MessageBox', '', funcGroup.pageOption, funcCode.notificationDialog, funcStack.universal, [], null)
export class NotificationError implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let msg = this.currentActObj.resourceFilter.message
    let type = this.currentActObj.resourceFilter.type

    if (type === 'success') {
      ElNotification.success({
        title: 'success',
        message: msg,
        onClose: () => {}
      })
    } else if (type === 'error') {
      ElNotification.error({
        title: 'error',
        message: msg,
        onClose: () => {}
      })
    } else {
      ElNotification.info({
        title: 'info',
        message: msg,
        onClose: () => {}
      })
    }
  }
}

@resourceFuncAttr('Page jump', '', funcGroup.pageOption, funcCode.leadToOtherPage, funcStack.universal, [], null)
export class leadToPage implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute(inparams: object_InParam[]) {
    let newpageId = this.currentActObj.resourceFilter.pageId
    // this.currentPage.renderContainer
    this.currentPage.$lylemit('onLYLLeadToOtherPage', newpageId)
  }
}
