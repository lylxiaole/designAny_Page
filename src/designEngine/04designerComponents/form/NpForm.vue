<template>
  <div>
    <a-form ref="form" :layout="formLayout" :form="form" :selfUpdate="true"
      :style="{backgroundColor:background,height:'100%','overflow':formOverflow}">
      <template v-for="item in ItemDataList" @click="()=>{onSelectFormItem(item)}">
        <div :style="itemBoardStyle(item.Id)" style="display:inline-block;*display:inline;*zoom:1; " :key="item.Id" @click="onSelectItem(item)">
          <a-form-item :style="{width:item.comp.width+'px',
            marginTop:item.formItemLayout.margin[0]+'px',
            marginRight:item.formItemLayout.margin[1]+'px',
            marginBottom:item.formItemLayout.margin[2]+'px',
            marginLeft: item.formItemLayout.margin[3]+'px'}" :label-col="item.formItemLayout.labelCol" :wrapper-col="item.formItemLayout.wrapperCol">
            <template slot="label">
              <span style="height:auto;width:100%">{{item.labelName}}</span>
            </template>
            <NpFormItem @onMounted="(itemcomp)=>{onFormItemMounted(itemcomp,item)}" style="width:100%;height:100%" :ref="item.Id" :id="item.Id"
              :form="form" :formItemData="item" v-decorator="[item.Id, item.decorator]" />
          </a-form-item>
          <div class="widget-view-action-left" v-show="IsDesigning&&itemIsSelected(item.Id)">
            <a-button type="link" icon="delete" @click="()=>{onFormItemDelete(item)}" ghost></a-button>
          </div>
          <div class="widget-view-action-left" v-show="IsDesigning&&itemIsSelected(item.Id)" style="margin-left:36px">
            <a-button type="link" :icon="item.comp.display==true?'eye-invisible':'eye'" @click="()=>{showOrHideItem(item.Id)}" ghost></a-button>
          </div>
          <!-- ******************************* -->
          <div class="widget-view-action-right" v-show="IsDesigning&&itemIsSelected(item.Id)" style="margin-right:36px">
            <a-button type="link" icon="arrow-up" @click="()=>{onChangeItemIndex(item,true)}" ghost></a-button>
          </div>
          <div class="widget-view-action-right" v-show="IsDesigning&&itemIsSelected(item.Id)">
            <a-button type="link" icon="arrow-down" @click="()=>{onChangeItemIndex(item,false)}" ghost></a-button>
          </div>
          <!-- ******************************* -->
        </div>
      </template>
      <div v-if="ItemCount===0">
        <a-empty />
      </div>
    </a-form>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { Property, Number_Property, NumberList_Property, Text_Property, Enum_Property, PropertyGroupName } from '../../03designerLayoutBase'
import modelAnalysis, {
  ModelInfo,
  ModelPropertyType,
  modelDetailInfo,
  ModelProperty,
  DecoratorOption,
  DecoratorRule
} from '../../02common/impResourcesCache/modelAnalysis'
import {
  FormItemData,
  itemShowName,
  itemValidateStr,
  FormItemDataName,
  layoutPropName,
  LabelColSpanName,
  LabelColOffsetName,
  WrapperColSpanName,
  WrapperColOffsetName,
  formItemGroupName,
  MarginTop,
  MarginLeft,
  MarginRight,
  MarginBottom
} from './commonClasses'
import { AllComponents } from '..'

import { ComponentBase } from '../../03designerLayoutBase'

import common from '../../02common/commonMethod'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import { CurrentApis } from '../../01designerContext'
import LayoutBase, { SaveInfo, LayoutInfo } from '../../03designerLayoutBase/LayoutBase'
import modelBingding, { bindingModelVal_InProperty } from '../../02common/commonClasses/modelBingding'
import NpFormItem from '../form/NpFormItem.vue'
import PageBase from '../../03designerLayoutBase/PageBase'
import { set } from 'xe-utils'
import btreeNode from '../../06propertyGrid/behaviorControl/behaviorTree/bTreeNode.vue'
import { param, paramType } from '../../03designerLayoutBase'

