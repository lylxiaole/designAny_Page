/**
 * 基础卡片
 * By GG
 */
<template>
  <div>
    <a-card :hoverable='false' :bordered="false" :style="{background:backgroundColor, color: fontColor, fontSize: fontSize + 'px',width:'300px'}">
      <p :style="{lineHeight: lineHeight + 'px',}" v-for="(item,index) in options" :key='index'>{{item.value}}</p>
      <template slot="title">
        <label :style="{ background:backgroundColor,color: fontColor, fontSize: fontSize + 'px' }">{{title}}</label></template>
    </a-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { Property, Number_Property, Text_Property, Behavior_Property, Enum_Property, PropertyGroupName } from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import BaseEvents from '../../03designerLayoutBase/BaseEvents'
import common from '../../02common/commonMethod'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import TextComponent from '../textComponents/TextComponent.vue'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
/**
 * 支持绑定数据源，生成字段   options
 * 支持设置内容大小、颜色 style
 * 设置文字行间距 lineHeight
 * 设置卡片背景色 background
 * 设置卡片标题  title
 * 设置卡片标题大小，颜色 style
 */
const options = [{ value: 'Apple' }, { value: 'Pear' }, { value: 'Orange' }]
@Component({
  components: { TextComponent }
})
export default class CardComponent extends ComponentBase {
  data() {
    return {
      options
    }
  }
  created() {}
  mounted() {
    this.width = '100%'
    this.height = 500
    this.CaptureEvent()
    this.canDrop = true
    this.canDrag = true
    this.onDrag_Event = this.ListenDrag_Event
    //注册特有属性
    this.registerProperty('卡片标题', PropertyGroupName.special, new Text_Property(), '请设置')
    this.registerProperty('内容行高', PropertyGroupName.special, new Number_Property(), '')
  }
  // 右侧组件拖拽信息，属性的设置
  private ListenDrag_Event(el: Element, dragdata: DragItemData<any>) {}

  //  拖到容器后获取信息
  private ListenDrop_Event(el: Element, targetContainer: Element) {}

  //特有属性
  get title(): string {
    if (this.findProperties(PropertyGroupName.special, '卡片标题')[0]) {
      return this.findProperties(PropertyGroupName.special, '卡片标题')[0].value
    } else {
      return ''
    }
  }
  get lineHeight(): string {
    if (this.findProperties(PropertyGroupName.special, '内容行高')[0]) {
      return this.findProperties(PropertyGroupName.special, '内容行高')[0].value
    } else {
      return ''
    }
  }
  //公有属性
  get fontColor(): string {
    if (this.findProperties(PropertyGroupName.normal, '前景色')[0]) {
      return this.findProperties(PropertyGroupName.normal, '前景色')[0].value as string
    } else {
      return ''
    }
  }

  get fontSize(): string {
    if (this.findProperties(PropertyGroupName.normal, '字体')[0]) {
      return this.findProperties(PropertyGroupName.normal, '字体')[0].value as string
    } else {
      return ''
    }
  }
  get backgroundColor(): string {
    if (this.findProperties(PropertyGroupName.normal, '背景色')[0]) {
      return this.findProperties(PropertyGroupName.normal, '背景色')[0].value as string
    } else {
      return ''
    }
  }
}
</script>
<style scoped>
</style>

