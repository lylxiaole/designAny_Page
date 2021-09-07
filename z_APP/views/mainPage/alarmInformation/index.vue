<template>
  <div>
    <van-cell title="报警信息">
      <template #label>
        <div style="width:100%;height:15rem;display:flex" id="alarmChart"></div>
      </template>
    </van-cell>
    <van-cell title="最近报警信息">
      <template #right-icon>
        <div class="moreBtn" @click="showMachinesPopup=true">
          <span>{{currentMachine}}</span>
          <van-icon name="arrow" />
        </div>
      </template>
      <template #label>
        <div>
          <alarmInfoCard :cardInfo="nearestOne"></alarmInfoCard>
        </div>
      </template>
    </van-cell>
    <van-cell title="最近报警信息">
      <template #label>
        <van-list>
          <alarmInfoCard v-for="item in nearestList" :key="item" :cardInfo="item" />
        </van-list>
      </template>
    </van-cell>
    <!-- ************************************************** -->
    <van-popup v-model="showMachinesPopup" position="bottom" :overlay="true">
      <van-picker show-toolbar :columns="machineList" @confirm="onSureChooseMachine" @cancel="onCancelChooseMachine" />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import alarmInfoCard from './alarmInfoCard.vue'
import * as echarts from 'echarts'
import resizer from 'element-resize-detector'
@Component({ components: { alarmInfoCard: alarmInfoCard } })
export default class Index extends PageBase {
  private nearestOne: any = {}
  private nearestList: any[] = []
  private mychart: any = null
  private currentResizer: any = null
  mounted() {
    let renderArea = $(this.$el).find('#alarmChart')
    this.mychart = echarts.init(renderArea[0])

    this.mychart.setOption({
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

    this.listenChartDomSize()
  }
  beforeDestroy() {
    this.unlisenDomSize()
  }
  // *********监听尺寸变化 ***************************************
  listenChartDomSize() {
    this.currentResizer = resizer()
    this.currentResizer.listenTo($(this.$el).find('#alarmChart'), (element) => {
      this.mychart.resize()
    })
  }
  unlisenDomSize() {
    this.currentResizer.removeAllListeners($(this.$el).find('#alarmChart'))
  }
  // *****************选择设备*******************************************************
  private showMachinesPopup: boolean = false
  private machineList: any[] = ['TCL-1001', 'TCL-1002', 'TCL-1003']
  private currentMachine = 'TCL-1001'
  private onCancelChooseMachine(e: any) {
    this.showMachinesPopup = false
  }
  private onSureChooseMachine(e: any) {
    this.showMachinesPopup = false
    this.currentMachine = e
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
