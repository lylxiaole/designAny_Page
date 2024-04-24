<template>
  <a-tooltip v-if="TooltipTitle.length>0" placement="top" :title="TooltipTitle" style="position:relative">
    <div class="gad-btn-div">
      <a-popconfirm v-if="isSo===true" :title="confirmTitle" okText="确认" style="width:100%;height:100%" cancelText="取消" :visible="btnOptions.visible"
        @confirm="confirm" @visibleChange="handleVisibleChange">
        <a-button :type="buttonType" :disabled="buttonDisabled" :style="npBtnStyle" @mouseover="onMouseOver" @mouseout="onMouseOut" @click="onClick"
          @mousedown="onmousedown" @mouseup="onmouseup">
          <a-icon v-if="btnOptions.iconFlag" :type="btnOptions.varIcon" ghost></a-icon>
          <v-icon :width="svgSize" :height="svgSize" :class="buttonText.length>0?'iconCss':''"
            v-else-if="btnOptions.iconCustom&& btnOptions.iconFlag===undefined" viewBox="0 0 100 100" :name="btnOptions.varIcon" />
          <img referrer="no-referrer|origin|unsafe-url" v-else v-lazy="btnOptions.imageUrl" alt="image" :width="svgSize+'px'" :height="svgSize+'px'"
            style="margin-right:8px;margin-top:-3px;" />
          {{  }}
        </a-button>
      </a-popconfirm>
      <a-button v-else :type="buttonType" :style="npBtnStyle" :disabled="buttonDisabled" @click="onClick" @mouseover="onMouseOver"
        @mouseout="onMouseOut" @mousedown="onmousedown" @mouseup="onmouseup">
        <a-icon v-if="btnOptions.iconFlag" :type="btnOptions.varIcon" ghost></a-icon>
        <v-icon :width="svgSize" :height="svgSize" :class="buttonText.length>0?'iconCss':''"
          v-else-if="btnOptions.iconCustom&& btnOptions.iconFlag===undefined" viewBox="0 0 100 100" :name="btnOptions.varIcon" />
        <img referrer="no-referrer|origin|unsafe-url" v-else v-lazy="btnOptions.imageUrl" alt="image" :width="svgSize+'px'" :height="svgSize+'px'"
          style="margin-right:8px;margin-top:-3px;" />{{ buttonText }}
      </a-button>
    </div>
  </a-tooltip>
  <div class="gad-btn-div" v-else>
    <a-popconfirm v-if="isSo===true" :title="confirmTitle" okText="确认" style="width:100%;height:100%" cancelText="取消" :visible="btnOptions.visible"
      @confirm="confirm" @visibleChange="handleVisibleChange">
      <a-button :type="buttonType" :disabled="buttonDisabled" :style="npBtnStyle" @click="onClick" @mouseover="onMouseOver" @mouseout="onMouseOut"
        @mousedown="onmousedown" @mouseup="onmouseup">
        <a-icon v-if="btnOptions.iconFlag" :type="btnOptions.varIcon" ghost></a-icon>
        <v-icon :width="svgSize" :height="svgSize" :class="buttonText.length>0?'iconCss':''"
          v-else-if="btnOptions.iconCustom&& btnOptions.iconFlag===undefined" viewBox="0 0 100 100" :name="btnOptions.varIcon" />
        <img referrer="no-referrer|origin|unsafe-url" v-else v-lazy="btnOptions.imageUrl" alt="image" :width="svgSize+'px'" :height="svgSize+'px'"
          style="margin-right:8px;margin-top:-3px;" />{{ buttonText }}
      </a-button>
    </a-popconfirm>
    <a-button v-else :type="buttonType" :style="npBtnStyle" :disabled="buttonDisabled" @click="onClick" @mouseover="onMouseOver"
      @mouseout="onMouseOut" @mousedown="onmousedown" @mouseup="onmouseup">
      <a-icon v-if="btnOptions.iconFlag" :type="btnOptions.varIcon" ghost></a-icon>
      <v-icon :width="svgSize" :height="svgSize" :class="buttonText.length>0?'iconCss':''"
        v-else-if="btnOptions.iconCustom&& btnOptions.iconFlag===undefined" viewBox="0 0 100 100" :name="btnOptions.varIcon" />
      <img referrer="no-referrer|origin|unsafe-url" v-else v-lazy="btnOptions.imageUrl" alt="image" :width="svgSize+'px'" :height="svgSize+'px'"
        style="margin-right:8px;margin-top:-3px;" />{{ buttonText }}
    </a-button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent, LayoutType, layoutCompTypeAttr } from '@designEngine/03designerLayoutBase'
