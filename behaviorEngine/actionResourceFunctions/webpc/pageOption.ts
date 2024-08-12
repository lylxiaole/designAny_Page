import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage, LayoutMethod } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '../../actFuncBase'
import { actionObj } from '../../actObject'
import { isPromise } from '@vue/shared'

@resourceFuncAttr('跳转页面', '', funcGroup.pageOption, funcCode.leadToPage, funcStack.webpc)
export class leadToPageMethod implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute() {}
}

@resourceFuncAttr('页面方法', '', funcGroup.pageOption, funcCode.methodsInPage, funcStack.webpc)
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

@resourceFuncAttr('页面属性', '', funcGroup.pageOption, funcCode.propertiesInPage, funcStack.webpc)
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
