<template>
  <div style="height:100%;width:100%;">
    <el-row style="height:50%">
      <el-col :span="12">
        <div style="width:100%;height:100%;" id="wenduChart"></div>
      </el-col>
      <el-col :span="12">
        <div style="width:100%;height:100%;" id="shunjianChart"></div>
      </el-col>
    </el-row>
    <el-row style="height:50%">
      <el-col :span="12">
        <div style="width:100%;height:100%;" id="miduChart"></div>
      </el-col>
      <el-col :span="12">
        <div style="width:100%;height:100%;" id="leijiChart"></div>
      </el-col>
    </el-row>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import * as echarts from 'echarts'
import resizer from 'element-resize-detector'
import { jkzl, jlbjk, jlbzdcx } from '../../../serviceAPIs/service'
import { async } from 'q'
import moment from 'moment'
import { watch } from 'fs'
@Component
export default class importantMeasure extends ComponentBase {
  // **************定时器***************************************
  mounted() {
    this.initChartsOption()
    this.listenChartDomSize()
  }

  beforeDestroy() {
    this.unlisenDomSize()
  }
  // *********监听尺寸变化 ***************************************
  private currentResizer: any = null
  listenChartDomSize() {
    this.currentResizer = resizer()
    this.currentResizer.listenTo($(this.$el).find('#mainTabs'), (element) => {
      if (this.wenduChart) {
        this.wenduChart.resize()
      }
      if (this.miduChart) {
        this.miduChart.resize()
      }
      if (this.shunjianChart) {
        this.shunjianChart.resize()
      }
      if (this.leijiChart) {
        this.leijiChart.resize()
      }
    })
  }
  unlisenDomSize() {
    this.currentResizer.removeAllListeners($(this.$el).find('#mainTabs'))
  }
  // *********延迟渲染,按需渲染echarts********************************************
  private tabsActived: number = 0
  private wenduChart: any = null
  private miduChart: any = null
  private shunjianChart: any = null
  private leijiChart: any = null

  private wenduOption: any = {}
  private miduOption: any = {}
  private shunjianOption: any = {}
  private leijiOption: any = {}

  private initChartsOption() {
    this.wenduOption = { xAxis: [], datas: [] }
    this.miduOption = { xAxis: [], datas: [] }
    this.shunjianOption = { xAxis: [], datas: [] }
    this.leijiOption = { xAxis: [], datas: [] }
  }
  private async chartsRendered() {
    await this.$nextTick()
    let wenduRenderArea = $(this.$el).find('#wenduChart')
    if (!this.wenduChart) {
      this.wenduChart = echarts.init(wenduRenderArea[0])
    }
    this.setWenduOption()
    this.wenduChart.resize()
    //  ****************************************
    let miduRenderArea = $(this.$el).find('#miduChart')
    if (!this.miduChart) {
      this.miduChart = echarts.init(miduRenderArea[0])
    }
    this.setMiduOption()
    this.miduChart.resize()
    //  ****************************************
    let shunjianRenderArea = $(this.$el).find('#shunjianChart')
    if (!this.shunjianChart) {
      this.shunjianChart = echarts.init(shunjianRenderArea[0])
    }
    this.setShunjianOption()
    this.shunjianChart.resize()
    //  ****************************************
    let leijiRenderArea = $(this.$el).find('#leijiChart')
    if (!this.leijiChart) {
      this.leijiChart = echarts.init(leijiRenderArea[0])
    }
    this.setLeijiOption()
    this.leijiChart.resize()
  }
  private setWenduOption() {
    this.wenduChart.setOption({
      title: {
        text: '温度',
        textStyle: {
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      calculable: true,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        height: '90%',
        width: '100%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.wenduOption.xAxis,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          realtimeSort: true,
          name: '值',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'lttb',
          data: this.wenduOption.datas
        }
      ]
    })
  }
  private setMiduOption() {
    this.miduChart.setOption({
      title: {
        text: '密度',
        textStyle: {
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      calculable: true,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        height: '90%',
        width: '100%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.miduOption.xAxis,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          realtimeSort: true,
          name: '值',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'lttb',
          data: this.miduOption.datas
        }
      ]
    })
  }
  private setShunjianOption() {
    this.shunjianChart.setOption({
      title: {
        text: '瞬间流量',
        textStyle: {
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      calculable: true,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        height: '90%',
        width: '100%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.shunjianOption.xAxis,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          realtimeSort: true,
          name: '值',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'lttb',
          data: this.shunjianOption.datas
        }
      ]
    })
  }
  private setLeijiOption() {
    this.leijiChart.setOption({
      title: {
        text: '累计量',
        textStyle: {
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      calculable: true,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        height: '90%',
        width: '100%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.leijiOption.xAxis,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          realtimeSort: true,
          name: '值',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'lttb',
          data: this.leijiOption.datas
        }
      ]
    })
  }
  // *****************初始化列表数据*******************************
  private cuteChartOptions(item) {
    let time = item.updateTime
    if (item.tagCode.indexOf('TI') > -1) {
      //温度
      if (this.wenduOption.xAxis.indexOf(time) < 0) {
        this.wenduOption.xAxis.push(time)
        this.wenduOption.datas.push(item.tagVal)
      }
    } else if (item.tagCode.indexOf('DI') > -1) {
      //密度
      if (this.miduOption.xAxis.indexOf(time) < 0) {
        this.miduOption.xAxis.push(time)
        this.miduOption.datas.push(item.tagVal)
      }
    } else if (item.tagCode.indexOf('FI') > -1) {
      //瞬间流量
      if (this.shunjianOption.xAxis.indexOf(time) < 0) {
        this.shunjianOption.xAxis.push(time)
        this.shunjianOption.datas.push(item.tagVal)
      }
    } else if (item.tagCode.indexOf('FQ') > -1) {
      //累计流量
      if (this.leijiOption.xAxis.indexOf(time) < 0) {
        this.leijiOption.xAxis.push(time)
        this.leijiOption.datas.push(item.tagVal)
      }
    }
  }
  public async addOneData(data: any[]) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index]
      this.cuteChartOptions(element)
    }
    this.chartsRendered()
  }
  public clearData() {
    this.initChartsOption()
  }
}
</script>
<style  lang="less" scoped>
</style>
