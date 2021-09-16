<template>
  <a-input ref="textInput" v-bind:type="Type" tabIndex="1" v-bind:placeholder="PlaceHolder" v-model="Text" v-bind:disabled='disabled'
    v-bind:style="inputStyle" @change="handleNumberChange" :maxlength="maxlength" @pressEnter="handlePressEnter" :allowClear="allowClear"
    @blur="handleInputBlur" :title="Text">
    <img v-if="isShowPrefix" slot="prefix" v-lazy="imageUrl" width="16px" height="16px" alt="image" />
  </a-input>
</template>

<script lang="ts">
import Vue from 'vue'
import ComponentBase from '../ComponentBase'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  Color_Property,
  Boolean_Property,
  UploadFile_Property,
  Number_Property
} from '../../02common/commonClasses/LayoutProperty'
import { param, paramType } from '../../02common/commonClasses/layoutEvent'
import { CurrentContext } from '../../01designerContext'
import common from '../../02common/commonMethod'

@Component
export default class InputComponent extends ComponentBase {
  inparam: param[]
  outparam: param
  isShowIndex = false
  text = ''

  get inputStyle(): any {
    return {
      enabled: 'true',
      height: '100%',
      width: '100%',
      textAlign: this.Horienten,
      borderRadius: this.borderRadius + 'px',
      borderColor: this.bordercolor,
      color: this.Color,
      fontSize: this.FontSize + 'px',
      paddingLeft: this.PaddingLeft + 'px',
      paddingTop: this.PaddingTop + 'px',
      paddingRight: this.PaddingRight + 'px',
      paddingBottom: this.PaddingBottom + 'px'
    }
  }

