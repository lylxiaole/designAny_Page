import Vue from 'vue'
import { CurrentContext, CurrentApis, fileInfo } from '../../01designerContext'
import { modelDetailInfo } from '../impResourcesCache/modelAnalysis'
import { dictCache, functionCache, modelMapperCache } from '../impResourcesCache'

import paramInfo from '../commonClasses/pageInParamInfo'
import PageBase from '../../05designerLayouts/PageBase'
import ComponentBase from '../../04designerComponents/ComponentBase'
import factory from './03_actionFactory'
import { reqFullScreen, exitFullScreen, deleteReportById } from '../utils/util'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import { Property } from '../commonClasses/LayoutProperty'
import { behavior } from './behaviorTypes'
import Layout_Professional from '../../05designerLayouts/layout_Professional/Layout_Professional.vue'
import layerPopup from '../layer/layerPopup'
import { getAllFilters, modelDataTypeEnum } from '../commonClasses/modelBingding'
import { pageSearchBase } from './04_actionReaourceTree'
import genoPrintDesigner from '../../genoPrintDesigner.vue'

import {
  resourceFuncAttr,
  resourceType,
  objectType,
  object_FixedVal,
  object_Method,
  object_callback,
  popupCallback,
  object_Signs,
  object_Variable,
  objectBase,
  allCuteSigns,
  allFilterSigns
} from './01_actionCommon'
import common from '../commonMethod'
import { Modal, message } from 'ant-design-vue'

function findContainerPage(page: PageBase, pageId?: string, getTopIfNull: boolean = true): PageBase {
  var find: PageBase
  if (getTopIfNull) {
    find = findContainerPageloop2(page, pageId)
  } else {
    find = findContainerPageloop1(page, pageId)
  }
  if (find) {
    return find
  }
  return page
}

function findContainerPageloop1(page: PageBase, pageId?: string): PageBase {
  if (!pageId) {
    return null
  }
  if (page.Id == pageId) {
    return page
  }
  if (!page.parentPage) {
    return null
  }
  return findContainerPageloop1(page.parentPage, pageId)
}

function findContainerPageloop2(page: PageBase, pageId?: string): PageBase {
  if (!pageId) {
    return page
  }
  if (page.Id == pageId) {
    return page
  }
  if (!page.parentPage) {
    return page
  }
  return findContainerPageloop2(page.parentPage, pageId)
}

export interface actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
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
  currentLayout: LayoutBase
  currentPage: PageBase
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
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var findproperty = containerPage.FindPropertyById(obj.resourceId)
    if (!findproperty) {
      return null
    } else {
      return findproperty.value
    }
  }
  setFunc(obj: objectBase, val: any) {
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    containerPage.SetPropertyVal(obj.resourceId, val, true)
  }
  getDesc(obj: objectBase): string {
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var findproperty = containerPage.FindPropertyById(obj.resourceId)
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

  private findPropertyInPage(propertyId: string, comps: ComponentBase[]): Property {
    var result: Property = null
    comps.filter((comp) => {
      var property = comp.FindPropertyById(propertyId)
      if (property) {
        result = property
      } else {
        let findinChildren = this.findPropertyInPage(propertyId, comp.layoutChildren as ComponentBase[])
        if (findinChildren) {
          result = findinChildren
        }
      }
    })
    return result
  }

  private findComponentInPage(propertyId: string, comps: ComponentBase[]): ComponentBase {
    var result: ComponentBase = null
    comps.filter((comp) => {
      var property = comp.FindPropertyById(propertyId)
      if (property) {
        result = comp
      } else {
        let findinChildren = this.findComponentInPage(propertyId, comp.layoutChildren as ComponentBase[])
        if (findinChildren) {
          result = findinChildren
        }
      }
    })
    return result
  }
}
@resourceFuncAttr(resourceType.methodsInPage)
class methodsInPageFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    var params: any[] = []
    obj.inputParams.filter((o) => {
      params.push(o.obj.ref)
    })
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    return containerPage.ExcuteMethod(obj.name, params)
  }
  setFunc(obj: objectBase, val: any) {}
  getDesc(obj: objectBase): string {
    return '当前页面方法:' + obj.name
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var method = containerPage.DesignerMethods.find((o) => o.eventName == obj.name)
    /************************ */
    method.inParams.forEach((methin) => {
      let find = obj.inputParams.find((o) => o.name == methin.name)
      if (!find) {
        let newobj = pageSearchBase.actionFctory.makeObject(common.getUuid(), methin.name, objectType.fixedVal, resourceType.fixedVal, obj.pageId)
        obj.inputParams.push({ name: methin.name, obj: newobj, isModel: false })
      }
    })
    /*************************** */
    obj.inputParams.forEach((op) => {
      var index = obj.inputParams.indexOf(op)
      obj.inputParams.splice(index, 1)
    })
  }
}

