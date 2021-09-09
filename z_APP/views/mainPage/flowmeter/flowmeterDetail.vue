<template>
  <div>
    <van-cell title="计量表实时信息">
      <template #label>
        <div style="height:12rem">
          <van-tabs style="height:100%" @rendered="tabrendered" id="mainTabs" :swipeable="true" :lazy-render="true">
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
      <detailCard v-for="item in dataList" :key="item" :title="item" @click="onClickCard" />
    </van-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import detailCard from './detailCard.vue'
import * as echarts from 'echarts'
import resizer from 'element-resize-detector'
@Component({ components: { detailCard: detailCard } })
export default class Index extends PageBase {
  mounted() {
    this.listenChartDomSize()
    this.getDataList()
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
  private wenduChart: any = null
  private miduChart: any = null
  private shunjianChart: any = null
  private leijiChart: any = null
  private async tabrendered(name: string, title: string) {
    await this.$nextTick()
    if (title === '温度') {
      let wenduRenderArea = $(this.$el).find('#wenduChart')
      this.wenduChart = echarts.init(wenduRenderArea[0])
      this.setWenduOption()
      this.wenduChart.resize()
    } else if (title === '密度') {
      let miduRenderArea = $(this.$el).find('#miduChart')
      this.miduChart = echarts.init(miduRenderArea[0])
      this.setMiduOption()
      this.miduChart.resize()
    } else if (title === '瞬间流量') {
      let shunjianRenderArea = $(this.$el).find('#shunjianChart')
      this.shunjianChart = echarts.init(shunjianRenderArea[0])
      this.setShunjianOption()
      this.shunjianChart.resize()
    } else if (title === '累计流量') {
      let leijiRenderArea = $(this.$el).find('#leijiChart')
      this.leijiChart = echarts.init(leijiRenderArea[0])
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
        height: '100%',
        width: '100%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
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
        width: '100%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
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
        width: '100%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
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
        width: '100%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    })
  }
  // *****************初始化列表数据*******************************
  private dataList: any[] = []
  private async getDataList() {}

  private onClickCard() {
    this.$router.push({ path: '/index/flowmeterDetailChart' })
  }
}
</script>
<style  lang="less" scoped>
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
