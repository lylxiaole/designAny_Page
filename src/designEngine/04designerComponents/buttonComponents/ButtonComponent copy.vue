/**
 *按钮组件
 * By LQW
 */
<template>
  <div style="position:relative" tabindex="1">
    <!-- <span v-if="isSo===true"> -->
    <a-popconfirm v-if="isSo===true" :title="confirmTitle" okText="确认" :disabled="buttonDisabled" cancelText="取消" :visible="visible"
      @confirm="confirm" @visibleChange="handleVisibleChange">
      <a-button :type="buttonType"
        :style="{background:backgroundColor,color:fontColor,fontSize: fontSize+'px',display:buttonDisplay, width:'100%',height:'100%',borderColor:backgroundColor}"
        @mouseover="onMouseOver" @mouseout="onMouseOut" @click="onClick">
        <a-icon v-if="iconFlag" :type="varIcon" ghost></a-icon>
        <img v-else :src="imageUrl" alt="image" :width="svgSize+'px'" :height="svgSize+'px'"
          style="vertical-align:middle;margin-right:8px;" />{{buttonText}}
      </a-button>
    </a-popconfirm>
    <!-- </span>
    <span v-else> -->
    <a-button v-else :type="buttonType"
      :style="{background:backgroundColor,color:fontColor,'vertical-align':'middle',fontSize: fontSize+'px',display:buttonDisplay,width:'100%',height:'100%',borderColor:backgroundColor}"
      @mouseover="onMouseOver" @mouseout="onMouseOut" :disabled="buttonDisabled" @click="onClick">
      <a-icon v-if="iconFlag" :type="varIcon" ghost></a-icon>
      <div v-else style="vertical-align:middle">
        <img :src="imageUrl" alt="image" :width="svgSize+'px'" :height="svgSize+'px'" style="margin-right:8px;" />{{buttonText}}
      </div>

    </a-button>
    <!-- </span> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Number_Property,
  Text_Property,
  Boolean_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  UploadFile_Property,
  Color_Property,
  Button_Property,
  PageInParams_Property
} from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import BaseEvents from '../../03designerLayoutBase/BaseEvents'
import { getUuid, deepClone } from '@src/utils'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import { InputSearch } from 'ant-design-vue/types/input/input-search'
import { layoutEvent } from '../../03designerLayoutBase'
import buttonAttributeInfos from '../../02common/commonClasses/buttonAttributeInfo'
import { CurrentContext } from '../../01designerContext'
import { param, paramType } from '../../03designerLayoutBase'

@Component
export default class ButtonComponent extends ComponentBase {
  infoNormal: buttonAttributeInfos = new buttonAttributeInfos()
  infoHover: buttonAttributeInfos = new buttonAttributeInfos()
  infoSelected: buttonAttributeInfos = new buttonAttributeInfos()
  infoDisable: buttonAttributeInfos = new buttonAttributeInfos()
  varIcon: string = ''
  backgroundColor: string = ''
  fontColor: string = ''
  iconFlag: boolean = true
  imageUrl: string = '../../assets/edit.png'
  visible: boolean = false
  buttonDisabled: boolean = false

  inparam: param[]
  outparam: param

  private setButtonAttribute(buttonAttributeInfo: buttonAttributeInfos) {
    if (typeof buttonAttributeInfo.buttonIconType !== 'undefined') {
      if (buttonAttributeInfo.buttonIconType == 1) {
        this.iconFlag = true
        this.varIcon = buttonAttributeInfo.buttonIcons + ''
      } else {
        this.iconFlag = false
        this.varIcon = ''
        this.imageUrl = CurrentContext.FileServerAddress + buttonAttributeInfo.buttonIconImages[0].url.split('?')[0]
      }
    }
    this.fontColor = buttonAttributeInfo.buttonTextColor
    this.backgroundColor = buttonAttributeInfo.buttonBGColor
  }

  @Watch('isSelected')
  watchIsSelected() {
    if (this.isSelected && !this.buttonDisabled) {
      this.setButtonAttribute(this.infoSelected)
    } else if (!this.isSelected && !this.buttonDisabled) {
      this.setButtonAttribute(this.infoNormal)
    }
  }

  // @Watch('buttonDisabled')
  // watchbuttonDisabled() {
  //   if (this.buttonDisabled) {
  //     this.setButtonAttribute(this.infoDisable)
  //   } else if (!this.buttonDisabled && this.isSelected) {
  //     this.setButtonAttribute(this.infoSelected)
  //   } else {
  //     this.setButtonAttribute(this.infoNormal)
  //   }
  // }

  @Watch('infoNormal')
  watchInfoNormal() {
    this.setButtonAttribute(this.infoNormal)
  }

  @Watch('infoSelected')
  watchInfoSelected() {
    if (this.isSelected) {
      this.setButtonAttribute(this.infoSelected)
    }
  }

  @Watch('infoDisable')
  watchInfoDisable() {
    if (this.buttonDisabled) {
      this.setButtonAttribute(this.infoDisable)
    }
  }

  private onMouseOver() {
    this.setButtonAttribute(this.infoHover)
  }

