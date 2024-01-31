import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, resourceType, funcStack, resourceGroup } from '../../actFuncBase'
import { objectType, object_FixedVal, object_Method, object_callback, popupCallback, object_Signs, object_Variable, objectBase, allCuteSigns, allFilterSigns } from '../../01_actionCommon'

@resourceFuncAttr('相等于', '', resourceGroup.filterSigns, resourceType.signEqual, funcStack.universal)
export class filtersignEqual implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '==='
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

@resourceFuncAttr('不等于', '', resourceGroup.filterSigns, resourceType.signNotEqual, funcStack.universal)
export class filtersignNotEqual implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '!=='
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

@resourceFuncAttr('大于', '', resourceGroup.filterSigns, resourceType.signGreaterThan, funcStack.universal)
export class filtersignGreaterThan implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '>'
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

@resourceFuncAttr('小于', '', resourceGroup.filterSigns, resourceType.signLessThan, funcStack.universal)
export class filtersignLessThan implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '<'
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

@resourceFuncAttr('大于等于', '', resourceGroup.filterSigns, resourceType.signGTOQ, funcStack.universal)
export class filtersignGTOQ implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '>='
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

@resourceFuncAttr('小于等于', '', resourceGroup.filterSigns, resourceType.signLTOQ, funcStack.universal)
export class filtersignLTOQ implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '<='
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

@resourceFuncAttr('且', '', resourceGroup.filterSigns, resourceType.signAnd, funcStack.universal)
export class filtersignAnd implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '&&'
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

@resourceFuncAttr('或', '', resourceGroup.filterSigns, resourceType.signOr, funcStack.universal)
export class filtersignOr implements actFuncBase<object_Signs> {
  $meta: object_Signs
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    return '||'
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
