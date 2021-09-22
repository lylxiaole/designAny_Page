
/*
Add By Gyl
文本输入框
 */
<template>
  <a-input v-bind:placeholder="PlaceHolder" v-model="Text" v-bind:disabled='disabled' ref="textInput" v-bind:type="Type" v-bind:style="{ enabled:'true', height:height, color: Color, fontSize: FontSize + 'px', paddingLeft:PaddingLeft+ 'px', paddingTop:PaddingTop+ 'px', 
    paddingRight:PaddingRight+ 'px', paddingBottom:PaddingBottom+ 'px'}" @change="handleNumberChange" :maxlength="curModelproperty.maxLength"
    @pressEnter="handlePressEnter" allowClear>
    <!-- <a-icon v-if="isShowPrefix" slot="prefix" type="user" /> -->
    <!--<a-icon v-if="Text" slot="suffix" type="close-circle" @click="emitEmpty" /> -->
  </a-input>
</template>


<!--Script-->
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
  Boolean_Property
} from '../../03designerLayoutBase'
import { param, paramType } from '../../03designerLayoutBase'

@Component
export default class InputComponent extends ComponentBase {
  inparam: param[]
  outparam: param

  //form: any
  isShowIndex = false
  text = ''
  beforeCreate() {
    // this.propCode = 'Text'
    //this.form = this.$form.createForm(this)
  }

  mounted() {
    this.width = 200
    this.height = 40
    /*空值属性：文本为空时，显示的提示内容 */
    this.registerProperty('空值文本', PropertyGroupName.special, new Text_Property(), '请输入')
    this.registerProperty('左内边距', PropertyGroupName.special, new Text_Property(), '0')
    this.registerProperty('上内边距', PropertyGroupName.special, new Text_Property(), '6')
    this.registerProperty('右内边距', PropertyGroupName.special, new Text_Property(), '0')
    this.registerProperty('下内边距', PropertyGroupName.special, new Text_Property(), '6')
    //this.registerProperty('是否可用', PropertyGroupName.special, new Boolean_Property(), true)
    //this.registerProperty('密码模式', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('文本', PropertyGroupName.special, new Text_Property(), '')
    // this.registerProperty('是否显示前缀图标', PropertyGroupName.special, new Boolean_Property(), false)

    // this.registerEvents('内容变化时的事件', '', this.inparam, this.outparam)
    // this.registerEvents('按下回车的事件', '', this.inparam, this.outparam)

    if (this.curModelproperty && this.curModelproperty.defaultValue) {
      this.Text = this.curModelproperty.defaultValue
    }
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
  }

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    // switch (property.propertyName) {
    //   case '绑定模型':
    //     var modelBind = this.parentPage.modelBindings.find((o) => o.modelBindingName == this.bindInfos[0].modelName)
    //     if (modelBind) {
    //       window.console.log('输入框绑定模型变更',modelBind)
    //       //this.curModelproperty
    //       window.console.log('this.curModelproperty',this.curModelproperty)
    //     }
    //     break
    // }
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

  get PlaceHolder(): string {
    if (this.findProperties(PropertyGroupName.special, '空值文本')[0]) {
      // console.log('文本输入框组件空值变了')
      return this.findProperties(PropertyGroupName.special, '空值文本')[0].value as string
    } else {
      return ''
    }
  }

  get Color(): string {
    if (this.findProperties(PropertyGroupName.normal, '前景色')[0]) {
      // console.log('文本输入框前景色变了')
      return this.findProperties(PropertyGroupName.normal, '前景色')[0].value as string
    } else {
      return ''
    }
  }
  get FontSize(): string {
    if (this.findProperties(PropertyGroupName.normal, '字体')[0]) {
      // console.log('文本输入框组件字体变了')
      return this.findProperties(PropertyGroupName.normal, '字体')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingLeft(): string {
    if (this.findProperties(PropertyGroupName.special, '左内边距')[0]) {
      //window.console.log('文本输入框组件左边距变了')
      return this.findProperties(PropertyGroupName.special, '左内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingTop(): string {
    if (this.findProperties(PropertyGroupName.special, '上内边距')[0]) {
      //window.console.log('文本输入框组件上边距位置变了')
      return this.findProperties(PropertyGroupName.special, '上内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingRight(): string {
    if (this.findProperties(PropertyGroupName.special, '右内边距')[0]) {
      //window.console.log('文本输入框组件右边距位置变了')
      return this.findProperties(PropertyGroupName.special, '右内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingBottom(): string {
    if (this.findProperties(PropertyGroupName.special, '下内边距')[0]) {
      //window.console.log('文本输入框下内边距变了')
      let data = this.findProperties(PropertyGroupName.special, '下内边距')[0].value as string
      return data
    }
    return ''
  }

  // get Disabled(): boolean {
  //   if (this.findProperties(PropertyGroupName.special, '是否可用')[0]) {
  //     // console.log('文本输入框是否可用变了')
  //     let data = this.findProperties(PropertyGroupName.special, '是否可用')[0].value as boolean
  //     if (data) return false
  //     if (!data) return true
  //   }
  // }

  get Type(): string {
    if (this.findProperties(PropertyGroupName.special, '密码模式')[0]) {
      // console.log('文本输入框是否密码模式变了')
      let data = this.findProperties(PropertyGroupName.special, '密码模式')[0].value as boolean
      if (data == true) return 'password'
      if (data == false) return 'text'
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
    // let r = new RegExp(s)

    // let m = r.exec(val)
    // if (m == null) {
    //   this.text = this.text
    // } else {
    //   this.text = val
    // }
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

<style scoped>
</style>
