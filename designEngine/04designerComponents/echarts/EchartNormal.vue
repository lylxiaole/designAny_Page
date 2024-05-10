 
<template>
  <div style="height:100%;width:100%" class="topdiv" ref="topdiv">
    <div ref="echartsArea" style="height:100%;width:100%"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent, DCompType, DCompnentAttr } from '@designEngine/03designerLayoutBase'
import { DPropAttr, Property, PropertyGroupName, JsonContent_Setting, Text_Setting } from '@designEngine/03designerLayoutBase'
import { getUuid, deepClone } from '@common/utils'
import * as echarts from 'echarts'
import { shallowRef } from 'vue'

import elementResizeDetectorMaker from 'element-resize-detector'

@DCompnentAttr('pc', DCompType.system_component, '系统组件', '普通EChart', 'EchartNormal', null)
@Options({})
export default class EchartNormal extends EngineComponent {
  private myChart: any = shallowRef({})
  private resizeListener: any = null

  @DPropAttr(new JsonContent_Setting('Option设置', PropertyGroupName.special, true))
  private option: any = {}

  mounted() {
    this.width = '500px'
    this.height = '500px'
    //*********************** */
    this.myChart = echarts.init(this.$refs.echartsArea as any)
    this.myChart.setOption(this.option, { notMerge: true })
    //*********************** */
    this.resizeListener = elementResizeDetectorMaker()
    this.resizeListener.listenTo(this.$refs.topdiv, () => {
      this.myChart.resize()
    })
    //*********************** */
    this.$watch('option', this.onOptionChanged, { deep: true })
  }
  private onOptionChanged(val) {
    this.myChart.setOption(val, { notMerge: true })
  }
  unmounted() {
    this.resizeListener.uninstall(this.$refs.topdiv)
  }
}
</script>



<style scoped>
</style>