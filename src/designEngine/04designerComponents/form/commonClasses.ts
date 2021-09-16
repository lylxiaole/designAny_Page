import {
  ModelInfo,
  ModelBindingProperty,
  ModelPropertyType,
  modelSimpleInfo,
  modelDetailInfo,
  ModelProperty,
  DecoratorOption,
  DecoratorRule
} from '../../02common/impResourcesCache/modelAnalysis'

import { PropertyGroupName } from '../../02common/commonClasses/LayoutProperty'

import { ComponentBase } from '../index'

export var itemShowName: string = '表单项显示'
export var itemValidateStr: string = '表单项验证显示文字'
export var FormItemDataName: string = 'FormItemDataString'
export var layoutPropName: string = '布局方式'

export var LabelColSpanName: string = '标签占位'
export var LabelColOffsetName: string = '标签偏移'
export var WrapperColSpanName: string = '控件占位'
export var WrapperColOffsetName: string = '控件偏移'

export var MarginTop: string = '顶部边距'
export var MarginLeft: string = '左边距'
export var MarginRight: string = '右边距'
export var MarginBottom: string = '底部边距'

export var formItemGroupName: string = '表单项布局'
export class FormItemData {
  Id: string
  labelName: string
  itemValidateStr: string
  modelBindingName: string
  modelCode: string
  propertyCode: string
  isShow: boolean = true
  compType: string
  modelProperty?: ModelProperty
  decorator: DecoratorOption
  comp: ComponentBase
  compData: any
  compVirtualDom: DocumentFragment

  cloneFrom(data: FormItemData) {
    this.Id = data.Id
    this.labelName = data.labelName
    this.modelBindingName = data.modelBindingName
    this.modelCode = data.modelCode
    this.propertyCode = data.propertyCode
    this.isShow = data.isShow
    this.compType = data.compType
    this.modelProperty = data.modelProperty
    this.decorator = data.decorator
    this.comp = data.comp
    this.itemValidateStr = data.itemValidateStr
  }

  get formItemLayout(): any {
    if (!this.comp) {
      return { labelCol: { span: 10 }, wrapperCol: { span: 14 }, margin: [13, 0, 0, 0] }
    }

    var property1 = this.comp.FindPropertyByName(formItemGroupName, LabelColSpanName)
    var property2 = this.comp.FindPropertyByName(formItemGroupName, LabelColOffsetName)
    var property3 = this.comp.FindPropertyByName(formItemGroupName, WrapperColSpanName)
    var property4 = this.comp.FindPropertyByName(formItemGroupName, WrapperColOffsetName)
    //
    var property5 = this.comp.FindPropertyByName(formItemGroupName, MarginTop)
    var property6 = this.comp.FindPropertyByName(formItemGroupName, MarginBottom)
    var property7 = this.comp.FindPropertyByName(formItemGroupName, MarginLeft)
    var property8 = this.comp.FindPropertyByName(formItemGroupName, MarginRight)
    //*********为了适应mes3.1的ui规范做的脚本， */
    if (property5 && property5.value == 13) {
      property5.value = 3
    }

    return {
      labelCol: { span: property1.value, offset: property2.value },
      wrapperCol: { span: property3.value, offset: property4.value },
      margin: [property5.value, property8.value, property6.value, property7.value]
    }
  }
}
