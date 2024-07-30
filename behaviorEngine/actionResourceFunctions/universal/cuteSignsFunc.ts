import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '../../actFuncBase'
import { popupCallback, actionObj } from '../../actObject'

// @resourceFuncAttr('+', '', objectType.signs, funcGroup.cuteSigns, funcCode.signAdd, funcStack.universal)
// export class cuteSignsAdd implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior

//   async getFunc(obj: object_FixedVal) {
//     return '+'
//   }
//   async setFunc(obj: object_FixedVal, val: any) {
//     throw '符号不能赋值'
//   }
//   getDesc(obj: actionObj): string {
//     return ''
//   }
//   isExit(obj: actionObj): boolean {
//     return true
//   }
//   /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
//   getSettingDetail(obj: actionObj): actionObj {
//     return null
//   }
// }

// @resourceFuncAttr('-', '', objectType.signs, funcGroup.cuteSigns, funcCode.signReduce, funcStack.universal)
// export class cuteSignsReduce implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '-'
//   }
//   async setFunc(obj: object_FixedVal, val: any) {
//     throw '符号不能赋值'
//   }
//   getDesc(obj: actionObj): string {
//     return ''
//   }
//   isExit(obj: actionObj): boolean {
//     return true
//   }
//   /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
//   getSettingDetail(obj: actionObj): actionObj {
//     return null
//   }
// }

// @resourceFuncAttr('=', '', objectType.signs, funcGroup.cuteSigns, funcCode.signAssign, funcStack.universal)
// export class cutesignAssign implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '='
//   }
//   async setFunc(obj: object_FixedVal, val: any) {
//     throw '符号不能赋值'
//   }
//   getDesc(obj: actionObj): string {
//     return ''
//   }
//   isExit(obj: actionObj): boolean {
//     return true
//   }
//   /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
//   getSettingDetail(obj: actionObj): actionObj {
//     return null
//   }
// }

// @resourceFuncAttr('*', '', objectType.signs, funcGroup.cuteSigns, funcCode.signMultiply, funcStack.universal)
// export class cutesignMultiply implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '*'
//   }
//   async setFunc(obj: object_FixedVal, val: any) {
//     throw '符号不能赋值'
//   }
//   getDesc(obj: actionObj): string {
//     return ''
//   }
//   isExit(obj: actionObj): boolean {
//     return true
//   }
//   /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
//   getSettingDetail(obj: actionObj): actionObj {
//     return null
//   }
// }

// @resourceFuncAttr('/', '', objectType.signs, funcGroup.cuteSigns, funcCode.signDivide, funcStack.universal)
// export class cutesignDivide implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '/'
//   }
//   async setFunc(obj: object_FixedVal, val: any) {
//     throw '符号不能赋值'
//   }
//   getDesc(obj: actionObj): string {
//     return ''
//   }
//   isExit(obj: actionObj): boolean {
//     return true
//   }
//   /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
//   getSettingDetail(obj: actionObj): actionObj {
//     return null
//   }
// }
