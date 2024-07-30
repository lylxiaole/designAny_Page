import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '../../actFuncBase'
import { popupCallback, actionObj } from '../../actObject'

// @resourceFuncAttr('字符串', '', objectType.fixedVal, funcGroup.fixedVal, funcCode.fixedValString, funcStack.universal)
// export class fixedValString implements actFuncBase<object_FixedVal> {
//   $meta: object_FixedVal
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     var newval = null
//     if (obj && obj.val) {
//       newval = obj.val.toString()
//     } else {
//       newval = null
//     }
//     return newval
//   }
//   async setFunc(obj: object_FixedVal, val: any) {
//     // window.console.log('固定值填写数据了', val)
//     obj.val = val
//   }
//   getDesc(obj: actionObj): string {
//     return '固定值/字符串'
//   }
//   isExit(obj: actionObj): boolean {
//     return true
//   }
//   /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
//   getSettingDetail(obj: actionObj): actionObj {
//     return null
//   }
// }
// @resourceFuncAttr('布尔', '', objectType.fixedVal, funcGroup.fixedVal, funcCode.fixedValBool, funcStack.universal)
// export class fixedValBool implements actFuncBase<object_FixedVal> {
//   $meta: object_FixedVal
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     var newval = null
//     if (!obj.val) {
//       newval = false
//     } else if (obj && obj.val.toLowerCase() == 'true') {
//       newval = true
//     } else {
//       newval = false
//     }
//     return newval
//   }
//   async setFunc(obj: object_FixedVal, val: any) {
//     // window.console.log('固定值填写数据了', val)
//     obj.val = val
//   }
//   getDesc(obj: actionObj): string {
//     return '固定值/布尔'
//   }
//   isExit(obj: actionObj): boolean {
//     return true
//   }
//   /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
//   getSettingDetail(obj: actionObj): actionObj {
//     return null
//   }
// }

// @resourceFuncAttr('整数', '', objectType.fixedVal, funcGroup.fixedVal, funcCode.fixedValInt, funcStack.universal)
// export class fixedValInt implements actFuncBase<object_FixedVal> {
//   $meta: object_FixedVal
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     var newval = null
//     try {
//       newval = parseInt(obj.val)
//     } catch (error) {
//       newval = NaN
//     }
//     return newval
//   }
//   async setFunc(obj: object_FixedVal, val: any) {
//     // window.console.log('固定值填写数据了', val)
//     obj.val = val
//   }
//   getDesc(obj: actionObj): string {
//     return '固定值/整数'
//   }
//   isExit(obj: actionObj): boolean {
//     return true
//   }
//   /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
//   getSettingDetail(obj: actionObj): actionObj {
//     return null
//   }
// }

// @resourceFuncAttr('浮点数', '', objectType.fixedVal, funcGroup.fixedVal, funcCode.fixedValFloat, funcStack.universal)
// export class fixedValFloat implements actFuncBase<object_FixedVal> {
//   $meta: object_FixedVal
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     var newval = null
//     try {
//       newval = parseFloat(obj.val)
//     } catch (error) {
//       newval = NaN
//     }
//     return newval
//   }
//   async setFunc(obj: object_FixedVal, val: any) {
//     // window.console.log('固定值填写数据了', val)
//     obj.val = val
//   }
//   getDesc(obj: actionObj): string {
//     return '固定值/浮点数'
//   }
//   isExit(obj: actionObj): boolean {
//     return true
//   }
//   /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
//   getSettingDetail(obj: actionObj): actionObj {
//     return null
//   }
// }

// @resourceFuncAttr('空值', '', objectType.fixedVal, funcGroup.fixedVal, funcCode.fixedValNone, funcStack.universal)
// export class fixedValNone implements actFuncBase<object_FixedVal> {
//   $meta: object_FixedVal
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     var newval = null
//     return newval
//   }
//   async setFunc(obj: object_FixedVal, val: any) {
//     // window.console.log('固定值填写数据了', val)
//     obj.val = val
//   }
//   getDesc(obj: actionObj): string {
//     return '固定值/空值'
//   }
//   isExit(obj: actionObj): boolean {
//     return true
//   }
//   /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
//   getSettingDetail(obj: actionObj): actionObj {
//     return null
//   }
// }
