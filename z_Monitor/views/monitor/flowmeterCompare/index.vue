<template>
  <div class="pageView" style="height:100%;width:100%">
    <el-row style="height:50px" class="showblock verticalAlignCenter">
      <el-col style="width:129px;height:100%;padding-left:8px" class="verticalAlignCenter">
        <el-button class="button" size="mini" @click="chooseFlowmeter">选择流量计</el-button>
        <flowmeterChooseModal ref="flowmeterChooseModal" @onSure="onChooseParams" @onCancel="onCancelChooseParams" />
      </el-col>
      <el-col style="width:calc(50% - 65px);height:100%">
        <flowmeterHeader :showChooseBtn="false" :flowmeterDetail.sync="firstFlowmeter" style="width:100%;height:100%" />
      </el-col>
      <el-col style="height:100%;padding:3px 0px;width:1px" class="flexHorilanLayout">
        <div style="height:100%;width:1px;border-left:1px solid #000"></div>
      </el-col>
      <el-col style="width:calc(50% - 65px);height:100%">
        <flowmeterHeader :showChooseBtn="false" :flowmeterDetail.sync="secondFlowmeter" style="width:100%;height:100%" />
      </el-col>
    </el-row>
    <!-- ********************************************************************* -->
    <el-row style="height:60px;position:relative;padding-left:10px" class="verticalAlignCenter showblock">
      <dateRangePicker style="width:550px;float:left" :startTime.sync="startTime" :endTime.sync="endTime"></dateRangePicker>
      <span style="float:left">或前:</span>
      <el-input-number size="small" style="float:left" v-model="beforeDays" controls-position="right" :min="0"></el-input-number>
      <span style="float:left">天</span>
      <el-button type="primary" size="small" style="float:left;margin-left:16px" @click="refreshData">刷新数据</el-button>
      <el-button type="primary" size="small" style="float:left" @click="chooseParams">重新选择参数</el-button>
    </el-row>
    <!-- ********************************************************************* -->
    <el-row style="height:calc(100% - 120px)" class="showblock">
      <div style="width:100%;height:100%" ref="firstarea"></div>
    </el-row>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk, getFlowmeterDetail, getParamsCompareData, getFlowmeterCompareData } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj, deepClone } from '@src/utils'
import * as echarts from 'echarts'
import flowmeterChooseModal from '../../../components/choosePamaterCompare/flowmeterChooseModal.vue'
import moment from 'moment'
import resizer from 'element-resize-detector'
import dateRangePicker from '@src/components/TimePickr/dateRangePicker.vue'
import flowmeterHeader from '../../../components/flowmeterHeader.vue'

const colors = ['#5793f3', '#d14a61', '#675bba', '#c04aab', '#a6c30f']
const chartoption: any = {
  title: {
    text: '123',
    subtext: '',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      animation: false
    }
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
  axisPointer: {
    link: { xAxisIndex: 'all' }
  },
  dataZoom: [
    {
      show: true,
      realtime: true,
      start: 30,
      end: 70,
      xAxisIndex: [0, 1]
    },
    {
      type: 'inside',
      realtime: true,
      start: 30,
      end: 70,
      xAxisIndex: [0, 1]
    }
  ],
  grid: [
    {
      left: 50,
      right: 50,
      height: '35%'
    },
    {
      left: 50,
      right: 50,
      top: '55%',
      height: '35%'
    }
  ],
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      axisLine: { onZero: true },
      data: []
    },
    {
      gridIndex: 1,
      type: 'category',
      boundaryGap: false,
      axisLine: { onZero: true },
      data: []
    }
  ],
  yAxis: [
    {
      name: [],
      type: 'value',
      position: 'left',
      nameTextStyle: {
        padding: [0, 0, 0, 100]
      }
    },
    {
      gridIndex: 1,
      name: [],
      type: 'value',
      position: 'left',
      nameTextStyle: {
        padding: [0, 0, 0, 100]
      }
    }
  ],
  series: [
    {
      name: '',
      type: 'line',
      symbolSize: 8,
      hoverAnimation: false,
      data: []
    },
    {
      name: '',
      type: 'line',
      xAxisIndex: 1,
      yAxisIndex: 1,
      symbolSize: 8,
      hoverAnimation: false,
      data: []
    }
  ]
}
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {
    flowmeterChooseModal,
    flowmeterHeader,
    dateRangePicker
  }
})
export default class Index extends PageBase {
  private firstChart: any = null

  private startTime: any = moment(new Date())
    .subtract(2, 'hours')
    .toDate()
  private endTime: any = new Date()
  private beforeDays: number = 0

