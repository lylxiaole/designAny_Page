/**
 * 文本组件
 * Modified by GG 新增字体大小,粗体,斜体设置
 */
<template>
  <div style="height:100%;">
    <a-tooltip placement="right" :title="TooltipTitle">
      <div :id="Id" :style="{backgroundColor:background,borderWidth:isShowBorder?'1px':'0px',borderStyle:'solid',borderColor:'#000000'}"
        style="height:100%;display: table;table-layout: fixed;width:100%;">
        <span :contentEditable="contentEditable" :style="{
          'height':'100%','width':'100%',
          'font-weight':fontWeight,
          'color':foreground,
          'font-size': fontSize + 'px',
          'font-style':fontStyle,
          'text-align': Horienten,
          'vertical-align':verticalAlign,
          'text-overflow':'ellipsis',
          'overflow':'hidden',
          'display':'table-cell',
          'white-space':space}" v-html="CurrentText"></span>
      </div>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { Property, Text_Property, Behavior_Property, Enum_Property, PropertyGroupName } from '@src/designEngine/03designerLayoutBase'
import { ComponentBase } from '@src/designEngine'

@Component
export default class TextComponent extends ComponentBase {
  isShowIndex: boolean = false
  isShowInput: boolean = false

  mounted() {
    this.width = 150
    this.height = 40
    this.background = 'white'
    this.registerProperty('文本', PropertyGroupName.special, new Text_Property(), '文本组件')
    //var textPropertyId = this.findPropertyByName(PropertyGroupName.special, '文本').id

    this.registerProperty('水平对齐', PropertyGroupName.special, new Enum_Property(true, ['居左', '居中', '居右']), '居中')
    this.registerProperty('垂直对齐', PropertyGroupName.special, new Enum_Property(true, ['居上', '居中', '居下']), '居中')
    // this.registerProperty('垂直对齐', PropertyGroupName.special, new Enum_Property(true, ['上', '中', '下']), '上')
    this.registerProperty('提示文字', PropertyGroupName.special, new Text_Property(), '')
    this.registerProperty('是否换行', PropertyGroupName.special, new Enum_Property(true, ['是', '否']), '是')
    this.registerProperty('粗细', PropertyGroupName.special, new Enum_Property(true, ['normal', 'bold', 'bolder', 'lighter']), 'normal')
    this.registerProperty('是否倾斜', PropertyGroupName.special, new Enum_Property(true, ['是', '否']), '否')
    this.registerProperty('是否可点击开启编辑', PropertyGroupName.special, new Enum_Property(true, ['是', '否']), '否')
    this.registerProperty('是否显示边框', PropertyGroupName.special, new Enum_Property(true, ['是', '否']), '否')
    // this.CaptureEvent()
    // this.canDrag = true
    // this.canDrop = true
    //let showinput = this.isShowInput
    // $('span').bind('dblclick', function() {

    // })
  }

  get contentEditable(): boolean {
    let prop = this.findPropertyByName(PropertyGroupName.special, '是否可点击开启编辑')
    if (prop && prop.value == '是') {
      return true
    } else {
      return false
    }
  }

  get fontSize(): string {
    if (this.findProperties(PropertyGroupName.normal, '字体')[0]) {
      return this.findProperties(PropertyGroupName.normal, '字体')[0].value as string
    }
    return '14'
  }
  get fontWeight(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '粗细')) {
      return this.findProperties(PropertyGroupName.special, '粗细')[0].value as string
    } else {
      return 'normal'
    }
  }
  get fontStyle(): string {
    if (this.findProperties(PropertyGroupName.special, '是否倾斜')[0]) {
      return this.findProperties(PropertyGroupName.special, '是否倾斜')[0].value === '是' ? 'oblique' : 'normal'
    } else {
      return 'normal'
    }
  }

  get verticalAlign(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '垂直对齐')) {
      if (this.findPropertyByName(PropertyGroupName.special, '垂直对齐').value === '居上') {
        return 'top'
      } else if (this.findPropertyByName(PropertyGroupName.special, '垂直对齐').value === '居中') {
        return 'middle'
      } else if (this.findPropertyByName(PropertyGroupName.special, '垂直对齐').value === '居下') {
        return 'bottom'
      }
    }
    return 'top'
  }
  get CurrentText(): string {
    if (this.findProperties(PropertyGroupName.special, '文本')[0]) {
      if (this.contentEditable) {
        //window.console.log('-----------文本输入框文字', this.findProperties(PropertyGroupName.special, '文本')[0].value as string)
      }
      return this.findProperties(PropertyGroupName.special, '文本')[0].value as string
    } else {
      return '暂无数据'
    }
  }
  get space(): string {
    if (this.findProperties(PropertyGroupName.special, '是否换行')[0]) {
      return this.findProperties(PropertyGroupName.special, '是否换行')[0].value === '否' ? 'nowrap' : null
    } else {
      return null
    }
  }

  /**获取属性值 */
  get Horienten(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '水平对齐')) {
      if (this.findPropertyByName(PropertyGroupName.special, '水平对齐').value === '居左') {
        return 'left'
      } else if (this.findPropertyByName(PropertyGroupName.special, '水平对齐').value === '居右') {
        return 'right'
      } else if (this.findPropertyByName(PropertyGroupName.special, '水平对齐').value === '居中') {
        return 'center'
      }
    }
    return 'center'
  }

  get TooltipTitle(): string {
    var tmp = this.findPropertyByName(PropertyGroupName.special, '提示文字')
    if (tmp && (tmp.value as string) != '') {
      return tmp.value as string
    } else {
      // if (this.findPropertyByName(PropertyGroupName.special, '文本')) {
      //   return this.findPropertyByName(PropertyGroupName.special, '文本').value as string
      // } else {
      //   return ''
      // }
      return ''
    }
  }

  get isShowBorder(): boolean {
    let prop = this.findPropertyByName(PropertyGroupName.special, '是否显示边框')
    if (prop && prop.value == '是') {
      return true
    } else {
      return false
    }
  }
}
</script>



<style scoped>
</style>