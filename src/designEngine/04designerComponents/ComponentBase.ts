import { SaveInfo } from '../03designerLayoutBase/LayoutBase'
import LayoutContainner from '../03designerLayoutBase/LayoutContainner'
import { DragItemData, DragItemTypeEnum } from '../03designerLayoutBase/BaseEvents'
import { Component, Prop, Vue, Emit, Watch, Provide } from 'vue-property-decorator'
import { param } from '../03designerLayoutBase/commonClasses/layoutEvent'

import { Property, Authority_Property, Color_Property, BindingModels_Property, Boolean_Property, PropertyGroupName, Number_Property } from '../02common/commonClasses/LayoutProperty'
import PageBase from '../05designerLayouts/PageBase'

import { factory } from '../02common/behavior'
import { ModelProperty, propertyValidator, DecoratorOption, DecoratorRule, modelTypeEnum } from '../02common/impResourcesCache/modelAnalysis'
import modelBingding, { bindingModelVal_InProperty, modelBingValue, bindTypeEnum, modelDataTypeEnum } from '../02common/commonClasses/modelBingding'
import { isArray, isObject } from 'xe-utils/methods'

@Component
export default class ComponentBase extends LayoutContainner {
  public wheelIndex: any = 1
  public defaultValue: any
  public parentPage: PageBase

  public get topParentPage(): PageBase {
    let res: PageBase = this.parentPage
    while (res && res.parentPage) {
      res = res.parentPage
    }
    return res
  }

  private _curModelproperty: ModelProperty

  public get curModelproperty(): ModelProperty {
    if (!this._curModelproperty) {
      this._curModelproperty = new ModelProperty()
    }
    return this._curModelproperty
  }
  public set curModelproperty(val: ModelProperty) {
    this._curModelproperty = val
  }

  public get validateProperty(): Property {
    return null
  }

