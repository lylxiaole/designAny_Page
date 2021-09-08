<template>
  <van-row style="border-radius:0.2rem;">
    <!-- *******左侧******************** -->
    <van-col :span="8">
      <div style="color:red;font-size:1.2rem">{{cardInfo.count}}</div>
      <div style="color:black;font-size:0.8rem">单位</div>
    </van-col>
    <!-- *********右侧********************************* -->
    <van-col :span="16">
      <div style="color:black;font-size:1rem;font-weight:500">{{cardInfo.desc}}</div>
      <div style="color:black;font-size:0.8rem">{{cardInfo.time}}</div>
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
      desc: '维保到期xxxxxxxxxxxx'
    }
  })
  cardInfo: any
}
</script>
<style>
</style>
