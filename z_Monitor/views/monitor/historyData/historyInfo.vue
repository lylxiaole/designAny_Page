<template>
  <div style="height: 100%; width: 100%">
    <el-row style="height: 50px; position: relative" class="verticalAlignCenter">
      <dateRangePicker style="width: 550px; float: left" :startTime.sync="startTime" :endTime.sync="endTime" type="datetimerange"></dateRangePicker>
      <span style="float: left">或前:</span>
      <el-input-number size="small" v-model="beforeDays" style="float: left; width: 100px" controls-position="right" :min="0" :step="1">
      </el-input-number>
      <span style="float: left">天</span>
      <el-button size="small" type="primary" style="float: left; margin-left: 16px" @click="refreshData">刷新数据</el-button>
      <el-button size="small" type="primary" style="float: left" @click="chooseParams">重新选择参数</el-button>
      <chooseFlowmeterParams @onSure="onChooseParams" @onCancel="onCancelChooseParams" ref="paramDialog" />
    </el-row>
    <el-row style="height: calc(100% - 50px)">
      <!-- <highcharts></highcharts> -->
      <div style="width: 100%; height: 100%" ref="chartArea"></div>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, getParamsCompareData, getFlowmeterParams } from '../../../serviceAPIs/service'
import chooseFlowmeterParams from '../../../components/chooseFlowmeterParams/index.vue'
import { Route } from 'vue-router'
import { param2Obj, deepClone } from '@src/utils'
import resizer from 'element-resize-detector'
import dateRangePicker from '@src/components/TimePickr/dateRangePicker.vue'
import moment from 'moment'
import HighCharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsDrilldown from 'highcharts/modules/drilldown'
import Highcharts3D from 'highcharts/highcharts-3d'
import Highmaps from 'highcharts/modules/map'
// 加载导出模块
import Exporting from 'highcharts/modules/exporting'
import { message } from 'ant-design-vue'
import { func } from 'prop-types'
import { parse } from 'querystring'
// 初始化导出模块
Exporting(HighCharts)
HighchartsMore(HighCharts)
HighchartsDrilldown(HighCharts)
Highcharts3D(HighCharts)
Highmaps(HighCharts)
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
    // window.console.log('watchFlowmeterDetailChange:', id)
    this.flowmeterId = id
    if (this.flowmeterId) {
      await this.initDefaultParams()
    }
  }

  private params: any[] = []
  private currentChart: any = null
  private startTime: any = moment(new Date())
    .subtract(2, 'hours')
    .toDate()
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
  public async refreshData() {
    if (!this.flowmeterId) {
      this.$message.warning('请选择流量计！')
      return
    }

    let paramcodes: string[] = []
    for (let index = 0; index < this.params.length; index++) {
      const element = this.params[index]
      paramcodes.push(element.PHDTAG)
    }
    if (paramcodes.length < 1) {
      this.$message.warning('请选择流量计参数！')
      return
    }
    let startdate = ''
    if (this.beforeDays > 0) {
      this.startTime = moment(this.endTime)
        .subtract(this.beforeDays, 'days')
        .format('YYYY-MM-DD HH:mm:ss')
    }
    startdate = moment(this.startTime).format('YYYY-MM-DD HH:mm:ss')
    let enddate = moment(this.endTime).format('YYYY-MM-DD HH:mm:ss')
    if (startdate >= enddate) {
      this.$message.warning('开始时间必须早于结束时间！')
      return
    }
    var dateBegin = new Date(startdate)
    var dateEnd = new Date(enddate)
    var dateDiff = dateEnd.getTime() - dateBegin.getTime() //时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))
    if (dayDiff > 365 * 3) {
      this.$message.warning('时间间隔太长，不能超过3年，参数越多，时间间隔越短，请重新选择！')
      return
    }
    let res = await getParamsCompareData(this.flowmeterId, paramcodes, startdate, enddate)
    console.log(res)
    this.cuteChartOption(res)
  }
  public async setDefaultParams(params: any[]) {
    this.params = params
  }
  // **************计算option*******************************************
  private cuteChartOption(datalist: any) {
    // window.console.log('cuteChartOption:', datalist)

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
    this.createChart(seriesOptions, datalist.dataTimeXes, ys, this.params)
  }
  // 初始化导出模块
  private createChart(seriesOptions, dic, yaxis, params) {
    console.log('', seriesOptions, dic, yaxis)
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

    let chart = HighCharts.setOptions({
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
        shortMonths: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        thousandsSep: ',',
        weekdays: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      }
    } as any)

    HighCharts.stockChart(
      this.$refs.chartArea as any,
      {
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
        chart: {
          cursor: 'pointer',
          events: {
            click: (e) => {
              this.onChartClick(e.xAxis[0].value, dic, params)
            }
          }
        },
        yAxis: yaxis,
        scrollbar: {
          enabled: false
        },
        exporting: {
          buttons: {
            contextButton: {
              menuItems: [
                {
                  text: '全屏',
                  onclick: function() {
                    ;(this as any).fullscreen.toggle()
                  }
                },
                {
                  text: '打印',
                  onclick: function() {
                    print()
                  }
                }
              ]
            }
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
          itemStyle: {
            color: '#333333',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          },
          //verticalAlign: 'top',
          //y: 100,
          shadow: true
        },
        plotOptions: {
          series: {
            events: {
              click: (e) => {
                this.onChartClick(e.point.category, dic, params)
              }
            },
            compare: 'percent',
            cursor: 'pointer',
            enableMouseTracking: true
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
      } as any
    )
    // window.console.log('HighCharts:',xxx)
  }
  private async clearData() {}
  private async initDefaultParams() {
    let res = await getFlowmeterParams(this.flowmeterId, null)
    if (!res) {
      res = []
    }
    this.params = res.filter((element: any) => element.SFSSLL == '1' || element.SFSSLL == '2' || element.SFSSLL == '3' || element.SFSSLL == '5')
  }
  // *************** *********************************************
  private async chooseParams() {
    if (this.flowmeterId === null) {
      this.$message.warning('请选择流量计！')
      return
    }
    await (this.$refs.paramDialog as chooseFlowmeterParams).showDialog(this.flowmeterId)
  }
  private onChooseParams(params: any[]) {
    this.params = params
    this.onSelectParams(this.params)
  }
  private onCancelChooseParams() {}
  // **************************************************************
  private onChartClick(pointervalue, dic, params) {
    let clickcategory = pointervalue

    let clData = {}
    for (var i = 0; i < params.length; i++) {
      if (dic.hasOwnProperty(params[i].PHDTAG))
        if (dic[params[i].PHDTAG].hasOwnProperty(clickcategory)) {
          //console.log("包含", dic[params[i].PHDTAG][clickcategory], params[i].PHDTAG, params[i].tagName);
          if (!clData.hasOwnProperty(params[i].PHDTAG)) clData[params[i].PHDTAG] = dic[params[i].PHDTAG][clickcategory]
          //clData[params[i].PHDTAG] = dic[params[i].PHDTAG][clickcategory];
          if (!clData.hasOwnProperty('clickTime')) {
            var date = new Date(clickcategory) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = date.getDate() + ' '
            var h = date.getHours() + ':'
            var m = date.getMinutes() + ':'
            var s = date.getSeconds()
            let rq = Y + M + D + h + m + s
            clData['clickTime'] = rq
          }
          if (!clData.hasOwnProperty('id')) clData['id'] = clickcategory
        } else {
          console.log('不包含', clickcategory)
          let num = clickcategory
          let newArr = []
          let newArrVal = []
          let arr = Object.keys(dic[params[i].PHDTAG])
          arr.map(function(x: any) {
            // 对数组各个数值求差值
            newArr.push(Math.abs(x - num))
            //newArrVal.push(x);
          })
          let arrMin = []
          for (var v = 0; v < 100; v++) {
            let endi = v * 100000 + 100000
            if (endi > newArr.length) endi = newArr.length - 1
            let da = newArr.slice(v * 100000, endi)
            arrMin.push(Math.min.apply(null, da))
          }
          console.log('对数组各个数值求差值', -Infinity, newArr.length)
          //var max = -Infinity;
          //for (var i = 0; i < arr.length; i++) if (arr[i] > max) max = arr[i];
          // 求最小值的索引
          let a = Math.min.apply(null, arrMin)
          let index = newArr.indexOf(a)
          //console.log("求最小值的索引", index, arr[index]);
          if (dic[params[i].PHDTAG].hasOwnProperty(arr[index])) {
            //console.log("包含", dic[params[i].PHDTAG][clickcategory], params[i].PHDTAG, params[i].tagName);
            if (!clData.hasOwnProperty(params[i].PHDTAG)) clData[params[i].PHDTAG] = dic[params[i].PHDTAG][arr[index]]
            //clData[params[i].PHDTAG] = dic[params[i].PHDTAG][clickcategory];
            if (!clData.hasOwnProperty('clickTime')) {
              var date = new Date(parseInt(arr[index])) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
              var Y = date.getFullYear() + '-'
              var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
              var D = date.getDate() + ' '
              var h = date.getHours() + ':'
              var m = date.getMinutes() + ':'
              var s = date.getSeconds()
              let rq = Y + M + D + h + m + s
              clData['clickTime'] = rq
            }
            if (!clData.hasOwnProperty('id')) clData['id'] = arr[index]
          }
        }
      else console.log('不包含编码', params[i].PHDTAG)
    }
    // window.console.log('哈哈哈哈哈:', clData)
    this.onSelectChartData(clData)
  }
  // **************************************************************
  @Emit('onSelectParams')
  private onSelectParams(params: any[]) {}
  @Emit('onSelectChartData')
  public onSelectChartData(data: any) {}
}
</script>
<style scoped>
</style>
