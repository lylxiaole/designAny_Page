<template>
  <div>
    <a-switch v-if="visible" v-model="checked" :style="switchStyle" :checkedChildren="checkedChildren"
              :unCheckedChildren="unCheckedChildren" :disabled="disabled" :size="size" @change="OnChange"/>
    <a-switch v-else v-model="checked" :style="switchStyle" :disabled="disabled" :size="size" @change="OnChange">
      <a-icon :type="checkedIcon" slot="checkedChildren"/>
      <a-icon :type="unCheckedIcon" slot="unCheckedChildren"/>
    </a-switch>
  </div>
</template>

<script lang='ts'>
import {Component, Prop, Vue, Emit, Watch} from 'vue-property-decorator'
import {
  Property,
  Number_Property,
  Text_Property,
  Enum_Property,
  PropertyGroupName,
  Color_Property
} from '../../02common/commonClasses/LayoutProperty'
import ComponentBase from '../ComponentBase'
import {param} from '../../02common/commonClasses/layoutEvent'

@Component
export default class SwitchComponent extends ComponentBase {
  visible: boolean = true
  inparam: param[]
  outparam: param

  mounted() {
    if (this.IsDesigning) {
      this.width = 50
      this.height = 25

      this.RegisterProperty('左内边距', PropertyGroupName.special, new Text_Property(), '0')
      this.RegisterProperty('上内边距', PropertyGroupName.special, new Text_Property(), '0')
      this.RegisterProperty('右内边距', PropertyGroupName.special, new Text_Property(), '0')
      this.RegisterProperty('下内边距', PropertyGroupName.special, new Text_Property(), '0')
      this.RegisterProperty('值', PropertyGroupName.special, new Number_Property(), 0)
      this.FindPropertyByName(PropertyGroupName.normal, '前景色').canSetting = false
      this.FindPropertyByName(PropertyGroupName.normal, '背景色').canSetting = false

      this.RegisterProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, ['大', '小']), '大')
      this.RegisterProperty('switch开关标识', PropertyGroupName.special, new Enum_Property(true, ['无标识', '文本标识', '图标标识']), '无标识')

      this.RegisterProperty('选中时文本', PropertyGroupName.special, new Text_Property(), '是')

      this.RegisterProperty('非选中时文本', PropertyGroupName.special, new Text_Property(), '否')

      this.RegisterProperty('选中时颜色', PropertyGroupName.special, new Color_Property(), '#18AEB7')
      this.RegisterProperty('非选中时颜色', PropertyGroupName.special, new Color_Property(), 'rgba(0, 0, 0, 0.25)')

      this.RegisterProperty('选中时字体颜色', PropertyGroupName.special, new Color_Property(), '#fff')
      this.RegisterProperty('非选中时字体颜色', PropertyGroupName.special, new Color_Property(), '#fff')