import {
  Property,
  PropertyGroupName,
  Number_Property,
  Text_Property,
  Boolean_Property,
  Enum_Property,
  Button_Property
} from '@designEngine/03designerLayoutBase'
import { getUuid, deepClone } from '@common/utils'
import { paramType, param } from '@behaviorEngine/index'

class buttonIcons {
  name: string
  value: string
}

class buttonAttributeInfos {
  key: string

  /**按钮状态 */
  buttonStatus: string

  /**设置按钮图标方式 1：直接设置 2：上传图片 */
  buttonIconType: number

  buttonIcons: buttonIcons

  buttonIconImages: fileInfo[]

  /**按钮文字颜色 */
  buttonTextColor: string = ''

  /**按钮背景色 */
  buttonBGColor: string = ''

  /**按钮边框颜色 */
  buttonFrameColor: string = ''

  get allButtonIcons(): any[] {
    if (this.buttonIconType == 1) {
      return [
        { name: '新增', value: 'plus' },
        { name: '查询', value: 'search' },
        { name: '删除', value: 'delete' },
        { name: '编辑', value: 'edit' }
      ]
    } else {
      return this.buttonIconImages
    }
  }
}

class btnOptionsClass {
  infoNormal: buttonAttributeInfos = new buttonAttributeInfos()
  infoHover: buttonAttributeInfos = new buttonAttributeInfos()
  infoSelected: buttonAttributeInfos = new buttonAttributeInfos()
  infoDisable: buttonAttributeInfos = new buttonAttributeInfos()
  varIcon: string = ''
  backgroundColor: string = ''
  fontColor: string = ''
  buttonFrameColor: string = ''
  iconFlag: boolean = true
  iconCustom: boolean = false
  imageUrl: string = '../../assets/edit.png'
  visible: boolean = false
  buttonTimeOut: boolean = true
  confirmClick: boolean = true
  inparam: param[]
  outparam: param
}

@layoutCompTypeAttr('pc', LayoutType.system_component, '系统组件', '按钮组件', 'ButtonComponent1', null)
@Options({})
export default class ButtonComponent extends EngineComponent {
  private btnOptions: btnOptionsClass = new btnOptionsClass()

  private setButtonAttribute(buttonAttributeInfo: buttonAttributeInfos) {
    if (buttonAttributeInfo.buttonIconType) {
      if (buttonAttributeInfo.buttonIconType == 1) {
        this.btnOptions.iconFlag = true
        this.btnOptions.varIcon = buttonAttributeInfo.buttonIcons + ''
      } else if (buttonAttributeInfo.buttonIconType == 3) {
        this.btnOptions.iconCustom = true
        this.btnOptions.iconFlag = undefined
        this.btnOptions.varIcon = buttonAttributeInfo.buttonIcons + ''
      } else {
        this.btnOptions.iconFlag = false
        this.btnOptions.varIcon = ''
        if (buttonAttributeInfo.buttonIconImages && buttonAttributeInfo.buttonIconImages.length > 0) {
          this.btnOptions.imageUrl = common.BuildingFileUrlForShow(
            CurrentContext.FileServerAddress,
            buttonAttributeInfo.buttonIconImages[0].url.split('?')[0]
          )
        }
      }
    }
    this.btnOptions.fontColor = buttonAttributeInfo.buttonTextColor
    this.btnOptions.backgroundColor = buttonAttributeInfo.buttonBGColor
    if (!buttonAttributeInfo.buttonFrameColor) {
      this.btnOptions.buttonFrameColor = buttonAttributeInfo.buttonBGColor
    } else {
      this.btnOptions.buttonFrameColor = buttonAttributeInfo.buttonFrameColor
    }
  }

  @Watch('isSelected')
  watchIsSelected() {
    if (this.isSelected && !this.buttonDisabled) {
      this.setButtonAttribute(this.btnOptions.infoSelected)
    } else if (!this.isSelected && !this.buttonDisabled) {
      this.setButtonAttribute(this.btnOptions.infoNormal)
    }
  }

  rendered(dom: Element) {}

