<template>
  <div style="height:100%;width:100%">
    <van-cell style="height:100%;width:100%">
      <template #title>
        <van-row style="width:100%">
          <van-col :span="12">{{$route.query.desc}}历史数据</van-col>
          <van-col :span="12">
            <div class="moreBtn" @click="showChooseDate=true">
              <span style="margin-left:auto;margin-right:0.2rem">{{currentChooseDate}}</span>
              <van-icon style="margin-right:0rem" name="arrow" />
            </div>
          </van-col>
        </van-row>
      </template>
      <template #label>
        <div style="width:100%;height:100%;" id="chartArea"></div>
      </template>
    </van-cell>
    <van-calendar v-model="showChooseDate" :min-date="new Date(2000,1,1)" :max-date="new Date()" @confirm="onChooseDate" />
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import * as echarts from 'echarts'
import resizer from 'element-resize-detector'
import { jkzl, jlbjk, jlbzdcx } from '../../../serviceAPIs/service'
import moment from 'moment'
@Component
export default class detailChart extends PageBase {
  mounted() {
    // ************************************
    this.listenChartDomSize()
  }

  activated() {
    if (this.currentChooseDate !== (this.$route.query as any).time) {
      let time = (this.$route.query as any).time
      this.currentChooseDate = moment(time).format('YYYY-MM-DD')
    }
  }

  beforeDestroy() {
    this.unlisenDomSize()
  }
  // *************日期选择********************************************************
  private currentChooseDate: string = ''
  private showChooseDate: boolean = false
  private onChooseDate(date) {
    this.currentChooseDate = moment(date).format('YYYY-MM-DD')
    this.showChooseDate = false
  }

  @Watch('currentChooseDate')
  private onChooseDateChanged(newval) {
    this.getDataList().then(() => {
      this.drawCharts()
    })
  }
  // *********画chart********************************************
  private chartArea: any = null
  private xAxisData: any[] = []
  private seriesData: any[] = []
  private async drawCharts() {
    await this.$nextTick()

    if (!this.chartArea) {
      let renderArea = $(this.$el).find('#chartArea')
      this.chartArea = echarts.init(renderArea[0])
    }
    // ************************************
    this.setChartOption()
  }

  private setChartOption() {
    this.chartArea.setOption(
      {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        calculable: true,
        grid: {
          left: '0%',
          top: '1%',
          width: '90%',
          height: '95%',
          containLabel: true
        },
        xAxis: {
          position: 'top',
          max: 'dataMax',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true
          }
        },
        yAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData,
          axisLabel: { rotate: 270 },
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300
        },
        series: [
          {
            realtimeSort: true,
            name: '值',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'lttb',
            data: this.seriesData,
            label: {
              show: true,
              position: 'right',
              valueAnimation: true
            }
            // areaStyle: {
            //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     {
            //       offset: 0,
            //       color: 'rgb(255, 158, 68)'
            //     },
            //     {
            //       offset: 1,
            //       color: 'rgb(255, 70, 131)'
            //     }
            //   ])
            // }
          }
        ],
        legend: {
          show: false
        },
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
      },
      true
    )
  }
  // *********监听尺寸变化 ***************************************
  private currentResizer: any = null
  listenChartDomSize() {
    this.currentResizer = resizer()
    this.currentResizer.listenTo($(this.$el).find('#chartArea'), (element) => {
      if (this.chartArea) {
        this.chartArea.resize()
      }
    })
  }
  unlisenDomSize() {
    this.currentResizer.removeAllListeners($(this.$el).find('#chartArea'))
  }
  // *****************详细信息列表*******************************
  private dataList: any[] = []

  private async getDataList() {
    let time = this.currentChooseDate //日期
    let id = (this.$route.query as any).id //日期
    let tag = (this.$route.query as any).key //日期
    var formData = new FormData()
    formData.append('action', 'getCurve')
    formData.append('jlbid', id)
    formData.append('rq', moment(time).format('yyyy-MM-DD'))
    formData.append('tagmc', tag)
    let res = await jkzl(formData)
    this.xAxisData = []
    this.seriesData = []
    for (let index = 0; index < res.length; index++) {
      const element = res[index]
      let findtime = this.xAxisData.find((o) => o === element.save_time)
      if (!findtime) {
        this.xAxisData.push(moment(element.save_time).format('HH:MM:SS'))
        this.seriesData.push(element.now_value)
      }
    }
    // window.console.log('this.xAxisData:', this.xAxisData)
    // window.console.log('this.seriesData:', this.seriesData)
  }
}
</script>
<style  lang="less" scoped>
.moreBtn {
  display: flex;
  vertical-align: middle;
  text-align: center;
  height: 1.5rem;
  color: #808080;
  font-weight: 400;
  font-size: 1rem;
  span {
    line-height: 1.5rem;
  }
  i {
    line-height: 1.5rem;
  }
  i:before {
    vertical-align: middle;
    text-align: center;
  }
}
/deep/ .firstGridItem .van-grid-item__content {
  border-right: 1px solid #e6e6e6 !important;
}
</style>
