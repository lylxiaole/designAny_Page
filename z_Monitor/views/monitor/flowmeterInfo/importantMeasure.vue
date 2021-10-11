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
  private intervalTimer: number = -1
  private currentjlbid: string = null
  mounted() {
    this.initChartsOption()
    this.listenChartDomSize()
    this.currentjlbid = this.$route.query.id as any
    this.startGetData()
  }

  private async startGetData() {
    this.getDataList().then(async () => {
      await this.chartsRendered()
    })
    this.intervalTimer = window.setInterval(() => {
      this.getDataList().then(async () => {
        await this.chartsRendered()
      })
    }, 10000)
  }

  beforeDestroy() {
    if (this.intervalTimer > -1) {
      window.clearInterval(this.intervalTimer)
    }
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
  private dataList: any[] = []
  private async getDataList() {
    var formData = new FormData()
    formData.append('action', 'getJlbTagInfoShow')
    formData.append('jlbid', this.currentjlbid)
    let res = await jkzl(formData)
    window.console.log('importantMeasure getDataList:', res)
    this.dataList = []

    for (let index = 0; index < res.length; index++) {
      const element = res[index]
      this.cuteChartOptions(element)
      this.dataList.push({
        key: element.PHDTAG,
        count: element.PHDVALUE,
        time: element.PHDTIME,
        desc: element.TAGMC,
        danwei: element.JLDW,
        id: element.JLBID
      })
    }

    // window.console.log('计量表详细信息:', res)
    // window.console.log('温度:', this.wenduOption)
    // window.console.log('密度:', this.miduOption)
    // window.console.log('瞬间流量:', this.shunjianOption)
    // window.console.log('累计流量:', this.leijiOption)
  }
  private cuteChartOptions(item) {
    let time = moment(item.PHDTIME).format('HH:mm:ss')
    if (item.PHDTAG.indexOf('TI') > -1) {
      //温度
      if (this.wenduOption.xAxis.indexOf(time) < 0) {
        this.wenduOption.xAxis.push(time)
        this.wenduOption.datas.push(item.PHDVALUE)
      }
    } else if (item.PHDTAG.indexOf('DI') > -1) {
      //密度
      if (this.miduOption.xAxis.indexOf(time) < 0) {
        this.miduOption.xAxis.push(time)
        this.miduOption.datas.push(item.PHDVALUE)
      }
    } else if (item.PHDTAG.indexOf('FI') > -1) {
      //瞬间流量
      if (this.shunjianOption.xAxis.indexOf(time) < 0) {
        this.shunjianOption.xAxis.push(time)
        this.shunjianOption.datas.push(item.PHDVALUE)
      }
    } else if (item.PHDTAG.indexOf('FQ') > -1) {
      //累计流量
      if (this.leijiOption.xAxis.indexOf(time) < 0) {
        this.leijiOption.xAxis.push(time)
        this.leijiOption.datas.push(item.PHDVALUE)
      }
    }
  }
}
</script>
<style  lang="less" scoped>
</style>