@resourceFuncAttr(resourceType.controlMethods)
class controlMethodsFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    var compId = obj.resourceId
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var comp = containerPage.FindLayoutRecursion(compId)
    var params: any[] = []
    obj.inputParams.filter((o) => {
      var m_param =
        o.obj.ref === undefined ? (o.obj.resourceId.split('&').length > 1 ? o.obj.resourceId.split('&')[1] : o.obj.resourceId[0]) : o.obj.ref
      params.push(m_param)
    })

    if (!comp) {
      throw '组件不存在,无法调用组件方法!'
    }
    return comp.ExcuteMethod(obj.name, params)
  }
  setFunc(obj: objectBase, val: any) {
    throw '组件方法不能赋值'
  }
  getDesc(obj: objectBase): string {
    var compId = obj.resourceId
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var comp = containerPage.FindLayoutRecursion(compId)
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

@resourceFuncAttr(resourceType.controlProperties)
class controlPropertiesFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var findproperty = this.findPropertyInPage(obj.resourceId, containerPage.layoutChildren as ComponentBase[])
    window.console.log('获取控件属性:', common.clone(findproperty))
    if (!findproperty) {
      return null
    } else {
      return findproperty.value
    }
  }
  setFunc(obj: objectBase, val: any) {
    // window.console.log('设置控件属性值')
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var findComponent = this.findComponentInPage(obj.resourceId, containerPage.layoutChildren as ComponentBase[])
    if (findComponent) {
      findComponent.SetPropertyVal(obj.resourceId, val, true)
    }
  }
  getDesc(obj: objectBase): string {
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var findproperty = this.findPropertyInPage(obj.resourceId, containerPage.layoutChildren as ComponentBase[])
    if (!findproperty) {
      return null
    }
    var findComponent = this.findComponentInPage(obj.resourceId, containerPage.layoutChildren as ComponentBase[])
    if (!findComponent) {
      return '页面控件(已删除)'
    }
    var desc = '页面控件:'
    desc += !findComponent.name ? '未命名' : findComponent.name
    desc += '/属性/'
    desc += findproperty.propertyName
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
  private findPropertyInPage(propertyId: string, comps: ComponentBase[]): Property {
    var result: Property = null
    comps.filter((comp) => {
      var property = comp.FindPropertyById(propertyId)
      if (property) {
        result = property
      } else {
        let findinChildren = this.findPropertyInPage(propertyId, comp.layoutChildren as ComponentBase[])
        if (findinChildren) {
          result = findinChildren
        }
      }
    })
    return result
  }
  /***使用属性Id,搜索对应的组件 */
  private findComponentInPage(propertyId: string, comps: ComponentBase[]): ComponentBase {
    var result: ComponentBase = null
    comps.filter((comp) => {
      var property = comp.FindPropertyById(propertyId)
      if (property) {
        result = comp
      } else {
        let findinChildren = this.findComponentInPage(propertyId, comp.layoutChildren as ComponentBase[])
        if (findinChildren) {
          result = findinChildren
        }
      }
    })
    return result
  }
}
@resourceFuncAttr(resourceType.systemDict)
class systemEnumFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    var desc = '枚举项/'
    var dict_id = obj_method.resourceId.split('&')[1]
    var dictItemCode = obj_method.resourceId.split('&')[2]

    var dictItems = dictCache.getSystemDictById_Sync(dict_id)
    if (!dictItems || dictItems.length < 1) {
      return desc + '找不到!'
    }

    var findDictItem = dictItems.find((o) => o.item_code == dictItemCode)
    if (!findDictItem) {
      throw '枚举项已经不存在,行为执行失败'
    }
    return findDictItem.item_value
  }
  setFunc(obj_method: object_Method, val: any) {
    throw '工作流不能赋值'
  }
  getDesc(obj: objectBase): string {
    var desc = '枚举项/'
    var dict_id = obj.resourceId.split('&')[1]
    var dictItemCode = obj.resourceId.split('&')[2]
    var dictItems = dictCache.getSystemDictById_Sync(dict_id) as any
    window.console.log('getDesc:', dict_id)
    // var dict = CurrentApis.GetSysDictById(dict_id) as any

    if (!dictItems || dictItems.length < 1) {
      return desc + '找不到!'
    }
    var findDictItem = dictItems.find((o) => o.item_code == dictItemCode)
    if (!findDictItem) {
      return desc + '找不到!'
    }
    return desc + findDictItem.item_name
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

@resourceFuncAttr(resourceType.customFunctions)
class customFunctionsFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    window.console.log('执行公式')
    let paramContent: string = ''
    let params: any[] = []
    obj_method.inputParams.filter((o) => {
      // var m_value = o.obj.ref == null || o.obj.ref == undefined ? o.obj.resourceId : o.obj.ref
      var m_value = null
      if (o.obj.resourceType == resourceType.modelsProperty) {
        m_value = o.obj.ref === undefined ? o.obj.resourceId : o.obj.ref
      } else {
        m_value = o.obj.ref
      }

      let param = { key: o.name, value: JSON.stringify(m_value) }
      params.push(param)
      paramContent += 'let ' + o.name + '=' + JSON.stringify(m_value) + ';'
    })

    let res: any = null
    let functionContent: string = functionCache.getFuncInfoByCode2Cache_Sync(obj_method.name)

    if (functionContent) {
      var regExp = /function\s*\w*\(([\s\S]*?)\)/
      let argList: string[] = []
      if (regExp.test(functionContent)) {
        if (RegExp.$1) {
          argList = RegExp.$1.split(',')
          argList = argList.map(function(arg) {
            return arg.replace(/\s/g, '')
          })
        }
      }
      if (!argList) {
        argList = []
      }
      /** */
      functionContent = paramContent + functionContent
      functionContent += ' ' + obj_method.name + '('
      for (let index = 0; index < argList.length; index++) {
        let argName = argList[index]
        let param = params.find((o) => o.key === argName)
        if (param) {
          functionContent += param.value
          params.splice(params.indexOf(param), 1)
        } else {
          functionContent += 'null'
        }
        functionContent += ','
      }
      /** */
      for (let index = 0; index < params.length; index++) {
        const param = params[index]
        functionContent += param.value + ','
      }

      if (functionContent[functionContent.length - 1] == ',') {
        functionContent = functionContent.substr(0, functionContent.length - 1)
      }
      functionContent += ');'

      // try {
      //TODO:初始准备替换成Function执行
      let customFuncResult = eval(functionContent)
      // if (customFuncResult) {
      //   res = customFuncResult
      // }
      res = customFuncResult
      // } catch (error) {
      //   window.console.error('公式执行异常：' + error)
      // }
    }
    return res
  }
  setFunc(obj_method: object_Method, val: any) {
    throw '公式不能赋值'
  }
  getDesc(obj: objectBase): string {
    var desc = '公式:' + obj.name
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

@resourceFuncAttr(resourceType.models)
class modalsFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    // window.console.log('模型实例')
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    //window.console.log('获取模型实例，页面:', containerPage.Id, this.currentPage.Id)
    return modalsFunc.getModelBindVal(containerPage, obj.resourceId)
  }
  setFunc(obj: objectBase, val: any) {
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    //window.console.log('设置模型实例，页面:', containerPage.Id)
    containerPage.setModelBindVal(obj.resourceId, val)
  }
  getDesc(obj: objectBase): string {
    return '模型实例:' + obj.resourceId
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {}
  static getModelBindVal(page: PageBase, modelBindName: string): any {
    var findModelBind = page.modelBindings.find((o) => o.modelBindingName == modelBindName)
    if (!findModelBind) {
      return null
    }
    if (findModelBind.modelBindingType == 2) {
      return findModelBind.val
    }
    //
    var newval = common.clone(findModelBind.val)
    newval.modelName = findModelBind.modelDetailInfo.modelName
    newval.filter = []
    findModelBind.modelFilters.filter((filter) => {
      newval.filter.push({ code: filter.code, type: filter.type, value: filter.value, combine: filter.combine })
    })
    //
    newval.orders = []
    findModelBind.modelOrders.filter((ord) => {
      if (ord.val || ord.val === false) {
        newval.orders.push({ code: ord.code, type: ord.val == true ? 'DESC' : 'ASC' })
      }
      //newval.orders.push({ code: ord.code, type: ord.type })
    })
    //
    newval.columns = []
    if (findModelBind.modelFuncColumns) {
      findModelBind.modelFuncColumns.filter((o) => {
        if (o.isChoose) {
          newval.columns.push({ code: o.code, func: o.func ? o.func : undefined })
        }
      })
    }

    return newval
  }
}

