<template>
  <div style="height: 100%; width: 100%" class="topdiv" ref="topdiv">
    <div ref="echartsArea" style="height: 100%; width: 100%"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import { DCompnentAttr } from '@design-any/interface/dist/LayoutAttr/ComponentInfo'
import { DPropAttr, PropertyGroupName, JsonContent_Setting, Text_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'

import * as echarts from 'echarts'
import { shallowRef } from 'vue'
import elementResizeDetectorMaker from 'element-resize-detector'
import paltform from '@design-any/interface/dist/enums/paltform'

@DCompnentAttr(paltform.universal, '基础组件', '普通EChart', 'EchartNormal_001', null)
@Options({})
export default class EchartNormal extends EngineComponent {
  private myChart: any = shallowRef({})
  private resizeListener: any = null

  @DPropAttr(new JsonContent_Setting('Option设置', PropertyGroupName.data, true))
  private option: any = {
    grid: {
      width: '100%',
      height: '100%'
    },
    title: {
      text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  }

  mounted() {
    this.width = '30%'
    this.height = '30%'
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

<style scoped></style>
