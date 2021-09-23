<template>
  <div>
    <van-cell title="报警信息">
      <template #label>
        <div style="width:100%;height:15rem;display:flex" id="alarmChart"></div>
      </template>
    </van-cell>
    <van-cell>
      <template #title>
        <van-row style="width:100%">
          <van-col :span="12">最近报警信息(一条)</van-col>
          <van-col :span="12">
            <div class="moreBtn" @click="showMachinesPopup=true">
              <span style="margin-left:auto;margin-right:0.2rem">{{currentMachine.text}}</span>
              <van-icon style="margin-right:0rem" name="arrow" />
            </div>
          </van-col>
        </van-row>
      </template>
      <template #label>
        <alarmInfoCard style="margin-top:1rem" v-if="nearestOne" :cardInfo="nearestOne"></alarmInfoCard>
      </template>
    </van-cell>

    <van-cell title="最近报警信息(多条)">
      <template #label>
        <van-list>
          <alarmInfoCard style="padding-top:0.5rem;margin-bottom:0.5rem;border-top:1px solid #EFEFEF;box-sizing:border-box"
            v-for="item in nearestList" :key="item.key" :cardInfo="item" />
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
import { jkzl, jlbjk } from '../../../serviceAPIs/service'
import moment from 'moment'
@Component({ components: { alarmInfoCard: alarmInfoCard } })
export default class Index extends PageBase {
  mounted() {
    this.drawCharts()
    this.getAllJLB()
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
  // *****************画charts*******************************************************
  private mychart: any = null
  private currentResizer: any = null
  private xAxisData: any[] = []
  private xSeriersData: any[] = []
  private async getServiveData() {
    var formDataOne = new FormData()
    formDataOne.append('action', 'getFaultInfo')
    let res = await jkzl(formDataOne)
    this.xAxisData = res.xData
    this.xSeriersData = res.yData
    window.console.log('getServiveData:', res)
  }
  private async drawCharts() {
    await this.getServiveData()
    this.$nextTick(() => {
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
            data: this.xAxisData,
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
            name: '数量',
            type: 'bar',
            barWidth: '60%',
            data: this.xSeriersData
          }
        ]
      })

      this.listenChartDomSize()
    })
  }
  // *****************最近一条报警*******************************************************
  private nearestOne: any = {
    code: 'HT-4009',
    time: '08-18 12:00:00',
    desc: '维保到期xxxxxxxxxxxx',
    timeLength: '3小时'
  }
  // *****************最近多条报警*******************************************************
  private nearestList: any[] = [
    {
      code: 'HT-4009',
      time: '08-18 12:00:00',
      desc: '维保到期xxxxxxxxxxxx',
      timeLength: '3小时'
    },
    {
      code: 'HT-4009',
      time: '08-18 12:00:00',
      desc: '维保到期xxxxxxxxxxxx',
      timeLength: '3小时'
    },
    {
      code: 'HT-4009',
      time: '08-18 12:00:00',
      desc: '维保到期xxxxxxxxxxxx',
      timeLength: '3小时'
    },
    {
      code: 'HT-4009',
      time: '08-18 12:00:00',
      desc: '维保到期xxxxxxxxxxxx',
      timeLength: '3小时'
    },
    {
      code: 'HT-4009',
      time: '08-18 12:00:00',
      desc: '维保到期xxxxxxxxxxxx',
      timeLength: '3小时'
    }
  ]
  // *****************选择设备*******************************************************
  private showMachinesPopup: boolean = false
  private machineList: any[] = [{ id: '', text: '' }]
  private currentMachine = { id: '', text: '' }

  @Watch('currentMachine')
  private async onCurrentMachine(newval: any) {
    var formDataOne = new FormData()
    formDataOne.append('action', 'getJlbBjxx')
    formDataOne.append('jlbid', newval.id)
    let oneMachine = await jlbjk(formDataOne)
    if (oneMachine && oneMachine.length > 0) {
      this.nearestOne = {
        code: oneMachine[0].PHDTAG,
        time: oneMachine[0].KSSJ,
        desc: oneMachine[0].CWXXZW,
        timeLength: moment(oneMachine[0].JSSJ).diff(moment(oneMachine[0].KSSJ), 'hours') + '小时'
      }
    } else {
      this.nearestOne = null
    }
    // ********************************************
    var formDataMore = new FormData()
    formDataMore.append('action', 'getJlbLsBjxx')
    formDataMore.append('jlbid', newval.id)
    let moreMachine = await jlbjk(formDataMore)
    this.nearestList = []
    window.console.log('moreMachine：', moreMachine)
    for (let index = 0; index < moreMachine.length; index++) {
      const element = moreMachine[index]
      this.nearestList.push({
        key: element.rn,
        code: element.PHDTAG,
        time: element.KSSJ,
        desc: element.CWXXZW,
        timeLength: moment(element.JSSJ).diff(moment(element.KSSJ), 'hours') + '小时'
      })
    }
  }
  private onCancelChooseMachine(e: any) {
    this.showMachinesPopup = false
  }
  private onSureChooseMachine(e: any) {
    this.showMachinesPopup = false
    this.currentMachine = e
  }
  private async getAllJLB() {
    var formData = new FormData()
    formData.append('action', 'getJlbInfo')
    let res = await jkzl(formData)
    this.machineList = []
    for (let index = 0; index < res.length; index++) {
      const element = res[index]
      this.machineList.push({ text: element.name, id: element.id })
    }
    this.currentMachine = this.machineList[0]
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
</style>