@resourceFuncAttr(resourceType.modelsStructure)
class modelsStructureFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    // window.console.log('模型实例')
    var containerPage = findContainerPage(this.currentPage, obj.pageId)

    var findModelBind = containerPage.modelBindings.find((o) => o.modelBindingName == obj.resourceId)
    if (!findModelBind) {
      return null
    }

    var res = new modelDetailInfo()
    res.modelIndo = findModelBind.modelDetailInfo
    res.properties = findModelBind.modelDetailProperties
    return res
  }
  setFunc(obj: objectBase, val: any) {}
  getDesc(obj: objectBase): string {
    return '模型实例:' + obj.resourceId
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
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    // window.console.log('模型实例')
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    let behav = containerPage.behaviors.find((o) => o.id == obj.resourceId)
    if (!behav) {
      return
    }
    window.console.log('****执行行为:', behav.name)
    behav.inparam = obj.inputParams[0].obj.ref
    var fact = new factory(this.currentLayout, containerPage, behav)
    fact.exacteAction()
  }
  setFunc(obj: object_Method, val: any) {
    throw '行为不能被赋值'
  }
  getDesc(obj: object_Method): string {
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    let behav = containerPage.behaviors.find((o) => o.id == obj.resourceId)
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

@resourceFuncAttr(resourceType.modelsProperty)
class modalsPropertyFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    // window.console.log('1111')
    var moldelBindName = obj.resourceId.split('&')[0]
    var propertyCode = obj.resourceId.split('&')[1]
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var modelbd = containerPage.modelBindings.find((o) => o.modelBindingName == moldelBindName)

    if (modelbd == null) {
      return null
    }

    // if (!modelbd.val || !modelbd.val.data) {
    //   return undefined
    // }
    // if (modelbd.modelDataType === modelDataTypeEnum.list) {
    //   return undefined
    // }

    if (!modelbd.val.data) {
      if (modelbd.modelDataType == modelDataTypeEnum.list) {
        modelbd.val.data = []
      } else if (modelbd.modelDataType == modelDataTypeEnum.single) {
        modelbd.val.data = {}
      } else {
        modelbd.val.data = {}
      }
    }

    if (modelbd.modelDataType != modelDataTypeEnum.list && modelbd.val.data[propertyCode] === undefined) {
      return null
    } else if (modelbd.modelDataType == modelDataTypeEnum.list) {
      return undefined
    }

    return modelbd.val.data[propertyCode]
  }
  setFunc(obj: objectBase, val: any) {
    // window.console.log('1111')
    var moldelBindName = obj.resourceId.split('&')[0]
    var propertyCode = obj.resourceId.split('&')[1]
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var modelbd = containerPage.modelBindings.find((o) => o.modelBindingName == moldelBindName)

    if (modelbd == null) {
      return
    }
    if (!modelbd.val.data) {
      if (modelbd.modelDataType == modelDataTypeEnum.list) {
        modelbd.val.data = []
      } else if (modelbd.modelDataType == modelDataTypeEnum.single) {
        modelbd.val.data = {}
      } else {
        modelbd.val.data = {}
      }
    }

    modelbd.val.data[propertyCode] = val
    containerPage.setModelBindVal(moldelBindName, modelbd.val.data)
  }
  getDesc(obj: objectBase): string {
    return '模型实例:' + obj.resourceId
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

@resourceFuncAttr(resourceType.modelsFilter)
class modalsFilterFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    var moldelBindName = obj.resourceId.split('&')[0]
    var filterId = obj.resourceId.split('&')[1]
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var modelbd = containerPage.modelBindings.find((o) => o.modelBindingName == moldelBindName)

    if (modelbd == null) {
      return null
    }

    var filter = modelbd.modelFilters.find((o) => o.id == filterId)
    if (filter) {
      return filter.value == undefined ? null : filter.value
    }
    return null
  }
  setFunc(obj: objectBase, val: any) {
    var moldelBindName = obj.resourceId.split('&')[0]
    var filterId = obj.resourceId.split('&')[1]
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var modelbd = containerPage.modelBindings.find((o) => o.modelBindingName == moldelBindName)

    if (modelbd == null) {
      return
    }

    var filter = modelbd.modelFilters.find((o) => o.id == filterId)
    if (filter) {
      filter.value = val
    }
    containerPage.setModelBindVal(moldelBindName, modelbd.val.data)
  }
  getDesc(obj: objectBase): string {
    var moldelBindName = obj.resourceId.split('&')[0]
    var filterId = obj.resourceId.split('&')[1]
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var modelbd = containerPage.modelBindings.find((o) => o.modelBindingName == moldelBindName)
    if (!modelbd) {
      return '筛选条件'
    }
    var filter = modelbd.modelFilters.find((o) => o.id == filterId)
    if (!filter) {
      return '筛选条件'
    }
    var typestr = getAllFilters().find((f) => f.val == filter.type).name
    var propertyName = modelbd.modelDetailProperties.find((p) => p.propertyCode == filter.code).propertyName
    return '模型实例:' + moldelBindName + '-筛选条件:' + '[' + propertyName + '-' + typestr + '-' + '筛选值]'
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

@resourceFuncAttr(resourceType.modelsPropRule)
class modelsPropRuleFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    var moldelBindName = obj.resourceId.split('&')[0]
    var propertyCode = obj.resourceId.split('&')[1]
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var modelbd = containerPage.modelBindings.find((o) => o.modelBindingName == moldelBindName)

    if (modelbd == null) {
      return null
    }

    var findproperty = modelbd.modelDetailProperties.find((o) => o.propertyCode == propertyCode)
    if (findproperty) {
      return findproperty.ruleId
    }
    return null
  }
  setFunc(obj: objectBase, val: any) {
    throw '属性规则不允许赋值'
  }
  getDesc(obj: objectBase): string {
    var moldelBindName = obj.resourceId.split('&')[0]
    var propertyCode = obj.resourceId.split('&')[1]
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var modelbd = containerPage.modelBindings.find((o) => o.modelBindingName == moldelBindName)
    if (!modelbd) {
      return '属性规则'
    }
    var findprop = modelbd.modelDetailProperties.find((o) => o.propertyCode == propertyCode)
    if (!findprop) {
      return '属性规则'
    }
    return '模型实例:' + moldelBindName + '-属性规则:' + '[' + findprop.propertyName + ']'
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

@resourceFuncAttr(resourceType.pageInParams)
class pageInParamsFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    var containerPage = findContainerPage(this.currentPage, obj.pageId, false)
    var itemvalue = containerPage.inParams.find((o) => o.key == obj.resourceId).paramVal
    if (itemvalue === undefined) {
      return null
    } else {
      return itemvalue
    }
  }
  setFunc(obj: objectBase, val: any) {
    var containerPage = findContainerPage(this.currentPage, obj.pageId, false)
    containerPage.inParams.find((o) => o.key == obj.resourceId).paramVal = val
  }
  getDesc(obj: objectBase): string {
    var containerPage = findContainerPage(this.currentPage, obj.pageId, false)
    var inparam = containerPage.inParams.find((o) => o.key == obj.resourceId)
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

@resourceFuncAttr(resourceType.workflows)
class workflowsFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    // resourceId= workflow.id + '&' + wfcontext.nodeId + '&' + wfcontext.contextName
    var loading = common.showLoading_Async()
    try {
      return this.runWorkflow(obj_method)
    } catch (error) {
      common.closeLoading_Async(loading)
      if (error.message) {
        layerPopup.warning(error.message)
      } else {
        layerPopup.warning(common.serialize(error))
      }
      window.console.error(common.serialize(error))
      throw undefined
    } finally {
      common.closeLoading_Async(loading)
    }
  }
  setFunc(obj_method: object_Method, val: any) {
    throw '工作流不能赋值'
  }
  getDesc(obj: objectBase): string {
    var workflow = CurrentApis.GetWorkOrderFlowDetail_Sync(obj.resourceId) as any
    var desc = '工作流(同步):' + workflow.wfName
    var patharr = obj.resourceId.split('&')
    patharr.splice(0, 1)
    for (let index = 0; index < patharr.length; index++) {
      let path = patharr[index]
      desc += '/' + path
    }
    return desc
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {
    let workflowId = obj.resourceId.split('&')[0]
    let workflow = CurrentApis.GetWorkOrderFlowDetail_Sync(workflowId) as any
    let wfinparamcodes: string[] = []
    for (let index = 0; index < workflow.workflowContextList.length; index++) {
      let context = workflow.workflowContextList[index]
      if (context.ownerType == 0) {
        wfinparamcodes.push(context.contextCode)
      }
    }
    /************************ */
    wfinparamcodes.forEach((code) => {
      let find = obj.inputParams.find((o) => o.name == code)
      if (!find) {
        let newobj = pageSearchBase.actionFctory.makeObject(common.getUuid(), code, objectType.fixedVal, resourceType.fixedVal, obj.pageId)
        obj.inputParams.push({ name: code, obj: newobj, isModel: false })
      }
    })
    /*************************** */
    obj.inputParams = obj.inputParams.filter((o) => wfinparamcodes.indexOf(o.name) > -1)
  }

  private runWorkflow(obj_method: object_Method) {
    let workflowId = obj_method.resourceId.split('&')[0]
    var params: any = {}

    obj_method.inputParams.filter((o) => {
      params[o.name] = o.obj.ref
      params[o.name] = common.clone(params[o.name])
      if (params[o.name] && params[o.name].data && params[o.name].data.content) {
        params[o.name].data.content = null
      }
    })
    // window.console.log('运算工作流，参数', params)
    var res = (CurrentApis.StartWorkOrderFlow(workflowId, params) as any).data.out
    var patharr = obj_method.resourceId.split('&')
    patharr.splice(0, 1) //第一个是工作流Id
    for (let index = 0; index < patharr.length; index++) {
      if (!res) {
        break
      }
      let path = patharr[index]
      res = res[path]
    }
    // window.console.log('运算工作流，获取到了结果', res)
    let tempres = this.cuteWorkflowResult(res)
    // window.console.log('工作流转换之后结果', tempres)
    return tempres
  }

  private cuteWorkflowResult(res: any) {
    if (!res && res != 0) {
      return null
    } else if (res.totalPages) {
      //返回数据是列表
      // let content = this.cuteListContent(res.content)
      return { totalPages: res.totalPages, totalElements: res.totalElements, content: res.content }
    } else {
      return res
    }
  }
}