@Component({
  components: { NpFormItem: NpFormItem, btreeNode: btreeNode }
})
export default class NpForm extends ComponentBase {
  form: any
  private ItemDataList: FormItemData[] = []

  beforeCreate() {}

  created() {
    this.width = 400
    this.height = 600
    this.background = 'white'
    this.registerProperty(layoutPropName, PropertyGroupName.special, new Enum_Property(true, ['水平', '垂直', '单行']), '水平')
    this.registerProperty(FormItemDataName, PropertyGroupName.special, new Text_Property(), null, false)
    this.registerProperty(LabelColSpanName, PropertyGroupName.special, new Number_Property(0, 24), 4, false, false) //span
    this.registerProperty(LabelColOffsetName, PropertyGroupName.special, new Number_Property(0, 24), 0, false, false) //偏移位
    this.registerProperty(WrapperColSpanName, PropertyGroupName.special, new Number_Property(0, 24), 14, false, false) //span
    this.registerProperty(WrapperColOffsetName, PropertyGroupName.special, new Number_Property(0, 24), 0, false, false) //偏移位
    this.registerMethods('提交表单', '', this.submit, [], null)
    this.registerMethods('重置表单验证', '', this.resetForm, [], null)

    let keyparam: param[] = []
    keyparam.push({ name: '模型id', type: paramType.string, val: null })
    this.registerMethods('动态生成项目', '', this.createFormItems, keyparam, null)
  }

  mounted() {
    if (this.IsDesigning) {
      this.canDrop = true
      this.canDrag = false
    }

    // window.console.log('表单控件', this.layoutInfo)
  }

  /*********************for binding******************************************************/
  get formLayout(): string {
    let property = this.findPropertyByName(PropertyGroupName.special, layoutPropName)
    if (property && property.value) {
      let propertyValue: string
      let selectedValue = property.value as string
      switch (selectedValue) {
        case '水平':
          propertyValue = 'horizontal'
          break
        case '垂直':
          propertyValue = 'vertical'
          break
        case '单行':
          propertyValue = 'inline'
          break
        default:
          propertyValue = selectedValue
          break
      }
      //触发formItemLayout的get方法
      return propertyValue
    }
    return null
  }

  get ItemCount(): number {
    let count = this.ItemDataList.length
    return count
  }

  get formOverflow(): string {
    if (this.IsDesigning) {
      return 'auto'
    } else {
      return 'auto'
    }
  }

  private itemBoardStyle(formDataId: string): any {
    // window.console.log('item边框样式修改')
    let formData = this.ItemDataList.find((o) => o.Id == formDataId)
    let selectedStyle = { border: '2px dashed #faad14', padding: '-2px' }
    let unSelectedStyle = { border: '0px dashed #bfbfbfd9', padding: '-1px' }

    if (!formData) {
      return {}
    }
    let resStyle: any = {}
    if (this.IsDesigning == false) {
      resStyle = {}
    } else if (formData.comp.isSelected) {
      resStyle = selectedStyle
    } else {
      resStyle = unSelectedStyle
    }

    if (formData.comp.display == false && this.IsDesigning == false) {
      resStyle.display = 'none'
    }

    return resStyle
  }

  private itemIsSelected(formDataId: string): boolean {
    let formData = this.ItemDataList.find((o) => o.Id == formDataId)
    if (!formData) {
      return false
    }

    return formData.comp.isSelected
  }

  /*********************private******************************************************/
  private makeFormByModelDetail(model: ModelInfo) {
    // window.console.log('创建表单', model)
    if (!model) {
      return
    }
    // let modelBding: modelBingding = this.parentPage.createModelBindingByModel(model)
    // if (modelBding && model && model.modelPropertyList) {
    //   for (let index = 0; index < model.modelPropertyList.length; index++) {
    //     const x = model.modelPropertyList[index]
    //     this.prepareFormItem(x, modelBding)
    //   }
    // }
  }

