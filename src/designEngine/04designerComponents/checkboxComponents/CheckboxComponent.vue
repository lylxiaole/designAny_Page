<template>
  <div>
    <div :style="{ borderBottom: '1px solid #E9E9E9',display: displayBottom, }">
      <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll" :style="{display:checkAllDisplay}">
        全选
      </a-checkbox>
    </div>
    <a-checkbox-group :disabled="disabled" v-model="vmodel" @change="onChange">
      <a-checkbox :disabled='item.disabled' :style="checkboxGroupItemStyle" v-for="(item,index) in dictOptions" :key="index" :value="item.item_value">
        {{ item.item_name }}
      </a-checkbox>
    </a-checkbox-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { Property, Text_Property, Enum_Property, Boolean_Property, PropertyGroupName, EnumModal_Property } from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import { getUuid, deepClone,BuildingFileUrlForShow } from '@src/utils'
import fileUpload from '../../02common/uploadFile/fileUpload'
import { CurrentContext } from '../../01designerContext'
import { bindTypeEnum } from '../../02common/commonClasses/modelBingding'
import { ModelPropertyType } from '../../02common/impResourcesCache/modelAnalysis'
import { dictCache } from '../../02common/impResourcesCache/'
import { param } from '../../03designerLayoutBase'

class checkData {
  label: string
  value: string
  disabled: boolean
}

@Component
export default class CheckboxComponent extends ComponentBase {
  public indeterminate: boolean = false
  public checkAll: boolean | any = false
  public fileUploadClass: fileUpload = null
  private displayBottom: string = 'block'
  private dictOptions: any[] = [
    { item_value: '0', item_name: 'A' },
    { item_value: '1', item_name: 'B' },
    {
      item_value: '2',
      item_name: 'C'
    }
  ]
  // private defaultVal: any[] = ['0', '1']
  inparam: param[]
  outparam: param

  @Prop()
  dictID: string

  @Prop()
  value: string

  @Watch('dictID')
  changVal() {
    if (this.dictID !== undefined) {
      this.initDictData()
    }
  }

