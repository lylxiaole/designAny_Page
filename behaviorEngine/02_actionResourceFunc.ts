import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import factory from './03_actionFactory'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { Property } from '@designEngine/index'
import { behavior } from './behaviorTypes'

import { resourceFuncAttr, resourceType, objectType, object_FixedVal, object_Method, object_callback, popupCallback, object_Signs, object_Variable, objectBase, allCuteSigns, allFilterSigns } from './01_actionCommon'

export interface actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: objectBase): any
  setFunc(obj: objectBase, val: any): void
  /**获取组件的描述 */
  getDesc(obj: objectBase): string
  /**是否存在 */
  isExit(obj: objectBase): boolean
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase
  /**设计时,选中公式，更新公式的入参 */
  updateInparam(obj: objectBase)
}

@resourceFuncAttr(resourceType.behaviorInParam)
class behaviorInParamFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    var inparam = this.currentBehavior.inparam
    return inparam
  }
  setFunc(obj: objectBase, val: any) {
    this.currentBehavior.inparam = val
  }
  getDesc(obj: objectBase): string {
    return '当前行为参数:' + obj.name
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

@resourceFuncAttr(resourceType.propertiesInPage)
class propertiesInPageFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    var findproperty = this.currentPage.findPropertyById(obj.resourceId)
    if (!findproperty) {
      return null
    } else {
      return findproperty.value
    }
  }
  setFunc(obj: objectBase, val: any) {
    this.currentPage.setPropertyVal(obj.resourceId, val, true)
  }
  getDesc(obj: objectBase): string {
    var findproperty = this.currentPage.findPropertyById(obj.resourceId)
    if (!findproperty) {
      return ''
    }
    return '当前页面属性:' + findproperty.propertyName
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  updateInparam(obj: objectBase) {}
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }

  private findPropertyInPage(propertyId: string, comps: EngineComponent[]): Property {
    var result: Property = null
    comps.filter((comp) => {
      var property = comp.findPropertyById(propertyId)
      if (property) {
        result = property
      } else {
        let findinChildren = this.findPropertyInPage(propertyId, comp.children as EngineComponent[])
        if (findinChildren) {
          result = findinChildren
        }
      }
    })
    return result
  }

  private findComponentInPage(propertyId: string, comps: EngineComponent[]): EngineComponent {
    var result: EngineComponent = null
    comps.filter((comp) => {
      var property = comp.findPropertyById(propertyId)
      if (property) {
        result = comp
      } else {
        let findinChildren = this.findComponentInPage(propertyId, comp.children as EngineComponent[])
        if (findinChildren) {
          result = findinChildren
        }
      }
    })
    return result
  }
}

@resourceFuncAttr(resourceType.controlMethods)
class controlMethodsFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    var compId = obj.resourceId
    var comp = this.currentPage.findLayoutRecursion(compId, this.currentPage.children)
    var params: any[] = []
    obj.inputParams.filter((o) => {
      var m_param = o.obj.ref === undefined ? (o.obj.resourceId.split('&').length > 1 ? o.obj.resourceId.split('&')[1] : o.obj.resourceId[0]) : o.obj.ref
      params.push(m_param)
    })

    if (!comp) {
      throw '组件不存在,无法调用组件方法!'
    }
    return comp.excuteMethod(obj.name, params)
  }
  setFunc(obj: objectBase, val: any) {
    throw '组件方法不能赋值'
  }
  getDesc(obj: objectBase): string {
    var compId = obj.resourceId
    var comp = this.currentPage.findLayoutRecursion(compId, this.currentPage.children)
    if (!comp) {
      return '页面控件(已删除)'
    }
    var desc = '页面控件:'
    desc += comp.name ? comp.name : '未命名'
    desc += '/方法/'
    desc += obj.name
    return desc
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

@resourceFuncAttr(resourceType.behaviors)
class behaviorsFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    // window.console.log('模型实例')
    let behav = this.currentPage.behaviors.find((o) => o.id == obj.resourceId)
    if (!behav) {
      return
    }
    window.console.log('****执行行为:', behav.name)
    behav.inparam = obj.inputParams[0].obj.ref
    var fact = new factory(this.currentLayout, this.currentPage, behav)
    fact.exacteAction()
  }
  setFunc(obj: object_Method, val: any) {
    throw '行为不能被赋值'
  }
  getDesc(obj: object_Method): string {
    let behav = this.currentPage.behaviors.find((o) => o.id == obj.resourceId)
    if (!behav) {
      return '页面行为:'
    }
    return '页面行为:' + behav.name
  }
  isExit(obj: object_Method): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {}
}

