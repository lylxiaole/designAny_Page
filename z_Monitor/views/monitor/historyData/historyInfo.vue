<template>
  <div style="height:100%;width:100%">
    <el-row style="height:50px;position:relative" class="verticalAlignCenter">
      <dateRangePicker style="width:550px;float:left" :startTime.sync="startTime" :endTime.sync="endTime"></dateRangePicker>
      <span style="float:left">或前:</span>
      <el-input-number v-model="beforeDays" style="float:left;width:100px" controls-position="right" :min="0" :step="1"></el-input-number>
      <span style="float:left">天</span>
      <el-button type="primary" style="float:left;margin-left:16px" @click="refreshData">刷新数据</el-button>
      <el-button type="primary" style="float:left" @click="chooseParams">重新选择参数</el-button>
      <chooseFlowmeterParams @onSure="onChooseParams" @onCancel="onCancelChooseParams" ref="paramDialog" />
    </el-row>
    <el-row style="height:calc(100% - 50px)">
      <!-- <highcharts></highcharts> -->
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
import { param2Obj, deepClone } from '@src/utils'
import * as echarts from 'echarts'
import resizer from 'element-resize-detector'
import dateRangePicker from '@src/components/TimePickr/dateRangePicker.vue'
import moment from 'moment'
import HighCharts from 'highcharts'
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

    let startdate = ''
    if (this.beforeDays > 0) {
      startdate = moment(this.startTime)
        .subtract(10, 'days')
        .format('YYYY-MM-DD HH:mm:ss')
    } else {
      startdate = moment(this.startTime).format('YYYY-MM-DD HH:mm:ss')
    }
    let enddate = moment(this.endTime).format('YYYY-MM-DD HH:mm:ss')
    let res = await getParamsCompareData(this.flowmeterId, paramcodes, startdate, enddate)
    this.cuteChartOption(res)
  }
  // **************计算option*******************************************
  private cuteChartOption(datalist: any) {
    window.console.log('cuteChartOption:', datalist)

    let seriesOptions = new Array()
    let ys = new Array()
    let yszy = true
    for (var i = 0; i < datalist.resDataList.length; i++) {
      var obj: any = {}
      var tagNameCn = datalist.resDataList[i].name
      let param = this.params.find((o) => o.PHDTAG === tagNameCn)
      let paramName = param.TAGMC
      obj.name = paramName
      //for (var resIndex = 0; resIndex < datalist.resDataList[i].data; resIndex++) {
      //    var resdata = datalist.resDataList[i].data[resIndex]
      //    resdata[1] = resdata[1]+''
      //}

      //window.console.log('datalist.resDataList[i]:', datalist.resDataList[i].data)
      obj.data = datalist.resDataList[i].data
      obj.yAxis = datalist.resDataList[i].yAxis
      seriesOptions.push(obj)
      let yobj: any = {}
      yobj.lineWidth = 1
      if (yszy == true) {
        yobj.opposite = false
        yszy = false
      } else {
        yobj.opposite = true
        yszy = true
      }

      ys.push(yobj)
    }
    console.log(seriesOptions)
    this.createChart(seriesOptions, datalist.dataTimeXes, ys)
  }

  private createChart(seriesOptions, dic, yaxis) {
    for (var i = 0; i < yaxis.length; i++) {
      var yax = yaxis[i]
      yax.labels = {
        enabled: true,
        formatter: function() {
          return parseFloat(this.value.toFixed(4))
        }
      }
    }

    console.log(yaxis, 'yaxis')

    HighCharts.setOptions({
      global: {
        useUTC: false
      },
      lang: {
        contextButtonTitle: '图表导出菜单',
        decimalPoint: '.',
        downloadJPEG: '下载JPEG图片',
        downloadPDF: '下载PDF文件',
        downloadPNG: '下载PNG文件',
        downloadSVG: '下载SVG文件',
        drillUpText: '返回 {series.name}',
        loading: '加载中',
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        noData: '没有数据',
        numericSymbols: ['千', '兆', 'G', 'T', 'P', 'E'],
        printChart: '打印图表',
        resetZoom: '恢复缩放',
        resetZoomTitle: '恢复图表',
        shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        thousandsSep: ',',
        weekdays: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      }
    })

    HighCharts.chart(this.$refs.chartArea as any, {
      rangeSelector: {
        selected: 8,
        buttons: [
          {
            type: 'minute',
            count: 10,
            text: '10分'
          },
          {
            type: 'hour',
            count: 5,
            text: '5时'
          },
          {
            type: 'day',
            count: 1,
            text: '1天'
          },
          {
            type: 'month',
            count: 1,
            text: '1月'
          },
          {
            type: 'month',
            count: 3,
            text: '3月'
          },
          {
            type: 'month',
            count: 6,
            text: '半年'
          },
          {
            type: 'ytd',
            text: '近一年'
          },
          {
            type: 'all',
            text: '全部'
          }
        ]
      },
      yAxis: yaxis,
      scrollbar: {
        enabled: false
      },
      exporting: {
        buttons: {
          contextButton: {}
        }
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: true,
        //align: 'right',
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        layout: 'horizontal',
        itemStyle: { color: '#333333', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
        //verticalAlign: 'top',
        //y: 100,
        shadow: true
      },
      plotOptions: {
        series: {
          compare: 'percent',
          point: {
            events: {
              click: function(e) {}
            }
          }
        }
      },
      tooltip: {
        /* pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><b>{series.className}</b> ',*/
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>',
        valueDecimals: 4,
        split: true,
        distance: 30,
        padding: 5
      },

      series: seriesOptions //[{name:name,data:[[时间戳,值]]}]
    })
  }
  private async clearData() {}
  // *************** *********************************************
  private async chooseParams() {
    await (this.$refs.paramDialog as chooseFlowmeterParams).showDialog(this.flowmeterId)
  }
  private onChooseParams(params: any[]) {
    this.params = params
    this.onSelectParams(this.params)
  }
  private onCancelChooseParams() {}
  // **************************************************************
  private onChartClick(params) {
    window.console.log('onChartClick')
    // 获取像素坐标点
    const pointInPixel = [params.offsetX, params.offsetY]
    const { target, topTarget } = params
    // 判断点击的点在  点击在折线的拐点 || 折线上
    if (target.z === 2 || topTarget.z === 2) {
      // 获取这条折线的 信息 也就是 index
      // 如果是拐点，直接读取 target.seriesIndex
      // 如果是折线上的点，读取 topTarget 对象下的继续寻找parent的信息的index
      const axs = target ? target.seriesIndex : topTarget.parent.parent.__ecComponentInfo.index
      console.log(axs)
    }
    this.onSelectChartData({})
  }
  // **************************************************************
  @Emit('onSelectParams')
  private onSelectParams(params: any[]) {}
  @Emit('onSelectChartData')
  private onSelectChartData(data: any) {}
}
</script>
<style scoped>
</style>