  private getDecorator(itemdata: FormItemData): DecoratorOption {
    // if (property) {
    //   this.curModelproperty = property
    // }
    let property = itemdata.modelProperty
    let decorator = new DecoratorOption()
    decorator.rules = []
    let rule = new DecoratorRule()
    rule.whitespace = !property.allowNull
    rule.required = !property.allowNull
    if (itemdata.itemValidateStr) {
      rule.message = !property.allowNull ? itemdata.itemValidateStr : ''
    } else {
      rule.message = !property.allowNull ? '请输入' + property.propertyName : ''
    }
    decorator.rules.push(rule)

    rule = new DecoratorRule()
    rule.validator = (rule: any, value: any, callback: any) => {
      this.CommonValid(property.propertyValidatorList, value, callback, !property.allowNull ? '请输入' + property.propertyName : '')
    }
    decorator.rules.push(rule)
    return decorator
  }

  private makeInnerFormItem(data: FormItemData): LayoutBase {
    let layoutInfo = AllComponents.find((x) => x.compCode === data.compType)
    // window.console.log('makeInnerFormItem', layoutInfo)
    let layoutInfoclone = common.clone(layoutInfo)
    layoutInfoclone.data = data
    layoutInfoclone.isNew = true
    layoutInfo.component.compCode = data.compType
    return this.insertComponentLayout(layoutInfo.component, layoutInfoclone)
  }

  private submit(e) {
    // window.console.log('触发表单验证')
    let isPassValidate = null
    let res: any = {}
    let modelCode_ = ''
    for (let index = 0; index < this.ItemDataList.length; index++) {
      const o = this.ItemDataList[index]
      if (o.modelCode) {
        modelCode_ = o.modelCode
      }

      if (o.modelBindingName) {
        res[o.propertyCode] = o.comp.validateProperty.value
        let modelBindInfo = o.comp.getPropertyBindModelInfo(o.comp.validateProperty.id)
        if (modelBindInfo && modelBindInfo.modelBindingName == o.modelBindingName) {
          res.id = modelBindInfo.val.data.id
        }
      }

      this.form.validateFields([o.Id], { force: true }, (err, values) => {
        if (err) {
          isPassValidate = false
        }
        this.$nextTick(() => {
          $(this.$el)
            .find('.ant-form-explain')
            .css('bottom', '-13px')
          $(this.$el)
            .find('.ant-form-explain')
            .css('font-size', '12px')
        })
      })
    }

    if (isPassValidate == false) {
      throw null
    }

    return { modelCode: modelCode_, data: res }
  }
  private resetForm() {
    this.form.resetFields()
    for (const key in this.form.formItems) {
      if (Object.prototype.hasOwnProperty.call(this.form.formItems, key)) {
        const element = this.ItemDataList.find((o) => o.Id == key)
        if (element.comp.validateProperty) {
          let data = {}
          data[key] = element.comp.validateProperty.value
          this.form.setFieldsValue(data)
        }
      }
    }
  }

  private getNewModelProperty(modelCode: string, propertyCode: string): ModelProperty {
    let newmodelinfo = modelAnalysis.getModelInfoByCode(modelCode)
    return newmodelinfo.properties.find((o) => o.propertyCode == propertyCode)
  }

  /**upOrDown：true向上，false向下 */
  private onChangeItemIndex(data: FormItemData, upOrDown: boolean) {
    window.event.stopPropagation()
    this.parentPage.chooseComps([data.comp])

    /**调换item位置 */
    let changedIndex = upOrDown == true ? -1 : 1
    let itemIndex = this.ItemDataList.indexOf(data)
    this.ItemDataList.splice(itemIndex, 1)
    this.ItemDataList.splice(itemIndex + changedIndex, 0, data)
    /**调换children位置 */
    let childIndex = this.children.indexOf(data.comp)
    this.children.splice(childIndex, 1)
    this.children.splice(childIndex + changedIndex, 0, data.comp)
    this.onComponentChildrenCountChange()
  }

  private showOrHideItem(itemId: string) {
    let item = this.ItemDataList.find((o) => o.Id == itemId)
    if (!item) {
      return
    }
    item.comp.display = !item.comp.display
  }

