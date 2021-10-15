<template>
  <div style="height:100%;width:100%">
    <el-row style="height:50px;position:relative" class="verticalAlignCenter">
      <dateRangePicker style="width:550px;float:left" :startTime.sync="startTime" :endTime.sync="endTime"></dateRangePicker>
      <span style="float:left">或前:</span>
      <el-input-number v-model="beforeDays" style="float:left;width:100px" controls-position="right" :min="0"></el-input-number>
      <span style="float:left">天</span>
      <el-button type="primary" style="float:left;margin-left:16px" @click="refreshData">刷新数据</el-button>
      <el-button type="primary" style="float:left" @click="chooseParams">重新选择参数</el-button>
      <chooseFlowmeterParams @onSure="onChooseParams" @onCancel="onCancelChooseParams" ref="paramDialog" />
    </el-row>
    <el-row style="height:calc(100% - 50px)">
      <div style="width:100%;height:100%" ref="chartArea"></div>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, getParamsCompareData } from '../../../serviceAPIs/service'
import chooseFlowmeterParams from '../../../components/chooseFlowmeterParams/index.vue'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import * as echarts from 'echarts'
import resizer from 'element-resize-detector'
import dateRangePicker from '@src/components/TimePickr/dateRangePicker.vue'
import moment from 'moment'

const colors = ['#5793f3', '#d14a61', '#675bba', '#c04aab', '#a6c30f']
const chartoption: any = {
  color: colors,
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    right: '30%',
    left: '5%',
    bottom: '8%'
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
      min: 0,
      max: 11000,
      position: 'left',
      axisLine: {
        lineStyle: {
          color: colors[2]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: '产品新增数量',
      min: 0,
      max: 200,
      position: 'right',
      axisLine: {
        lineStyle: {
          color: colors[0]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: '厂商新增数量',
      min: 0,
      max: 200,
      position: 'right',
      offset: 80,
      axisLine: {
        lineStyle: {
          color: colors[1]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: '注册用户新增数量',
      min: 0,
      max: 90000,
      position: 'right',
      offset: 200,
      axisLine: {
        lineStyle: {
          color: colors[3]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: 'XXXXXX',
      min: 0,
      max: 1000000,
      position: 'right',
      offset: 280,
      axisLine: {
        lineStyle: {
          color: colors[4]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: '设备新增数量',
      type: 'line',
      data: [10000, 2000, 1065, 3620, 6530, 9510, 2000, 3002, 3580, 5063, 1520, 9000]
    },
    {
      name: '产品新增数量',
      type: 'line',
      yAxisIndex: 1,
      data: [10, 50, 100, 32, 56, 87, 41, 25, 46, 96, 30, 150]
    },
    {
      name: '厂商新增数量',
      type: 'line',
      data: [12, 15, 26, 36, 25, 18, 16, 47, 58, 69, 93, 150]
    },
    {
      name: '注册用户新增数量',
      type: 'line',
      yAxisIndex: 3,
      data: [30000, 5000, 50000, 13436, 25555, 18000, 56416, 42227, 44658, 69002, 90013, 15330]
    },
    {
      name: 'XXXXXX',
      type: 'line',
      yAxisIndex: 4,
      data: [130000, 50100, 250000, 123436, 251555, 138000, 56416, 482227, 144658, 569002, 290013, 152230]
    }
  ]
}
// *****************************************************************
/***贮运厂总览 */
@Component({
  components: {
    dateRangePicker,
    chooseFlowmeterParams
  }
})
export default class historyInfo extends ComponentBase {
  @Prop()
  private flowmeterId: string
  @Watch('flowmeterId')
  private async watchflowmeterIdChange(id: string) {
    // window.console.log('watchFlowmeterDetailChange:', data)
    this.flowmeterId = id
    this.clearData()
  }

  private params: any[] = []
  private currentChart: any = null
  private startTime: any = new Date()
  private endTime: any = new Date()
  private beforeDays: number = 0
  // ********************************************************************************
  mounted() {
    this.currentChart = echarts.init(this.$refs.chartArea as any)
    this.drawChart(chartoption)
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
  // *************** *********************************************
  private async refreshData() {
    let paramcodes: string[] = []
    for (let index = 0; index < this.params.length; index++) {
      const element = this.params[index]
      paramcodes.push(element.PHDTAG)
    }

    let startdate = moment(this.startTime).format('YYYY-MM-DD HH:mm:ss')
    let enddate = moment(this.endTime).format('YYYY-MM-DD HH:mm:ss')
    let res = await getParamsCompareData(this.flowmeterId, paramcodes, startdate, enddate)
    this.cuteChartOption(res)
  }

  private cuteChartOption(compareDatas: any[]) {
    window.console.log('refreshData:', compareDatas)
  }

  private async clearData() {}
  // *************** *********************************************
  private async chooseParams() {
    await (this.$refs.paramDialog as chooseFlowmeterParams).showDialog(this.flowmeterId)
  }
  private onChooseParams(params: any[]) {
    this.params = params
  }
  private onCancelChooseParams() {}
  // **************************************************************
  private drawChart(option) {
    this.currentChart.setOption(option)
    this.currentChart.resize()
  }
  // **************************************************************
  @Emit('onSelectParams')
  private onSelectParams(params: any[]) {}
}
</script>
<style scoped>
</style>