  /**当前组件的权限码 */
  public get authorityCode(): string {
    return this.FindPropertyByName(PropertyGroupName.normal, '权限设置').value
  }
  public set authorityCode(val: string) {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '权限设置')
    if (property) {
      property.value = val
    }
  }

  get foreground(): string {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '前景色')
    if (property) {
      return property.value
    } else {
      return '#000000'
    }
  }

  get display(): boolean {
    // window.console.log('是否显示')
    var property = this.FindPropertyByName(PropertyGroupName.normal, '是否显示')
    if (property) {
      return property.value as boolean
    }
    return false
  }

  set display(val: boolean) {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '是否显示')
    if (property) {
      property.value = val
    }
  }

  get disabled(): boolean {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '是否禁用')
    if (property) {
      return property.value as boolean
    }
    return false
  }

  set disabled(val: boolean) {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '是否禁用')
    if (property) {
      property.value = val
    }
  }

  get zIndex(): number {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '层级设置')
    if (property) {
      return property.value
    } else {
      return null
    }
  }

  set zIndex(val: number) {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '层级设置')
    if (property) {
      property.value = val
    }
  }
  get tooltipText(): string {
    return null
  }

  created() {
    if (this.IsDesigning == true) {
      this.RegisterProperty('前景色', PropertyGroupName.normal, new Color_Property(), '#000000')
      this.RegisterProperty('权限设置', PropertyGroupName.normal, new Authority_Property())
      this.RegisterProperty('绑定模型', PropertyGroupName.normal, new BindingModels_Property(), [], true, false)
      this.RegisterProperty('是否禁用', PropertyGroupName.normal, new Boolean_Property(), false)
      this.RegisterProperty('是否显示', PropertyGroupName.normal, new Boolean_Property(), true, true)
      this.RegisterProperty('层级设置', PropertyGroupName.normal, new Number_Property(), 1)

      var numberproperty = new Number_Property()
      numberproperty.min = -99999
      this.RegisterProperty('外边距-左', PropertyGroupName.normal, numberproperty, 0, false, false, 'px')
      this.RegisterProperty('外边距-右', PropertyGroupName.normal, numberproperty, 0, false, false, 'px')
      this.RegisterProperty('外边距-上', PropertyGroupName.normal, numberproperty, 0, false, false, 'px')
      this.RegisterProperty('外边距-下', PropertyGroupName.normal, numberproperty, 0, false, false, 'px')
      this.RegisterProperty('内边距-左', PropertyGroupName.normal, numberproperty, 0, false, false, 'px')
      this.RegisterProperty('内边距-右', PropertyGroupName.normal, numberproperty, 0, false, false, 'px')
      this.RegisterProperty('内边距-上', PropertyGroupName.normal, numberproperty, 0, false, false, 'px')
      this.RegisterProperty('内边距-下', PropertyGroupName.normal, numberproperty, 0, false, false, 'px')
    }

    /**注册事件 */
    var inparams: param[] = []
    this.RegisterEvents('控件加载完成事件', '', inparams, null)
    this.$nextTick(() => {
      if (this.TriggeEvent) {
        // this.TriggeEvent('控件初始化完成事件', null)
      }
    })
  }

  mounted() {
    if (this.IsDesigning == true) {
      this.canDrop = false
      this.canDrag = true
      this.width = 200
      this.height = 200
      this.onDrag_Event = this.listenOnDrag
    }
    // this.onDragMove_Event = this.onDragMove
    this.$nextTick(() => {
      if (!this.TriggeEvent) {
        return
      }
      this.TriggeEvent('控件加载完成事件', null)
    })
  }

  rendered(dom: Element) {}
  // *******************************privates**************************************************************************************
  protected listenOnDrag(el: Element, dragdata: DragItemData<any>) {
    dragdata.type = DragItemTypeEnum.dragmove_component_inpage
    //window.console.log('comp listenOnDrag')
    dragdata.dragData = { compId: this.Id }
  }

  private analysisPropertyVal_UseModelBind(modelBindInfo: modelBingding, bindInfo: bindingModelVal_InProperty): any {
    if (modelBindInfo.modelBindingType == 2) {
      return modelBindInfo.val
    }

    if (!modelBindInfo.val && modelBindInfo.modelBindingType == 1) {
      modelBindInfo.val = new modelBingValue()
    }
    if (!modelBindInfo.val.data && modelBindInfo.modelBindingType == 1) {
      modelBindInfo.val.data = {}
    }
    /**查询结果是树 */
    if (modelBindInfo.modelDataType == modelDataTypeEnum.tree) {
      return (modelBindInfo.val as modelBingValue).data
    }

    if (bindInfo.bindType == bindTypeEnum.code) {
      //绑定到code
      if (modelBindInfo.modelDetailInfo.modelType == modelTypeEnum.TREE) {
        return (modelBindInfo.val as modelBingValue).data
      }
      /**分页查询结果 */
      if (modelBindInfo.val.data && modelBindInfo.val.data.content) {
        return (modelBindInfo.val as modelBingValue).data
      }

      if (bindInfo.modelCodes.length == 1) {
        return (modelBindInfo.val as modelBingValue).data[bindInfo.modelCodes[0].code]
      }

      if (isArray(modelBindInfo.val.data)) {
        return (modelBindInfo.val as modelBingValue).data
      } else {
        let newpropertyVal: any = {}

        for (let index = 0; index < bindInfo.modelCodes.length; index++) {
          const codeinfo = bindInfo.modelCodes[index]
          newpropertyVal[codeinfo.code] = (modelBindInfo.val as modelBingValue).data[codeinfo.code]
        }
        return newpropertyVal
      }
    } else if (bindInfo.bindType == bindTypeEnum.filter) {
      //绑定到filter
      let filter = modelBindInfo.modelFilters.find((o) => o.id == bindInfo.modelFilterId)
      if (filter) {
        return filter.value
      }
    } else if (bindInfo.bindType == bindTypeEnum.order) {
      //绑定到order
      let order = modelBindInfo.modelOrders.find((o) => o.code == bindInfo.modelOrderCode)
      if (order) {
        return order.val
      }
    }
  }
  private analysisModelBindVal_UsePropertyVal(modelbindInfo: modelBingding, bindInfo: bindingModelVal_InProperty, propertyVal: any): any {
    if (!modelbindInfo.val && modelbindInfo.modelBindingType == 2) {
      modelbindInfo.val = {}
    }
    if (!modelbindInfo.val && modelbindInfo.modelBindingType == 1) {
      modelbindInfo.val = new modelBingValue()
    }
    if (!modelbindInfo.val.data && modelbindInfo.modelBindingType == 1) {
      modelbindInfo.val.data = {}
    }

    if (modelbindInfo.modelBindingType == 2) {
      modelbindInfo.val = propertyVal
      return
    }

    /**查询结果是树 */
    if (modelbindInfo.modelDataType == modelDataTypeEnum.tree) {
      ;(modelbindInfo.val as modelBingValue).data = propertyVal
      return
    }

    if (bindInfo.bindType == bindTypeEnum.code) {
      ;(modelbindInfo.val as modelBingValue).modelCode = modelbindInfo.modelBindingInfo.modelCode

      /**分页查询结果 */
      if (propertyVal && propertyVal.content) {
        modelbindInfo.val.data = propertyVal
        return
      }
      if (modelbindInfo.modelDetailInfo.modelType == modelTypeEnum.TREE) {
        ;(modelbindInfo.val as modelBingValue).data = propertyVal
        return
      }
      if (bindInfo.modelCodes.length == 1) {
        var code = bindInfo.modelCodes[0].code
        ;(modelbindInfo.val as modelBingValue).data[code] = propertyVal
        return
      }
      /** */
      if (propertyVal && propertyVal.data) {
        propertyVal = propertyVal.data
      }
      /** */
      if (modelbindInfo.modelDataType == modelDataTypeEnum.list && isArray(propertyVal)) {
        ;(modelbindInfo.val as modelBingValue).data = propertyVal
      }
      if (modelbindInfo.modelDataType == modelDataTypeEnum.list && isObject(propertyVal)) {
        return
      } else if (modelbindInfo.modelDataType == modelDataTypeEnum.single && isArray(propertyVal)) {
        ;(modelbindInfo.val as modelBingValue).data = {}
      } else {
        if (!propertyVal) {
          return
        }
        for (let index = 0; index < bindInfo.modelCodes.length; index++) {
          const codeinfo = bindInfo.modelCodes[index]
          var code = codeinfo.code
          ;(modelbindInfo.val as modelBingValue).data[code] = propertyVal[code]
        }
      }

      return
    } else if (bindInfo.bindType == bindTypeEnum.filter) {
      //绑定到filter
      let filter = modelbindInfo.modelFilters.find((o) => o.id == bindInfo.modelFilterId)
      if (filter) {
        filter.value = propertyVal
      }

      return
    } else if (bindInfo.bindType == bindTypeEnum.order) {
      //绑定到order
      let order = modelbindInfo.modelOrders.find((o) => o.code == bindInfo.modelOrderCode)
      if (order) {
        order.val = propertyVal
      }
      return
    }
  }

  // *******************************protecteds**************************************************************************************
  /**模型绑定信息，关联到页面中所有的模型示例 */
  public get bindInfos(): bindingModelVal_InProperty[] {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '绑定模型')
    if (!property || !property.value) {
      return []
    }
    var val = property.value
    return val as bindingModelVal_InProperty[]
  }
  protected addPropertyModelBind(bindinfo: bindingModelVal_InProperty) {
    var property = this.FindPropertyByName(PropertyGroupName.normal, '绑定模型')
    if (!property || !property.value) {
      return
    }
    var findIndex = this.bindInfos.findIndex((o) => o.propertyId == bindinfo.propertyId)
    if (findIndex < 0) {
      ;(property.value as bindingModelVal_InProperty[]).push(bindinfo)
    } else {
      ;(property.value as bindingModelVal_InProperty[]).splice(findIndex, 1, bindinfo)
    }
  }
  protected async TriggeEvent(name: string, inparam: any) {
    if (!this.parentPage || this.parentPage.IsDesigning == true) {
      return
    }
    // window.console.log('触发事件:', name, this.$el)
    var event = this.DesignerEvents.find((o) => o.eventName == name)
    if (!event) {
      window.console.error('事件调用失败,该事件不存在')
      return
    }

    for (let index = 0; index < event.behaviorIds.length; index++) {
      const bid = event.behaviorIds[index]
      let behavior = this.parentPage.behaviors.find((o) => o.id == bid)
      if (!behavior) {
        continue
      }
      behavior.inparam = null
      if (inparam) {
        behavior.inparam = inparam
      }
      let actfac = new factory(this, this.parentPage, behavior)
      // console.info('behavior.inparam', behavior.inparam)
      try {
        actfac.exacteAction()
      } catch (error) {
        break
      } finally {
        behavior = null
        actfac = null
      }
    }
    //TODO 在事件设计的数据中找到事件,并调用事件
    return
  }
  /*属性值发生改变，需要改变它绑定的模型实例 */
  protected afterSetPropertyVal(propertyId: string, propertyVal: any) {
    var bindinfo = this.getPropertyBindInfo(propertyId)
    if (!bindinfo) {
      return
    }
    let modelbindInfo = this.parentPage.getModelBindInfo(bindinfo)
    //TODO 根据属性绑定的字段，更新模型实例的中的某些值，然后再通知其它的所有组件
    this.analysisModelBindVal_UsePropertyVal(modelbindInfo, bindinfo, propertyVal)

    if (modelbindInfo.modelBindingType == 2) {
      this.parentPage.setModelBindVal(bindinfo.modelName, modelbindInfo.val, propertyId)
    }
    if (modelbindInfo.modelBindingType == 1) {
      this.parentPage.setModelBindVal(bindinfo.modelName, modelbindInfo.val.data, propertyId)
    }
  }
  protected isHavePermission(authCode: string): boolean {
    if (!authCode) {
      return
    }

    if (this.IsDesigning == false) {
      var page = this.parentPage
      while (page.parentPage) {
        page = page.parentPage
      }
      if (!page.permissions) {
        return
      }
      var find = page.permissions.find((o) => o.permissionCode == authCode)
      if (find) {
        window.console.log('权限[' + authCode + ']，有权限', this.$el)
        return true
      } else {
        window.console.log('权限[' + authCode + ']，没有权限', this.$el)
        return false
      }
    }
    return
  }
  // *******************************publics**************************************************************************************
  /**获取属性绑定信息，绑定信息存在于组件中*/
  public getPropertyBindInfo(propertyId: string): bindingModelVal_InProperty {
    //获取属性的模型绑定信息
    if (this.bindInfos != null && this.bindInfos != undefined && propertyId && this.parentPage) {
      let bindInfo: bindingModelVal_InProperty = null
      for (let index = 0; index < this.bindInfos.length; index++) {
        const o = this.bindInfos[index]
        if (o.propertyId == propertyId && this.parentPage.getModelBindInfo(o)) {
          bindInfo = o
        }
      }

      if (bindInfo) {
        return bindInfo
      } else {
        return null
      }
    } else {
      return null
    }
  }
  /**获取属性绑定模型实例信息---模型实例存在于页面中*/
  public getPropertyBindModelInfo(propertyId: string): modelBingding {
    let bindInfo = this.getPropertyBindInfo(propertyId)
    if (bindInfo) {
      return this.parentPage.getModelBindInfo(bindInfo)
    } else {
      return null
    }
  }

  protected loadCompleted(childrenData: SaveInfo[]): void {
    /****************************权限判断**** */
    if (this.isHavePermission(this.authorityCode) == undefined) {
      return
    }

    if (this.isHavePermission(this.authorityCode) == false && this.display == true) {
      this.display = false
    }
    /******************************** */
  }

  //设置模型实例的数据，需要改变绑定它的属性
  public setModelBindInfo(modelBindName: string, modelBindInfo: modelBingding, sourcePropertyId?: string) {
    for (const bindInfo of this.bindInfos) {
      //设置模型实例值的时候，不改变来源属性的值
      if (bindInfo.propertyId == sourcePropertyId || bindInfo.modelName != modelBindName) {
        continue
      }
      // 根据属性绑定模型实例的字段信息，从模型实例中提取数据，作为新的属性值
      var newPropertyVal = this.analysisPropertyVal_UseModelBind(modelBindInfo, bindInfo)
      this.SetPropertyVal(bindInfo.propertyId, newPropertyVal, true)
    }
    for (let index = 0; index < this.layoutChildren.length; index++) {
      const innercomp = this.layoutChildren[index] as ComponentBase
      if (innercomp && innercomp.setModelBindInfo) {
        innercomp.setModelBindInfo(modelBindName, modelBindInfo, sourcePropertyId)
      }
    }
  }
  /**
   * 为验证属性添加模型绑定信息
   * modelproperty:模型属性信息
   * modelBindName:模型实例名称
   */
  public addValidatePropertyBindInfo(modelproperty: ModelProperty, modelBindName: string) {
    if (!this.validateProperty) {
      return
    }
    var newbindInfo = new bindingModelVal_InProperty()
    newbindInfo.bindType = bindTypeEnum.code
    newbindInfo.modelCodes = [{ code: modelproperty.propertyCode, codeName: modelproperty.propertyName, modelId: modelproperty.modelId }]
    newbindInfo.modelName = modelBindName
    newbindInfo.propertyId = this.validateProperty.id
    this.addPropertyModelBind(newbindInfo)
    this.curModelproperty = modelproperty
  }

  /**为组件添加模型验证信息 */
  // public addModelValidate(property?: ModelProperty) {
  //   // if (!this.validateProperty) {
  //   //   return
  //   // }
  //   if (property) {
  //     this.curModelproperty = property
  //   }
  //   if (this.curModelproperty.propertyName === '账号') {
  //     window.console.log('this.validateProperty', this.curModelproperty)
  //   }

  //   this.Decorator = new DecoratorOption()
  //   this.Decorator.rules = []
  //   var rule = new DecoratorRule()
  //   rule.whitespace = !this.curModelproperty.allowNull
  //   rule.required = !this.curModelproperty.allowNull
  //   rule.message = !this.curModelproperty.allowNull ? '请输入' + this.curModelproperty.propertyName : ''
  //   this.Decorator.rules.push(rule)

  //   rule = new DecoratorRule()
  //   rule.validator = (rule: any, value: any, callback: any) =>
  //     this.CommonValid(
  //       this.curModelproperty.propertyValidatorList,
  //       value,
  //       callback,
  //       !this.curModelproperty.allowNull ? '请输入' + this.curModelproperty.propertyName : ''
  //     )
  //   this.Decorator.rules.push(rule)
  // }

  /**通用的验证方法，根据编码获取 */
  public CommonValid(validatorArr: propertyValidator[], value: any, callback: any, message: any) {
    if (value === 0) {
      value = '0'
    }
    //根据模型编码获取验证库的验证方法
    if (value == Number.NaN || value == undefined || value == null || value == '') {
      callback()
      return
    }
    //解析方法，然后返回错误信息，funcCode就是方法名，入参固定传value，出参传boolean，根据出参判断是否提示
    for (let index = 0; index < validatorArr.length; index++) {
      const element = validatorArr[index]
      if (element.customFunction && element.customFunction.funcContent) {
        let func = element.customFunction.funcContent
        let validateRes = eval(func + ' ' + element.customFunction.funcCode + '(' + value + ')')
        if (!validateRes) {
          callback(element.errorMsg)
          return
        }
      }
    }
  }

  public getModelValidate(propCode: string) {}
}