  get maxlength(): number {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '最大长度')
    if (prop) {
      if (prop.value == 0) {
        return null
      }
      return prop.value
    } else {
      return null
    }
  }

  get isShowPrefix(): boolean {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '是否显示前缀图标')
    if (prop) {
      return prop.value as boolean
    } else {
      return false
    }
  }
  get imageUrl(): string {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '上传图标')
    if (prop) {
      let selectValues = prop.value
      if (selectValues && selectValues.length > 0) {
        let fullpath = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, selectValues[0].url.split('?')[0])
        return fullpath
      }
      return ''
    } else {
      return ''
    }
  }
  created() {
    /*空值属性：文本为空时，显示的提示内容 */
    this.RegisterProperty('空值文本', PropertyGroupName.special, new Text_Property(), '请输入')
    this.RegisterProperty('左内边距', PropertyGroupName.special, new Text_Property(), '0')
    this.RegisterProperty('上内边距', PropertyGroupName.special, new Text_Property(), '0')
    this.RegisterProperty('右内边距', PropertyGroupName.special, new Text_Property(), '0')
    this.RegisterProperty('下内边距', PropertyGroupName.special, new Text_Property(), '0')
    //this.RegisterProperty('是否可用', PropertyGroupName.special, new Boolean_Property(), true)
    this.RegisterProperty('密码模式', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('文本', PropertyGroupName.special, new Text_Property(), '')
    this.RegisterProperty(
      '最大长度',
      PropertyGroupName.special,
      new Number_Property(),
      this.curModelproperty.maxLength == 0 ? '' : this.curModelproperty.maxLength
    )
    this.RegisterProperty('是否显示前缀图标', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('上传图标', PropertyGroupName.special, new UploadFile_Property(10, ''))
    this.RegisterProperty('支持打印设置', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('圆角设置', PropertyGroupName.special, new Number_Property(), 0)
    this.RegisterProperty('边框颜色', PropertyGroupName.special, new Color_Property(), '#000000')
    this.RegisterProperty('水平对齐', PropertyGroupName.special, new Enum_Property(true, ['居左', '居中', '居右']), '居左')
    // }

    this.RegisterEvents('内容变化时的事件', '', this.inparam, this.outparam)
    this.RegisterEvents('按下回车的事件', '', this.inparam, this.outparam)
    this.RegisterEvents('失去焦点事件', '', this.inparam, this.outparam)

    this.RegisterMethods('移除焦点', '', this.blur, null, null)
    this.RegisterMethods('获取焦点', '', this.focus, null, null)
    this.RegisterMethods('输入框全选', '', this.selectInput, null, null)
  }
  mounted() {
    this.width = 220
    this.height = 30
    if (this.curModelproperty && this.curModelproperty.defaultValue) {
      this.Text = this.curModelproperty.defaultValue
    }
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
    this.$nextTick(() => {
      $(this.$el)
        .find('.ant-input')
        .css('height', this.height)
    })
  }

  blur(): void {
    var input = this.$refs.textInput as any
    input.blur()
  }

  focus(): void {
    var input = this.$refs.textInput as any
    this.$nextTick(() => {
      input.focus()
    })
  }

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    if (property.propertyName === '是否禁用') {
      if (property.value === true) {
        $(this.$el)
          .find('.ant-input')
          .css('paddingRight', 0 + 'px')
      } else {
        $(this.$el)
          .find('.ant-input')
          .css('paddingRight', 30 + 'px')
      }
    } else if (property.propertyName === '高度') {
      $(this.$el)
        .find('.ant-input')
        .css('height', property.value + 'px')
    }
  }

  public get validateProperty(): Property {
    var property = this.FindPropertyByName(PropertyGroupName.special, '文本')
    return property
  }

  handleInputBlur(e) {
    this.TriggeEvent('失去焦点事件', null)
    var property = this.FindPropertyByName(PropertyGroupName.special, '文本')
    var template = property.value
    if (property && property.value) {
      let newval = property ? property.value.trim() : ''
      this.SetPropertyVal(property.id, newval)
      if (newval.length !== template.length) {
        this.handleNumberChange(newval)
      }
    }
  }
  selectInput() {
    this.$nextTick(() => {
      $(this.$el)
        .find('.ant-input')
        .select()
    })
  }
  handleNumberChange(e) {
    this.triggerChange(e)

    this.TriggeEvent('内容变化时的事件', e)
  }

  triggerChange(changedValue) {
    this.$emit('change', changedValue)
  }

  handlePressEnter(e) {
    var property = this.FindPropertyByName(PropertyGroupName.special, '文本')
    if (property && property.value) {
      let newval = property ? property.value.trim() : ''
      this.SetPropertyVal(property.id, newval)
    }
    this.TriggeEvent('按下回车的事件', null)
  }

  get PlaceHolder(): string {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '空值文本')
    if (prop) {
      return prop.value as string
    } else {
      return ''
    }
  }

  get Color(): string {
    let prop = this.FindPropertyByName(PropertyGroupName.normal, '前景色')
    if (prop) {
      return prop.value as string
    } else {
      return ''
    }
  }
  get FontSize(): string {
    let prop = this.FindPropertyByName(PropertyGroupName.normal, '字体')
    if (prop) {
      return prop.value as string
    } else {
      return ''
    }
  }

  get PaddingLeft(): string {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '左内边距')
    if (prop) {
      return prop.value as string
    } else {
      return ''
    }
  }

  get PaddingTop(): string {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '上内边距')
    if (prop) {
      return prop.value as string
    } else {
      return ''
    }
  }

  get PaddingRight(): string {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '右内边距')
    if (prop) {
      return prop.value as string
    } else {
      return ''
    }
  }

  get PaddingBottom(): string {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '下内边距')
    if (prop) {
      let data = prop.value as string
      return data
    }
    return ''
  }

  get Type(): string {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '密码模式')
    if (prop) {
      let data = prop.value as boolean
      if (data == true) return 'password'
      if (data == false) return 'text'
    }
    return ''
  }
  get allowClear(): boolean {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '支持打印设置')
    if (prop) {
      let property = prop.value as boolean
      return !property
    }
    return false
  }

  get tooltipText(): string {
    return this.Text
  }

  get Text(): string {
    var property = this.FindPropertyByName(PropertyGroupName.special, '文本')
    if (property && property.value) {
      return property ? property.value : ''
    }
    return ''
  }

  get borderRadius(): number {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '圆角设置')
    if (prop) {
      let property = prop.value
      return property
    }
    return 5
  }
  get bordercolor(): string {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '边框颜色')
    if (prop) {
      return prop.value as string
    }
    return ''
  }
  get Horienten(): string {
    let prop = this.FindPropertyByName(PropertyGroupName.special, '水平对齐')
    if (prop) {
      if (prop.value === '居左') {
        return 'left'
      } else if (prop.value === '居右') {
        return 'right'
      } else if (prop.value === '居中') {
        return 'center'
      }
    }
    return 'left'
  }

  set Text(val) {
    var property = this.FindPropertyByName(PropertyGroupName.special, '文本')
    if (property) {
      this.SetPropertyVal(property.id, val)
    }
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

<style scoped lang="less">
/deep/ .ant-input-disabled {
  padding-right: 0px !important;
}
/deep/ .ant-input {
  box-shadow: none !important;
}
</style>

