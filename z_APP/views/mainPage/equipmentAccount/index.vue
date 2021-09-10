<template>
  <div>
    <van-row>
      <van-dropdown-menu active-color="#1989fa">
        <van-dropdown-item v-model="chooseTime" :options="timeList" @change="chooseTimeChanged" />
        <van-dropdown-item v-model="chooseStatus" :options="statusList" @change="chooseStatusChanged" />
      </van-dropdown-menu>
    </van-row>
    <van-cell title="设备维保信息">
      <template #label>
        <van-list>
          <maintenanceCard v-for="item in list" :key="item.key" :cardInfo="item" style="margin-top:1rem;" />
        </van-list>
      </template>
    </van-cell>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import maintenanceCard from './maintenanceCard.vue'
import moment from 'moment'
import { parseTime } from '@src/utils'
@Component({ components: { maintenanceCard: maintenanceCard } })
export default class Index extends PageBase {
  // *******************时间选择****************************************************
  private chooseTime: number = 0
  private timeList: any[] = [{ text: '2021-08-09', value: 0 }, { text: '2021-07-09', value: 1 }, { text: '2021-06-09', value: 2 }]
  private chooseTimeChanged(e: any) {}
  // *******************状态选择****************************************************
  private chooseStatus: number = 0
  private statusList: any[] = [{ text: '全部', value: 0 }, { text: '未开始', value: 1 }, { text: '已结束', value: 2 }]
  private chooseStatusChanged(e: any) {}
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
</style>
