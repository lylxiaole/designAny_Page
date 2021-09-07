<template>
  <div>
    <van-row>
      <van-dropdown-menu>
        <van-dropdown-item v-model="chooseTime" :options="timeList" @change="chooseTimeChanged" />
        <van-dropdown-item v-model="chooseStatus" :options="statusList" @change="chooseStatusChanged" />
      </van-dropdown-menu>
    </van-row>
    <van-cell title="设备维保信息">
      <template #label>
        <van-list>
          <maintenanceCard v-for="item in list" :key="item" :cardInfo="item" />
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
  private list: any[] = []
}
</script>
<style>
</style>
