<template>
  <div>
    <van-row style="height:1.2rem">
      <van-col :span="12" style="text-align:left;height:100%">{{cardInfo.code}}</van-col>
      <van-col :span="12" style="text-align:right;height:100%"> {{cardInfo.time}}</van-col>
    </van-row>
    <van-row style="height:1.2rem;margin-top:0.2rem;color:#313131">{{cardInfo.desc}}</van-row>
    <van-row>
      <van-col style="text-align:left;margin-top:0.2rem;height:1.2rem">时长: {{cardInfo.timeLength}}</van-col>
    </van-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
@Component
export default class alarmInfoCard extends PageBase {
  @Prop({
    default: {
      code: 'HT-4009',
      time: '08-18 12:00:00',
      desc: '维保到期xxxxxxxxxxxx',
      timeLength: '3小时'
    }
  })
  cardInfo: any
}
</script>
<style>
</style>
