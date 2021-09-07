<template>
  <div>
    <van-row style="margin-top:0.2rem">
      <van-col :span="8" style="text-align:left">{{cardInfo.code}}</van-col>
      <van-col :span="8" style="text-align:center">状态:{{cardInfo.status}}</van-col>
      <van-col :span="8" style="text-align:right">结果:{{cardInfo.result}}</van-col>
    </van-row>
    <van-row style="margin-top:0.2rem">{{cardInfo.desc}}</van-row>
    <van-row style="margin-top:0.2rem">
      <van-col :span="12" style="text-align:left">{{cardInfo.startTime}}</van-col>
      <van-col :span="12" style="text-align:right">{{cardInfo.endTime}} </van-col>
    </van-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
@Component
export default class maintenanceCard extends PageBase {
  @Prop({
    default: {
      code: 'HT-4009',
      status: '未开始',
      result: '已结束',
      desc: '维保到期xxxxxxxxxxxx',
      startTime: '08-18 12:00:00',
      endTime: '08-19 12:00:00'
    }
  })
  cardInfo: any
}
</script>
<style>
</style>
