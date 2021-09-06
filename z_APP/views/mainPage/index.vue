<template>
  <div>
    <!-- <van-nav-bar title="标题" :left-arrow="showLeftArrow" @click-left="onClickLeft" /> -->
    <div>
      <firstPage />
      <flowmeter />
      <position />
      <equipmentAccount />
      <alarmInformation />
    </div>
    <van-tabbar v-model="active" @change="onTabChange">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">流量计</van-tabbar-item>
      <van-tabbar-item icon="friends-o">报警信息</van-tabbar-item>
      <van-tabbar-item icon="setting-o">位置</van-tabbar-item>
      <van-tabbar-item icon="setting-o">设备台账</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import firstPage from './firstPage/index.vue'
import flowmeter from './flowmeter/index.vue'
import position from './position/index.vue'
import equipmentAccount from './equipmentAccount/index.vue'
import alarmInformation from './alarmInformation/index.vue'
import PageBase from '@src/views/PageBase'

@Component({
  components: {
    firstPage: firstPage,
    flowmeter: flowmeter,
    position: position,
    equipmentAccount: equipmentAccount,
    alarmInformation: alarmInformation
  }
})
export default class Index extends PageBase {
  private get showLeftArrow() {
    return true
  }

  private active: string = null
  private onClickLeft() {
    this.$router.back()
  }
  private onTabChange(index: number) {
    window.console.log('onTabChange:', index)
  }
}
</script>
<style>
</style>
