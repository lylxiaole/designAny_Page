<template>
  <div style="height:100%;width:100%">
    <van-row class="headerCom" :style="headerStyle()">
      <van-row style="height:40%;">
        <!-- needNavBack -->
        <van-col :span="12" style="height:100%;display:flex">
          <van-image round width="1.5rem" height="1.5rem" style="align-self:center;margin-left:1.5rem" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
        </van-col>
        <van-col :span="12" style="height:100%;display:flex">
          <span v-if="needNavBack()" style="align-self:center;flex:1;text-align:right;margin-right:1.2rem" @click="pageBackClick">返回</span>
        </van-col>
      </van-row>
      <van-row style="height:60%;box-sizing:border-box;padding-bottom:1rem">
        <van-col span="8" style="height:100%;border-right:1px solid #fff;padding-top:0.5rem">
          <div class="headerTitle">计量表</div>
          <div class="headerTitle" style="margin-top:0.3rem">{{flowmeterStatus.zgs}}</div>
        </van-col>
        <van-col span="8" style="height:100%;border-right:1px solid #fff;padding-top:0.5rem">
          <div class="headerTitle">正常</div>
          <div class="headerTitle" style="margin-top:0.3rem">{{flowmeterStatus.zcsl}}</div>
        </van-col>
        <van-col span="8" style="height:100%;padding-top:0.5rem">
          <div class="headerTitle">异常</div>
          <div class="headerTitle" style="margin-top:0.3rem">{{flowmeterStatus.zgs-flowmeterStatus.zcsl}}</div>
        </van-col>
      </van-row>
    </van-row>
    <div class="contentCom" :style="contentStyle()">
      <transition name="van-slide-top">
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </div>
    <van-tabbar class="bottomBar" :style="bottomBarStyle()" :value="activeItemIndex()" @change="onTabChange">
      <van-tabbar-item :icon="firstPageBarIcon_normal">首页</van-tabbar-item>
      <van-tabbar-item :icon="flowmeterBarIcon_normal">流量计</van-tabbar-item>
      <van-tabbar-item :icon="alarmInfoBarIcon_normal">报警信息</van-tabbar-item>
      <van-tabbar-item :icon="positionBarIcon_normal">位置</van-tabbar-item>
      <van-tabbar-item :icon="equipmentBarIcon_normal">设备台账</van-tabbar-item>
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
import { jkzl, jlbjk } from '../../serviceAPIs/service'
// *****************************************************************
const alarmInfoBarIcon_normal = require('../../assets/img/alarmInfoBarIcon.png')
const equipmentBarIcon_normal = require('../../assets/img/equipmentBarIcon.png')
const firstPageBarIcon_normal = require('../../assets/img/firstPageBarIcon.png')
const flowmeterBarIcon_normal = require('../../assets/img/flowmeterBarIcon.png')
const positionBarIcon_normal = require('../../assets/img/positionBarIcon.png')
// *****************************************************************

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
  private alarmInfoBarIcon_normal: any = alarmInfoBarIcon_normal
  private equipmentBarIcon_normal: any = equipmentBarIcon_normal
  private firstPageBarIcon_normal: any = firstPageBarIcon_normal
  private flowmeterBarIcon_normal: any = flowmeterBarIcon_normal
  private positionBarIcon_normal: any = positionBarIcon_normal
  // ********************************************************************************
  mounted() {
    this.getFlowmeterStatus()
  }
  // ***********计量表状态*******************************************************
  private flowmeterStatus: any = {}
  private async getFlowmeterStatus() {
    var formData = new FormData()
    formData.append('action', 'getJlbzthz')
    let res = await jlbjk(formData)
    this.flowmeterStatus = res[0]
  }
  // ***********************************************************************************
  private pageBackClick() {
    this.$router.back()
  }
  // ***************底部Tab*********************************************
  private needNavBack() {
    return this.$router.currentRoute.meta.needNavBack
  }
  private headerStyle() {
    return { height: '8rem' }
  }
  private contentStyle() {
    let needFooter = this.$router.currentRoute.meta.needFooter
    if (needFooter) {
      return { height: 'calc(100% - 13rem)' }
    } else {
      return { height: 'calc(100% - 8rem)' }
    }
  }
  private bottomBarStyle() {
    let needFooter = this.$router.currentRoute.meta.needFooter
    if (needFooter) {
      return { height: '5rem', display: 'flex' }
    } else {
      return { height: '0rem', display: 'none' }
    }
  }
  private activeItemIndex(): number {
    if (this.$router.currentRoute.path.indexOf('/index/firstPage') > -1) {
      return 0
    } else if (this.$router.currentRoute.path.indexOf('/index/flowmeter') > -1) {
      return 1
    } else if (this.$router.currentRoute.path.indexOf('/index/alarmInformation') > -1) {
      return 2
    } else if (this.$router.currentRoute.path.indexOf('/index/position') > -1) {
      return 3
    } else if (this.$router.currentRoute.path.indexOf('/index/equipmentAccount') > -1) {
      return 4
    }
  }
  private onTabChange(index: number) {
    switch (index) {
      case 0:
        this.$router.push({ path: '/index/firstPage' })
        break
      case 1:
        this.$router.push({ path: '/index/flowmeter' })
        break
      case 2:
        this.$router.push({ path: '/index/alarmInformation' })
        break
      case 3:
        this.$router.push({ path: '/index/position' })
        break
      case 4:
        this.$router.push({ path: '/index/equipmentAccount' })
        break
      default:
        break
    }
  }
}
</script>
<style scoped>
.headerCom {
  /* height: 8rem; */
  background-color: #738fff;
  color: white;
}
.contentCom {
  /* height: calc(100% - 13rem); */
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 0.5rem;
}
.bottomBar {
  /* height: 5rem; */
}

.headerTitle {
  text-align: center;
}
</style>