@resourceFuncAttr(resourceType.workflowsAsync)
class workflowsAsyncFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    // window.console.log('异步执行工作流')
    var loading = common.showLoading_Async()

    this.runWorkflow(obj_method)
      .then((d) => {})
      .catch((error) => {
        if (error.message) {
          layerPopup.warning(error.message)
        } else {
          layerPopup.warning(common.serialize(error))
        }
      })
      .finally(() => {
        common.closeLoading_Async(loading)
      })
    // resourceId= workflow.id + '&' + wfcontext.nodeId + '&' + wfcontext.contextName
  }
  setFunc(obj_method: object_Method, val: any) {
    throw '工作流不能赋值'
  }
  getDesc(obj: objectBase): string {
    var workflow = CurrentApis.GetWorkOrderFlowDetail_Sync(obj.resourceId) as any
    var desc = '工作流(异步):' + workflow.wfName
    var patharr = obj.resourceId.split('&')
    patharr.splice(0, 1)
    for (let index = 0; index < patharr.length; index++) {
      let path = patharr[index]
      desc += '/' + path
    }
    return desc
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {
    let workflowId = obj.resourceId.split('&')[0]
    let workflow = CurrentApis.GetWorkOrderFlowDetail_Sync(workflowId) as any
    let wfinparamcodes: string[] = []
    for (let index = 0; index < workflow.workflowContextList.length; index++) {
      let context = workflow.workflowContextList[index]
      if (context.ownerType == 0) {
        wfinparamcodes.push(context.contextCode)
      }
    }
    /************************ */

    wfinparamcodes.forEach((code) => {
      let find = obj.inputParams.find((o) => o.name == code)
      if (!find) {
        let newobj = pageSearchBase.actionFctory.makeObject(common.getUuid(), code, objectType.fixedVal, resourceType.fixedVal, obj.pageId)
        obj.inputParams.push({ name: code, obj: newobj, isModel: false })
      }
    })
    /*************************** */
    obj.inputParams = obj.inputParams.filter((o) => wfinparamcodes.indexOf(o.name) > -1 || o.name == '回调行为')
  }
  private async runWorkflow(obj_method: object_Method): Promise<any> {
    let workflowId = obj_method.resourceId.split('&')[0]
    var params: any = {}
    obj_method.inputParams
      .filter((o) => o.name != '回调行为')
      .filter((o) => {
        params[o.name] = o.obj.ref
        params[o.name] = common.clone(params[o.name])
        if (params[o.name] && params[o.name].data && params[o.name].data.content) {
          params[o.name].data.content = null
        }
      })

    /** */
    var callbackbehavior = obj_method.inputParams.find((o) => o.name == '回调行为').obj as object_callback
    var res = (await CurrentApis.StartWorkOrderFlow_Async(workflowId, params)) as any
    res = res.data.out
    var patharr = obj_method.resourceId.split('&')
    patharr.splice(0, 1)
    for (let index = 0; index < patharr.length; index++) {
      if (!res) {
        break
      }
      let path = patharr[index]
      res = res[path]
    }
    // window.console.log('运算工作流，获取到了结果', res)
    let tempres = this.cuteWorkflowResult(res)

    for (let index = 0; index < callbackbehavior.pCallbacks.length; index++) {
      try {
        const cb = callbackbehavior.pCallbacks[index]
        var modelBindVal = common.clone(tempres)
        // window.console.log(popupPage.parentPage.behaviors)
        var behavior = this.currentPage.behaviors.find((o) => o.id == cb.behaviorId_InMainPage)
        if (behavior) {
          behavior.inparam = modelBindVal
          var fact = new factory(this.currentLayout, this.currentPage, behavior)
          fact.exacteAction()
        }
      } catch (error) {
        window.console.error('执行异步工作流回调错误:', common.serialize(error))
        continue
      }
    }
  }

  private cuteWorkflowResult(res: any) {
    if (!res && res != 0) {
      return null
    } else if (res.totalPages) {
      //返回数据是列表
      // let content = this.cuteListContent(res.content)
      return { totalPages: res.totalPages, totalElements: res.totalElements, content: res.content }
    } else {
      return res
    }
  }
}

@resourceFuncAttr(resourceType.fileTemplate)
class fileTemplateFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    var fileId = obj_method.resourceId.split('&')[1]
    // var fileName = obj_method.resourceId.split('&')[2]
    // var fileurl = obj_method.resourceId.split('&')[3]
    //根据fileId 重新获取一下数据
    let file = CurrentApis.GetFileTemplateById(fileId) as any
    let fileurl = file.file_url
    if (!fileurl) {
      return fileurl
    }

    let filedecoded = decodeURIComponent(fileurl)
    filedecoded = filedecoded.split('?')[0]
    // window.console.log(fileurl)
    // let lastdownline = filedecoded.lastIndexOf('.')
    // let fileext = filedecoded.substr(lastdownline, filedecoded.length)
    // let filename = file.file_name + fileext

    let lastdownline = filedecoded.lastIndexOf('.')
    let fileext = filedecoded.substr(lastdownline, filedecoded.length)
    let filename = file.file_name
    filename = filename + fileext

    if (fileurl.indexOf('http') !== 0) {
      fileurl = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, fileurl)
    }
    // window.console.log('download:', filename)
    fileTemplateFunc.download(fileurl, filename)
  }
  setFunc(obj_method: object_Method, val: any) {
    throw '工作流不能赋值'
  }
  getDesc(obj: objectBase): string {
    var desc = '文件模板/'
    var fileId = obj.resourceId.split('&')[1]
    var fileName = obj.resourceId.split('&')[2]
    var fileUrl = obj.resourceId.split('&')[3]
    return desc + fileName + '/' + fileUrl
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {}

  /**
   * 获取 blob
   * @param  {String} url 目标文件地址
   * @return {cb}
   */
  private static getBlob(url, cb) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Company-Id', CurrentContext.GetCompanyId())
    xhr.responseType = 'blob'
    xhr.onload = function() {
      if (xhr.status === 200) {
        cb(xhr.response)
      }
    }
    xhr.send()
  }

  /**
   * 保存
   * @param  {Blob} blob
   * @param  {String} filename 想要保存的文件名称
   */
  private static saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename)
    } else {
      var link = document.createElement('a')
      var body = document.querySelector('body')

      link.href = window.URL.createObjectURL(blob)
      link.download = filename

      // fix Firefox
      link.style.display = 'none'
      body.appendChild(link)

      link.click()
      body.removeChild(link)

      window.URL.revokeObjectURL(link.href)
    }
  }

  /**
   * 下载
   * @param  {String} url 目标文件地址
   * @param  {String} filename 想要保存的文件名称
   */
  public static download(url: string, filename: string) {
    this.getBlob(url, (blob) => {
      this.saveAs(blob, filename)
    })
  }
}

@resourceFuncAttr(resourceType.localStorage)
class localStorageFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    let id = obj_method.resourceId.split('&')[1]
    // window.console.log('obj_method: ', obj_method)
    let storage_code = obj_method.resourceId.split('&')[2]
    // window.console.log('storage_code: ', storage_code)
    let storage_name = obj_method.resourceId.split('&')[3]
    let expires = obj_method.resourceId.split('&')[4]
    let obj = obj_method
    //window.console.log('Vue.ls: ', Vue.ls)
    if (obj.name === '获取本地资源') {
      window.console.log('Vue.ls.get: ', Vue.ls.get(storage_code))
      if (storage_code === 'GenoAny-AppCode') {
        //获取url
        window.console.log('获取url', window.location)
        //解析获取 参数
        var appcode = window.location.pathname.split('/').pop()
        window.console.log('appcode: ', appcode)
        return appcode //CurrentContext.AppCode
      } else if (storage_code === 'State_Info') {
        window.console.log(`State_Info${CurrentContext.GetCompanyId()}`, Vue.ls.get(storage_code + '_' + CurrentContext.GetCompanyId()))
        return Vue.ls.get(storage_code + '_' + CurrentContext.GetCompanyId())
      } else {
        return Vue.ls.get(storage_code)
      }
    } else if (obj.name === '设置本地资源') {
      let val = obj.inputParams[0].obj.ref
      Vue.ls.set(storage_code, val, parseFloat(expires))
    } else {
      Vue.ls.remove(storage_code)
    }
  }
  setFunc(obj_method: object_Method, val: any) {
    throw '工作流不能赋值'
  }
  getDesc(obj: objectBase): string {
    var desc = '本地资源/'
    let id = obj.resourceId.split('&')[1]
    let storage_code = obj.resourceId.split('&')[2]
    let storage_name = obj.resourceId.split('&')[3]
    let expires = obj.resourceId.split('&')[4]
    return desc + storage_code + '/' + storage_name //+ '/' + expires
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
  currentLayout: LayoutBase
  currentPage: PageBase
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
  currentLayout: LayoutBase
  currentPage: PageBase
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
  currentLayout: LayoutBase
  currentPage: PageBase
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
  currentLayout: LayoutBase
  currentPage: PageBase
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

@resourceFuncAttr(resourceType.normalPopupWindow)
class normalPopupFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    var str = ''
    var st
    obj.inputParams.filter((o) => {
      str += o.obj.ref
      st = o.obj.ref
    })
    if (obj.name == '确认弹窗') {
      message.info(str)
    } else if (obj.name == '警告弹窗') {
      message.warning(str)
    } else if (obj.name == '错误弹窗') {
      message.error(str)
      // window.console.info('错误信息', JSON.stringify(st))
    } else {
      message.info(str)
    }
  }
  setFunc(obj: object_Method, val: any) {
    throw '弹窗怎么赋值'
  }
  getDesc(obj: objectBase): string {
    return '提示弹窗'
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

@resourceFuncAttr(resourceType.confirmPopup)
class ConfirmFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    var paramstr = obj.inputParams.find((o) => o.name == '询问文字').obj.ref
    var paramIsShowCancel = obj.inputParams.find((o) => o.name == '是否显示取消按钮').obj.ref as boolean
    var surecb = obj.inputParams.find((o) => o.name == '确认回调').obj as object_callback
    var cancelcb = obj.inputParams.find((o) => o.name == '取消回调').obj as object_callback
    //window.console.log('confirm弹窗')

    var confirmOptions: any = {
      title: paramstr,
      maskClosable: false,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { loading: 200 },
      onOk: async () => {
        if (!surecb) {
          return
        }

        this.excuteCallbacks(surecb.pCallbacks)
      },
      cancelButtonProps: { loading: 200 },
      onCancel: async () => {
        if (!cancelcb) {
          return
        }

        this.excuteCallbacks(cancelcb.pCallbacks)
      }
    }

    if (paramIsShowCancel == false) {
      confirmOptions.cancelButtonProps = {
        props: {
          prefixCls: 'hideCancleBtn_behav_confirm'
        }
      }
    }

    Modal.confirm(confirmOptions as any)
  }
  setFunc(obj: object_Method, val: any) {
    throw '不能赋值'
  }
  getDesc(obj: objectBase): string {
    return '询问窗'
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {}

  excuteCallbacks(cbs: popupCallback[]) {
    for (let index = 0; index < cbs.length; index++) {
      try {
        const cb = cbs[index]
        // window.console.log(popupPage.parentPage.behaviors)
        var behavior = this.currentPage.behaviors.find((o) => o.id == cb.behaviorId_InMainPage)
        if (behavior) {
          var fact = new factory(this.currentLayout, this.currentPage, behavior)
          fact.exacteAction()
        }
      } catch (error) {
        window.console.error('执行回调错误:', common.serialize(error))
        continue
      }
    }
  }
}