  private onItemNameChanged(itemId: string, newtitle: string) {
    let item = this.ItemDataList.find((o) => o.Id == itemId)
    item.labelName = newtitle

    let propertyFind = item.comp.findPropertyByName(PropertyGroupName.special, itemShowName)
    if (propertyFind) {
      item.comp.setPropertyVal(propertyFind.id, newtitle)
    }

    this.onChildrenCountChange()
  }

  private onSelectItem(data: FormItemData) {
    window.event.stopPropagation()
    this.parentPage.chooseComps([data.comp])
  }
  /*********************protected******************************************************/
  protected renderChildFromData(data: SaveInfo) {
    // let compclass = this.findSystemComp(data.layoutInfo.groupName, data.layoutInfo.name)
    // if (!compclass) {
    //   return
    // }
    // this.insertComponentLayout(compclass, data.layoutInfo, null, data)
  }

  protected renderComponent(dropcomp: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum, data?: SaveInfo): LayoutBase {
    // window.console.log('绘制表单子组件')
    if (!layoutInfo) {
      return
    }
    let numberProperty = new Number_Property()
    numberProperty.min = -9999
    numberProperty.max = 9999
    /**表单项显示名称 */
    dropcomp.registerProperty(itemShowName, PropertyGroupName.special, new Text_Property(), null)
    dropcomp.registerProperty(itemValidateStr, PropertyGroupName.special, new Text_Property(), null)
    /***************************** */
    dropcomp.registerProperty(LabelColSpanName, formItemGroupName, { ...numberProperty }, 10, true, true)
    dropcomp.registerProperty(LabelColOffsetName, formItemGroupName, { ...numberProperty }, 0, true, true)
    dropcomp.registerProperty(WrapperColSpanName, formItemGroupName, { ...numberProperty }, 14, true, true)
    dropcomp.registerProperty(WrapperColOffsetName, formItemGroupName, { ...numberProperty }, 0, true, true)
    dropcomp.registerProperty(MarginTop, formItemGroupName, { ...numberProperty }, 3, true, true, 'px')
    dropcomp.registerProperty(MarginBottom, formItemGroupName, { ...numberProperty }, 0, true, true, 'px')
    dropcomp.registerProperty(MarginLeft, formItemGroupName, { ...numberProperty }, 0, true, true, 'px')
    dropcomp.registerProperty(MarginRight, formItemGroupName, { ...numberProperty }, 0, true, true, 'px')
    /***************************** */
    if (layoutInfo.data) {
      this.renderFormComp(dropcomp, layoutInfo, dragType, data)
    } else {
      this.renderSystemComp(dropcomp, layoutInfo, dragType, data)
    }
    dropcomp.parentLayout = this
    dropcomp.parentPage = this.parentPage
    dropcomp.$on('onPropertyChanged', this.onFormItemCompPropertyChanged)
    return dropcomp
  }

  protected listenOnDrag(el: Element, dragdata: DragItemData<any>) {
    dragdata.type = DragItemTypeEnum.drag_compInForm
    dragdata.dragData = { compId: this.Id }
    return false
  }
  protected listenOnDragMove(xchanged: number, ychanged: number, left: number, top: number, el: Element, dragdata?: DragItemData<any>): boolean {
    return false
  }

  private renderFormComp(dropcomp: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum, data?: SaveInfo) {
    let item: FormItemData = new FormItemData()
    item.cloneFrom(layoutInfo.data)
    item.modelProperty = this.getNewModelProperty(item.modelCode, item.propertyCode)

    // if (!item.modelProperty) {
    //   //虚模型无法从之前的模型属性中获取到，需要使用虚模型信息
    //   let modelBind = this.parentPage.modelBindings.find((o) => o.modelBindingName == item.modelBindingName)
    //   if (modelBind && modelBind.virtualModelPropertyList && modelBind.virtualModelPropertyList.length > 0) {
    //     let property = modelBind.virtualModelPropertyList.find((single) => single.propertyCode == item.propertyCode)
    //     if (property) {
    //       item.modelProperty = property
    //     }
    //   }
    // }

    if (!item.modelProperty) {
      return null
    }

    if (data) {
      let finddata = data.properties.find((o) => o.propertyName == itemShowName && o.groupName == PropertyGroupName.special)
      item.labelName = finddata ? finddata.value : ''
      finddata = data.properties.find((o) => o.propertyName == itemValidateStr && o.groupName == PropertyGroupName.special)
      item.itemValidateStr = finddata ? finddata.value : ''
    } else {
      item.labelName = item.modelProperty.propertyName
      let fproperty = dropcomp.findPropertyByName(PropertyGroupName.special, itemShowName)
      dropcomp.setPropertyVal(fproperty.id, item.labelName)
    }

    item.decorator = this.getDecorator(item)
    item.comp = dropcomp
    item.compData = data

    this.ItemDataList.push(item)
    let prop = item.modelProperty

    let bindname = item.modelBindingName
    if (item.modelProperty.propertyType == ModelPropertyType.ENUM || item.modelProperty.propertyType == ModelPropertyType.ENUMARRAY) {
      ;(dropcomp as any).dictID = item.modelProperty.dictId
    }
    dropcomp.$on('onPropertyChanged', this.onItemCompPropertyChanged)
  }