  mounted() {
    //注册特有属性
    this.registerProperty('排列顺序', PropertyGroupName.special, new Enum_Property(true, ['水平', '垂直']), '水平')
    this.registerProperty('是否支持全选', PropertyGroupName.special, new Enum_Property(true, ['是', '否']), '否')
    this.registerProperty('选择枚举', PropertyGroupName.special, new EnumModal_Property())
    this.registerProperty('是否禁用选中项', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('是否支持布尔', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('是否字符串格式存储', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('展示值', PropertyGroupName.special, new Text_Property(), '')
    this.registerProperty('数据源', PropertyGroupName.special, null, null, true, true)
    this.registerProperty('当前选项值', PropertyGroupName.special, null, undefined, true, true)
    this.registerEvents('值改变事件', '', this.inparam, this.outparam)
    this.initDictData()
    //属性改变触发
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
  }

  private get checkboxGroupItemStyle(): any {
    return {
      margin: '0',
      display: this.displayOrder,
      color: this.fontColor,
      fontSize: this.fontSize + 'px',
      backgroundImage: this.bgImage
    }
  }

  private initDictData() {
    var aray = []
    var param = {
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

    let dict = dictCache.getSystemDictById_Sync(this.dictID) as any
    // let dict = CurrentApis.GetSysDictById(this.dictID) as any
    if (dict) {
      let itemList = dict
      for (let index = 0; index < itemList.length; index++) {
        const item = itemList[index]
        if (!item.deleted) {
          aray.push({
            item_name: item.item_name,
            item_value: item.item_value + ''
          })
        }
      }

      this.dictOptions = aray
      let prop = this.findPropertyByName(PropertyGroupName.special, '数据源')
      if (prop) {
        this.setPropertyVal(prop.id, aray)
      }

      this.triggeEvent('控件加载完成事件', null)
    }
  }

  private onChange(value: any) {
    var property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    var isStr = this.findPropertyByName(PropertyGroupName.special, '是否字符串格式存储')
    if (isStr && (isStr.value as boolean) === true) {
      this.setPropertyVal(property.id, value.toString())
      this.$emit('change', value.toString())
      //console.log('value值改变事件: ', value.toString())
    } else {
      this.setPropertyVal(property.id, value)
      this.$emit('change', value)
    }
    this.triggeEvent('值改变事件', null)
    this.indeterminate = !!value.length && value.length < this.dictOptions.length
    this.checkAll = value.length === this.dictOptions.length
  }

  private onCheckAllChange(e) {
    if (this.findPropertyByName(PropertyGroupName.special, '数据源')) {
      let property = this.findPropertyByName(PropertyGroupName.special, '数据源')
      //window.console.log('loadCompleted', property)
      if (property.value) {
        this.dictOptions = property.value
      }
    }
    let arr = []
    for (let index = 0; index < this.dictOptions.length; index++) {
      const element = this.dictOptions[index]
      arr.push(element.item_value)
    }
    Object.assign(this, {
      vmodel: e.target.checked ? arr : [],
      indeterminate: false,
      checkAll: e.target.checked
    })
  }

  protected loadCompleted(childrenData: any[]) {
    let dataSource = this.findPropertyByName(PropertyGroupName.special, '数据源')
    if (dataSource.value) {
      this.dictOptions = dataSource.value
    } else {
      let property = this.findPropertyByName(PropertyGroupName.special, '选择枚举')
      if (property.value) {
        this.dictOptions = property.value
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

  /**需要绑定选中值 */
  public get validateProperty(): Property {
    let property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    return property
  }

  //选中的集合
  // eslint-disable-next-line getter-return
  get vmodel(): any {
    let property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    let isBool = this.findPropertyByName(PropertyGroupName.special, '是否支持布尔')
    let displayText = this.findPropertyByName(PropertyGroupName.special, '展示值')
    if (isBool && (isBool.value as boolean) === true) {
      displayText.canSetting = true
    } else {
      if (displayText) {
        displayText.canSetting = false
      }
    }
    this.isDisableChooseItems()
    let isStr = this.findPropertyByName(PropertyGroupName.special, '是否字符串格式存储')

    if (isStr && (isStr.value as boolean) === true) {
      if (
        property.value != undefined &&
        property.value != null &&
        property.value != '' &&
        property.value.length > 0 &&
        property.value.constructor !== String
      ) {
        let itemValues = []
        for (let index = 0; index < property.value.length; index++) {
          const element = property.value[index]
          itemValues.push(element.itemValue.toString())
        }

        return itemValues
      } else if (
        property.value != undefined &&
        property.value != null &&
        property.value != '' &&
        property.value.length > 0 &&
        property.value.constructor === String
      ) {
        return property.value.split(',')
      } else if (property.value && property.value.constructor == Object) {
        if (Object.keys(property.value).length == 0) {
          this.setPropertyVal(property.id, '')
          return ''
        } else if (property.value.itemValue != undefined) {
          return property.value.itemValue
        }
      } else {
        return undefined
      }
    } else {
      return property ? (property.value != undefined && property.value != null && property.value != '' ? property.value : undefined) : undefined
    }
  }

  set vmodel(val: any) {
    let property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    let isStr = this.findPropertyByName(PropertyGroupName.special, '是否字符串格式存储')
    //console.info('vmodel', isStr)
    if (isStr && (isStr.value as boolean) === true) {
      this.setPropertyVal(property.id, val.toString())
    } else {
      this.setPropertyVal(property.id, val)
    }
  }

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    switch (property.propertyName) {
      case '选择枚举':
        {
          this.dictOptions = []
          this.dictOptions = property.value
          this.findPropertyByName(PropertyGroupName.special, '数据源').value = undefined
        }
        break
      case '展示值':
        {
          let boolProp = this.findPropertyByName(PropertyGroupName.special, '是否支持布尔')
          if (boolProp && (boolProp.value as boolean) === true) {
            this.dictOptions = []
            this.dictOptions.push({
              item_value: '1',
              item_name: this.findPropertyByName(PropertyGroupName.special, '展示值').value
            })
          }
          this.findPropertyByName(PropertyGroupName.special, '选择枚举').value = undefined
          this.findPropertyByName(PropertyGroupName.special, '数据源').value = undefined
        }

        break
    }
  }

  private isDisableChooseItems(): void {
    let isChooseItems = this.findPropertyByName(PropertyGroupName.special, '是否禁用选中项')
    if (isChooseItems && (isChooseItems.value as boolean) === true) {
      if (this.dictOptions !== undefined) {
        for (let index = 0; index < this.dictOptions.length; index++) {
          const element = this.dictOptions[index]
          element.disabled = true
        }
      }
    } else {
      if (this.dictOptions !== undefined) {
        for (let index = 0; index < this.dictOptions.length; index++) {
          const element = this.dictOptions[index]
          element.disabled = false
        }
      }
    }
  }

  //特有属性
  get plainOptions(): checkData {
    if (this.findProperties(PropertyGroupName.special, '数据源')[0]) {
      return this.findProperties(PropertyGroupName.special, '数据源')[0].value
    }
    return null
  }

  get displayOrder(): string {
    if (this.findProperties(PropertyGroupName.special, '排列顺序')[0]) {
      return (this.findProperties(PropertyGroupName.special, '排列顺序')[0].value as string) == '垂直' ? 'block' : 'inline'
    }
    return null
  }

  get checkAllDisplay(): string {
    if (this.findProperties(PropertyGroupName.special, '是否支持全选')[0]) {
      if ((this.findProperties(PropertyGroupName.special, '是否支持全选')[0].value as string) == '是') {
        this.displayBottom = 'block'
      } else {
        this.displayBottom = 'none'
      }
      return (this.findProperties(PropertyGroupName.special, '是否支持全选')[0].value as string) == '是' ? 'block' : 'none'
    } else {
      return 'block'
    }
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

  get bgImage(): string {
    if (this.findProperties(PropertyGroupName.special, '背景图片')[0]) {
      let selectValues = this.findProperties(PropertyGroupName.special, '背景图片')[0].value
      if (selectValues && selectValues.length > 0) {
        let fullPath = BuildingFileUrlForShow(CurrentContext.FileServerAddress, selectValues[0].url)
        return fullPath
      }
      return ''
    } else {
      return ''
    }
  }
}
</script>
<style scoped>
</style>