@resourceFuncAttr(resourceType.breakBehavior)
class breakBehaviorFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    throw ''
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
@resourceFuncAttr(resourceType.breakBehaviorAll)
class breakBehaviorAllFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
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
@resourceFuncAttr(resourceType.uploadFile)
class uploadFileFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    var callbackbehavior = obj.inputParams.find((o) => o.name == '回调事件').obj as object_callback
    //弹出窗体上传excel文件
    var rowNum = obj.inputParams.find((o) => o.name == '从第几行开始读取').obj as object_FixedVal
    var uploadComp = this.currentPage.$refs['papapapsjjadhfkhasdgfkhasgdf'] as Vue
    /*** */
    $(uploadComp.$el)
      .find('#uploadfile79953769070592')
      .attr('value', rowNum.val)

    $(uploadComp.$el)
      .find('#uploadfile79953769070592')
      .click()
    /*** */
    uploadComp.$off('upLoadCallBack').$on('upLoadCallBack', (val: any) => {
      /**解析的结果 */
      for (let index = 0; index < callbackbehavior.pCallbacks.length; index++) {
        try {
          const cb = callbackbehavior.pCallbacks[index]
          var modelBindVal = common.clone(val)
          var behavior = this.currentPage.behaviors.find((o) => o.id == cb.behaviorId_InMainPage)
          if (behavior) {
            behavior.inparam = modelBindVal
            var fact = new factory(this.currentLayout, this.currentPage, behavior)
            fact.exacteAction()
          }
        } catch (error) {
          continue
        }
      }
    })
  }
  setFunc(obj: object_Method, val: any) {
    throw '不可以赋值'
  }
  getDesc(obj: objectBase): string {
    return '下载文件'
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

@resourceFuncAttr(resourceType.uploadFile_all)
class uploadFile_all_Func implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    var fileExts = obj.inputParams.find((o) => o.name == '文件类型').obj as object_FixedVal
    var filecount = obj.inputParams.find((o) => o.name == '最大文件个数').obj as object_FixedVal
    var upLoadSize = obj.inputParams.find((o) => o.name == '文件最大尺寸(MB)').obj as object_FixedVal
    var callbackbehavior = obj.inputParams.find((o) => o.name == '回调事件').obj as object_callback
    //弹出窗体上传文件
    var uploadComp = this.currentPage.$refs['423b1336-510f-4497-9761-d0bb8f3d4ef9'] as Vue
    ;(this.currentPage as any).upLoadSize = upLoadSize.ref
    ;(this.currentPage as any).maxFileLength = filecount.ref
    // ;(this.currentPage as any).fileType = fileExts.ref
    ;(uploadComp as any).setFileType(fileExts.ref)
    ;(uploadComp as any).showUpload()
    ;(uploadComp as any).changeFileServer(CurrentContext.BusinessFileServerAddress)
    uploadComp.$off('upLoadCompleted').$once('upLoadCompleted', (filelist: fileInfo[]) => {
      //window.console.log('上传文件成功', filelist)
      var newdata: any[] = []
      filelist.filter((o) => {
        newdata.push({ name: o.name, relativePath: o.url, serverAddr: CurrentContext.BusinessFileServerAddress })
      })
      for (let index = 0; index < callbackbehavior.pCallbacks.length; index++) {
        try {
          const cb = callbackbehavior.pCallbacks[index]
          var behavior = this.currentPage.behaviors.find((o) => o.id == cb.behaviorId_InMainPage)
          if (behavior) {
            behavior.inparam = newdata
            var fact = new factory(this.currentLayout, this.currentPage, behavior)
            fact.exacteAction()
          }
        } catch (error) {
          continue
        }
      }
    })
  }
  setFunc(obj: object_Method, val: any) {
    throw '不可以赋值'
  }
  getDesc(obj: objectBase): string {
    return '下载文件'
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

@resourceFuncAttr(resourceType.downloadFile)
class downloadFileFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    //window.console.log('下载链接')
    let fileurl = obj.inputParams[0].obj.ref
    if (!fileurl) {
      return fileurl
    }
    //window.console.log('resourceType.downloadFile')
    // window.console.log(fileurl)
    let filedecoded = decodeURIComponent(fileurl)
    filedecoded = filedecoded.split('?')[0]
    // window.console.log('文件解码结果是:', decodeURIComponent(fileurl))
    let lastdownline = filedecoded.lastIndexOf('.')
    let lastsplitline = filedecoded.lastIndexOf('/')
    let fileext = filedecoded.substr(lastdownline + 1, filedecoded.length)
    let filename = filedecoded.substr(lastsplitline + 1, lastdownline - lastsplitline)
    filename = filename + fileext
    if (fileurl.indexOf('http') !== 0) {
      fileurl = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, fileurl)
    }
    window.console.log('download:', filename)
    fileTemplateFunc.download(fileurl, filename)
  }
  setFunc(obj: object_Method, val: any) {
    throw '不可以赋值'
  }
  getDesc(obj: objectBase): string {
    return '下载文件'
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

@resourceFuncAttr(resourceType.serverTimeNow)
class getServerTimeFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    return CurrentApis.GetServerTime()
  }
  setFunc(obj: object_Method, val: any) {
    throw '不可以赋值'
  }
  getDesc(obj: objectBase): string {
    return '获取系统当前时间'
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

@resourceFuncAttr(resourceType.pagePopupWindow)
class pagePopupFunc implements actResFuncBase {
  static width: string = '弹窗样式-宽度'
  static height: string = '弹窗样式-高度'
  static title: string = '弹窗样式-标题'
  static fullScreen: string = '弹窗样式-全屏'
  static closeCallback: string = '弹窗关闭事件'
  static closeBtnCallback: string = '关闭图标触发回调'
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    var regNumber = new RegExp('^[0-9]*$')
    var width = obj.inputParams.find((o) => o.name == pagePopupFunc.width).obj.ref
    var height = obj.inputParams.find((o) => o.name == pagePopupFunc.height).obj.ref
    var title = obj.inputParams.find((o) => o.name == pagePopupFunc.title).obj.ref
    var closeBtnIsCallback = false
    let inparamclosebtncb = obj.inputParams.find((o) => o.name == pagePopupFunc.closeBtnCallback)
    if (inparamclosebtncb) {
      closeBtnIsCallback = inparamclosebtncb.obj.ref
    }

    let fullscreenInP = obj.inputParams.find((o) => o.name == pagePopupFunc.fullScreen)
    let fullScreen = fullscreenInP ? fullscreenInP.obj.ref : false
    var callbackbehavior = obj.inputParams.find((o) => o.name == pagePopupFunc.closeCallback).obj as object_callback

    var closeBtn: number = 1
    var popupHeaderHeight = 42
    if (!title) {
      title = false
      closeBtn = 0
      popupHeaderHeight = 0
    }

    let fullOpen = false
    if (fullScreen != undefined && fullScreen != null) {
      let pType = Object.prototype.toString.call(fullScreen)
      switch (pType) {
        case '[object Boolean]': {
          fullOpen = fullScreen
          break
        }
        case '[object String]': {
          let str = fullScreen.toLowerCase().replace(' ', '')
          switch (str) {
            case '全屏':
            case 'true':
            case '是':
            case 'yes':
            case '1': {
              fullOpen = true
              break
            }
            default:
              break
          }
          break
        }
        case '[object Number]': {
          if (fullScreen === 1) {
            fullOpen = true
          }
          break
        }
      }
    }

    if (width && regNumber.test(width)) {
      width = parseInt(width) + 'px'
    }
    if (height && regNumber.test(height)) {
      height = parseInt(height) + popupHeaderHeight + 'px'
    }
    //********************* */
    let domid = common.getUuid()
    let div = ' <div id="' + domid + '"> </div> '
    let preLoadPageInfo: PageBase = (new Layout_Professional() as unknown) as PageBase
    let pageParams: paramInfo[] = []
    for (let index = 0; index < obj.inputParams.length; index++) {
      const element = obj.inputParams[index]
      if (element.name.indexOf('入参-') > -1) {
        let newparam = new paramInfo()
        newparam.paramType = element.isModel == true ? 1 : 2
        newparam.paramIsList = false
        newparam.paramName = element.name
        newparam.paramVal = element.obj.ref
        newparam.key = element.key
        pageParams.push(newparam)
      }
    }

    preLoadPageInfo.Load(obj.resourceId, pageParams, true, true).then(async (pageData) => {
      if (!width) {
        width = preLoadPageInfo.width + 'px'
      }
      if (!height) {
        height = preLoadPageInfo.height + popupHeaderHeight + 'px'
      }

      // ************************************************************
      let popupPage: PageBase = (new Layout_Professional() as unknown) as PageBase
      popupPage.IsDesigning = false
      let layerpopupIndex = (window as any).layer.open({
        type: 1,
        title: title,
        skin: 'popup-class',
        area: [width, height],
        closeBtn: closeBtn, //不显示关闭按钮
        anim: 2,
        resize: false,
        shade: 0.6,
        shadeClose: false, //开启遮罩关闭
        zIndex: 100, //表格的tips是101，弹窗的zindex不能大于100 xuww 2020-04-02 add
        content: div,
        end: () => {
          this.onPopupClosed(callbackbehavior, popupPage, this.currentPage)
          if (popupPage.Destory) {
            popupPage.Destory()
          }
          obj = null
          popupPage = null
          if (fullOpen) {
            exitFullScreen(this.currentPage.$el)
          }
          this.cancelAutoSize()
        },
        cancel: () => {
          popupPage.popupInfo.isCallback = closeBtnIsCallback
          // this.onPopupClosed(callbackbehavior, popupPage, this.currentPage)
        },
        success: function(layero, index) {
          //优化样式
          $(layero)
            .find('.layui-layer-close')
            .attr('draggable', 'false')

          if (fullOpen) {
            ;(window as any).layer.full(index)
            reqFullScreen(null, () => {
              // ;(window as any).layer.close(layerpopupIndex)
            })
          }
        }
      })
      // ************************************************************
      popupPage.$once('onMounted', async (mpage: PageBase) => {
        await mpage.LoadPageByData(obj.resourceId, pageData, pageParams)
        mpage.StartShowNew(false)
        mpage.left = 0
        mpage.top = 0
        mpage.popupInfo = { popupId: layerpopupIndex, isCallback: false }

        $(mpage.$el)
          .parent()
          .css('overflow-x', 'hidden')
        mpage.adaptSize(mpage.width, mpage.height)
        this.startAutoSize(popupPage, popupHeaderHeight, layerpopupIndex)
        preLoadPageInfo.Destory()
        preLoadPageInfo = null
        pageParams == null
        pageData = null
      })
      popupPage.$mount('#' + domid)
    })
  }
  setFunc(obj: object_Method, val: any) {
    throw '弹窗怎么赋值'
  }
  getDesc(obj: objectBase): string {
    return '页面弹窗:' + obj.description
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }

  private onPopupClosed(objcb: object_callback, popupPage: PageBase, sourcePage: PageBase) {
    if (!popupPage || !popupPage.popupInfo || !popupPage.popupInfo.isCallback) {
      return
    }
    for (let index = 0; index < objcb.pCallbacks.length; index++) {
      try {
        const cb = objcb.pCallbacks[index]
        let modelBindVal = null
        let mbinpage = popupPage.modelBindings.find((o) => o.modelBindingName == cb.modelBindName_InPopupPage)

        if (mbinpage) {
          modelBindVal = modalsFunc.getModelBindVal(popupPage, cb.modelBindName_InPopupPage)
          if (mbinpage.modelBindingType == 1) {
            modelBindVal = modelBindVal.data
          }
        }
        let behavior = sourcePage.behaviors.find((o) => o.id == cb.behaviorId_InMainPage)
        if (behavior) {
          behavior.inparam = modelBindVal
          let fact = new factory(this.currentLayout, sourcePage, behavior)
          fact.exacteAction()
          fact = null
        }
      } catch (error) {
        continue
      }
    }
  }
  updateInparam(obj: object_Method) {
    var preLoadPageInfo: PageBase = new PageBase()
    preLoadPageInfo.Load(obj.resourceId, [], true, true).then(() => {
      let inparams: string[] = []
      let staticinparams: string[] = []
      for (let index = 0; index < preLoadPageInfo.inParams.length; index++) {
        let pageinp = preLoadPageInfo.inParams[index]
        inparams.push(pageinp.key)
      }
      staticinparams.push(pagePopupFunc.width)
      staticinparams.push(pagePopupFunc.height)
      staticinparams.push(pagePopupFunc.title)
      staticinparams.push(pagePopupFunc.fullScreen)
      staticinparams.push(pagePopupFunc.closeBtnCallback)
      staticinparams.push(pagePopupFunc.closeCallback)

      let fullScreenParam = obj.inputParams.find((o) => o.name === pagePopupFunc.fullScreen)
      if (!fullScreenParam) {
        const node3 = pageSearchBase.actionFctory.makeObject(common.getUuid() + '&布尔', '手填固定值', objectType.fixedVal, resourceType.fixedVal)
        obj.inputParams.push({ name: pagePopupFunc.fullScreen, obj: node3, isModel: false })
      }
      window.console.log('******刷新页面入参')
      /************************ */
      inparams.forEach((key) => {
        let find = obj.inputParams.find((o) => o.key == key)
        let pagei = preLoadPageInfo.inParams.find((o) => o.key == key)
        if (!find) {
          let newobj = pageSearchBase.actionFctory.makeObject(key, '手填固定值', objectType.fixedVal, resourceType.fixedVal, obj.pageId)
          obj.inputParams.push({ key: key, name: '入参-' + pagei.paramName, obj: newobj, isModel: false })
        } else {
          find.name = '入参-' + pagei.paramName
        }
      })

      /*************************** */
      obj.inputParams = obj.inputParams.filter((o) => inparams.indexOf(o.key) > -1 || staticinparams.indexOf(o.name) > -1)
      preLoadPageInfo.Destory()
    })
  }
  private startAutoSize(mpage: PageBase, popupHeaderHeight: number, layerIndex: number) {
    this.currentPpopupPage = mpage
    this.cpopupHeaderHeight = popupHeaderHeight
    this.onWindowResize()
    mpage.$on('onScaleSized', this.onWindowResize)
  }
  private cancelAutoSize() {
    this.currentPpopupPage.$off('onScaleSized', this.onWindowResize)
  }

  private currentPpopupPage: PageBase
  private cpopupHeaderHeight: number

  private onWindowResize: () => void = () => {
    let newheight = parseFloat((this.currentPpopupPage.height * this.currentPpopupPage.currentScaleSize).toString())
    let layerdom1 = $(this.currentPpopupPage.$el).parents('.layui-layer')
    $(layerdom1).css('height', newheight + this.cpopupHeaderHeight + 'px')
    ////////////////////////////////
    let x = $('body').height() - newheight - this.cpopupHeaderHeight
    if (x < 0) {
      x = 0
    }
    $(layerdom1).css('top', x / 2)
    ////////////////
    let layerdom2 = $(this.currentPpopupPage.$el).parents('.layui-layer-content')

    if (x === 0) {
      $(layerdom2).css('height', $('body').height() + 'px')
      $(layerdom2).css('overflow-y', 'auto')
    } else {
      $(layerdom2).css('height', newheight + this.cpopupHeaderHeight + 'px')
      $(layerdom2).css('overflow-y', 'hidden')
      $(layerdom2).scrollTop(0)
    }
    // window.console.log('popup onWindowResize:', newheight)
  }
}