  @Watch('infoNormal')
  watchInfoNormal() {
    if (!this.buttonDisabled) {
      this.setButtonAttribute(this.btnOptions.infoNormal)
    }
  }

  @Watch('infoSelected')
  watchInfoSelected() {
    if (this.isSelected && !this.buttonDisabled) {
      this.setButtonAttribute(this.btnOptions.infoSelected)
    }
  }

  @Watch('infoDisable')
  watchInfoDisable() {
    if (this.buttonDisabled) {
      this.setButtonAttribute(this.btnOptions.infoDisable)
    }
  }

  private onMouseOver() {
    if (!this.buttonDisabled) {
      this.setButtonAttribute(this.btnOptions.infoHover)
    }
  }

  private handleVisibleChange(visible) {
    if (!visible) {
      this.btnOptions.visible = false
      return
    }
    if (this.buttonDisabled) {
      this.btnOptions.visible = false
      this.confirm() // next step
    } else {
      this.btnOptions.visible = true
    }
  }

  private onMouseOut() {
    if (!this.buttonDisabled) {
      if (this.isSelected) {
        this.setButtonAttribute(this.btnOptions.infoSelected)
      } else {
        this.setButtonAttribute(this.btnOptions.infoNormal)
      }
    }
  }

  private onClick() {
    let timeoutProperty = this.findPropertyByName(PropertyGroupName.special, '点击时间间隔')
    if (this.btnOptions && this.btnOptions.buttonTimeOut) {
      this.btnOptions.buttonTimeOut = false
      let timeout = timeoutProperty && timeoutProperty.value ? (timeoutProperty.value as number) : 1000
      if (timeout < 1000) {
        timeout = 1000
      }
      setTimeout(() => {
        if (this.btnOptions) {
          this.btnOptions.buttonTimeOut = true
        }
      }, timeout)
      this.triggerEvent('按钮点击事件', null)
    }
    //触发事件
  }

  private onmousedown() {
    this.setButtonAttribute(this.btnOptions.infoSelected)
  }

  private onmouseup() {
    this.setButtonAttribute(this.btnOptions.infoNormal)
  }

  private confirm() {
    if (this.btnOptions.confirmClick) {
      this.btnOptions.confirmClick = false
      setTimeout(() => {
        this.btnOptions.confirmClick = true
      }, 1000)
      this.triggerEvent('确认按钮回调事件', null)
    }
  }

  created() {}

  mounted() {
    if (this.isDesigning) {
      this.width = 80
      this.height = 34
      //注册特有属性
      this.registerProperty(PropertyGroupName.special, '提示文字', new Text_Property(), '')
      this.registerProperty(PropertyGroupName.special, '气泡提示信息', new Text_Property(), '确认要删除吗？')
      this.registerProperty(PropertyGroupName.special, '是否展示气泡', new Boolean_Property(), false)
      this.registerProperty(PropertyGroupName.special, '按钮文本', new Text_Property(), '新增')
      this.registerProperty(PropertyGroupName.special, '图标大小', new Number_Property(), 20)
      this.registerProperty(
        PropertyGroupName.special,
        '按钮类型',

        new Enum_Property(true, ['主按钮', '次按钮', '虚线按钮', '危险按钮', '链接按钮']),
        '主按钮'
      )
      this.registerProperty(PropertyGroupName.special, '按钮设置', new Button_Property())
      //新增点击时间间隔属性
      this.registerProperty(PropertyGroupName.special, '点击时间间隔', new Number_Property(), 1000)
      this.findPropertyByName(PropertyGroupName.normal, '前景色').canSetting = false
      this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
      this.findPropertyByName(PropertyGroupName.normal, '背景色').canSetting = false
    }
    this.registerEvents('按钮点击事件', '', this.btnOptions.inparam, this.btnOptions.outparam)
    this.registerEvents('确认按钮回调事件', '', this.btnOptions.inparam, this.btnOptions.outparam)
    this.$watch('buttonInfo', this.watchButtonAttributeInfo, { deep: true })
  }

  get npBtnStyle() {
    return {
      background: this.btnOptions.backgroundColor,
      color: this.btnOptions.fontColor,
      borderColor: this.btnOptions.buttonFrameColor,
      fontSize: this.fontSize + 'px',
      width: '100%',
      height: '100%',
      'box-shadow': 'none',
      'text-shadow': '0px',
      padding: this.buttonText.length == 0 ? 0 : '0 15px'
    }
  }

