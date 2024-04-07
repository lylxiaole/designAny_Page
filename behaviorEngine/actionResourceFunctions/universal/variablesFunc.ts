import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, resourceCode, funcStack, resourceGroup } from '../../actFuncBase'
import { objectType, object_FixedVal, object_Method, object_callback, popupCallback, object_Signs, object_Variable, objectBase } from '../../actObject'

@resourceFuncAttr('变量', '', objectType.variable, resourceGroup.variables, resourceCode.variables, funcStack.universal)
export class variables implements actFuncBase<object_Variable> {
  $meta: object_Variable
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  async getFunc(obj: object_Variable) {
    return this.currentBehavior.variables[obj.name]
  }
  async setFunc(obj: object_Variable, val: any) {
    val = val === undefined ? null : val
    this.currentBehavior.variables[obj.name] = val
  }
  getDesc(obj: objectBase): string {
    // window.console.log('显示变量的description')
    return '变量:' + obj.name
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {}
}