@resourceFuncAttr(resourceType.pageInParams)
class pageInParamsFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    var itemvalue = this.currentPage.inParams.find((o) => o.key == obj.resourceId).paramVal
    if (itemvalue === undefined) {
      return null
    } else {
      return itemvalue
    }
  }
  setFunc(obj: objectBase, val: any) {
    this.currentPage.inParams.find((o) => o.key == obj.resourceId).paramVal = val
  }
  getDesc(obj: objectBase): string {
    var inparam = this.currentPage.inParams.find((o) => o.key == obj.resourceId)
    if (!inparam) {
      return ''
    }
    return '页面入参:' + inparam.paramName
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

@resourceFuncAttr(resourceType.variables)
class variablesFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_Variable) {
    return this.currentBehavior.variableFormulas[obj.name]
  }
  setFunc(obj: object_Variable, val: any) {
    val = val === undefined ? null : val
    this.currentBehavior.variableFormulas[obj.name] = val
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

@resourceFuncAttr(resourceType.fixedVal)
class fixedValFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_FixedVal) {
    // window.console.log('处理固定值')
    var valueType = obj.resourceId.split('&')[1]
    if (!valueType) {
      valueType = '字符串'
    }

    var newval = null
    try {
      if (valueType == '字符串') {
        newval = obj.val.toString()
      } else if (valueType == '布尔') {
        if (!obj.val) {
          newval = false
        } else if (obj.val.toLowerCase() == 'true') {
          newval = true
        } else {
          newval = false
        }
      } else if (valueType == '整数') {
        newval = parseInt(obj.val)
      } else if (valueType == '浮点数') {
        newval = parseFloat(obj.val)
      } else if (valueType == '空值') {
        newval = null
      }
    } catch {
      // window.console.log('固定值处理失败')
      if (valueType == '字符串') {
        newval = ''
      } else if (valueType == '布尔') {
        newval = false
      } else if (valueType == '整数') {
        newval = NaN
      } else if (valueType == '浮点数') {
        newval = NaN
      } else if (valueType == '空值') {
        newval = null
      }
    }
    return newval
  }
  setFunc(obj: object_FixedVal, val: any) {
    // window.console.log('固定值填写数据了', val)
    obj.val = val
  }
  getDesc(obj: objectBase): string {
    var valueType = obj.resourceId.split('&')[1]
    if (!valueType) {
      valueType = '字符串'
    }

    return '固定值/' + valueType
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

@resourceFuncAttr(resourceType.signs)
class signsFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_Signs) {
    return allCuteSigns.find((o) => o.title == obj.name).value
  }
  setFunc(obj: object_Signs, val: any) {
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
  updateInparam(obj: object_Method) {}
}

@resourceFuncAttr(resourceType.filterSigns)
class filterSignsFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_Signs) {
    return allFilterSigns.find((o) => o.title == obj.name).value
  }
  setFunc(obj: object_Signs, val: any) {
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
  updateInparam(obj: object_Method) {}
}

@resourceFuncAttr(resourceType.breakBehaviorAll)
class breakBehaviorAllFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    throw undefined
  }
  setFunc(obj: object_Method, val: any) {
    throw '不可赋值'
  }
  getDesc(obj: objectBase): string {
    return '终止行为'
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

@resourceFuncAttr(resourceType.callback)
class callbackFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj: object_callback) {
    var fact = new factory(this.currentLayout, this.currentPage, obj.behavior)
    fact.exacteAction()
  }
  setFunc(obj: object_callback, val: any) {
    throw '回调函数不能赋值'
  }
  getDesc(obj: object_callback): string {
    if (obj.behavior) {
      return '行为:' + obj.behavior.name
    }
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

@resourceFuncAttr(resourceType.consoleSettings)
class consoleSettingsFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    for (let index = 0; index < obj_method.inputParams.length; index++) {
      let o = obj_method.inputParams[index]
      let m_value = o.obj.ref === undefined ? 'undefined' : o.obj.ref
      let strValue = JSON.stringify(m_value)
      window.console.log('调试' + o.name + '：' + strValue)
    }
    return null
  }
  setFunc(obj: objectBase, val: any) {
    throw '调试输出配置不能赋值'
  }
  getDesc(obj: objectBase): string {
    return '调试输出配置'
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

@resourceFuncAttr(resourceType.externalLinks)
class externalLinksFunc implements actResFuncBase {
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    let params = obj_method.inputParams
    if (params && Array.isArray(params) && params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        let param = params[i]
        if (param.name == 'URL地址') {
          let url = param.obj.ref
          if (url) {
            if (url.indexOf('http://') < 0) {
              url = 'http://' + url
            }
            window.open(url)
          }
          break
        }
      }
    }
    return null
  }
  setFunc(obj: objectBase, val: any) {
    throw '外部链接不能赋值'
  }
  getDesc(obj: objectBase): string {
    return '外部链接地址'
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

var allFuncs: any[] = [propertiesInPageFunc, behaviorInParamFunc, behaviorsFunc, pageInParamsFunc, variablesFunc, fixedValFunc, signsFunc, filterSignsFunc, breakBehaviorAllFunc, controlMethodsFunc, callbackFunc, consoleSettingsFunc, externalLinksFunc]

function getResouceFunc(resType: resourceType): actResFuncBase {
  // window.console.log('行为代码2', resType)
  var res = allFuncs.filter((o: any) => o.prototype.$Meta.resType == resType)[0]
  try {
    return new res()
  } catch (error) {
    debugger
    return null
  }
}

export default allFuncs
export { getResouceFunc }