  private firstFlowmeter: any = null
  private firstParams: any = null
  private secondFlowmeter: any = null
  private secondParams: any = null
  // ********************************************************************************
  mounted() {
    this.firstChart = echarts.init(this.$refs.firstarea as any)
    this.firstChart.setOption(chartoption)
    this.firstChart.resize()
    // ********************
    if (this.$route.query.id) {
      this.loadData(this.$route.query.id as string)
    }
    // ********************
    this.listenChartDomSize()
  }
  private async loadData(flowmeterId: string) {
    let flowmeterDetails = await getFlowmeterDetail(flowmeterId)
    if (flowmeterDetails && flowmeterDetails.length > 0) {
      let flowmeterDetail = flowmeterDetails[0]
      ;(this.$refs.flowmeterChooseModal as flowmeterChooseModal).showChooseFlowmeter(flowmeterDetail, null)
    }
  }
  // ****************************************************************
  private currentResizer: any = null
  listenChartDomSize() {
    this.currentResizer = resizer()
    this.currentResizer.listenTo($(this.$el), (element) => {
      if (this.firstChart) {
        this.firstChart.resize()
      }
    })
  }
  unlisenDomSize() {
    this.currentResizer.removeAllListeners($(this.$el))
  }
  // ************************************************************
  private async chooseFlowmeter() {
    await (this.$refs.flowmeterChooseModal as any).showChooseFlowmeter(this.firstFlowmeter, this.secondFlowmeter)
  }
  private async chooseParams() {
    await (this.$refs.flowmeterChooseModal as flowmeterChooseModal).showChooseParams(
      this.firstFlowmeter,
      this.firstParams,
      this.secondFlowmeter,
      this.secondParams
    )
  }
  // ************************************************************
  private onChooseParams(firstFlowmeter: any, firstParams: any, secondFlowmeter: any, secondParams: any) {
    this.firstFlowmeter = firstFlowmeter
    this.firstParams = firstParams
    this.secondFlowmeter = secondFlowmeter
    this.secondParams = secondParams
    // window.console.log('onChooseParams:', firstFlowmeter, firstParams, secondFlowmeter, secondParams)
    this.refreshData()
  }
  private onCancelChooseParams() {}
  // ************************************************************
  private async refreshData() {
    if (!this.firstFlowmeter) {
      this.$message.error('请先选择流量计!')
      return
    } else if (!this.secondFlowmeter) {
      this.$message.error('请先选择流量计!')
      return
    }
    if (!this.firstParams || this.firstParams.length < 1) {
      this.$message.error('请先选择流量计参数!')
      return
    }
    if (!this.secondParams || this.secondParams.length < 1) {
      this.$message.error('请先选择流量计参数!')
      return
    }

    let startdate = ''
    if (this.beforeDays > 0) {
      startdate = moment(this.startTime)
        .subtract(this.beforeDays, 'days')
        .format('YYYY-MM-DD hh:mm:ss')
    } else {
      startdate = moment(this.startTime).format('YYYY-MM-DD hh:mm:ss')
    }
    let enddate = moment(this.endTime).format('YYYY-MM-DD hh:mm:ss')
    let param1codes: string[] = []
    for (let index = 0; index < this.firstParams.length; index++) {
      const element = this.firstParams[index]
      param1codes.push(element.PHDTAG)
    }
    let param2codes: string[] = []
    for (let index = 0; index < this.secondParams.length; index++) {
      const element = this.secondParams[index]
      param2codes.push(element.PHDTAG)
    }
    let compareData = await getFlowmeterCompareData(
      this.firstFlowmeter.JLBID,
      this.secondFlowmeter.JLBID,
      param1codes,
      param2codes,
      startdate,
      enddate
    )
    // window.console.log('compareData:', compareData)
    if (!compareData) {
      return
    }
    await this.drawChart(compareData)
  }
  private async drawChart(data: any) {
    let title = data.names[0] + '与' + data.names[1] + '对比'
    let firstoption = deepClone(chartoption)
    firstoption.title.text = title

    let param1 = this.firstParams.find((o) => o.PHDTAG === data.names[0])
    let paramName1 = param1.TAGMC
    firstoption.xAxis[0].data = data.xData
    firstoption.series[0].name = paramName1
    firstoption.series[0].data = data.dataVals[0]
    firstoption.yAxis[0].name = paramName1

    let param2 = this.secondParams.find((o) => o.PHDTAG === data.names[1])
    let paramName2 = param2.TAGMC
    firstoption.xAxis[1].data = data.xData
    firstoption.series[1].name = paramName2
    firstoption.series[1].data = data.dataVals[1]
    firstoption.yAxis[1].name = paramName2

    this.firstChart.setOption(firstoption)
    this.firstChart.resize()
  }
}
</script>
<style lang="less" scoped>
@import '../../../assets/monitorStyle.less';
</style>
