<template>
  <van-cell-group>
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
        <van-field label="温度:" :value="cardInfo.temp" readonly />
        <van-field label="瞬间流量:" :value="cardInfo.instantaneousFlow" readonly />
        <van-field label="密度:" :value="cardInfo.density" readonly />
        <van-field label="累计流量:" :value="cumulativeFlow" readonly />
      </van-col>
    </van-row>
  </van-cell-group>
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
