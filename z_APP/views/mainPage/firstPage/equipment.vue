<template>
  <div>
    <van-row style="font-size:1rem;font-weight:500;color:#000000">
      <span>{{cardInfo.type}}数量:{{cardInfo.count}}条</span>
    </van-row>
    <van-row style="font-size:0.8rem;font-weight:400;color:#808080;margin-top:0.4rem">
      <span>原因表明处{{cardInfo.desc}}</span>
    </van-row>
    <van-row style="font-size:1.2rem;font-weight:600;color:#EF3131;margin-top:0.4rem">
      <span>{{cardInfo.timeLength}}</span>
    </van-row>
    <van-row style="font-size:0.8rem;font-weight:400;color:#808080;margin-top:0.4rem">
      <span>状态:{{cardInfo.status}}</span>
    </van-row>
    <van-row style="font-size:0.8rem;font-weight:400;color:#484848;margin-top:0.4rem">
      <span>{{cardInfo.type}}结果:{{cardInfo.result}}</span>
    </van-row>
    <van-row style="font-size:0.8rem;font-weight:400;color:#808080;margin-top:0.4rem">
      <span>时间:{{cardInfo.time}}</span>
    </van-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
@Component
export default class Index extends PageBase {
  @Prop({
    default: {
      type: '维保',
      count: 20,
      desc: '维保到期',
      timeLength: '300分钟',
      status: '未开始',
      result: '已结束',
      time: '2021-08-19 12:00:00'
    }
  })
  cardInfo: any
}
</script>
<style>
</style>
