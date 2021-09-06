<template>
  <div style="height:100%;width:100%">
    <!-- <van-nav-bar title="标题" :left-arrow="showLeftArrow" @click-left="onClickLeft" /> -->
    <div class="contentCom">
      <firstPage v-show="active===0" />
      <flowmeter v-show="active===1" />
      <position v-show="active===2" />
      <equipmentAccount v-show="active===3" />
      <alarmInformation v-show="active===4" />
    </div>
    <van-tabbar class="bottomBar" v-model="active" @change="onTabChange">
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

  private onClickLeft() {
    this.$router.back()
  }
  // ***************底部Tab*********************************************
  private active: number = 0
  private onTabChange(index: number) {
    window.console.log('onTabChange:', this.active)
  }
}
</script>
<style scoped>
.contentCom {
  height: calc(100% - 8rem);
}
.bottomBar {
  height: 8rem;
}
</style>
