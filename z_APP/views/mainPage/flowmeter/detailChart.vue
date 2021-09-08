<template>
  <div>
    <van-cell title="计量表实时信息">
      <template #label>
        <div style="transform:rotate(90deg);" id="chartArea"></div>
      </template>
    </van-cell>
    <van-list>
      <detailCard v-for="item in dataList" :key="item" :title="item" />
    </van-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import * as echarts from 'echarts'
import resizer from 'element-resize-detector'
@Component
export default class detailChart extends PageBase {
  mounted() {
    this.drawCharts()
  }
  beforeDestroy() {
    this.unlisenDomSize()
  }
  // *********画chart********************************************
  private chartArea: any = null
  private async drawCharts() {
    await this.$nextTick()
    let renderArea = $(this.$el).find('#chartArea')
    this.chartArea = echarts.init(renderArea[0])
    // ************************************
    this.setChartOption()
    // ************************************
    this.listenChartDomSize()
  }

  private setChartOption() {
    this.chartArea.setOption({
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
  // *********监听尺寸变化 ***************************************
  private currentResizer: any = null
  listenChartDomSize() {
    this.currentResizer = resizer()
    this.currentResizer.listenTo($(this.$el).find('#chartArea'), (element) => {
      this.chartArea.resize()
    })
  }
  unlisenDomSize() {
    this.currentResizer.removeAllListeners($(this.$el).find('#chartArea'))
  }
  // *****************详细信息列表*******************************
  private dataList: any[] = []
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
