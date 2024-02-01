import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, resourceType, funcStack, resourceGroup } from '../../actFuncBase'
import { objectType, object_FixedVal, object_Method, object_callback, popupCallback, object_Signs, object_Variable, objectBase } from '../../actObject'

@resourceFuncAttr('字符串', '', objectType.fixedVal, resourceGroup.fixedVal, resourceType.fixedValString, funcStack.universal)
export class fixedValString implements actFuncBase<object_FixedVal> {
  $meta: object_FixedVal
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    var newval = null
    if (obj && obj.val) {
      newval = obj.val.toString()
    } else {
      newval = null
    }
    return newval
  }
  setFunc(obj: object_FixedVal, val: any) {
    // window.console.log('固定值填写数据了', val)
    obj.val = val
  }
  getDesc(obj: objectBase): string {
    return '固定值/字符串'
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
}
@resourceFuncAttr('布尔', '', objectType.fixedVal, resourceGroup.fixedVal, resourceType.fixedValBool, funcStack.universal)
export class fixedValBool implements actFuncBase<object_FixedVal> {
  $meta: object_FixedVal
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    var newval = null
    if (!obj.val) {
      newval = false
    } else if (obj && obj.val.toLowerCase() == 'true') {
      newval = true
    } else {
      newval = false
    }
    return newval
  }
  setFunc(obj: object_FixedVal, val: any) {
    // window.console.log('固定值填写数据了', val)
    obj.val = val
  }
  getDesc(obj: objectBase): string {
    return '固定值/布尔'
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
}

@resourceFuncAttr('整数', '', objectType.fixedVal, resourceGroup.fixedVal, resourceType.fixedValInt, funcStack.universal)
export class fixedValInt implements actFuncBase<object_FixedVal> {
  $meta: object_FixedVal
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    var newval = null
    try {
      newval = parseInt(obj.val)
    } catch (error) {
      newval = NaN
    }
    return newval
  }
  setFunc(obj: object_FixedVal, val: any) {
    // window.console.log('固定值填写数据了', val)
    obj.val = val
  }
  getDesc(obj: objectBase): string {
    return '固定值/整数'
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
}

@resourceFuncAttr('浮点数', '', objectType.fixedVal, resourceGroup.fixedVal, resourceType.fixedValFloat, funcStack.universal)
export class fixedValFloat implements actFuncBase<object_FixedVal> {
  $meta: object_FixedVal
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    var newval = null
    try {
      newval = parseFloat(obj.val)
    } catch (error) {
      newval = NaN
    }
    return newval
  }
  setFunc(obj: object_FixedVal, val: any) {
    // window.console.log('固定值填写数据了', val)
    obj.val = val
  }
  getDesc(obj: objectBase): string {
    return '固定值/浮点数'
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
}

@resourceFuncAttr('空值', '', objectType.fixedVal, resourceGroup.fixedVal, resourceType.fixedValNone, funcStack.universal)
export class fixedValNone implements actFuncBase<object_FixedVal> {
  $meta: object_FixedVal
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    var newval = null
    return newval
  }
  setFunc(obj: object_FixedVal, val: any) {
    // window.console.log('固定值填写数据了', val)
    obj.val = val
  }
  getDesc(obj: objectBase): string {
    return '固定值/空值'
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
}