  private renderSystemComp(dropcomp: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum, data?: SaveInfo) {
    // window.console.log('renderSystemComp', data)
    let newid = common.getUuid()
    let item: FormItemData = new FormItemData()
    item.Id = common.getUuid()
    if (!data) {
      item.labelName = layoutInfo.name
    } else {
      let finddata = data.properties.find((o) => o.propertyName == itemShowName && o.groupName == PropertyGroupName.special)
      item.labelName = finddata ? finddata.value : ''

      finddata = data.properties.find((o) => o.propertyName == itemValidateStr && o.groupName == PropertyGroupName.special)
      item.itemValidateStr = finddata ? finddata.value : ''
    }
    item.propertyCode = newid
    item.comp = dropcomp
    item.compData = data
    this.ItemDataList.push(item)
    dropcomp.$on('onPropertyChanged', this.onItemCompPropertyChanged)
  }
  private onFormItemMounted(formitemComp: NpFormItem, item: FormItemData) {
    let find = this.ItemDataList.find((o) => o.comp == item.comp)
    let prop = find.modelProperty
    let bindname = find.modelBindingName
    if (find.modelProperty) {
      find.comp.defaultValue = find.modelProperty.defaultValue
      find.comp.curModelproperty = find.modelProperty
    }

    formitemComp.mountComp(find.comp)
    if (find.compData) {
      find.comp.LoadData(find.compData)
    }
    if (!find.comp.name) {
      find.comp.name = find.labelName
    }
    if (find.modelProperty) {
      find.comp.addValidatePropertyBindInfo(prop, bindname)
    }
    this.$forceUpdate()
  }

  private onFormItemCompPropertyChanged(propertyId: string, property: Property, layout: LayoutBase) {
    let find = this.ItemDataList.find((o) => o.comp == layout)
    if (property.propertyName == itemShowName && property.groupName == PropertyGroupName.special) {
      find.labelName = property.value
    } else if (property.propertyName == itemValidateStr && property.groupName == PropertyGroupName.special) {
      find.itemValidateStr = property.value
    }
  }

  private onItemCompPropertyChanged(propertyId: string, property: Property, comp: ComponentBase) {
    if (property.propertyName == '绑定模型') {
      // this.watchOnSystemCompBind(comp, comp.bindInfos)
    }
  }

