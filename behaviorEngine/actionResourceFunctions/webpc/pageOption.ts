import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '../../actFuncBase'
import { actionObj } from '../../actObject'

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
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute() {
    var params: any[] = []
    this.currentActObj.inputParams.filter((o) => {
      params.push(o.val)
    })
    return this.currentPage.excuteMethod(this.currentActObj.name, params)
  }
}

@resourceFuncAttr('页面属性', '', funcGroup.pageOption, funcCode.propertiesInPage, funcStack.webpc)
export class propertiesInPageMethod implements actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async excute() {}
}
