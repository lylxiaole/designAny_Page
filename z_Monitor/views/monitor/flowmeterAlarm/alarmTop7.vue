<template>
  <div ref="domarea">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, getAlarmTop5 } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import * as echarts from 'echarts'
import { parse } from 'querystring'
import resizer from 'element-resize-detector'
// *****************************************************************
/***作业区流量计 */
@Component({
  components: {}
})
export default class alarmTop7 extends ComponentBase {
  @Prop({
    default: () => {
      return null
    }
  })
  private flowmeterId: string
  @Watch('flowmeterId')
  private async watchflowmeterIdChange(val: any) {
    if (val) {
      this.loadData(val)
    }
  }
  // *******************************************
  private currentChart: any = null
  private option: any = {
    title: {
      text: '当月报警次数TOP5'
    },
    tooltip: { show: true },
    legend: {
      data: []
    },
    grid: {
      bottom: '10%'
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: 'Sales' },
        { name: 'Administration' },
        { name: 'Information Technology' },
        { name: 'Customer Support' },
        { name: 'Development' },
        { name: 'Marketing' }
      ]
    },
    series: [
      {
        name: ' ',
        type: 'radar',
        data: [
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000]
          }
        ]
      }
    ]
  }
  //
  mounted() {
    this.currentChart = echarts.init(this.$refs.domarea as any)
    this.drawChart()
    this.listenChartDomSize()
  }
  beforeDestroy() {
    this.unlisenDomSize()
  }
  private currentResizer: any = null
  listenChartDomSize() {
    this.currentResizer = resizer()
    this.currentResizer.listenTo($(this.$el), (element) => {
      if (this.currentChart) {
        this.currentChart.resize()
      }
    })
  }
  unlisenDomSize() {
    this.currentResizer.removeAllListeners($(this.$el))
  }
  private drawChart() {
    this.currentChart.setOption(this.option)
    this.currentChart.resize()
  }
  // ************************************************************
  private async loadData(flowmeterId: string) {
    let wranTop5 = await getAlarmTop5(flowmeterId)
    if (!wranTop5) {
      wranTop5 = []
    }
    window.console.log('wranTop5:', wranTop5)
    this.option.radar.indicator = []
    this.option.series[0].data[0].value = []
    for (let index = 0; index < wranTop5.length; index++) {
      const element = wranTop5[index]
      this.option.radar.indicator.push({ name: element.CWXXZW, max: parseInt(element.VAL) + 3 })
      this.option.series[0].data[0].value.push(parseInt(element.VAL))
    }
    this.drawChart()
  }
}
</script>
<style lang="less" scoped>
</style>
