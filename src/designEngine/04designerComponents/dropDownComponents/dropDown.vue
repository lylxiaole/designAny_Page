<template>
  <div>
    <a-dropdown-button v-if="dropFormat == 1" :trigger="dropTrigger" :disabled="dropDownDisabled" :placement="placement" :size="size"
      :style="{ color: Color, width: '100%', height: '100%' }">
      {{ DropdownText }}
      <a-menu slot="overlay">
        <a-menu-item @click="handleMenuClick(item, i)" v-for="(item, i) in dropdowns" :key="item.key" v-show="item.dropVisable">
          <a-popconfirm v-if="item.checked === true" :title="item.confirmTitle" okText="确认" :disabled="dropDownDisabled" cancelText="取消"
            @confirm="confirm(item.value)" @cancel="cancel">
            <a-button type="link" :style="{ color: item.dropTextColor }"><img referrer="no-referrer|origin|unsafe-url" v-if="item.iconFlag"
                v-lazy="item.url" alt="image" width="16px" height="16px" style="margin-right:8px;margin-top:-1px;" />{{ item.value }}</a-button>
          </a-popconfirm>
          <a-button v-else type="link" :style="{ color: item.dropTextColor }">
            <img referrer="no-referrer|origin|unsafe-url" v-if="item.iconFlag" v-lazy="item.url" alt="image" width="16px" height="16px"
              style="margin-right:8px;margin-top:-1px;" />
            {{ item.value }}
          </a-button>
        </a-menu-item>
      </a-menu>
    </a-dropdown-button>
    <a-dropdown v-else-if="dropFormat == 2" :trigger="dropTrigger" :style="{ width: '100%', height: '100%' }">
      <a-menu slot="overlay">
        <a-menu-item @click="handleMenuClick(item, i)" v-for="(item, i) in dropdowns" :key="item.key" v-show="item.dropVisable">
          <a-popconfirm v-if="item.checked === true" :title="item.confirmTitle" okText="确认" cancelText="取消" @confirm="confirm(item.value)"
            @cancel="cancel">
            <a-button type="link" :style="{ color: item.dropTextColor }"><img referrer="no-referrer|origin|unsafe-url" v-if="item.iconFlag"
                v-lazy="item.url" alt="image" width="16px" height="16px" style="margin-right:8px;margin-top:-1px;" />{{ item.value }}</a-button>
          </a-popconfirm>
          <a-button v-else type="link" :style="{ color: item.dropTextColor }"><img referrer="no-referrer|origin|unsafe-url" v-if="item.iconFlag"
              v-lazy="item.url" alt="image" width="16px" height="16px" style="margin-right:8px;margin-top:-1px;" />{{ item.value }}</a-button>
        </a-menu-item>
      </a-menu>
      <a-button :style="{
          width: '100%',
          height: '100%',
          padding: 0 + 'px',
          color: fontColor,
          background: backgroundColor,
          borderColor: buttonFrameColor,
        }" :disabled="dropDownDisabled" @mouseover="onMouseOver" @mouseout="onMouseOut" @mousedown="onmousedown" @mouseup="onmouseup">
        <a-icon v-if="dropIconFlag" :type="varIcon" ghost></a-icon>
        <img referrer="no-referrer|origin|unsafe-url" v-else v-lazy="dropImageUrl" alt="image"
          style="margin-right:8px;margin-top:-3px;width:16px;height:16px" />{{ DropdownText }}
        <a-icon type="down" style="margin-left:3px" v-if="suffixIcon" />
      </a-button>
    </a-dropdown>
    <a-dropdown v-else :trigger="dropTrigger" :disabled="dropDownDisabled">
      <a-menu slot="overlay">
        <a-menu-item @click="handleMenuClick(item, i)" v-for="(item, i) in dropdowns" :key="item.key" v-show="item.dropVisable">
          <a-popconfirm v-if="item.checked === true" :title="item.confirmTitle" okText="确认" :disabled="dropDownDisabled" cancelText="取消"
            @confirm="confirm(item.value)" @cancel="cancel">
            <a-button type="link" :style="{ color: item.dropTextColor }"><img referrer="no-referrer|origin|unsafe-url" v-if="item.iconFlag"
                v-lazy="item.url" alt="image" width="16px" height="16px" style="margin-right:8px;margin-top:-1px;" />{{ item.value }}</a-button>
          </a-popconfirm>
          <a-button v-else type="link" :style="{ color: item.dropTextColor }"><img referrer="no-referrer|origin|unsafe-url" v-if="item.iconFlag"
              v-lazy="item.url" alt="image" width="16px" height="16px" style="margin-right:8px;margin-top:-1px;" />{{ item.value }}</a-button>
        </a-menu-item>
      </a-menu>
      <div style="text-align:center;margin-top:5px;" :disabled="dropDownDisabled">
        <a :style="{ color: dropColor }" href="#">
          {{ DropdownText }}
          <a-icon type="down" style="margin-left:3px" /></a>
      </div>
    </a-dropdown>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Number_Property,
  Text_Property,
  TextList_Property,
  Boolean_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  UploadFile_Property,
  Color_Property,
  Button_Property,
  PageInParams_Property,
  dropDown_Property
} from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import common from '../../02common/commonMethod'
import { param, paramType } from '../../03designerLayoutBase'
import { CurrentContext } from '../../01designerContext'
import dropdownAttributeInfo from '../../02common/commonClasses/dropdownAttributeInfo'
import buttonAttributeInfos from '../../02common/commonClasses/buttonAttributeInfo'

