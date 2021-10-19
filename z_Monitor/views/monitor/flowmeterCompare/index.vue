<template>
  <div class="pageView" style="height:100%;width:100%">
    <el-row style="height:60px">
      <el-col :span="4">
        <el-button class="button" size="mini" @click="chooseFlowmeter">选择流量计</el-button>
        <flowmeterChooseModal @onSure="onChooseParams" @onCancel="onCancelChooseParams" ref="flowmeterChooseModal" />
      </el-col>
      <el-col :span="10">
        <flowmeterHeader :showChooseBtn="false" :flowmeterDetail.sync="firstFlowmeter" style="width:100%;height:100%" />
      </el-col>
      <el-col :span="10" style="border-left:1px solid #000">
        <flowmeterHeader :showChooseBtn="false" :flowmeterDetail.sync="secondFlowmeter" style="width:100%;height:100%" />
      </el-col>
    </el-row>
    <!-- ********************************************************************* -->
    <el-row style="height:60px;position:relative" class="verticalAlignCenter">
      <dateRangePicker style="width:550px;float:left" :startTime.sync="startTime" :endTime.sync="endTime"></dateRangePicker>
      <span style="float:left">或前:</span>
      <el-input-number style="float:left" v-model="beforeDays" controls-position="right" :min="0"></el-input-number>
      <span style="float:left">天</span>

      <el-button type="primary" style="float:left;margin-left:16px" @click="refreshData">刷新数据</el-button>
      <el-button type="primary" style="float:left" @click="chooseParams">重新选择参数</el-button>
    </el-row>
    <!-- ********************************************************************* -->
    <el-row style="height:calc(50% - 60px)">
      <div style="width:100%;height:100%" ref="firstarea"></div>
    </el-row>
    <el-row style="height:calc(50% - 60px)">
      <div style="width:100%;height:100%" ref="secondarea"></div>
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
  color: colors,
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    right: '20%'
  },
  toolbox: {
    feature: {
      dataView: {
        show: false,
        readOnly: false
      },
      restore: {
        show: false
      },
      saveAsImage: {
        show: false
      }
    }
  },
  legend: {
    data: ['设备新增数量', '产品新增数量', '厂商新增数量', '注册用户新增数量', 'XXXXXX']
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: false
      },
      data: ['2016-01', '2016-02', '2016-03', '2016-04', '2016-05', '2016-06', '2016-07', '2016-08', '2016-09', '2016-10', '2016-11', '2016-12']
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '设备新增数量',
      position: 'left',
      axisLine: {
        lineStyle: {
          color: colors[2]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: 'XXXXXX',
      type: 'line',
      yAxisIndex: 0,
      data: [130000, 50100, 250000, 123436, 251555, 138000, 56416, 482227, 144658, 569002, 290013, 152230]
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
  private secondChart: any = null

  private startTime: any = new Date()
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
    this.secondChart = echarts.init(this.$refs.secondarea as any)
    this.secondChart.setOption(chartoption)
    this.secondChart.resize()
    // ********************

    this.listenChartDomSize()
  }
  // ****************************************************************
  private currentResizer: any = null
  listenChartDomSize() {
    this.currentResizer = resizer()
    this.currentResizer.listenTo($(this.$el), (element) => {
      if (this.firstChart) {
        this.firstChart.resize()
      }
      if (this.secondChart) {
        this.secondChart.resize()
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
    await (this.$refs.flowmeterChooseModal as any).showChooseParams(this.firstFlowmeter, this.firstParams, this.secondFlowmeter, this.secondParams)
  }
  // ************************************************************
  private onChooseParams(firstFlowmeter: any, firstParams: any, secondFlowmeter: any, secondParams: any) {
    this.firstFlowmeter = firstFlowmeter
    this.firstParams = firstParams
    this.secondFlowmeter = secondFlowmeter
    this.secondParams = secondParams
    window.console.log('onChooseParams:', firstFlowmeter, firstParams, secondFlowmeter, secondParams)
  }
  private onCancelChooseParams() {}
  // ************************************************************
  private async refreshData() {
    let startdate = ''
    if (this.beforeDays > 0) {
      startdate =
        moment(this.startTime)
          .subtract(this.beforeDays, 'days')
          .format('YYYY-MM-DD') + ' 00:00:00'
    } else {
      startdate = moment(this.startTime).format('YYYY-MM-DD') + ' 00:00:00'
    }
    let enddate = moment(this.endTime).format('YYYY-MM-DD') + ' 23:59:59'
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
    window.console.log('compareData:', compareData)
    if (!compareData) {
      return
    }
    await this.drawChart(compareData)
  }
  private async drawChart(data: any) {
    let firstoption = deepClone(chartoption)
    let param1 = this.firstParams.find((o) => o.PHDTAG === data.names[0])
    let paramName1 = param1.TAGMC
    firstoption.xAxis[0].data = data.xData
    firstoption.series[0].name = paramName1
    firstoption.series[0].data = data.dataVals[0]
    firstoption.yAxis[0].name = paramName1
    this.firstChart.setOption(firstoption)
    this.firstChart.resize()

    ////////////////////////////
    let secondoption = deepClone(chartoption)
    let param2 = this.secondParams.find((o) => o.PHDTAG === data.names[1])
    let paramName2 = param2.TAGMC
    secondoption.xAxis[0].data = data.xData
    secondoption.series[0].name = paramName2
    secondoption.series[0].data = data.dataVals[1]
    secondoption.yAxis[0].name = paramName2
    this.secondChart.setOption(secondoption)
    this.secondChart.resize()
  }
}
</script>
<style lang="less" scoped>
@import '../../../assets/monitorStyle.less';
</style>
