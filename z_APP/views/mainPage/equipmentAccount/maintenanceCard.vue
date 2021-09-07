<template>
  <div>
    <van-row>
      <van-col>{{cardInfo.code}}</van-col>
      <van-col>状态:{{cardInfo.status}}</van-col>
      <van-col>结果:{{cardInfo.result}}</van-col>
    </van-row>
    <van-row>{{cardInfo.desc}}</van-row>
    <van-row>
      <van-col> {{cardInfo.startTime}}</van-col>
      <van-col> {{cardInfo.endTime}}</van-col>
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
