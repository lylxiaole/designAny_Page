<template>
  <van-row style="border-radius:0.2rem;">
    <!-- *******左侧******************** -->
    <van-col :span="6"
      style="background-color:red;height:100%;color:white;padding:0.3rem 0.4rem;border-top-left-radius: 0.2rem 0.2rem;border-bottom-left-radius: 0.2rem 0.2rem;">
      <van-row style="height:40%">
        <div class="middleAlign" style="height:100%;width:100%">FT3007</div>
      </van-row>
      <van-row style="height:60%">
        <van-image round width="100%" height="100%" :src="cardIcon" fit="scale-down" />
      </van-row>
    </van-col>
    <!-- *********右侧********************************* -->
    <van-col :span="18" style="padding:0.3rem 0.4rem;color:#808080;">
      <van-row style="position:relative">
        <span style="float:left">温度:</span>
        <span style="float:right">{{cardInfo.temp}}</span>
      </van-row>
      <van-row style="margin-top:0.2rem;position:relative">
        <span style="float:left">瞬间流量:</span>
        <span style="float:right">{{cardInfo.instantaneousFlow}}</span>
      </van-row>
      <van-row style="margin-top:0.2rem;position:relative">
        <span style="float:left">密度:</span>
        <span style="float:right">{{cardInfo.density}}</span>
      </van-row>
      <van-row style="margin-top:0.2rem;position:relative">
        <span style="float:left">累计流量:</span>
        <span style="float:right">{{cardInfo.cumulativeFlow}}</span>
      </van-row>
    </van-col>
  </van-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
@Component
export default class Index extends PageBase {
  private cardIcon: any = require('../../../assets/img/liuliangji.png')

  @Prop({ default: {} })
  cardInfo: any
}
</script>
<style>
</style>
