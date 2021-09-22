/**
 * 单选按钮
 * By GG   background:backgroundColor,
 */
<template>
  <div style="margin-left:15px">
    <a-radio-group :disabled="disabled" @change="onChange" v-model="vmodel" size="large">
      <a-radio v-for="(item,index) in dictOptions" :key="index" :value="item.item_value" :style="{ display: displayOrder,        
        color: fontColor, fontSize: fontSize + 'px'}" :disabled="item.disabled">
        {{item.item_name}}
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Number_Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  Boolean_Property,
  EnumModal_Property
} from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import BaseEvents from '../../03designerLayoutBase/BaseEvents'
import common from '../../02common/commonMethod'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import { CurrentApis, CurrentContext } from '../../01designerContext'
import { bindTypeEnum } from '../../02common/commonClasses/modelBingding'
import { ModelPropertyType } from '../../02common/impResourcesCache/modelAnalysis'
import { dictCache, functionCache, modelMapperCache } from '../../02common/impResourcesCache/'
import { param, paramType } from '../../03designerLayoutBase'

class radioData {
  label: string
  value: string
  disabled: boolean
}
@Component
export default class RadioComponent extends ComponentBase {
  private dictOptions: any[] = [{ item_value: '0', item_name: 'A' }, { item_value: '1', item_name: 'B' }, { item_value: '2', item_name: 'C' }]

  inparam: param[]
  outparam: param

  @Prop()
  dictID: string
  @Prop()
  value: string

  @Watch('value')
  valueChange() {
    this.vmodel = this.value
  }
  @Watch('dictID')
  changVal() {
    if (this.dictID !== undefined) {
      this.initDictData()
    }
  }

