<template>
  <div style="height:100%;width:100%">
    <van-row class="headerCom">
      <van-row style="height:40%">
        <van-image round width="1.5rem" height="1.5rem" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
      </van-row>
      <van-row style="height:60%">
        <van-col span="8" style="height:100%">
          <div class="headerTitle">计量表</div>
          <div class="headerTitle" style="margin-top:1rem">{{302}}</div>
        </van-col>
        <van-col span="8" style="height:100%">
          <div class="headerTitle">正常</div>
          <div class="headerTitle" style="margin-top:1rem">{{302}}</div>
        </van-col>
        <van-col span="8" style="height:100%">
          <div class="headerTitle">异常</div>
          <div class="headerTitle" style="margin-top:1rem">{{302}}</div>
        </van-col>
      </van-row>
    </van-row>
    <div class="contentCom">
      <firstPage v-show="active===0" />
      <flowmeter v-show="active===1" />
      <alarmInformation v-show="active===2" />
      <position v-show="active===3" />
      <equipmentAccount v-show="active===4" />
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
  private onTabChange(index: number) {}
}
</script>
<style scoped>
.headerCom {
  height: 8rem;
}
.bottomBar {
  height: 5rem;
}
.contentCom {
  height: calc(100% - 13rem);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0.5rem;
}

.headerTitle {
  text-align: center;
}
</style>