  get buttonDisabled(): Boolean {
    let property = this.findPropertyByName(PropertyGroupName.normal, '是否禁用')
    let result: boolean = false
    if (property && property.value) {
      if (property.value == false) {
        this.setButtonAttribute(this.btnOptions.infoNormal)
      } else {
        this.setButtonAttribute(this.btnOptions.infoDisable)
        this.removeSpanClass()
      }
      result = property.value as boolean
    } else {
      this.setButtonAttribute(this.btnOptions.infoNormal)
    }
    return result
  }

  set buttonDisabled(val: Boolean) {
    let property = this.findPropertyByName(PropertyGroupName.normal, '是否禁用')
    this.setPropertyVal(property.id, val)
    if (val) {
      this.setButtonAttribute(this.btnOptions.infoDisable)
      this.removeSpanClass()
    } else {
      this.setButtonAttribute(this.btnOptions.infoNormal)
    }
  }

  // private onCurrentPropertyChanged(propertyId: string, property_newval: any, comp: ComponentBase): void {
  //   if (property_newval.propertyName == '是否禁用') {
  //     this.buttonDisabled = property_newval.value
  //   }
  // }

  watchButtonAttributeInfo() {
    let findProp = this.findPropertyByName(PropertyGroupName.special, '按钮设置')

    if (findProp && typeof findProp.value != 'undefined') {
      this.btnOptions.infoNormal = findProp.value[0]
      this.btnOptions.infoHover = findProp.value[1]
      this.btnOptions.infoSelected = findProp.value[2]
      this.btnOptions.infoDisable = findProp.value[3]
    }
  }

  protected get buttonInfo(): buttonAttributeInfos[] {
    let property = this.findPropertyByName(PropertyGroupName.special, '按钮设置')
    if (!property) {
      return []
    }

    let val = property.value
    if (!val) {
      return []
    }
    return val as buttonAttributeInfos[]
  }

  get confirmTitle(): string {
    let findProp = this.findPropertyByName('特有属性', '气泡提示信息')
    if (findProp) {
      return findProp.value as string
    } else {
      return ''
    }
  }

  get isSo(): boolean {
    let findProp = this.findPropertyByName(PropertyGroupName.special, '是否展示气泡')
    if (findProp) {
      return findProp.value as boolean
    }
    return false
  }

  //按钮文本
  get buttonText(): string {
    let findProp = this.findPropertyByName('特有属性', '按钮文本')
    if (findProp) {
      return findProp.value as string
    } else {
      return ''
    }
  }

  get svgSize(): number {
    let findProp = this.findPropertyByName('特有属性', '图标大小')
    if (findProp) {
      return findProp.value as number
    }
    return 20
  }

  //公有属性
  get fontSize(): string {
    let findProp = this.findPropertyByName(PropertyGroupName.normal, '字体')
    if (findProp) {
      let size = findProp.value
      if (size == 0) {
        size = '14'
      }
      return size as string
    }
    return '14'
  }

  //按钮类型
  get buttonType(): string {
    let findProp = this.findPropertyByName(PropertyGroupName.special, '按钮类型')
    let typeName = 'default'
    if (findProp) {
      switch (findProp.value) {
        case '主按钮': {
          typeName = 'primary'
          break
        }
        case '次按钮': {
          typeName = 'default'
          break
        }
        case '虚线按钮': {
          typeName = 'dashed'
          break
        }
        case '危险按钮': {
          typeName = 'danger'
          break
        }
        default:
          typeName = 'link'
          break
      }
    }
    return typeName
  }

  // 为解决a-popconfirm在a-button上添加span并且继承a-button的外部Class，导致样式混乱的问题
  // 相关讨论 https://github.com/ant-design/ant-design/issues/5301
  private removeSpanClass() {
    this.$nextTick(() => {
      let btnDom = $(this.$el).find('span.gad-btn')
      btnDom.removeClass()
    })
  }

  get TooltipTitle(): string {
    let tmp = this.findPropertyByName(PropertyGroupName.special, '提示文字')
    if (tmp && (tmp.value as string) != '') {
      return tmp.value as string
    } else {
      return ''
    }
  }
}
</script>

<style scoped>
.icon {
  width: 2em;
  height: 2em;
}
.iconCss {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: auto;
}
</style>