  private handleVisibleChange(visible) {
    if (!visible) {
      this.visible = false
      return
    }
    if (this.buttonDisabled) {
      this.confirm() // next step
    } else {
      this.visible = true
    }
  }

  private onMouseOut() {
    if (this.isSelected) {
      this.setButtonAttribute(this.infoSelected)
    } else {
      this.setButtonAttribute(this.infoNormal)
    }
  }

  private onClick() {
    //触发事件
    window.console.log('触发点击事件1212121212')
    this.triggeEvent('按钮点击事件', null)
  }
  private confirm() {
    this.triggeEvent('确认按钮回调事件', null)
  }
  mounted() {
    this.width = 80
    this.height = 34
    //注册特有属性
    this.registerProperty('气泡提示信息', PropertyGroupName.special, new Text_Property(), '确认要删除吗？')
    this.registerProperty('是否展示气泡', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('按钮文本', PropertyGroupName.special, new Text_Property(), '新增')
    this.registerProperty('图标大小', PropertyGroupName.special, new Number_Property(), 16)
    //this.registerProperty('是否禁用', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty(
      '按钮类型',
      PropertyGroupName.special,
      new Enum_Property(true, ['主按钮', '次按钮', '虚线按钮', '危险按钮', '链接按钮']),
      '主按钮'
    )
    this.registerProperty('按钮设置', PropertyGroupName.special, new Button_Property())
    this.findPropertyByName(PropertyGroupName.normal, '前景色').canSetting = false
    this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
    this.findPropertyByName(PropertyGroupName.normal, '背景色').canSetting = false

    this.registerEvents('按钮点击事件', '', this.inparam, this.outparam)
    this.registerEvents('确认按钮回调事件', '', this.inparam, this.outparam)

    //属性改变
    this.$on('onPropertyChanged', this.onCurrentPropertyChanged)

    this.$watch('buttonInfo', this.watchButtonAttributeInfo, { deep: true })
  }

  private onCurrentPropertyChanged(propertyId: string, property_newval: any, comp: ComponentBase): void {
    //buttonDisabled
    if (property_newval.propertyName === '是否禁用') {
      this.buttonDisabled = property_newval.value
    }
    //window.console.log('属性变更1111',property_newval)
  }

  watchButtonAttributeInfo() {
    if (typeof this.findPropertyByName(PropertyGroupName.special, '按钮设置').value != 'undefined') {
      this.infoNormal = this.findPropertyByName(PropertyGroupName.special, '按钮设置').value[0]
      this.infoHover = this.findPropertyByName(PropertyGroupName.special, '按钮设置').value[1]
      this.infoSelected = this.findPropertyByName(PropertyGroupName.special, '按钮设置').value[2]
      this.infoDisable = this.findPropertyByName(PropertyGroupName.special, '按钮设置').value[3]
    }
  }

  protected get buttonInfo(): buttonAttributeInfos[] {
    var val = this.findPropertyByName(PropertyGroupName.special, '按钮设置').value
    if (!val) {
      return []
    }
    return val as buttonAttributeInfos[]
  }

  get confirmTitle(): string {
    if (this.findPropertyByName('特有属性', '气泡提示信息')) {
      return this.findPropertyByName('特有属性', '气泡提示信息').value as string
    } else {
      return ''
    }
  }
  get isSo(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否展示气泡')[0]) {
      return this.findProperties(PropertyGroupName.special, '是否展示气泡')[0].value as boolean
    }
    return false
  }

  //按钮文本
  get buttonText(): string {
    if (this.findPropertyByName('特有属性', '按钮文本')) {
      return this.findPropertyByName('特有属性', '按钮文本').value as string
    } else {
      return ''
    }
  }
  get svgSize(): number {
    if (this.findPropertyByName('特有属性', '图标大小')) {
      return this.findPropertyByName('特有属性', '图标大小').value as number
    }
    return
  }
  // get buttonDisabled(): boolean {
  //   if (this.findProperties(PropertyGroupName.special, '是否禁用')[0]) {
  //     return this.findProperties(PropertyGroupName.special, '是否禁用')[0].value as boolean
  //   }
  //   return false
  // }
  //公有属性
  get fontSize(): string {
    if (this.findPropertyByName(PropertyGroupName.normal, '字体')) {
      return this.findPropertyByName(PropertyGroupName.normal, '字体').value as string
    }
    return ''
  }

  //按钮类型
  get buttonType(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '按钮类型')) {
      if (this.findPropertyByName(PropertyGroupName.special, '按钮类型').value === '主按钮') {
        return 'primary'
      } else if (this.findPropertyByName(PropertyGroupName.special, '按钮类型').value === '次按钮') {
        return 'default'
      } else if (this.findPropertyByName(PropertyGroupName.special, '按钮类型').value === '虚线按钮') {
        return 'dashed'
      } else if (this.findPropertyByName(PropertyGroupName.special, '按钮类型').value === '危险按钮') {
        return 'danger'
      } else {
        return 'link'
      }
    }
    return 'default'
  }
}
</script>