  mounted() {
    //注册特有属性
    this.registerProperty('排列顺序', PropertyGroupName.special, new Enum_Property(true, ['水平', '垂直']), '水平')
    this.registerProperty('数据源', PropertyGroupName.special, null, null, true, true)
    this.registerProperty('选择枚举', PropertyGroupName.special, new EnumModal_Property())
    this.registerProperty('是否禁用选中项', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('是否支持布尔', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('展示值', PropertyGroupName.special, new Text_Property(), '')

    this.registerProperty('禁用某些项', PropertyGroupName.special, new Text_Property(), '')

    this.registerProperty('当前选项值', PropertyGroupName.special, null, undefined, true, true)
    this.registerEvents('值改变事件', '', this.inparam, this.outparam)
    this.initDictData()
    //属性改变触发
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
  }

  protected loadCompleted(childrenData: any[]) {
    let dataSource = this.findPropertyByName(PropertyGroupName.special, '数据源')
    if (dataSource.value) {
      this.dictOptions = dataSource.value
      console.log('this.dictOptions1: ', this.dictOptions)
    } else {
      let property = this.findPropertyByName(PropertyGroupName.special, '选择枚举')
      if (property.value) {
        property.value
          .sort((o1, o2) => {
            return o1.item_value - o2.item_value
          })
          .forEach((element) => {
            element.item_value += ''
          })
        this.dictOptions = property.value
        console.log('this.dictOptions2: ', this.dictOptions)
      }
      let boolProp = this.findPropertyByName(PropertyGroupName.special, '是否支持布尔')
      if (boolProp && (boolProp.value as boolean) === true) {
        this.dictOptions = []
        this.dictOptions.push({
          item_value: '1',
          item_name: this.findPropertyByName(PropertyGroupName.special, '展示值').value
        })
      }
    }
  }

  private initDictData() {
    let aray = []
    let param = {
      filter: [
        {
          code: 'sys_dict_view__id',
          value: this.dictID,
          type: 'EQ'
        }
      ],
      modelCode: 'DictView'
    }
    if (!this.dictID) return

    // let dict = CurrentApis.GetSysDictById(this.dictID) as any
    let dict = dictCache.getSystemDictById_Sync(this.dictID) as any
    console.log('dict: ', dict)
    if (dict) {
      let itemList = dict
      itemList.forEach((item) => {
        if (!item.deleted) {
          aray.push({
            item_name: item.item_name,
            item_value: item.item_value + ''
          })
        }
      })
      this.dictOptions = aray
      let prop = this.findPropertyByName(PropertyGroupName.special, '数据源')
      if (prop) {
        this.setPropertyVal(prop.id, aray)
      }
      // this.triggeEvent('控件加载完成事件', null)
    }
  }

  /**需要绑定选中值 */
  public get validateProperty(): Property {
    var property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    return property
  }
  get vmodel(): any {
    var property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    var isbool = this.findPropertyByName(PropertyGroupName.special, '是否支持布尔')
    var displayText = this.findPropertyByName(PropertyGroupName.special, '展示值')
    var ischooseItems = this.findPropertyByName(PropertyGroupName.special, '禁用某些项')
    if (isbool && (isbool.value as boolean) === true) {
      displayText.canSetting = true
    } else {
      if (displayText) {
        displayText.canSetting = false
      }
    }
    this.isDisableChooseItems()
    let data = ''
    let result = property ? (property.value != undefined && property.value != null && property.value != '' ? property.value : undefined) : undefined
    if (result && result.constructor != String) {
      if (result.itemValue !== undefined) {
        data = result.itemValue + ''
      } else {
        data = result + ''
      }
      this.setPropertyVal(property.id, data.toString())
      this.$emit('change', data.toString())
      this.triggeEvent('值改变事件', null)
      //window.console.log('单选框选中值改变了 ')
    } else {
      data = result
    }
    if (ischooseItems && ischooseItems.value !== '') {
      this.disableItems()
    }
    return data !== undefined ? data.toString() : data
  }
  set vmodel(val: any) {
    var property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    //window.console.log('当前选项值: ', property)

    let data = ''
    let result =
      val.constructor == String ? val : val ? (val.value != undefined && val.value != null && val.value != '' ? val.value : undefined) : undefined
    if (result) {
      if (result.itemValue !== undefined) {
        data = result.itemValue + ''
      } else {
        data = result + ''
      }
    } else {
      data = result
    }

    this.setPropertyVal(property.id, data.toString())
    this.$emit('change', data.toString())
    this.triggeEvent('值改变事件', null)
  }
  private isDisableChooseItems(): void {
    var ischooseItems = this.findPropertyByName(PropertyGroupName.special, '是否禁用选中项')
    if (ischooseItems && (ischooseItems.value as boolean) === true) {
      if (this.dictOptions !== undefined) {
        this.dictOptions.forEach((element) => {
          element.disabled = true
        })
      }
    } else {
      if (this.dictOptions !== undefined) {
        this.dictOptions.forEach((element) => {
          element.disabled = false
        })
      }
    }
  }

  private disableItems(): void {
    var ischooseItems = this.findPropertyByName(PropertyGroupName.special, '禁用某些项')
    //console.log('ischooseItems: ', ischooseItems)
    if (ischooseItems && ischooseItems.value !== '') {
      let items = ischooseItems.value.toString().split(',')
      if (this.dictOptions !== undefined) {
        this.dictOptions.forEach((element) => {
          items.forEach((item) => {
            if (element.item_value === item) {
              element.disabled = true
            }
          })
        })
      }
    } else {
      if (this.dictOptions !== undefined) {
        this.dictOptions.forEach((element) => {
          element.disabled = false
        })
      }
    }
  }

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    switch (property.propertyName) {
      case '绑定模型':
        if (!this.bindInfos || this.bindInfos.length <= 0) {
          return
        }
        var modelBind = this.parentPage.modelBindings.find((o) => o.modelBindingName == this.bindInfos[0].modelName)
        var bindType = []
        property.value.forEach((element) => {
          if (element.bindType === bindTypeEnum.filter) {
            bindType.push(element)
          }
        })
        var bindCode = []
        property.value.forEach((element) => {
          if (element.bindType === bindTypeEnum.code) {
            bindCode.push(element)
          }
        })
        if (modelBind) {
          if (property.value.length > 0 && bindType.length > 0) {
            if (modelBind.modelFilters && modelBind.modelFilters.length > 0) {
              let filter = modelBind.modelFilters.find((item) => item.id === property.value[0].modelFilterId)
              if (!filter) {
                return
              }
              let enumProp = modelBind.modelDetailInfo.modelPropertyList.find((item) => item.propertyCode === filter.code)
              if (!enumProp) {
                return
              }
              if (enumProp && enumProp.propertyType === ModelPropertyType.ENUM && enumProp.dictId) {
                this.dictID = enumProp.dictId
              }
            }
          }
        }

        //也可以绑定数据源，非表单操作
        if (property.value.length > 0 && bindCode.length > 0) {
          if (property.value[0].modelCodes && property.value[0].modelCodes.length > 0) {
            let enumProp = modelBind.modelDetailInfo.modelPropertyList.find((item) => item.propertyCode === property.value[0].modelCodes[0].code)
            if (!enumProp) {
              return
            }
            if (enumProp && enumProp.propertyType === ModelPropertyType.ENUM && enumProp.dictId) {
              this.dictID = enumProp.dictId
            }
          }
        }
        this.findPropertyByName(PropertyGroupName.special, '选择枚举').value = undefined
        this.findPropertyByName(PropertyGroupName.special, '是否支持布尔').value = false
        break
      case '选择枚举':
        this.dictOptions = []
        if (property.value) {
          property.value
            .sort((o1, o2) => {
              return o1.item_value - o2.item_value
            })
            .forEach((element) => {
              element.item_value += ''
            })
          this.dictOptions = property.value
          console.log('this.dictOptions: ', this.dictOptions)
          this.findPropertyByName(PropertyGroupName.special, '数据源').value = undefined
        }
        break
      case '展示值':
        var boolProp = this.findPropertyByName(PropertyGroupName.special, '是否支持布尔')
        if (boolProp && (boolProp.value as boolean) === true) {
          this.dictOptions = []
          this.dictOptions.push({
            item_value: '1',
            item_name: this.findPropertyByName(PropertyGroupName.special, '展示值').value
          })
        }
        this.findPropertyByName(PropertyGroupName.special, '选择枚举').value = undefined
        this.findPropertyByName(PropertyGroupName.special, '数据源').value = undefined
        break
    }
  }
  //特有属性
  get displayOrder(): string {
    if (this.findProperties(PropertyGroupName.special, '排列顺序')[0]) {
      return (this.findProperties(PropertyGroupName.special, '排列顺序')[0].value as string) == '垂直' ? 'block' : 'inline'
    }
    return null
  }
  get optionsWithDisabled(): radioData {
    if (this.findProperties(PropertyGroupName.special, '数据源')[0]) {
      return this.findProperties(PropertyGroupName.special, '数据源')[0].value
    }
    return null
  }
  //公有属性
  get fontColor(): string {
    if (this.findProperties(PropertyGroupName.normal, '前景色')[0]) {
      return this.findProperties(PropertyGroupName.normal, '前景色')[0].value as string
    }
    return null
  }

  get fontSize(): string {
    if (this.findProperties(PropertyGroupName.normal, '字体')[0]) {
      return this.findProperties(PropertyGroupName.normal, '字体')[0].value as string
    }
    return null
  }
  get backgroundColor(): string {
    if (this.findProperties(PropertyGroupName.normal, '背景色')[0]) {
      return this.findProperties(PropertyGroupName.normal, '背景色')[0].value as string
    }
    return null
  }

  //事件
  private onChange(e: any) {}
}
</script>
<style scoped>
</style>

