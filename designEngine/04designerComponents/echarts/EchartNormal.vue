 
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
    this.width = '500px'
    this.height = '500px'
    this.registerProperty(PropertyGroupName.special, 'Option设置', new Text_Setting())
  }
}
</script>



<style scoped>
</style>