  private watchOnSystemCompBind(comp: ComponentBase, newval: bindingModelVal_InProperty[]) {
    // window.console.log('绑定信息变了')
    // if (comp.validateProperty == null) {
    //   return
    // }
    // let bindinfo = newval.find((o) => o.propertyId == comp.validateProperty.id)
    // if (!bindinfo || (bindinfo && bindinfo.modelCodes.length < 1)) {
    //   if (comp.layoutInfo.data) {
    //     comp.layoutInfo.data = null
    //   }
    //   return
    // }
    // let modelBind = this.parentPage.getModelBindInfo(bindinfo)
    // if (!modelBind) {
    //   return
    // }
    // let newformItemData: FormItemData = this.ItemDataList.find((o) => o.comp == comp)
    // newformItemData.labelName = bindinfo.modelCodes[0].codeName
    // newformItemData.modelBindingName = modelBind.modelBindingName
    // newformItemData.propertyCode = bindinfo.modelCodes[0].code
    // newformItemData.compType = comp.layoutInfo.type
    // newformItemData.modelCode = modelBind.modelBindingInfo.modelCode
    // newformItemData.modelProperty = this.getNewModelProperty(newformItemData.modelCode, newformItemData.propertyCode)
    // newformItemData.decorator = this.getDecorator(newformItemData)
    // if (
    //   newformItemData.modelProperty.propertyType == ModelPropertyType.ENUM ||
    //   newformItemData.modelProperty.propertyType == ModelPropertyType.ENUMARRAY
    // ) {
    //   ;(comp as any).dictID = newformItemData.modelProperty.dictId
    // }
    // let fproperty = comp.findPropertyByName(PropertyGroupName.special, itemShowName)
    // comp.setPropertyVal(fproperty.id, newformItemData.labelName)
    // fproperty = comp.findPropertyByName(PropertyGroupName.special, itemValidateStr)
    // comp.setPropertyVal(fproperty.id, newformItemData.itemValidateStr)
    // let cloneitem = { ...newformItemData }
    // cloneitem.comp = null
    // comp.layoutInfo.data = cloneitem
  }
  /*********************Item组件的触发事件 *********************************************/
  private onFormItemDelete(itemdata: FormItemData) {
    let dataIndex = this.ItemDataList.indexOf(itemdata)
    this.parentPage.chooseComps([this.ItemDataList[dataIndex].comp])

    // this.$confirm({
    //   title: '确定要删除吗?删除后不能恢复!',
    //   okText: '确定',
    //   okType: 'danger',
    //   cancelText: '取消',
    //   onOk: () => {
    //     this.removeChild(this.ItemDataList[dataIndex].comp)
    //     this.ItemDataList.splice(dataIndex, 1)
    //   },
    //   onCancel: () => {}
    // })
  }

  /** 动态生成form表单的项目
   * 两个步骤，第一步，模型实例添加字段，第二步，根据模型实例的字段类型来动态生成组件
   * 自动关联模型实例
   */
  private createFormItems(param: any) {
    //window.console.log('------------------动态生成form表单参数', param)
    if (param instanceof Array && param.length > 0) {
      let modelDetail = {}
      let modelBind: any = {}
      if (this.ItemDataList && this.ItemDataList.length > 0) {
        let item = this.ItemDataList[0]
        // modelBind = this.parentPage.modelBindings.find((o) => o.modelBindingName == item.modelBindingName)
        // if (modelBind.virtualModelPropertyList && modelBind.virtualModelPropertyList.length > 0) {
        //   //清理下之前的虚模型数据
        //   modelBind.virtualModelPropertyList.forEach((element) => {
        //     let dataIndex = this.ItemDataList.findIndex((item) => item.propertyCode == element.propertyCode)
        //     if (dataIndex > -1) {
        //       this.removeChild(this.ItemDataList[dataIndex].comp)
        //       this.ItemDataList.splice(dataIndex, 1)
        //     }
        //   })
        // }
      }
      CurrentApis.GetVirtulModelById(param[0]).then((res: any) => {
        if (res instanceof Array && res.length > 0) {
          //重新排序
          res.sort(function(a, b) {
            return a.sortNo - b.sortNo
          })

          if (this.ItemDataList && this.ItemDataList.length > 0) {
            //window.console.log('------------------动态生成form表单参数res', this.ItemDataList)
            modelBind.virtualModelPropertyList = res
            //动态生成的时候把状态修改为设计状态，不然会缺失很多组件初始化方法
            this.IsDesigning = true
            res.forEach((x) => {
              var fromitemdata = this.prepareFormItem(x, modelBind, true)
              this.$nextTick(() => {
                let comp = this.children.find((single) => single.name == fromitemdata.labelName) as ComponentBase
                comp.width = this.ItemDataList[0].comp.width
                comp.findPropertyByName(formItemGroupName, LabelColSpanName).value = this.ItemDataList[0].comp.findPropertyByName(
                  formItemGroupName,
                  LabelColSpanName
                ).value
                comp.findPropertyByName(formItemGroupName, LabelColOffsetName).value = this.ItemDataList[0].comp.findPropertyByName(
                  formItemGroupName,
                  LabelColOffsetName
                ).value
                comp.findPropertyByName(formItemGroupName, WrapperColSpanName).value = this.ItemDataList[0].comp.findPropertyByName(
                  formItemGroupName,
                  WrapperColSpanName
                ).value
                comp.findPropertyByName(formItemGroupName, WrapperColOffsetName).value = this.ItemDataList[0].comp.findPropertyByName(
                  formItemGroupName,
                  WrapperColOffsetName
                ).value
                comp.findPropertyByName(formItemGroupName, MarginTop).value = this.ItemDataList[0].comp.findPropertyByName(
                  formItemGroupName,
                  MarginTop
                ).value
                comp.findPropertyByName(formItemGroupName, MarginBottom).value = this.ItemDataList[0].comp.findPropertyByName(
                  formItemGroupName,
                  MarginBottom
                ).value
                comp.findPropertyByName(formItemGroupName, MarginLeft).value = this.ItemDataList[0].comp.findPropertyByName(
                  formItemGroupName,
                  MarginLeft
                ).value
                comp.findPropertyByName(formItemGroupName, MarginRight).value = this.ItemDataList[0].comp.findPropertyByName(
                  formItemGroupName,
                  MarginRight
                ).value
              })
            })
            this.$nextTick(() => {
              //生成之后把状态切换成非设计状态
              this.IsDesigning = false
            })
          }
        }
      })
    }
  }

