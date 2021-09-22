<template>
  <a-input-number ref="input" v-model="ResVal" v-bind:disabled="disabled" v-bind:max="Max" v-bind:step='Step' v-bind:min="Min"
    :formatter="value => `${value}`+formatter" :parser="value => value.replace(formatter, '')"
    v-bind:style="{ enabled:'true', height:height+'px',width:'100%', color: Color, fontSize: FontSize + 'px'}" @change="handleNumberChange"
    :maxlength="curModelproperty.maxLength" :precision="precision">
  </a-input-number>
</template>

<script lang="ts">
import Vue from 'vue'
import { ComponentBase } from '../../03designerLayoutBase'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { PropertyTypeEnum } from '../../06propertyGrid/commonTypes'
import {
  Property,
  PropertyGroupName,
  Text_Property,
  Color_Property,
  Boolean_Property,
  Number_Property,
  NumberList_Property
} from '../../03designerLayoutBase'
import { param, paramType } from '../../03designerLayoutBase'

/*
属性说明：是否可用、最大值、最小值、步幅
 */
@Component
export default class InputNumberComponent extends ComponentBase {
  @Prop()
  value: number

  @Watch('value')
  valueChange() {
    this.ResVal = this.value
  }

  inparam: param[]
  outparam: param
  mounted() {
    this.width = 200
    this.height = 34
    this.registerProperty('单位', PropertyGroupName.special, new Text_Property(), '')
    this.registerProperty('值', PropertyGroupName.special, new Number_Property(), 0)
    this.registerProperty('最大值', PropertyGroupName.special, new Text_Property(), '999999')
    this.registerProperty('最小值', PropertyGroupName.special, new Text_Property(), '0')
    this.registerProperty('步幅', PropertyGroupName.special, new Text_Property(), '1')
    this.registerProperty('精度', PropertyGroupName.special, new Number_Property(), this.curModelproperty.per)
    this.registerEvents('内容变化时的事件', '', this.inparam, this.outparam)

    this.registerMethods('移除焦点', '', this.blur, null, null)
    this.registerMethods('获取焦点', '', this.focus, null, null)
    if (this.curModelproperty && this.curModelproperty.defaultValue) {
      this.ResVal = parseFloat(this.curModelproperty.defaultValue)
    }
  }

  blur(): void {
    var input = this.$refs.input as any
    input.blur()
  }

  focus(): void {
    var input = this.$refs.input as any
    input.focus()
  }

  handelChange(e) {
    // this.triggeEvent('内容变化时的事件', e)
  }

  handleNumberChange(e) {
    var property_max = this.findPropertyByName(PropertyGroupName.special, '最大值')
    var property_min = this.findPropertyByName(PropertyGroupName.special, '最小值')
    var property_now = this.findPropertyByName(PropertyGroupName.special, '值')
    if (typeof e == 'number') {
      if (property_max.value != null && e != null && e > property_max.value) {
        e = property_max.value
        this.ResVal = e
      }
      if (property_min.value != null && e != null && e < property_min.value) {
        e = property_min.value
        this.ResVal = e
      }
    }
    if (e === null) {
      e = property_min.value
      var property_now = this.findPropertyByName(PropertyGroupName.special, '值')
      property_now.value = property_min.value
    }

    // console.info('handleNumberChange', e)
    this.triggeEvent('内容变化时的事件', e)
  }

  public get validateProperty(): Property {
    var property = this.findPropertyByName(PropertyGroupName.special, '值')
    return property
  }

  get formatter(): string {
    if (this.findProperties(PropertyGroupName.special, '单位')[0]) {
      return this.findProperties(PropertyGroupName.special, '单位')[0].value as string
    } else {
      return ''
    }
  }

  get ResVal(): number {
    var property = this.findPropertyByName(PropertyGroupName.special, '值')
    return property ? (isNaN(property.value) ? 0 : property.value) : 0
  }

  set ResVal(val: number) {
    var property = this.findPropertyByName(PropertyGroupName.special, '值')
    if (val == 0) {
      val = 0
    }
    var property_max = this.findPropertyByName(PropertyGroupName.special, '最大值')
    var property_min = this.findPropertyByName(PropertyGroupName.special, '最小值')
    if (typeof val == 'number') {
      if (property_max.value != null && val != null && val > property_max.value) {
        val = property_max.value
      }
      if (property_min.value != null && val != null && val < property_min.value) {
        val = property_min.value
      }
    }
    this.setPropertyVal(property.id, val)
  }

  //公有属性
  get FontSize(): string {
    if (this.findProperties(PropertyGroupName.normal, '字体')[0]) {
      return this.findProperties(PropertyGroupName.normal, '字体')[0].value as string
    }
    return ''
  }

  get Color(): string {
    if (this.findProperties(PropertyGroupName.normal, '前景色')[0]) {
      return this.findProperties(PropertyGroupName.normal, '前景色')[0].value as string
    }
    return ''
  }

  get Max(): number {
    if (this.findProperties(PropertyGroupName.special, '最大值')[0]) {
      let result = this.findProperties(PropertyGroupName.special, '最大值')[0].value as string
      if (result == '999999' && this.curModelproperty.maxValue) {
        return parseFloat(this.curModelproperty.maxValue + '')
      }
      return parseFloat(result)
    }
    return 999999
  }

  get Min(): number {
    if (this.findProperties(PropertyGroupName.special, '最小值')[0]) {
      let result = this.findProperties(PropertyGroupName.special, '最小值')[0].value as string
      if (result == '0' && this.curModelproperty.minValue) {
        return parseFloat(this.curModelproperty.minValue + '')
      }
      return parseFloat(result)
    }
    return 0
  }

  get Step(): number {
    if (this.findProperties(PropertyGroupName.special, '步幅')[0]) {
      let result = this.findProperties(PropertyGroupName.special, '步幅')[0].value as string
      return parseFloat(result)
    }
    return 1
  }

  get precision(): number {
    if (this.findProperties(PropertyGroupName.special, '精度')[0]) {
      let result = this.findProperties(PropertyGroupName.special, '精度')[0].value
      if (result <= 100) {
        result as string
        return parseFloat(result)
      }
    }
    return this.curModelproperty.per
  }
}
</script>
<style lang='less' scoped>
/deep/ .components-input-demo-presuffix {
  background: white;
}
</style>