@Component
export default class dropDown extends ComponentBase {
  infoNormal: buttonAttributeInfos = new buttonAttributeInfos()
  infoHover: buttonAttributeInfos = new buttonAttributeInfos()
  infoSelected: buttonAttributeInfos = new buttonAttributeInfos()
  infoDisable: buttonAttributeInfos = new buttonAttributeInfos()
  varIcon: string = ''
  backgroundColor: string = ''
  fontColor: string = ''
  buttonFrameColor: string = ''
  dropIconFlag: boolean = true
  dropImageUrl: string = '../../assets/edit.png'
  private flagKey: string = null
  private isShowPrefix: boolean = false
  private dropColor: string = ''
  inparam: param[]
  outparam: param
  visible: boolean = false
  private iconFlag: boolean = false
  dropdowns: dropdownAttributeInfo[] = []

  @Watch('dropdowns', { deep: true })
  watchdropdownsChanged(newval: dropdownAttributeInfo[]) {
    if (!newval) {
      newval = []
    }

    for (let index = 0; index < newval.length; index++) {
      let element = newval[index]
      if (this.isHavePermission(element.authCode) == undefined) {
        continue
      }

      if (this.isHavePermission(element.authCode) == false && element.dropVisable == true) {
        element.dropVisable = false
      }
    }
  }

  @Watch('isSelected')
  watchIsSelected() {
    if (this.isSelected && !this.dropDownDisabled) {
      this.setButtonAttribute(this.infoSelected)
    } else if (!this.isSelected && !this.dropDownDisabled) {
      this.setButtonAttribute(this.infoNormal)
    }
  }

  @Watch('infoNormal')
  watchInfoNormal() {
    if (!this.dropDownDisabled) {
      this.setButtonAttribute(this.infoNormal)
    }
  }

  @Watch('infoSelected')
  watchInfoSelected() {
    if (this.isSelected && !this.dropDownDisabled) {
      this.setButtonAttribute(this.infoSelected)
    }
  }

  @Watch('infoDisable')
  watchInfoDisable() {
    if (this.dropDownDisabled) {
      //window.console.info('this.infoDisable', this.infoDisable)
      this.setButtonAttribute(this.infoDisable)
    }
  }

