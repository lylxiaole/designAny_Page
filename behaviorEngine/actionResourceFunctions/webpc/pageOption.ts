import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '../../actFuncBase'
import { popupCallback, actionObj } from '../../actObject'

@resourceFuncAttr('跳转页面', '', funcGroup.pageOption, funcCode.leadToPage, funcStack.webpc)
export class variables implements actFuncBase<actionObj> {
  $meta: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async getFunc(obj: actionObj) {}
  async setFunc(obj: actionObj, val: any) {}
  getDesc(obj: actionObj): string {
    // window.console.log('显示变量的description')
    return '页面跳转'
  }
  isExit(obj: actionObj): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: actionObj): actionObj {
    return null
  }
  updateInparam(obj: actionObj) {}
}

@resourceFuncAttr('页面方法', '', funcGroup.pageOption, funcCode.methodsInPage, funcStack.webpc)
export class methodsInPageMethod implements actFuncBase<actionObj> {
  $meta: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async getFunc(obj: actionObj) {
    var params: any[] = []
    obj.inputParams.filter((o) => {
      params.push(o.val)
    })
    return this.currentPage.excuteMethod(obj.name, params)
  }
  async setFunc(obj: actionObj, val: any) {}
  getDesc(obj: actionObj): string {
    // window.console.log('显示变量的description')
    return '页面方法'
  }
  isExit(obj: actionObj): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: actionObj): actionObj {
    return null
  }
  updateInparam(obj: actionObj) {}
}

@resourceFuncAttr('页面属性', '', funcGroup.pageOption, funcCode.propertiesInPage, funcStack.webpc)
export class propertiesInPageMethod implements actFuncBase<actionObj> {
  $meta: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async getFunc(obj: actionObj) {}
  async setFunc(obj: actionObj, val: any) {}
  getDesc(obj: actionObj): string {
    // window.console.log('显示变量的description')
    return '页面方法'
  }
  isExit(obj: actionObj): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: actionObj): actionObj {
    return null
  }
  updateInparam(obj: actionObj) {}
}
