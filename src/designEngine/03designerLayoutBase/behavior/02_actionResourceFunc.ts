import Vue from 'vue'
import { getUuid } from '@src/utils'
import PageBase from '../PageBase'
import { ComponentBase } from '../../03designerLayoutBase'
import factory from './03_actionFactory'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import { Property } from '../commonClasses/LayoutProperty'
import { behavior } from './behaviorTypes'
import genoPrintDesigner from '../../genoPrintDesigner.vue'

import { resourceFuncAttr, resourceType, objectType, object_FixedVal, object_Method, object_callback, popupCallback, object_Signs, object_Variable, objectBase, allCuteSigns, allFilterSigns } from './01_actionCommon'

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
    var findproperty = containerPage.findPropertyById(obj.resourceId)
    if (!findproperty) {
      return null
    } else {
      return findproperty.value
    }
  }
  setFunc(obj: objectBase, val: any) {
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    containerPage.setPropertyVal(obj.resourceId, val, true)
  }
  getDesc(obj: objectBase): string {
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var findproperty = containerPage.findPropertyById(obj.resourceId)
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
      var property = comp.findPropertyById(propertyId)
      if (property) {
        result = property
      } else {
        let findinChildren = this.findPropertyInPage(propertyId, comp.children as ComponentBase[])
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
      var property = comp.findPropertyById(propertyId)
      if (property) {
        result = comp
      } else {
        let findinChildren = this.findComponentInPage(propertyId, comp.children as ComponentBase[])
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
  currentLayout: LayoutBase
  currentPage: PageBase
  currentBehavior: behavior
  getFunc(obj: object_Method) {
    var compId = obj.resourceId
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var comp = containerPage.findLayoutRecursion(compId, containerPage.children)
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
    var containerPage = findContainerPage(this.currentPage, obj.pageId)
    var comp = containerPage.findLayoutRecursion(compId, containerPage.children)
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
    var domid = getUuid()
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
    var domid = getUuid()
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

var allFuncs: any[] = [propertiesInPageFunc, behaviorInParamFunc, behaviorsFunc, pageInParamsFunc, variablesFunc, fixedValFunc, signsFunc, filterSignsFunc, breakBehaviorAllFunc, controlMethodsFunc, callbackFunc, consoleSettingsFunc, externalLinksFunc, reportPrintPreview_Func, reportPrint_Func]

function getResouceFunc(resType: resourceType): actResFuncBase {
  // window.console.log('行为代码2', resType)
  var res = allFuncs.filter((o: any) => o.prototype.$Meta.resType == resType)[0]
  return new res()
}

export default allFuncs
export { getResouceFunc }
