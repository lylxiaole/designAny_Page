/**
 *评分组件
 * By LQW
 */
<template>
  <div :style="{background:background}">
    <a-rate v-if="visible" v-model="value" :allowHalf="allowHalf" :allowClear="allowClear" :disabled="disabled" :count="count"
      :style="{fontSize:fontSize+'px',color:fontColor,}" @hoverChange="hoverChange" @change="onChange">
      <a-icon v-if="icon!=''" slot="character" :type="icon"></a-icon>
    </a-rate>
    <a-rate v-else v-model="value" :character="character" :allowHalf="allowHalf" :allowClear="allowClear" :disabled="disabled" :count="count"
      :style="{fontSize:fontSize+'px',color:fontColor,}" @hoverChange="hoverChange" @change="onChange">
    </a-rate>
    <!--有默认样式-->
    <span v-if="textVisible" class="ant-rate-text" :style="{color:textColor,fontSize:textFontSize+'px'}">{{value}} {{textValue}}</span>
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
  UploadFile_Property,
  Color_Property,
  Button_Property,
  PageInParams_Property,
  Boolean_Property
} from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import BaseEvents from '../../03designerLayoutBase/BaseEvents'
import { getUuid, deepClone } from '@src/utils'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import { InputSearch } from 'ant-design-vue/types/input/input-search'
import { layoutEvent, param } from '../../03designerLayoutBase'
import buttonAttributeInfos from '../../02common/commonClasses/buttonAttributeInfo'
import { CurrentContext } from '../../01designerContext'
@Component
export default class RateComponent extends ComponentBase {
  value: number = 2
  inparam: param[]
  outparam: param
  mounted() {
    this.width = 160
    this.height = 30
    this.registerProperty('评分星总数(个)', PropertyGroupName.special, new Number_Property(), 5)
    this.registerProperty('是否允许半选', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('是否允许再次点击清除', PropertyGroupName.special, new Boolean_Property(), true)
    //this.registerProperty('是否禁用', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('是否使用图标样式', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('设置图标', PropertyGroupName.special, new Enum_Property(true, ['默认图标', '心型', '五角星型', '笑脸']), '默认图标')
    this.registerProperty('设置字符', PropertyGroupName.special, new Text_Property())
    this.registerProperty('是否展示文案', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('编辑文案', PropertyGroupName.special, new Text_Property(), 'star')
    this.registerProperty('文案字体(px)', PropertyGroupName.special, new Number_Property(), 14)
    this.registerProperty('文案前景色', PropertyGroupName.special, new Color_Property(), '#000000')
    // this.findPropertyByName(PropertyGroupName.special, '设置图标').canSetting = true
    this.findPropertyByName(PropertyGroupName.special, '设置字符').canSetting = false
    this.findPropertyByName(PropertyGroupName.special, '编辑文案').canSetting = false
    this.findPropertyByName(PropertyGroupName.special, '文案字体(px)').canSetting = false
    this.findPropertyByName(PropertyGroupName.special, '文案前景色').canSetting = false

    this.registerEvents('选择事件', '', this.inparam, this.outparam)
    this.registerEvents('鼠标经过时数值变化事件', '', this.inparam, this.outparam)

    //属性改变触发
    this.$on('onPropertyChanged', this.onCurrentPropertyChanged)
  }

  private onCurrentPropertyChanged(propertyId: string, property: Property, comp: ComponentBase): void {
    //改变颜色
    var width = $(this.$el)
      .find('.ant-rate')
      .width()

    var height = $(this.$el)
      .find('.ant-rate')
      .height()
    // console.log(width)
    // console.log(height)
    // this.width = width
    // this.height = height
  }
  hoverChange(e: any) {
    this.triggeEvent('鼠标经过时数值变化事件', null)
  }
  onChange(e: any) {
    this.triggeEvent('选择事件', null)
  }

  @Watch('textVisible')
  watchTextVisible() {
    if (this.textVisible) {
      this.findPropertyByName(PropertyGroupName.special, '编辑文案').canSetting = true
      this.findPropertyByName(PropertyGroupName.special, '文案字体(px)').canSetting = true
      this.findPropertyByName(PropertyGroupName.special, '文案前景色').canSetting = true
    } else {
      this.findPropertyByName(PropertyGroupName.special, '编辑文案').canSetting = false
      this.findPropertyByName(PropertyGroupName.special, '文案字体(px)').canSetting = false
      this.findPropertyByName(PropertyGroupName.special, '文案前景色').canSetting = false
    }
  }
  /**是否展示文案 */
  get textVisible(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否展示文案')) {
      return this.findProperties(PropertyGroupName.special, '是否展示文案')[0].value as boolean
    }
  }
  /**文案value */
  get textValue(): string {
    if (this.findPropertyByName('特有属性', '编辑文案')) {
      return this.findPropertyByName('特有属性', '编辑文案').value as string
    } else {
      return '暂无数据'
    }
  }

  /**文案字体大小 */
  get textFontSize(): string {
    if (this.findProperties(PropertyGroupName.special, '文案字体(px)')[0]) {
      return this.findProperties(PropertyGroupName.special, '文案字体(px)')[0].value as string
    }
  }

  /**文案颜色 */
  get textColor(): string {
    if (this.findProperties(PropertyGroupName.special, '文案前景色')[0]) {
      return this.findProperties(PropertyGroupName.special, '文案前景色')[0].value as string
    } else {
      return '#000000'
    }
  }

  @Watch('visible')
  watchVisible() {
    if (this.visible) {
      this.findPropertyByName(PropertyGroupName.special, '设置字符').canSetting = false
      this.findPropertyByName(PropertyGroupName.special, '设置图标').canSetting = true
    } else {
      this.findPropertyByName(PropertyGroupName.special, '设置字符').canSetting = true
      this.findPropertyByName(PropertyGroupName.special, '设置图标').canSetting = false
    }
  }

  get visible(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否使用图标样式')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否使用图标样式').value as boolean
    }
  }

  /**是否允许半选 */
  get allowHalf(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否允许半选')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否允许半选').value as boolean
    }
  }
  /**再次点击清除 */
  get allowClear(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否允许再次点击清除')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否允许再次点击清除').value as boolean
    }
  }
  /**允许鼠标交互 */
  // get disabled(): boolean {
  //   if (this.findPropertyByName(PropertyGroupName.special, '是否禁用')) {
  //     return this.findPropertyByName(PropertyGroupName.special, '是否禁用').value as boolean
  //   }
  // }
  /**star总数 */
  get count(): number {
    if (this.findPropertyByName(PropertyGroupName.special, '评分星总数(个)')) {
      return this.findPropertyByName(PropertyGroupName.special, '评分星总数(个)').value as number
    }
  }
  /**评分图标样式 */
  get icon(): string {
    if (this.findProperties(PropertyGroupName.special, '设置图标')[0]) {
      if ((this.findProperties(PropertyGroupName.special, '设置图标')[0].value as string) == '心型') {
        return 'heart'
      } else if ((this.findProperties(PropertyGroupName.special, '设置图标')[0].value as string) == '五角星型') {
        return 'star'
      } else if ((this.findProperties(PropertyGroupName.special, '设置图标')[0].value as string) == '笑脸') {
        return 'smile'
      } else {
        return ''
      }
    }
  }
  /**星标设置为字符样式 */
  get character(): string {
    if (this.findPropertyByName('特有属性', '设置字符')) {
      return this.findPropertyByName('特有属性', '设置字符').value as string
    } else {
      return '暂无数据'
    }
  }
  /**星标颜色 */
  get fontColor(): string {
    if (this.findProperties(PropertyGroupName.normal, '前景色')[0]) {
      return this.findProperties(PropertyGroupName.normal, '前景色')[0].value as string
    }
  }
  /**星标大小 */
  get fontSize(): string {
    if (this.findProperties(PropertyGroupName.normal, '字体')[0]) {
      return this.findProperties(PropertyGroupName.normal, '字体')[0].value as string
    }
  }
}
</script>