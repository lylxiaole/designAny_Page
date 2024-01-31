import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, resourceType, funcStack, resourceGroup } from '../../actFuncBase'
import { objectType, object_FixedVal, object_Method, object_callback, popupCallback, object_Signs, object_Variable, objectBase, allCuteSigns, allFilterSigns } from '../../01_actionCommon'

@resourceFuncAttr('加', '', resourceGroup.cuteSigns, resourceType.signAdd, funcStack.universal)
export class cuteSignsAdd implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior

  getFunc(obj: object_FixedVal) {
    return '+'
  }
  setFunc(obj: object_FixedVal, val: any) {
    throw '符号不能赋值'
  }
  getDesc(obj: objectBase): string {
    return ''
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
}

@resourceFuncAttr('减', '', resourceGroup.cuteSigns, resourceType.signReduce, funcStack.universal)
export class cuteSignsReduce implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '-'
  }
  setFunc(obj: object_FixedVal, val: any) {
    throw '符号不能赋值'
  }
  getDesc(obj: objectBase): string {
    return ''
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
}

@resourceFuncAttr('赋值', '', resourceGroup.cuteSigns, resourceType.signAssign, funcStack.universal)
export class cutesignAssign implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '='
  }
  setFunc(obj: object_FixedVal, val: any) {
    throw '符号不能赋值'
  }
  getDesc(obj: objectBase): string {
    return ''
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
}

@resourceFuncAttr('相乘', '', resourceGroup.cuteSigns, resourceType.signMultiply, funcStack.universal)
export class cutesignMultiply implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '*'
  }
  setFunc(obj: object_FixedVal, val: any) {
    throw '符号不能赋值'
  }
  getDesc(obj: objectBase): string {
    return ''
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
}

@resourceFuncAttr('相除', '', resourceGroup.cuteSigns, resourceType.signDivide, funcStack.universal)
export class cutesignDivide implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '/'
  }
  setFunc(obj: object_FixedVal, val: any) {
    throw '符号不能赋值'
  }
  getDesc(obj: objectBase): string {
    return ''
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
}
