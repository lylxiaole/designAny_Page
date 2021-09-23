<template>
  <div>
    <van-row>
      <van-col :span="12">
        <van-field v-model="end_time" placeholder="选择时间" readonly="readonly" @click="showTimePopup = true" />
      </van-col>
      <van-col :span="12">
      </van-col>
    </van-row>
    <!-- ***************时间选择*************************************************** -->
    <van-popup v-model="showTimePopup" position="bottom" :overlay="true">
      <van-datetime-picker type="date" v-model="currentDate_end" @cancel="onCancelChooseTime" @confirm="onSureChooseTime" />
    </van-popup>
    <!-- ***************状态选择*************************************************** -->
    <van-popup v-model="showStatePopup" position="bottom" :overlay="true">
      <van-picker show-toolbar :columns="statusList" @confirm="onConfirm" @cancel="showStatePopup = false" />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import moment from 'moment'
import { parseTime } from '@src/utils'
@Component
export default class Index extends PageBase {
  private list: any[] = []

  // *******************时间选择****************************************************
  private showTimePopup: boolean = false
  private end_time: string = ''
  private currentDate_end: Date = null
  private onCancelChooseTime(e: any) {
    this.showTimePopup = false
  }
  private onSureChooseTime(e: any) {
    this.showTimePopup = false
    this.end_time = moment(this.currentDate_end).format('LL')
  }
  // *******************状态选择****************************************************
  private showStatePopup: boolean = false
  private statusList: any[] = ['全部', '未开始', '已结束']
  private onCancelChooseStatus(e: any) {
    this.showTimePopup = false
  }
  private onSureChooseStatus(e: any) {
    this.showTimePopup = false
    this.end_time = moment(this.currentDate_end).format('LL')
  }
}
</script>
<style>
</style>
