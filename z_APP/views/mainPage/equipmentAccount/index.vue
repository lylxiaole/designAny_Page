<template>
  <div>
    <van-row>
      <van-col :span="12">
        <van-field v-model="end_time" placeholder="选择时间" readonly="readonly" @click="showPopup = true" />
      </van-col>
      <van-col :span="12">

      </van-col>
    </van-row>
    <!-- ****************************************************************** -->
    <van-popup v-model="showPopup" label="离开时间" position="bottom" :overlay="true">
      <van-datetime-picker type="date" v-model="currentDate_end" @cancel="onCancelChooseTime" @confirm="onSureChooseTime" />
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
  private showPopup: boolean = false
  private list: any[] = []

  // *******************时间选择****************************************************
  private end_time: string = ''
  private currentDate_end: Date = null
  private onCancelChooseTime(e: any) {
    this.showPopup = false
  }
  private onSureChooseTime(e: any) {
    this.showPopup = false
    this.end_time = moment(this.currentDate_end).format('LL')
    window.console.log('onSureChooseTime:', this.end_time)
  }
}
</script>
<style>
</style>