@resourceFuncAttr(resourceType.pageRoute)
class pageRouteFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    let pageInParams: paramInfo[] = []
    for (let index = 0; index < obj_method.inputParams.length; index++) {
      const element = obj_method.inputParams[index]
      if (element.name.indexOf('入参-') == 0) {
        let newparam = new paramInfo()
        newparam.paramType = element.isModel == true ? 1 : 2
        newparam.paramIsList = false
        newparam.paramName = element.name
        newparam.paramVal = element.obj.ref
        newparam.key = element.key
        pageInParams.push(newparam)
      }
    }
    CurrentContext.RoutePage(obj_method.resourceId, pageInParams)
    return null
  }
  setFunc(obj: objectBase, val: any) {
    throw '页面跳转不能赋值'
  }
  getDesc(obj: objectBase): string {
    return '页面跳转的路径：' + obj.description
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {
    var preLoadPageInfo: PageBase = new PageBase()
    preLoadPageInfo.Load(obj.resourceId, [], true, true).then(() => {
      let inparams: string[] = []
      let staticinparams: string[] = []
      for (let index = 0; index < preLoadPageInfo.inParams.length; index++) {
        let pageinp = preLoadPageInfo.inParams[index]
        inparams.push(pageinp.key)
      }
      /************************ */
      inparams.forEach((key) => {
        let find = obj.inputParams.find((o) => o.key == key)
        let pagei = preLoadPageInfo.inParams.find((o) => o.key == key)
        if (!find) {
          let newobj = pageSearchBase.actionFctory.makeObject(key, '手填固定值', objectType.fixedVal, resourceType.fixedVal, obj.pageId)
          obj.inputParams.push({ key: key, name: '入参-' + pagei.paramName, obj: newobj, isModel: false })
        } else {
          find.name = '入参-' + pagei.paramName
        }
      })
      /*************************** */
      obj.inputParams = obj.inputParams.filter((o) => inparams.indexOf(o.key) > -1 || staticinparams.indexOf(o.name) > -1)
      preLoadPageInfo.Destory()
    })
  }
}

