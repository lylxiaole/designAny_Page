<template>
  <div>
    <van-row style="height:3rem;background-color:#ffffff">
      <van-col :span="16" style="">
        <van-dropdown-menu active-color="#1989fa">
          <van-dropdown-item v-model="viewType" :options="viewTypes" @change="chooseViewType" />
          <van-dropdown-item v-model="chooseStatus" :options="statusList" @change="chooseStatusChanged" />
        </van-dropdown-menu>
      </van-col>
      <van-col :span="8">
        <div style="height:3rem;line-height:3rem;width:100%;position:relative" @click="showChooseDate=true">
          <div style="height:3rem;float:left;line-height:3rem;">{{currentChooseDate}}</div>
          <div style="height:3rem;float:left;line-height:3rem;display:flex;margin-left:4px">
            <van-icon style="align-self:center" name="arrow" />
          </div>
        </div>
      </van-col>
    </van-row>
    <van-cell style="height:calc(100% - 3rem)" :title="viewType===0?'设备维保信息':'设备巡检信息'">
      <template #label>
        <van-list>
          <maintenanceCard v-for="item in list" :key="item.key" :cardInfo="item"
            style="padding-top:0.5rem;margin-bottom:0.5rem;border-top:1px solid #EFEFEF;box-sizing:border-box" />
        </van-list>
      </template>
    </van-cell>

    <van-calendar v-model="showChooseDate" :min-date="new Date(2000,1,1)" :max-date="new Date()" @confirm="onChooseDate" />

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import maintenanceCard from './maintenanceCard.vue'
import moment from 'moment'
import { parseTime } from '@src/utils'
import { wbjh, xjjh } from '../../../serviceAPIs/service'

@Component({ components: { maintenanceCard: maintenanceCard } })
export default class Index extends PageBase {
  mounted() {
    this.getDataList()
  }
  // *******************时间选择****************************************************
  private showChooseDate: boolean = false
  private currentChooseDate: string = moment(new Date()).format('YYYY-MM-DD')
  private onChooseDate(date: any) {
    this.showChooseDate = false
    this.currentChooseDate = moment(date).format('YYYY-MM-DD')
    this.getDataList()
  }
  // *******************状态选择****************************************************
  private chooseStatus: number = 0
  private statusList: any[] = [{ text: '未开始', value: 0 }, { text: '维保中', value: 1 }, { text: '维保完成', value: 2 }]
  private chooseStatusChanged(e: any) {
    this.chooseStatus = e
    this.getDataList()
  }
  private getStateStr() {
    return this.statusList.find((o) => o.value === this.chooseStatus).text
  }
  // *******************类型选择****************************************************
  private viewType: number = 0
  private viewTypes: any[] = [{ text: '维保信息', value: 0 }, { text: '巡检信息', value: 1 }]
  private chooseViewType(e: any) {
    // window.console.log('chooseViewType:', e)
    this.viewType = e
    if (this.viewType === 0) {
      this.statusList = [{ text: '未开始', value: 0 }, { text: '维保中', value: 1 }, { text: '维保完成', value: 2 }]
    } else {
      this.statusList = [{ text: '未开始', value: 0 }, { text: '巡检中', value: 1 }, { text: '巡检完成', value: 2 }]
    }
    this.chooseStatus = 0
    this.getDataList()
  }
  // *******************状态选择****************************************************
  private list: any[] = [
    {
      key: 1,
      code: 'HT-4009',
      status: '未开始',
      result: '已结束',
      desc: '维保到期xxxxxxxxxxxx',
      startTime: '08-18 12:00:00',
      endTime: '08-19 12:00:00'
    },
    {
      key: 2,
      code: 'HT-4009',
      status: '未开始',
      result: '已结束',
      desc: '维保到期xxxxxxxxxxxx',
      startTime: '08-18 12:00:00',
      endTime: '08-19 12:00:00'
    },
    {
      key: 4,
      code: 'HT-4009',
      status: '未开始',
      result: '已结束',
      desc: '维保到期xxxxxxxxxxxx',
      startTime: '08-18 12:00:00',
      endTime: '08-19 12:00:00'
    },
    {
      key: 5,
      code: 'HT-4009',
      status: '未开始',
      result: '已结束',
      desc: '维保到期xxxxxxxxxxxx',
      startTime: '08-18 12:00:00',
      endTime: '08-19 12:00:00'
    }
  ]

  private async getDataList() {
    if (this.viewType === 0) {
      this.getWeibaoXinxi()
    } else {
      this.getXunjianXinxi()
    }
  }

  private async getWeibaoXinxi() {
    let res = await wbjh(this.currentChooseDate, this.getStateStr())
    this.list = []
    for (let index = 0; index < res.length; index++) {
      const element = res[index]
      this.list.push({
        code: element.wh,
        status: element.wbzt,
        result: element.wbjg,
        desc: element.wbyy,
        startTime: element.wbkssj ? element.wbkssj : element.wbjhsj,
        endTime: element.wbjssj
      })
    }
  }

  private async getXunjianXinxi() {
    let res = await xjjh(this.currentChooseDate, this.getStateStr())
    this.list = []
    for (let index = 0; index < res.length; index++) {
      const element = res[index]
      this.list.push({
        code: element.wh,
        status: element.xjzt,
        result: element.xjjg,
        desc: element.xjyy,
        startTime: element.xjkssj ? element.xjkssj : element.xjjhsj,
        endTime: element.xjjssj
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .van-dropdown-item {
  .van-popup {
    margin: 0rem 0.5rem !important;
    width: calc(100% - 1rem);
    .van-cell__title {
      font-size: 0.6rem !important;
      font-weight: 400 !important;
    }
  }
}

/deep/ .van-dropdown-menu__bar {
  box-shadow: none !important;
}
</style>
