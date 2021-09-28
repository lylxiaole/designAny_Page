<template>
  <div>
    <van-cell title="计量表实时信息">
      <template #label>
        <div style="height:12rem">
          <van-tabs style="height:100%" v-model="tabsActived" @rendered="tabrendered" id="mainTabs" :swipeable="true" :lazy-render="true">
            <van-tab title="温度">
              <div style="width:100%;height:calc(100% - 44px);" id="wenduChart"></div>
            </van-tab>
            <van-tab title="密度">
              <div style="width:100%;height:calc(100% - 44px);" id="miduChart"></div>
            </van-tab>
            <van-tab title="瞬间流量">
              <div style="width:100%;height:calc(100% - 44px);" id="shunjianChart"></div>
            </van-tab>
            <van-tab title="累计流量">
              <div style="width:100%;height:calc(100% - 44px);" id="leijiChart"></div>
            </van-tab>
          </van-tabs>
        </div>
      </template>
    </van-cell>
    <van-list>
      <detailCard class="detailCard" v-for="item in dataList" :key="item.PHDTAG" :cardInfo="item" @onChooseCard="onClickCard(item)" />
    </van-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import detailCard from './detailCard.vue'
import * as echarts from 'echarts'
import resizer from 'element-resize-detector'
import { jkzl, jlbjk, jlbzdcx } from '../../../serviceAPIs/service'
import { async } from 'q'
import moment from 'moment'
import { watch } from 'fs'
@Component({ components: { detailCard: detailCard } })
export default class Index extends PageBase {
  // **************定时器***************************************
  private intervalTimer: number = -1
  private currentjlbid: string = null
  mounted() {
    this.initChartsOption()
    this.listenChartDomSize()
  }
  activated() {
    this.currentjlbid = this.$route.query.jlbid as any
    this.startGetData()
  }

  private async startGetData() {
    this.getDataList().then(async () => {
      await this.tabrendered('', this.getTitleByActivedTab(this.tabsActived))
    })
    this.intervalTimer = window.setInterval(() => {
      this.getDataList().then(async () => {
        await this.tabrendered('', this.getTitleByActivedTab(this.tabsActived))
      })
    }, 10000)
  }

  deactivated() {
    if (this.intervalTimer > -1) {
      window.clearInterval(this.intervalTimer)
    }
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

  @Watch('tabsActived')
  ontabsActivedChanged(newval) {
    // window.console.log('tabsActived:', this.getTitleByActivedTab(this.tabsActived))
    this.tabrendered('', this.getTitleByActivedTab(this.tabsActived))
  }

  private getTitleByActivedTab(val) {
    switch (val) {
      case 0:
        return '温度'
        break
      case 1:
        return '密度'
        break
      case 2:
        return '瞬间流量'
        break
      case 3:
        return '累计流量'
        break
      default:
        break
    }
  }

  private initChartsOption() {
    this.wenduOption = { xAxis: [], datas: [] }
    this.miduOption = { xAxis: [], datas: [] }
    this.shunjianOption = { xAxis: [], datas: [] }
    this.leijiOption = { xAxis: [], datas: [] }
  }

  private async tabrendered(name: string, title: string) {
    await this.$nextTick()
    if (title === '温度' && $(this.$el).find('#wenduChart').length > 0) {
      let wenduRenderArea = $(this.$el).find('#wenduChart')
      if (!this.wenduChart) {
        this.wenduChart = echarts.init(wenduRenderArea[0])
      }
      this.setWenduOption()
      this.wenduChart.resize()
    } else if (title === '密度' && $(this.$el).find('#miduChart').length > 0) {
      let miduRenderArea = $(this.$el).find('#miduChart')
      if (!this.miduChart) {
        this.miduChart = echarts.init(miduRenderArea[0])
      }
      this.setMiduOption()
      this.miduChart.resize()
    } else if (title === '瞬间流量' && $(this.$el).find('#shunjianChart').length > 0) {
      let shunjianRenderArea = $(this.$el).find('#shunjianChart')
      if (!this.shunjianChart) {
        this.shunjianChart = echarts.init(shunjianRenderArea[0])
      }
      this.setShunjianOption()
      this.shunjianChart.resize()
    } else if (title === '累计流量' && $(this.$el).find('#leijiChart').length > 0) {
      let leijiRenderArea = $(this.$el).find('#leijiChart')
      if (!this.leijiChart) {
        this.leijiChart = echarts.init(leijiRenderArea[0])
      }
      this.setLeijiOption()
      this.leijiChart.resize()
    }
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
    formData.append('action', 'getOneJlbTagInfo')
    formData.append('jlbid', this.currentjlbid)

    let res = await jkzl(formData)
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
  private onClickCard(item) {
    window.console.log('onClickCard:', item)
    this.$router.push({ path: '/index/flowmeterDetailChart', query: item })
  }
}
</script>
<style  lang="less" scoped>
.detailCard {
  height: 6.8rem;
  box-sizing: border-box;
  margin-top: 0.4rem;
  background-color: white;
}
.moreBtn {
  display: flex;
  vertical-align: middle;
  text-align: center;
  height: 1.5rem;
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
</style>
