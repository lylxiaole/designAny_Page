 
<template>
  <div style="height:100%;width:100%" class="topdiv" ref="topdiv">
    <div ref="echartsArea" style="height:100%;width:100%"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EngineLayout, EngineComponent, LayoutType, layoutCompTypeAttr } from '@designEngine/03designerLayoutBase'
import { Property, PropertyGroupName, Number_Setting, Text_Setting, Boolean_Setting, Enum_Setting } from '@designEngine/03designerLayoutBase'
import { getUuid, deepClone } from '@common/utils'
import * as echarts from 'echarts'
import { shallowRef } from 'vue'

import elementResizeDetectorMaker from 'element-resize-detector'

@layoutCompTypeAttr('pc', LayoutType.system_component, '系统组件', '普通EChart', 'EchartNormal', null)
@Options({})
export default class EchartNormal extends EngineComponent {
  private myChart: any = shallowRef({})
  private resizeListener: any = null
  private get option() {
    var property = this.findPropertyByName(PropertyGroupName.special, 'Option设置')
    if (!property.value) {
      property.value = {
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
    }
    return property.value
  }

  mounted() {
    this.width = '500px'
    this.height = '500px'
    this.registerProperty(PropertyGroupName.special, 'Option设置', new Text_Setting())
    //*********************** */
    this.myChart = echarts.init(this.$refs.echartsArea as any)
    this.myChart.setOption(this.option, { notMerge: true })
    //*********************** */
    this.resizeListener = elementResizeDetectorMaker()
    this.resizeListener.listenTo(this.$refs.topdiv, async () => {
      this.myChart.resize()
    })
  }

  unmounted() {
    this.resizeListener.uninstall(this.$refs.topdiv)
  }
}
</script>



<style scoped>
</style>