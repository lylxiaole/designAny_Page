<template>
  <el-button :type="buttonType" :style="npBtnStyle" :disabled="buttonDisabled" @click="onClick" @mouseover="onMouseOver" @mouseout="onMouseOut"
    @mousedown="onmousedown" @mouseup="onmouseup">

  </el-button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent, LayoutType, layoutCompTypeAttr } from '@designEngine/03designerLayoutBase'
import {
  Property,
  PropertyGroupName,
  Number_Setting,
  Text_Setting,
  Boolean_Setting,
  Enum_Setting,
  Button_Setting
} from '@designEngine/03designerLayoutBase'
import { getUuid, deepClone } from '@common/utils'
import { paramType, param } from '@behaviorEngine/index'
import designerContext from '@designEngine/01designerContext/context'

class fileInfo {
  uid: string = 'uid' // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
  name: string
  get url(): string {
    return designerContext.getFileApiAddr(this.uid)
  }
}
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

@layoutCompTypeAttr('pc', LayoutType.system_component, '系统组件', '普通按钮', 'ButtonComponent1', null)
@Options({})
export default class ButtonComponent extends EngineComponent {
  private btnOptions: btnOptionsClass = new btnOptionsClass()

  created() {}

  mounted() {
    this.width = 80
    this.height = 34
    //注册特有属性
    this.registerProperty(PropertyGroupName.special, '按钮文本', new Text_Setting(), '新增')
    this.registerProperty(PropertyGroupName.special, '图标大小', new Number_Setting(), 20)
    this.registerProperty(
      PropertyGroupName.special,
      '按钮类型',
      new Enum_Setting(true, ['主按钮', '次按钮', '虚线按钮', '危险按钮', '链接按钮']),
      '主按钮'
    )
    this.registerProperty(PropertyGroupName.special, '按钮设置', new Button_Setting())
    //新增点击时间间隔属性
    this.registerProperty(PropertyGroupName.special, '点击时间间隔', new Number_Setting(), 1000)
    this.findPropertyByName(PropertyGroupName.normal, '前景色').canSetting = false
    this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
    this.findPropertyByName(PropertyGroupName.normal, '背景色').canSetting = false

    this.registerEvents('按钮点击事件', '', this.btnOptions.inparam, this.btnOptions.outparam)
    this.registerEvents('确认按钮回调事件', '', this.btnOptions.inparam, this.btnOptions.outparam)
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