  /** 准备formitem数据 */
  private prepareFormItem(x: any, modelBind: any, issetdefault = false): FormItemData {
    let compType: string = null
    switch (x.propertyType) {
      case ModelPropertyType.EXPRESSION:
      case ModelPropertyType.STRING:
        {
          compType = 'InputComponent' //'input'
        }
        break
      case ModelPropertyType.INT:
      case ModelPropertyType.FLOAT:
        {
          compType = 'InputNumberComponent' //'input-number'
        }
        break
      case ModelPropertyType.DATE:
        {
          compType = 'DatePickerCom' //'datepicker'
        }
        break
      case ModelPropertyType.BOOL:
        {
          compType = 'SwitchComponent' //'switchComponent'
        }
        break
      case ModelPropertyType.ENUM:
        {
          compType = 'SelectSingleComponent' //'selectSingleComponent'
        }
        break
      case ModelPropertyType.ENUMARRAY:
        {
          compType = 'SelectMultipleComponent' //'SelectMultipleComponent'
        }
        break
      case ModelPropertyType.BIGTEXT:
        {
          compType = 'TextAreaComponent' //'SelectMultipleComponent'
        }
        break
      default:
        break
    }
    if (compType) {
      let item = new FormItemData()
      item.Id = common.getUuid()
      item.labelName = x.propertyName
      item.modelBindingName = modelBind.modelBindingName
      item.modelCode = modelBind.modelDetailInfo.modelCode
      item.propertyCode = x.propertyCode
      item.modelProperty = x
      item.compType = compType
      var comp = this.makeInnerFormItem(item)

      // if (issetdefault) {
      //   this.$nextTick(() => {
      //     if (this.$refs[item.Id]) {
      //       let formitemComp = this.$refs[item.Id][0] as NpFormItem
      //       let comp = this.children.find((single) => single.name == item.labelName) as ComponentBase
      //       comp.setPropertyVal(comp.validateProperty.id, modelBind.val.data[item.propertyCode])
      //     }
      //   })
      // }
      return item
    }
  }
}
</script>
<style scoped>
.widget-view-action-left {
  position: relative;
  margin-top: -32px;
  z-index: 999;
  float: left;
  background: #faad14;
}

.widget-view-action-right {
  position: relative;
  margin-top: -32px;
  z-index: 999;
  float: right;
  background: #faad14;
}

.widget-view-model {
  position: relative;
  top: -20px;
  right: 3px;
  float: right;
  font-size: 12px;
  color: #faad14;
  z-index: 999;
}
</style>
