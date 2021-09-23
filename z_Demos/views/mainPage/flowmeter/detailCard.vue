<template>
  <van-row style="border-radius:0.2rem;padding:0.8rem" @click="onChooseCard">
    <!-- *******左侧******************** -->
    <van-col :span="8" style="height:100%">
      <div style="color:red;font-size:1.5rem;height:60%">{{cardInfo.count}}</div>
      <div style="font-size:0.8rem;height:40%;color:#cdcdcd">{{cardInfo.danwei}}</div>
    </van-col>
    <!-- *********右侧********************************* -->
    <van-col :span="16" style="height:100%">
      <div style="color:black;font-size:1rem;font-weight:600;height:60%">{{cardInfo.desc}}</div>
      <div style="font-size:0.8rem;height:40%;color:#cdcdcd">{{cardInfo.time}}</div>
    </van-col>
  </van-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
@Component
export default class Index extends PageBase {
  @Prop({
    default: {
      count: 32156,
      time: '08-18 12:00:00',
      desc: '维保到期xxxxxxxxxxxx',
      danwei: '伏特'
    }
  })
  cardInfo: any

  @Emit('onChooseCard')
  private onChooseCard(e) {}
}
</script>
<style>
</style>
