<template>
  <div>
    <van-cell title="报警信息">
      <template #label>
        <div style="width:100%;height:20rem" id="alarmChart"></div>
      </template>
    </van-cell>
    <van-cell title="最近报警信息">
      <template #right-icon>
        <div class="moreBtn">
          <span>更多</span>
          <van-icon name="arrow" />
        </div>
      </template>
      <template #label>
        <alarmInfoCard :cardInfo="nearestOne"></alarmInfoCard>
      </template>
    </van-cell>
    <van-cell title="最近报警信息">
      <template #label>
        <van-list>
          <alarmInfoCard v-for="item in nearestList" :key="item" :cardInfo="item" />
        </van-list>
      </template>
    </van-cell>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import alarmInfoCard from './alarmInfoCard.vue'

import * as echarts from 'echarts'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer] as any)

@Component({ components: { alarmInfoCard: alarmInfoCard } })
export default class Index extends PageBase {
  private nearestOne: any = {}
  private nearestList: any[] = []
  private mychart: any = null
  mounted() {
    let renderArea = $(this.$el).find('#alarmChart')
    this.mychart = echarts.init(renderArea[0])
    this.mychart.setOption({
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }
      ]
    })
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