@resourceFuncAttr(resourceType.pageSources)
class pageResoucesFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    let pageInParams: paramInfo[] = []
    for (let index = 0; index < obj_method.inputParams.length; index++) {
      const element = obj_method.inputParams[index]
      if (element.name.indexOf('入参-') == 0) {
        let newparam = new paramInfo()
        newparam.paramType = element.isModel == true ? 1 : 2
        newparam.paramIsList = false
        newparam.paramName = element.name
        newparam.paramVal = element.obj.ref
        newparam.key = element.key
        pageInParams.push(newparam)
      }
    }
    //CurrentContext.RoutePage(obj_method.resourceId, pageInParams)
    return null
  }
  setFunc(obj: objectBase, val: any) {
    throw '页面资源不能赋值'
  }
  getDesc(obj: objectBase): string {
    return '页面资源'
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {
    var preLoadPageInfo: PageBase = new PageBase()
    preLoadPageInfo.Load(obj.resourceId, [], true, true).then(() => {
      let inparams: string[] = []
      let staticinparams: string[] = []
      for (let index = 0; index < preLoadPageInfo.inParams.length; index++) {
        let pageinp = preLoadPageInfo.inParams[index]
        inparams.push(pageinp.key)
      }
      /************************ */
      inparams.forEach((key) => {
        let find = obj.inputParams.find((o) => o.key == key)
        let pagei = preLoadPageInfo.inParams.find((o) => o.key == key)
        if (!find) {
          let newobj = pageSearchBase.actionFctory.makeObject(key, '手填固定值', objectType.fixedVal, resourceType.fixedVal, obj.pageId)
          obj.inputParams.push({ key: key, name: '入参-' + pagei.paramName, obj: newobj, isModel: false })
        } else {
          find.name = '入参-' + pagei.paramName
        }
      })
      /*************************** */
      obj.inputParams = obj.inputParams.filter((o) => inparams.indexOf(o.key) > -1 || staticinparams.indexOf(o.name) > -1)
      preLoadPageInfo.Destory()
    })
  }
}

@resourceFuncAttr(resourceType.callback)
class callbackFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
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

@resourceFuncAttr(resourceType.modelMapper)
class modelMapperFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: objectBase) {
    window.console.log('[' + this.currentBehavior.name + ']获取模型映射:', this.currentPage)
    let result = modelMapperCache.getModelMapperByCode_Sync(obj.name)
    return result
  }
  setFunc(obj: objectBase, val: any) {
    throw '模型映射不能赋值'
  }
  getDesc(obj: objectBase): string {
    var desc = '模型映射:' + obj.name
    return desc
  }
  isExit(obj: objectBase): boolean {
    return true
  }
  getSettingDetail(obj: objectBase): objectBase {
    return null
  }
  updateInparam(obj: object_Method) {}
}

@resourceFuncAttr(resourceType.consoleSettings)
class consoleSettingsFunc implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
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
  currentLayout: LayoutBase
  currentPage: PageBase
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

