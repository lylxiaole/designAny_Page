import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '../../actFuncBase'
import { objectType, object_callback, popupCallback, objectBase } from '../../actObject'

@resourceFuncAttr('跳转页面', '', objectType.method, funcGroup.pageOption, funcCode.leadToPage, funcStack.webpc)
export class variables implements actFuncBase<objectBase> {
  $meta: objectBase
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async getFunc(obj: objectBase) {}
  async setFunc(obj: objectBase, val: any) {}
  getDesc(obj: objectBase): string {
    // window.console.log('显示变量的description')
    return '页面跳转'
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: objectBase) {}
}

@resourceFuncAttr('页面方法', '', objectType.method, funcGroup.pageOption, funcCode.methodsInPage, funcStack.webpc)
export class methodsInPageMethod implements actFuncBase<objectBase> {
  $meta: objectBase
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async getFunc(obj: objectBase) {
    var params: any[] = []
    obj.inputParams.filter((o) => {
      params.push(o.val)
    })
    return this.currentPage.excuteMethod(obj.name, params)
  }
  async setFunc(obj: objectBase, val: any) {}
  getDesc(obj: objectBase): string {
    // window.console.log('显示变量的description')
    return '页面方法'
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: objectBase) {}
}

@resourceFuncAttr('页面属性', '', objectType.method, funcGroup.pageOption, funcCode.propertiesInPage, funcStack.webpc)
export class propertiesInPageMethod implements actFuncBase<objectBase> {
  $meta: objectBase
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async getFunc(obj: objectBase) {}
  async setFunc(obj: objectBase, val: any) {}
  getDesc(obj: objectBase): string {
    // window.console.log('显示变量的description')
    return '页面方法'
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: objectBase) {}
}
