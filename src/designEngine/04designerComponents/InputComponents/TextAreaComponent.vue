
<template>
  <a-textarea v-bind:placeholder="PlaceHolder" v-model="Text" v-bind:disabled='disabled||ReadOnly' ref="textInput" v-bind:style="textAreaStyle"
    @change="handleNumberChange" :maxlength="maxlength" @pressEnter="handlePressEnter" allowClear @drop="()=>{return false}">
    <a-icon v-if="isShowPrefix" slot="prefix" type="user" />
  </a-textarea>
</template>

<script lang="ts">
import Vue from 'vue'
import { ComponentBase } from '../../03designerLayoutBase'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  Color_Property,
  Boolean_Property,
  Number_Property
} from '../../03designerLayoutBase'
import { param, paramType } from '../../03designerLayoutBase'

@Component
export default class TextAreaComponent extends ComponentBase {
  inparam: param[]
  outparam: param
  isShowIndex = false
  text = ''
  get isShowPrefix(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否显示前缀图标')[0]) {
      return this.findProperties(PropertyGroupName.special, '是否显示前缀图标')[0].value as boolean
    } else {
      return false
    }
  }

  mounted() {
    this.width = 350
    this.height = 60
    /*空值属性：文本为空时，显示的提示内容 */
    this.registerProperty('空值文本', PropertyGroupName.special, new Text_Property(), '请输入')
    this.registerProperty(
      '最大长度',
      PropertyGroupName.special,
      new Number_Property(),
      this.curModelproperty.maxLength == 0 ? '' : this.curModelproperty.maxLength
    )
    this.registerProperty('左内边距', PropertyGroupName.special, new Text_Property(), '12')
    this.registerProperty('上内边距', PropertyGroupName.special, new Text_Property(), '6')
    this.registerProperty('右内边距', PropertyGroupName.special, new Text_Property(), '0')
    this.registerProperty('下内边距', PropertyGroupName.special, new Text_Property(), '6')
    this.registerProperty('文本', PropertyGroupName.special, new Text_Property(), '')
    this.registerProperty('是否显示前缀图标', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('只读', PropertyGroupName.special, new Boolean_Property(), false)

    this.registerEvents('内容变化时的事件', '', this.inparam, this.outparam)
    this.registerEvents('按下回车的事件', '', this.inparam, this.outparam)

    if (this.curModelproperty && this.curModelproperty.defaultValue) {
      this.Text = this.curModelproperty.defaultValue
    }
  }

  public get validateProperty(): Property {
    var property = this.findPropertyByName(PropertyGroupName.special, '文本')
    return property
  }

  handleNumberChange(e) {
    this.triggerChange(e)
    this.triggeEvent('内容变化时的事件', e)
  }

  triggerChange(changedValue) {
    this.$emit('change', changedValue)
  }

  handlePressEnter(e) {
    this.triggeEvent('按下回车的事件', null)
  }

  get textAreaStyle(): any {
    return {
      enabled: 'true',
      width: '100%',
      height: this.height + 'px',
      fontSize: this.FontSize + 'px',
      paddingLeft: this.PaddingLeft + 'px',
      paddingTop: this.PaddingTop + 'px',
      paddingRight: this.PaddingRight + 'px',
      paddingBottom: this.PaddingBottom + 'px'
    }
  }

  get PlaceHolder(): string {
    if (this.findProperties(PropertyGroupName.special, '空值文本')[0]) {
      return this.findProperties(PropertyGroupName.special, '空值文本')[0].value as string
    } else {
      return ''
    }
  }

  get maxlength(): number {
    if (this.findProperties(PropertyGroupName.special, '最大长度')[0]) {
      if (this.findProperties(PropertyGroupName.special, '最大长度')[0].value == 0) {
        return null
      }
      return this.findProperties(PropertyGroupName.special, '最大长度')[0].value
    } else {
      return null
    }
  }
  get FontSize(): string {
    if (this.findProperties(PropertyGroupName.normal, '字体')[0]) {
      return this.findProperties(PropertyGroupName.normal, '字体')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingLeft(): string {
    if (this.findProperties(PropertyGroupName.special, '左内边距')[0]) {
      return this.findProperties(PropertyGroupName.special, '左内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingTop(): string {
    if (this.findProperties(PropertyGroupName.special, '上内边距')[0]) {
      return this.findProperties(PropertyGroupName.special, '上内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingRight(): string {
    if (this.findProperties(PropertyGroupName.special, '右内边距')[0]) {
      return this.findProperties(PropertyGroupName.special, '右内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingBottom(): string {
    if (this.findProperties(PropertyGroupName.special, '下内边距')[0]) {
      let data = this.findProperties(PropertyGroupName.special, '下内边距')[0].value as string
      return data
    }
    return ''
  }

  get Text(): string {
    var property = this.findPropertyByName(PropertyGroupName.special, '文本')
    return property ? property.value : ''
  }

  set Text(val) {
    var property = this.findPropertyByName(PropertyGroupName.special, '文本')
    this.setPropertyVal(property.id, val)
  }

  get ReadOnly(): boolean {
    var property = this.findPropertyByName(PropertyGroupName.special, '只读')
    return property ? property.value : false
  }

  emitEmpty() {
    ;(this.$refs.textInput as any).focus()
    this.Text = ''
    this.triggerChange('')
  }

  getTempValidate(): any[] {
    return ['']
  }
}
</script>


