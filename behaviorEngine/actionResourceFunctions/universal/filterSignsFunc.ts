import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from '../../behaviorTypes'
import { actFuncBase, resourceFuncAttr, funcCode, funcStack, funcGroup } from '../../actFuncBase'
import { objectType, popupCallback, actionObj } from '../../actObject'

// @resourceFuncAttr('==', '', objectType.signs, funcGroup.filterSigns, funcCode.signEqual, funcStack.universal)
// export class filtersignEqual implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '==='
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

// @resourceFuncAttr('!=', '', objectType.signs, funcGroup.filterSigns, funcCode.signNotEqual, funcStack.universal)
// export class filtersignNotEqual implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '!=='
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

// @resourceFuncAttr('>', '', objectType.signs, funcGroup.filterSigns, funcCode.signGreaterThan, funcStack.universal)
// export class filtersignGreaterThan implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '>'
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

// @resourceFuncAttr('<', '', objectType.signs, funcGroup.filterSigns, funcCode.signLessThan, funcStack.universal)
// export class filtersignLessThan implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '<'
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

// @resourceFuncAttr('>=', '', objectType.signs, funcGroup.filterSigns, funcCode.signGTOQ, funcStack.universal)
// export class filtersignGTOQ implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '>='
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

// @resourceFuncAttr('<=', '', objectType.signs, funcGroup.filterSigns, funcCode.signLTOQ, funcStack.universal)
// export class filtersignLTOQ implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '<='
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

// @resourceFuncAttr('&&', '', objectType.signs, funcGroup.filterSigns, funcCode.signAnd, funcStack.universal)
// export class filtersignAnd implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '&&'
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

// @resourceFuncAttr('||', '', objectType.signs, funcGroup.filterSigns, funcCode.signOr, funcStack.universal)
// export class filtersignOr implements actFuncBase<object_Signs> {
//   $meta: object_Signs
//   currentLayout: EngineLayout
//   currentPage: EnginePage
//   currentBehavior: behavior
//   async getFunc(obj: object_FixedVal) {
//     return '||'
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
