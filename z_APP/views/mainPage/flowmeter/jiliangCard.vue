<template>
  <van-row>
    <!-- *******左侧******************** -->
    <van-col :span="6" style="background-color:red;height:100%">
      <van-row>
        <span>FT3007</span>
      </van-row>
      <van-row>
      </van-row>
    </van-col>
    <!-- *********右侧********************************* -->
    <van-col :span="18">
      <van-row>
        <span>温度:{{cardInfo.temp}}</span>
      </van-row>
      <van-row>
        <span>瞬间流量:{{cardInfo.instantaneousFlow}}</span>
      </van-row>
      <van-row>
        <span>密度:{{cardInfo.density}}</span>
      </van-row>
      <van-row>
        <span>累计流量:{{cardInfo.cumulativeFlow}}</span>
      </van-row>
    </van-col>
  </van-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
@Component
export default class Index extends PageBase {
  @Prop({ default: {} })
  cardInfo: any
}
</script>
<style>
</style>