  private setButtonAttribute(buttonAttributeInfo: buttonAttributeInfos) {
    if (typeof buttonAttributeInfo.buttonIconType !== 'undefined') {
      if (buttonAttributeInfo.buttonIconType == 1) {
        this.dropIconFlag = true
        this.varIcon = buttonAttributeInfo.buttonIcons + ''
      } else {
        this.dropIconFlag = false
        this.varIcon = ''
        this.dropImageUrl = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, buttonAttributeInfo.buttonIconImages[0].url.split('?')[0])
      }
    }
    this.fontColor = buttonAttributeInfo.buttonTextColor
    this.backgroundColor = buttonAttributeInfo.buttonBGColor
    if (!buttonAttributeInfo.buttonFrameColor) {
      this.buttonFrameColor = buttonAttributeInfo.buttonBGColor
    } else {
      this.buttonFrameColor = buttonAttributeInfo.buttonFrameColor
    }
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
    var fprop = this.findPropertyByName(PropertyGroupName.special, '按钮设置')
    if (!fprop) {
      return []
    }
    return fprop.value as buttonAttributeInfos[]
  }
  private onMouseOver() {
    if (!this.dropDownDisabled) {
      this.setButtonAttribute(this.infoHover)
    }
  }
  private onmousedown() {
    this.setButtonAttribute(this.infoSelected)
  }
  private onmouseup() {
    this.setButtonAttribute(this.infoNormal)
  }
  private onMouseOut() {
    if (!this.dropDownDisabled) {
      if (this.isSelected) {
        this.setButtonAttribute(this.infoSelected)
      } else {
        this.setButtonAttribute(this.infoNormal)
      }
    }
  }
  mounted() {
    let cellData: dropdownAttributeInfo[] = [
      {
        key: this.flagKey,
        value: '111',
        authCode: null,
        checked: false,
        confirmTitle: '确认要删除吗？',
        imageUrl: [],
        iconFlag: false,
        url: '',
        dropTextColor: '',
        dropVisable: true,
        timeout: 1000
      }
    ]
    if (this.IsDesigning) {
      this.width = 80
      this.height = 34
      this.background = 'white'
      this.flagKey = common.getUuid()

      this.registerProperty('按钮设置', PropertyGroupName.special, new Button_Property())
      this.registerProperty('菜单项设置', PropertyGroupName.special, new dropDown_Property(), cellData)
      this.registerProperty('是否展示后缀图标', PropertyGroupName.special, new Boolean_Property(), false)
      this.registerProperty('按钮文本', PropertyGroupName.special, new Text_Property(), '新增')
      this.registerProperty('菜单格式', PropertyGroupName.special, new Enum_Property(true, ['菜单按钮', '按钮', '菜单']), '菜单按钮')
      this.registerProperty('触发方式', PropertyGroupName.special, new Enum_Property(true, ['点击', '悬浮', '右键']), '悬浮')
      this.registerProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, ['大', '中', '小']), '中')
      this.registerProperty('菜单弹出位置', PropertyGroupName.special, new Enum_Property(true, ['左下', '右下', '中间', '左上', '右上']), '左下')

      this.findPropertyByName(PropertyGroupName.normal, '前景色').canSetting = false
      this.findPropertyByName(PropertyGroupName.normal, '背景图片').canSetting = false
      this.findPropertyByName(PropertyGroupName.normal, '背景色').canSetting = false
    }

    let dropDownparam: param[] = []
    dropDownparam.push({ name: '按钮名称', type: paramType.string, val: null })
    this.registerEvents('点击事件', '', this.inparam, this.outparam)
    this.registerEvents('确认按钮回调事件', '', this.inparam, this.outparam)
    this.registerMethods('菜单项隐藏', '', this.dropDownVisable, dropDownparam, null)
    this.registerMethods('菜单项显示', '', this.dropDown, dropDownparam, null)
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
    this.$watch('buttonInfo', this.watchButtonAttributeInfo, { deep: true })
    /** */
    this.dropdowns = common.clone(cellData)
  }
  /** 属性表更方法 */
  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    if (property.propertyName === '菜单项设置') {
      //window.console.info('菜单项设置--------------------', property.value)
      if (property && property.value) {
        //Update By LH 2020/07/28
        let dropdownVal = property.value as dropdownAttributeInfo[]
        dropdownVal.forEach((item) => {
          if (item.imageUrl[0] !== undefined) {
            item.url = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, item.imageUrl[0].url.split('?')[0])
            item.iconFlag = true
          }
        })
        this.dropdowns = common.clone(dropdownVal)
      }
    } else if (property.propertyName === '是否禁用') {
      this.dropDownDisabled = property.value
    }
  }

  protected loadCompleted(childrenData: any[]) {
    let property = this.findPropertyByName(PropertyGroupName.special, '菜单项设置')
    if (property && property.value) {
      //Update  By LH 2020/07/29
      let dropdownVal = property.value as any[]
      dropdownVal.forEach((item) => {
        if (item.imageUrl[0] !== undefined) {
          item.url = common.BuildingFileUrlForShow(CurrentContext.FileServerAddress, item.imageUrl[0].url.split('?')[0])
          item.iconFlag = true
        }
      })
      //window.console.log("---------------dropdownVal", dropdownVal);
      this.dropdowns = common.clone(dropdownVal)

      this.children = []
      for (let index = 0; index < this.dropdowns.length; index++) {
        const element = this.dropdowns[index]
        let newcomp = new ComponentBase()
        newcomp.authorityCode = element.authCode
        this.children.push(newcomp)
      }
    }
  }

  private dropDownVisable(param: any) {
    let dropDown = param
    let index = this.dropdowns.findIndex((o) => o.value == param[0])
    let drop = this.dropdowns[index]
    if (drop !== undefined) {
      drop.dropVisable = false
      this.$set(this.dropdowns, index, drop)
    }
  }
  private dropDown(param: any) {
    let dropDown = param
    let index = this.dropdowns.findIndex((o) => o.value == param[0])
    let drop = this.dropdowns[index]
    if (drop !== undefined) {
      drop.dropVisable = true
      this.$set(this.dropdowns, index, drop)
    }
  }

  //按钮文本
  get DropdownText(): string {
    if (this.findPropertyByName('特有属性', '按钮文本')) {
      return this.findPropertyByName('特有属性', '按钮文本').value as string
    } else {
      return ''
    }
  }
  get suffixIcon(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否展示后缀图标')[0]) {
      return this.findProperties(PropertyGroupName.special, '是否展示后缀图标')[0].value as boolean
    }
    return false
  }

  private handleVisibleChange(visible) {
    if (!visible) {
      this.visible = false
      return
    }
    if (this.dropDownDisabled) {
    } else {
      this.visible = true
    }
  }
  get Color(): string {
    if (this.findProperties(PropertyGroupName.normal, '前景色')[0]) {
      return this.findProperties(PropertyGroupName.normal, '前景色')[0].value as string
    }
    return ''
  }

  get dropTrigger(): any {
    if (this.findPropertyByName(PropertyGroupName.special, '触发方式')) {
      if (this.findPropertyByName(PropertyGroupName.special, '触发方式').value === '点击') {
        return ['click']
      } else if (this.findPropertyByName(PropertyGroupName.special, '触发方式').value === '悬浮') {
        return ['hover']
      } else if (this.findPropertyByName(PropertyGroupName.special, '触发方式').value === '右键') {
        return ['contextmenu']
      }
    }
    return []
  }
  get dropDownDisabled(): Boolean {
    var property = this.findPropertyByName(PropertyGroupName.normal, '是否禁用')
    if (!property) {
      this.dropColor = ''
      return false
    }
    if (property.value === true) {
      this.dropColor = 'rgba(183, 183, 183, 1)'
    } else {
      this.dropColor = ''
    }
    return property.value as boolean
  }

  set dropDownDisabled(val: Boolean) {
    var property = this.findPropertyByName(PropertyGroupName.normal, '是否禁用')
    this.setPropertyVal(property.id, val)
    if (val) {
      this.setButtonAttribute(this.infoDisable)
    } else {
      this.setButtonAttribute(this.infoNormal)
    }
  }
  get placement(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '菜单弹出位置')) {
      if (this.findPropertyByName(PropertyGroupName.special, '菜单弹出位置').value === '左下') {
        return 'bottomLeft'
      } else if (this.findPropertyByName(PropertyGroupName.special, '菜单弹出位置').value === '右下') {
        return 'bottomCenter'
      } else if (this.findPropertyByName(PropertyGroupName.special, '菜单弹出位置').value === '左上') {
        return 'topLeft'
      } else if (this.findPropertyByName(PropertyGroupName.special, '菜单弹出位置').value === '右上') {
        return 'topRight'
      } else {
        return 'topCenter'
      }
    }
    return 'topRight'
  }
  get size(): string {
    if (this.findProperties(PropertyGroupName.special, '尺寸')[0]) {
      return (this.findProperties(PropertyGroupName.special, '尺寸')[0].value as string) == '大'
        ? 'large'
        : (this.findProperties(PropertyGroupName.special, '尺寸')[0].value as string) == '中'
        ? 'default'
        : 'small'
    }
    return 'default'
  }
  get dropFormat(): number {
    if (this.findProperties(PropertyGroupName.special, '菜单格式')[0]) {
      return (this.findProperties(PropertyGroupName.special, '菜单格式')[0].value as string) == '菜单按钮'
        ? 1
        : (this.findProperties(PropertyGroupName.special, '菜单格式')[0].value as string) == '按钮'
        ? 2
        : 3
    }
    return 0
  }

  buttonTimeOut: boolean = true
  private handleMenuClick(drop: any, index) {
    //window.console.log('---------------drop',drop)
    if (this.buttonTimeOut) {
      this.buttonTimeOut = false
      setTimeout(
        () => {
          this.buttonTimeOut = true
        },
        drop.timeout ? (drop.timeout as number) : 1000
      )
      this.triggeEvent('点击事件', drop.value)
    }
  }
  private cancel() {}
  private confirm(val: any) {
    this.triggeEvent('确认按钮回调事件', val)
  }
}
</script>
<style lang="less" scoped></style>
