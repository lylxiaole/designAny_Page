 
<template>
  <div style="height:100%;">
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
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent, DCompType, DCompnentAttr } from '@design-any/interface/dist/index'
import { DPropAttr, Property, PropertyGroupName, Number_Setting, Text_Setting, Boolean_Setting, Enum_Setting } from '@design-any/interface/dist/index'
import { getUuid, deepClone } from '@common/utils'

@DCompnentAttr('pc', DCompType.system_component, '系统组件', '文本组件', 'TextComponent_001', null)
@Options({})
export default class TextComponent extends EngineComponent {
  isShowIndex: boolean = false
  isShowInput: boolean = false

  mounted() {
    this.width = '10%'
    this.height = '4%'
    this.background = 'white'
  }

  @DPropAttr(new Boolean_Setting('是否可点击开启编辑', PropertyGroupName.special, true))
  private contentEditabl: boolean = false
  @DPropAttr(new Enum_Setting('粗细', PropertyGroupName.special, true, null, true, ['normal', 'bold', 'bolder', 'lighter']))
  private fontWeight: string = 'normal'
  @DPropAttr(new Enum_Setting('倾斜', PropertyGroupName.special, true, null, true, ['oblique', 'normal']))
  private fontStyle: string = 'normal'
  @DPropAttr(new Enum_Setting('垂直对齐', PropertyGroupName.special, true, null, true, ['top', 'middle', 'bottom']))
  private verticalAlign: string = 'middle'
  @DPropAttr(new Text_Setting('文本', PropertyGroupName.special, true))
  private CurrentText: string = '暂无数据'
  @DPropAttr(new Enum_Setting('自动换行', PropertyGroupName.special, true, null, true, ['nowrap', 'wrap']))
  private space: string = 'wrap'
  @DPropAttr(new Enum_Setting('水平对齐', PropertyGroupName.special, true, null, true, ['left', 'center', 'right']))
  private Horienten: string = 'center'
  @DPropAttr(new Boolean_Setting('是否显示边框', PropertyGroupName.special, true))
  private isShowBorder: boolean = false
}
</script>



<style scoped>
</style>