      this.RegisterProperty('选中时图标', PropertyGroupName.special, new Enum_Property(true, ['对号', '微笑']), '对号')
      this.FindPropertyByName(PropertyGroupName.special, '选中时图标').canSetting = false
      this.RegisterProperty('非选中时图标', PropertyGroupName.special, new Enum_Property(true, ['叉号', '皱眉']), '叉号')
      this.FindPropertyByName(PropertyGroupName.special, '非选中时图标').canSetting = false
    }
    //注册事件
    this.RegisterEvents('状态改变事件', '', this.inparam, this.outparam)
    this.$watch('switchIcon', this.watchSwitchIconType, {deep: true})
    //属性改变触发
    this.$on('onPropertyChanged', this.onCurrentPropertyChanged)
    if (this.curModelproperty && this.curModelproperty.defaultValue) {
      if (parseInt(this.curModelproperty.defaultValue) == 1) {
        this.checked = true
      } else if (parseInt(this.curModelproperty.defaultValue) == 0) {
        this.checked = false
      }
    }
  }

  get switchStyle(): any {
    return {
      'background-color': this.checked ? this.check_backGroundColor : this.uncheck_backGroundColor,
      paddingLeft: this.PaddingLeft + 'px',
      paddingTop: this.PaddingTop + 'px',
      paddingRight: this.PaddingRight + 'px',
      paddingBottom: this.PaddingBottom + 'px'
    }
  }

  public get validateProperty(): Property {
    let property = this.FindPropertyByName(PropertyGroupName.special, '值')
    return property
  }

  private onCurrentPropertyChanged(propertyId: string, property: Property, comp: ComponentBase): void {
    if (this.checked) {
      this.TriggeEvent('状态改变事件', null)
      $(this.$el)
          .find('.ant-switch-inner')
          .css('color', this.check_fontColor)
    } else {
      this.TriggeEvent('状态改变事件', null)
      $(this.$el)
          .find('.ant-switch-inner')
          .css('color', this.uncheck_fontColor)
    }
  }

  rendered(el: any) {
    $(this.$el)
        .find('.ant-switch-inner')
        .css('font-size', this.fontSize)

    if (this.FindPropertyByName(PropertyGroupName.special, '值').value === 1) {
      $(this.$el)
          .find('.ant-switch-inner')
          .css('color', this.check_fontColor)
    } else {
      $(this.$el)
          .find('.ant-switch-inner')
          .css('color', this.uncheck_fontColor)
    }
  }

  //监听标识类型
  watchSwitchIconType() {
    if (this.switchIcon === 'icon') {
      this.FindPropertyByName(PropertyGroupName.special, '选中时文本').canSetting = false
      this.FindPropertyByName(PropertyGroupName.special, '非选中时文本').canSetting = false
      this.FindPropertyByName(PropertyGroupName.special, '选中时图标').canSetting = true
      this.FindPropertyByName(PropertyGroupName.special, '非选中时图标').canSetting = true
      this.visible = false
    } else if (this.switchIcon === 'text') {
      this.FindPropertyByName(PropertyGroupName.special, '选中时文本').canSetting = true
      this.FindPropertyByName(PropertyGroupName.special, '非选中时文本').canSetting = true
      this.FindPropertyByName(PropertyGroupName.special, '选中时图标').canSetting = false
      this.FindPropertyByName(PropertyGroupName.special, '非选中时图标').canSetting = false
      this.visible = true
    } else {
      this.FindPropertyByName(PropertyGroupName.special, '选中时文本').canSetting = false
      this.FindPropertyByName(PropertyGroupName.special, '非选中时文本').canSetting = false
      this.FindPropertyByName(PropertyGroupName.special, '选中时图标').canSetting = false
      this.FindPropertyByName(PropertyGroupName.special, '非选中时图标').canSetting = false
      this.visible = true
    }
  }

  //设置switch开关的标识
  get switchIcon(): string {
    if (this.FindProperties(PropertyGroupName.special, 'switch开关标识')[0]) {
      if ((this.FindProperties(PropertyGroupName.special, 'switch开关标识')[0].value as string) == '无标识') {
        return ''
      } else if ((this.FindProperties(PropertyGroupName.special, 'switch开关标识')[0].value as string) == '文本标识') {
        return 'text'
      } else {
        return 'icon'
      }
    }
    return ''
  }

  get checked(): Boolean {
    let property = this.FindPropertyByName(PropertyGroupName.special, '值')
    if (property && property.value == 1) {
      return true
    }
    return false
  }

  set checked(val: Boolean) {
    let property = this.FindPropertyByName(PropertyGroupName.special, '值')
    if (!property) {
      return
    }
    if (val == true) {
      this.SetPropertyVal(property.id, 1)
    }
    if (val == false) {
      this.SetPropertyVal(property.id, 0)
    }
  }

  get check_backGroundColor(): string {
    if (this.FindProperties(PropertyGroupName.special, '选中时颜色')[0]) {
      return this.FindProperties(PropertyGroupName.special, '选中时颜色')[0].value as string
    }
    return ''
  }

  get check_fontColor(): string {
    if (this.FindProperties(PropertyGroupName.special, '选中时字体颜色')[0]) {
      return this.FindProperties(PropertyGroupName.special, '选中时字体颜色')[0].value as string
    }
    return ''
  }

  get PaddingRight(): string {
    if (this.FindProperties(PropertyGroupName.special, '右内边距')[0]) {
      return this.FindProperties(PropertyGroupName.special, '右内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingTop(): string {
    if (this.FindProperties(PropertyGroupName.special, '上内边距')[0]) {
      return this.FindProperties(PropertyGroupName.special, '上内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingLeft(): string {
    if (this.FindProperties(PropertyGroupName.special, '左内边距')[0]) {
      return this.FindProperties(PropertyGroupName.special, '左内边距')[0].value as string
    } else {
      return ''
    }
  }

  get PaddingBottom(): string {
    if (this.FindProperties(PropertyGroupName.special, '下内边距')[0]) {
      let data = this.FindProperties(PropertyGroupName.special, '下内边距')[0].value as string
      return data
    }
    return ''
  }

  get uncheck_backGroundColor(): string {
    if (this.FindProperties(PropertyGroupName.special, '非选中时颜色')[0]) {
      return this.FindProperties(PropertyGroupName.special, '非选中时颜色')[0].value as string
    }
    return ''
  }

  get uncheck_fontColor(): string {
    if (this.FindProperties(PropertyGroupName.special, '非选中时字体颜色')[0]) {
      return this.FindProperties(PropertyGroupName.special, '非选中时字体颜色')[0].value as string
    }
    return ''
  }

  //选中时文本
  get checkedChildren(): string {
    if (
        this.FindPropertyByName(PropertyGroupName.special, '选中时文本') &&
        this.FindPropertyByName(PropertyGroupName.special, '选中时文本').canSetting
    ) {
      return this.FindPropertyByName(PropertyGroupName.special, '选中时文本').value as string
    }
    return '是'
  }

  //非选中时文本
  get unCheckedChildren(): string {
    if (
        this.FindPropertyByName(PropertyGroupName.special, '非选中时文本') &&
        this.FindPropertyByName(PropertyGroupName.special, '非选中时文本').canSetting
    ) {
      return this.FindPropertyByName(PropertyGroupName.special, '非选中时文本').value as string
    }
    return '否'
  }

  //选中时图标
  get checkedIcon(): string {
    if (
        this.FindProperties(PropertyGroupName.special, '选中时图标')[0] &&
        this.FindPropertyByName(PropertyGroupName.special, '选中时图标').canSetting
    ) {
      if ((this.FindProperties(PropertyGroupName.special, '选中时图标')[0].value as string) == '对号') {
        return 'check'
      } else {
        return 'smile'
      }
    }
    return ''
  }

  //非选中时图标
  get unCheckedIcon(): string {
    if (
        this.FindProperties(PropertyGroupName.special, '非选中时图标')[0] &&
        this.FindPropertyByName(PropertyGroupName.special, '非选中时图标').canSetting
    ) {
      if ((this.FindProperties(PropertyGroupName.special, '非选中时图标')[0].value as string) == '叉号') {
        return 'close'
      } else {
        return 'frown'
      }
    }
    return ''
  }

  //开关大小
  get size(): string {
    if (this.FindProperties(PropertyGroupName.special, '尺寸')[0]) {
      return (this.FindProperties(PropertyGroupName.special, '尺寸')[0].value as string) == '大' ? 'default' : 'small'
    }
    return 'default'
  }

  //字体大小
  get fontSize(): string {
    if (this.FindProperties(PropertyGroupName.normal, '字体')[0]) {
      return this.FindProperties(PropertyGroupName.normal, '字体')[0].value as string
    }
    return ''
  }

  //触发注册的事件
  private OnChange(checked: any) {
    this.TriggeEvent('状态改变事件', null)
  }
}
</script>