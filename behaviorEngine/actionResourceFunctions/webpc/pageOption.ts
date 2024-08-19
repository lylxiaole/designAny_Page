import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage, LayoutMethod } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '../../actFuncBase'
import { actionObj } from '../../actObject'
import { isPromise } from '@vue/shared'
import { ElNotification } from 'element-plus'

@resourceFuncAttr('页面方法', '', funcGroup.pageOption, funcCode.methodsInPage, funcStack.webpc, [], { key: getUuid(), name: '输出' })
export class methodsInPageMethod implements actFuncBase {
  currentActObj: actionObj
  currentBehavior: behavior

  currentLayout: EngineLayout
  currentPage: EnginePage

  async excute() {
    var params: any[] = []
    this.currentActObj.inputParams.filter((o) => {
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
      window.console.error('找不到布局')
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

@resourceFuncAttr('页面属性', '', funcGroup.pageOption, funcCode.propertiesInPage, funcStack.webpc, [{ key: getUuid(), name: '设定值' }], { key: getUuid(), name: '输出' })
export class propertiesInPageMethod implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute() {
    let { layoutId, propField } = this.currentActObj.resourceFilter
    let targetLayout: EngineLayout = null
    if (this.currentPage.Id === layoutId) {
      targetLayout = this.currentPage
    } else {
      targetLayout = this.currentPage.findLayoutRecursion(layoutId, this.currentPage.children)
    }

    if (this.currentActObj.inputParams[0].refOutParamId) {
      targetLayout[propField] = this.currentActObj.inputParams[0].val
    }

    return targetLayout[propField]
  }
}
// *************************************************************************
@resourceFuncAttr('提示窗', '', funcGroup.pageOption, funcCode.notificationDialog, funcStack.universal, [], null)
export class NotificationError implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute() {
    let msg = this.currentActObj.resourceFilter.message
    let type = this.currentActObj.resourceFilter.type

    if (type === 'success') {
      ElNotification.success({
        title: '成功',
        message: msg,
        onClose: () => {}
      })
    } else if (type === 'error') {
      ElNotification.error({
        title: '错误',
        message: msg,
        onClose: () => {}
      })
    } else {
      ElNotification.info({
        title: '信息',
        message: msg,
        onClose: () => {}
      })
    }
  }
}

@resourceFuncAttr('页面跳转', '', funcGroup.pageOption, funcCode.leadToOtherPage, funcStack.universal, [], null)
export class leadToPage implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute() {
    let newpageId = this.currentActObj.resourceFilter.pageId

    this.currentPage.$lylemit('onLYLLeadToOtherPage', newpageId)
  }
}