@resourceFuncAttr(resourceType.controlLoadingWindow)
class controlLoadingWindowFunc implements actResFuncBase {
  static loadingind: any = null
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    var isshow = obj_method.resourceId.indexOf('显示') > -1
    if (isshow && !controlLoadingWindowFunc.loadingind) {
      controlLoadingWindowFunc.loadingind = common.showLoading_Async()
    } else if (controlLoadingWindowFunc.loadingind) {
      common.closeLoading_Async(controlLoadingWindowFunc.loadingind)
      controlLoadingWindowFunc.loadingind = null
    }
  }
  setFunc(obj: objectBase, val: any) {
    throw '不能赋值'
  }
  getDesc(obj: objectBase): string {
    var isshow = obj.resourceId.indexOf('显示') > -1
    if (isshow) {
      return '显示加载窗'
    } else {
      return '关闭加载窗'
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

@resourceFuncAttr(resourceType.callLocalProgram)
class callLocalProgramFunc implements actResFuncBase {
  static loadingind: any = null
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    //window.console.log('打开本地程序')
    var programname = obj_method.inputParams.find((o) => o.name == '本地程序名称').obj.ref
    var args = obj_method.inputParams.find((o) => o.name == '参数').obj.ref
    window.location.href = programname + ':///' + args
  }
  setFunc(obj: objectBase, val: any) {
    throw '不能赋值'
  }
  getDesc(obj: objectBase): string {
    return '调用本地程序'
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

@resourceFuncAttr(resourceType.openLocalExeToOpenFile)
class openLocalExeToOpenFileProgramFunc implements actResFuncBase {
  static loadingind: any = null
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    var url = obj_method.inputParams.find((o) => o.name == '文件相对路径').obj.ref
    var programname = 'GenoAny'
    var data = {
      domain: CurrentContext.FileServerAddress,
      url: url,
      compId: CurrentContext.GetCompanyId()
    }
    window.location.href = programname + ':///' + JSON.stringify(data)
  }
  setFunc(obj: objectBase, val: any) {
    throw '不能赋值'
  }
  getDesc(obj: objectBase): string {
    return '调用本地程序打开附件'
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

/**新增打印相关通用方法 */
@resourceFuncAttr(resourceType.designReportTemplate)
class designReportTemplate_Func implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  currentDesigner: genoPrintDesigner
  getFunc(obj: object_Method) {
    window.console.log('开始打印设计')
    let datasourceArr = []
    var datasource = (obj.inputParams.find((o) => o.name == '报表数据源').obj as any).ref
    if (obj.inputParams.length > 3) {
      for (let index = 3; index < obj.inputParams.length; index++) {
        const element = obj.inputParams[index]
        datasourceArr.push((element.obj as any).ref)
      }
    }
    datasourceArr.push(datasource)
    var template = (obj.inputParams.find((o) => o.name == '报表模板id').obj as any).ref
    var callbackbehavior = obj.inputParams.find((o) => o.name == '保存回调事件').obj as object_callback
    let templateContent = template
    var domid = common.getUuid()
    var div = ' <div id="' + domid + '"> </div> '
    var designer: genoPrintDesigner = new genoPrintDesigner()
    this.currentDesigner = designer
    var oldIsDesigning = this.currentPage.IsDesigning
    var layerpopupIndex = (window as any).layer.open({
      type: 1,
      title: '打印',
      skin: 'popup-class',
      area: ['90%', '90%'],
      closeBtn: 1, //显示关闭按钮
      anim: 2,
      resize: false,
      shade: 0.6,
      shadeClose: false, //开启遮罩关闭
      zIndex: 100, //表格的tips是101，弹窗的zindex不能大于100 xuww 2020-04-02 add
      content: div,
      end: async () => {
        this.currentPage.IsDesigning = oldIsDesigning
      },
      cancel: async () => {},
      success: function(layero, index) {}
    })
    this.currentPage.IsDesigning = true
    this.currentDesigner.$mount('#' + domid)
    ;(this.currentDesigner as any).StartPrint()
    let obj111 = common.deserialize(templateContent)
    //window.console.log('**********弹出打印控件了,传入参数是--------------------obj:', obj)
    let modelList: any[] = []
    for (let index = 0; index < datasourceArr.length; index++) {
      let element = datasourceArr[index]
      let data = element.data ? (element.data.content && element.data.content instanceof Array ? element.data.content : element.data) : element
      modelList.push({ modelCode: element.modelCode, isList: data instanceof Array ? true : false, data: [] })
    }

    // datasourceArr.forEach((element) => {
    //   let data = element.data ? (element.data.content && element.data.content instanceof Array ? element.data.content : element.data) : element
    //   modelList.push({ modelCode: element.modelCode, isList: data instanceof Array ? true : false, data: [] })
    // })
    if (!templateContent || obj111 instanceof Object) {
      ;(this.currentDesigner as any).NewPage(modelList)
    } else {
      ;(this.currentDesigner as any).OpenPage(templateContent, modelList)
    }
    ;(this.currentDesigner as any).$on('onSaved', (res) => {
      // window.console.log('--------------------保存返回值', res)
      for (let index = 0; index < callbackbehavior.pCallbacks.length; index++) {
        try {
          const cb = callbackbehavior.pCallbacks[index]
          var behavior = this.currentPage.behaviors.find((o) => o.id == cb.behaviorId_InMainPage)
          if (behavior) {
            behavior.inparam = res
            var fact = new factory(this.currentLayout, this.currentPage, behavior)
            fact.exacteAction()
          }
        } catch (error) {
          continue
        }
      }
    })
    ;(this.currentDesigner as any).$on('onNeedClose', (res) => {
      ;(window as any).layer.close(layerpopupIndex)
    })
  }
  setFunc(obj: object_Method, val: any) {
    throw '不可以赋值'
  }
  getDesc(obj: objectBase): string {
    return '设计模板'
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

@resourceFuncAttr(resourceType.reportPrintPreview)
class reportPrintPreview_Func implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  currentDesigner: genoPrintDesigner
  getFunc(obj: object_Method) {
    let datasourceArr = []
    var datasource = (obj.inputParams.find((o) => o.name == '报表数据源').obj as any).ref
    if (obj.inputParams.length > 2) {
      for (let index = 2; index < obj.inputParams.length; index++) {
        const element = obj.inputParams[index]
        datasourceArr.push((element.obj as any).ref)
      }
    }
    datasourceArr.push(datasource)
    var template = (obj.inputParams.find((o) => o.name == '报表模板id').obj as any).ref
    let templateContent = template
    var domid = common.getUuid()
    var div = ' <div id="' + domid + '"> </div> '
    var designer: genoPrintDesigner = new genoPrintDesigner()
    this.currentDesigner = designer
    var oldIsDesigning = this.currentPage.IsDesigning
    var layerpopupIndex = (window as any).layer.open({
      type: 1,
      title: '打印',
      skin: 'popup-class',
      area: ['90%', '90%'],
      closeBtn: 1, //显示关闭按钮
      anim: 2,
      resize: false,
      shade: 0.6,
      shadeClose: false, //开启遮罩关闭
      zIndex: 100, //表格的tips是101，弹窗的zindex不能大于100 xuww 2020-04-02 add
      content: div,
      end: async () => {
        this.currentPage.IsDesigning = oldIsDesigning
      },
      cancel: async () => {},
      success: function(layero, index) {}
    })
    this.currentPage.IsDesigning = true
    this.currentDesigner.$mount('#' + domid)
    ;(this.currentDesigner as any).StartPrint()
    let modelList: any[] = []
    for (let index = 0; index < datasourceArr.length; index++) {
      let element = datasourceArr[index]
      let data = element.data ? (element.data.content && element.data.content instanceof Array ? element.data.content : element.data) : element
      modelList.push({ modelCode: element.modelCode, isList: data instanceof Array ? true : false, data: data })
    }
    //window.console.log('--------------------------打印预览入参',modelList)
    ;(this.currentDesigner as any).PreviewPrint(templateContent, modelList, () => {})
  }
  setFunc(obj: object_Method, val: any) {
    throw '不可以赋值'
  }
  getDesc(obj: objectBase): string {
    return '打印预览'
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

@resourceFuncAttr(resourceType.reportPrint)
class reportPrint_Func implements actResFuncBase {
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  currentDesigner: genoPrintDesigner
  getFunc(obj: object_Method) {
    var datasource = (obj.inputParams.find((o) => o.name == '报表数据源').obj as any).ref
    let datasourceArr = []
    var datasource = (obj.inputParams.find((o) => o.name == '报表数据源').obj as any).ref
    if (obj.inputParams.length > 2) {
      for (let index = 2; index < obj.inputParams.length; index++) {
        const element = obj.inputParams[index]
        datasourceArr.push((element.obj as any).ref)
      }
    }
    datasourceArr.push(datasource)
    var template = (obj.inputParams.find((o) => o.name == '报表模板id').obj as any).ref
    let templateContent = template
    var domid = common.getUuid()
    var div = ' <div id="' + domid + '"> </div> '
    var designer: genoPrintDesigner = new genoPrintDesigner()
    this.currentDesigner = designer
    var oldIsDesigning = this.currentPage.IsDesigning
    var layerpopupIndex = (window as any).layer.open({
      type: 1,
      title: '打印',
      skin: 'popup-class',
      area: ['90%', '90%'],
      closeBtn: 1, //显示关闭按钮
      anim: 2,
      resize: false,
      shade: 0.6,
      shadeClose: false, //开启遮罩关闭
      zIndex: 100, //表格的tips是101，弹窗的zindex不能大于100 xuww 2020-04-02 add
      content: div,
      end: async () => {
        this.currentPage.IsDesigning = oldIsDesigning
      },
      cancel: async () => {},
      success: function(layero, index) {}
    })
    this.currentPage.IsDesigning = true
    this.currentDesigner.$mount('#' + domid)
    ;(this.currentDesigner as any).StartPrint()
    let modelList: any[] = []
    for (let index = 0; index < datasourceArr.length; index++) {
      let element = datasourceArr[index]
      let data = element.data ? (element.data.content && element.data.content instanceof Array ? element.data.content : element.data) : element
      modelList.push({ modelCode: element.modelCode, isList: data instanceof Array ? true : false, data: data })
    }
    ;(this.currentDesigner as any).PrintPage(templateContent, modelList, () => {
      ;(this.currentDesigner as any).onClosePage(templateContent)
      ;(window as any).layer.close(layerpopupIndex)
    })
  }
  setFunc(obj: object_Method, val: any) {
    throw '不可以赋值'
  }
  getDesc(obj: objectBase): string {
    return '打印报表'
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

/**删除报表 */
@resourceFuncAttr(resourceType.deleteReport)
class deleteReport_Func implements actResFuncBase {
  static loadingind: any = null
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj_method: object_Method) {
    var reportId = obj_method.inputParams.find((o) => o.name == '报表id').obj.ref
    //调用删除方法
    deleteReportById(reportId)
  }
  setFunc(obj: objectBase, val: any) {
    throw '不能赋值'
  }
  getDesc(obj: objectBase): string {
    return '根据id删除报表'
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

var allFuncs: any[] = [
  propertiesInPageFunc,
  methodsInPageFunc,
  behaviorInParamFunc,
  customFunctionsFunc,
  modalsFunc,
  modelsStructureFunc,
  behaviorsFunc,
  modalsPropertyFunc,
  modalsFilterFunc,
  modelsPropRuleFunc,
  pageInParamsFunc,
  workflowsFunc,
  workflowsAsyncFunc,
  systemEnumFunc,
  fileTemplateFunc,
  getServerTimeFunc,
  localStorageFunc,
  variablesFunc,
  fixedValFunc,
  signsFunc,
  filterSignsFunc,
  breakBehaviorFunc,
  breakBehaviorAllFunc,
  normalPopupFunc,
  pagePopupFunc,
  ConfirmFunc,
  controlMethodsFunc,
  controlPropertiesFunc,
  callbackFunc,
  modelMapperFunc,
  consoleSettingsFunc,
  uploadFileFunc,
  uploadFile_all_Func,
  downloadFileFunc,
  pageRouteFunc,
  pageResoucesFunc,
  externalLinksFunc,
  controlLoadingWindowFunc,
  callLocalProgramFunc,
  designReportTemplate_Func,
  reportPrintPreview_Func,
  reportPrint_Func,
  openLocalExeToOpenFileProgramFunc,
  deleteReport_Func
]

function getResouceFunc(resType: resourceType): actResFuncBase {
  // window.console.log('行为代码2', resType)
  var res = allFuncs.filter((o: any) => o.prototype.$Meta.resType == resType)[0]
  return new res()
}

export default allFuncs
export { getResouceFunc }
