 
<template>
  <div style="height:100%;">

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent, LayoutType, layoutCompTypeAttr } from '@designEngine/03designerLayoutBase'
import { Property, PropertyGroupName, Number_Setting, Text_Setting, Boolean_Setting, Enum_Setting } from '@designEngine/03designerLayoutBase'
import { getUuid, deepClone } from '@common/utils'

@layoutCompTypeAttr('pc', LayoutType.system_component, '系统组件', '普通EChart', 'EchartNormal', null)
@Options({})
export default class EchartNormal extends EngineComponent {
  mounted() {
    this.width = '150px'
    this.height = '40px'
    this.background = 'white'
    this.registerProperty(PropertyGroupName.special, '文本', new Text_Setting(), '文本组件')
    //var textPropertyId = this.findPropertyByName(PropertyGroupName.special, '文本').id
    this.registerProperty(PropertyGroupName.special, '水平对齐', new Enum_Setting(true, ['居左', '居中', '居右']), '居中')
    this.registerProperty(PropertyGroupName.special, '垂直对齐', new Enum_Setting(true, ['居上', '居中', '居下']), '居中')
    // this.registerProperty('垂直对齐', PropertyGroupName.special, new Enum_Setting(true, ['上', '中', '下']), '上')
    this.registerProperty(PropertyGroupName.special, '提示文字', new Text_Setting(), '')
    this.registerProperty(PropertyGroupName.special, '是否换行', new Enum_Setting(true, ['是', '否']), '是')
    this.registerProperty(PropertyGroupName.special, '粗细', new Enum_Setting(true, ['normal', 'bold', 'bolder', 'lighter']), 'normal')
    this.registerProperty(PropertyGroupName.special, '是否倾斜', new Enum_Setting(true, ['是', '否']), '否')
    this.registerProperty(PropertyGroupName.special, '是否可点击开启编辑', new Enum_Setting(true, ['是', '否']), '否')
    this.registerProperty(PropertyGroupName.special, '是否显示边框', new Enum_Setting(true, ['是', '否']), '否')
  }
}
</script>



<style scoped>
</style>