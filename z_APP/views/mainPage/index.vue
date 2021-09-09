<template>
  <div style="height:100%;width:100%">
    <van-row class="headerCom" :style="headerStyle">
      <van-row style="height:40%;">
        <!-- needNavBack -->
        <van-col :span="12" style="height:100%;display:flex">
          <van-image round width="1.5rem" height="1.5rem" style="align-self:center;margin-left:1.5rem" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
        </van-col>
        <van-col :span="12" style="height:100%;display:flex">
          <span v-if="needNavBack" style="align-self:center;flex:1;text-align:right;margin-right:1.2rem" @click="pageBackClick">返回</span>
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
    <div class="contentCom" :style="contentStyle">
      <transition name="van-slide-top">
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </div>
    <van-tabbar class="bottomBar" :style="bottomBarStyle" :value="activeItemIndex" @change="onTabChange">
      <van-tabbar-item>
        <template #icon="props">
          <img v-show="props.active" :src="firstPageBarIcon_solid" />
          <img v-show="!props.active" :src="firstPageBarIcon_normal" />
        </template>
        <span>首页</span>
      </van-tabbar-item>

      <van-tabbar-item>
        <template #icon="props">
          <img v-show="props.active" :src="flowmeterBarIcon_solid" />
          <img v-show="!props.active" :src="flowmeterBarIcon_normal" />
        </template>
        <span>流量计</span>
      </van-tabbar-item>

      <van-tabbar-item>
        <template #icon="props">
          <img v-show="props.active" :src="alarmInfoBarIcon_solid" />
          <img v-show="!props.active" :src="alarmInfoBarIcon_normal" />
        </template>
        <span>报警信息</span>
      </van-tabbar-item>

      <van-tabbar-item>
        <template #icon="props">
          <img v-show="props.active" :src="positionBarIcon_solid" />
          <img v-show="!props.active" :src="positionBarIcon_normal" />
        </template>
        <span>位置</span>
      </van-tabbar-item>

      <van-tabbar-item>
        <template #icon="props">
          <img v-show="props.active" :src="equipmentBarIcon_solid" />
          <img v-show="!props.active" :src="equipmentBarIcon_normal" />
        </template>
        <span>设备台账</span>
      </van-tabbar-item>

    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk } from '../../serviceAPIs/service'
import { Route } from 'vue-router'
// *****************************************************************
const alarmInfoBarIcon_normal = require('../../assets/img/alarmInfoBarIcon.png')
const equipmentBarIcon_normal = require('../../assets/img/equipmentBarIcon.png')
const firstPageBarIcon_normal = require('../../assets/img/firstPageBarIcon.png')
const flowmeterBarIcon_normal = require('../../assets/img/flowmeterBarIcon.png')
const positionBarIcon_normal = require('../../assets/img/positionBarIcon.png')

const alarmInfoBarIcon_solid = require('../../assets/img/alarmInfoBarIconSolid.png')
const equipmentBarIcon_solid = require('../../assets/img/equipmentBarIconSolid.png')
const firstPageBarIcon_solid = require('../../assets/img/firstPageBarIconSolid.png')
const flowmeterBarIcon_solid = require('../../assets/img/flowmeterBarIconSolid.png')
const positionBarIcon_solid = require('../../assets/img/positionBarIconSolid.png')
// *****************************************************************

@Component
export default class Index extends PageBase {
  private alarmInfoBarIcon_normal: any = alarmInfoBarIcon_normal
  private equipmentBarIcon_normal: any = equipmentBarIcon_normal
  private firstPageBarIcon_normal: any = firstPageBarIcon_normal
  private flowmeterBarIcon_normal: any = flowmeterBarIcon_normal
  private positionBarIcon_normal: any = positionBarIcon_normal

  private alarmInfoBarIcon_solid: any = alarmInfoBarIcon_solid
  private equipmentBarIcon_solid: any = equipmentBarIcon_solid
  private firstPageBarIcon_solid: any = firstPageBarIcon_solid
  private flowmeterBarIcon_solid: any = flowmeterBarIcon_solid
  private positionBarIcon_solid: any = positionBarIcon_solid
  // ********************************************************************************
  mounted() {
    this.currentRoute = this.$router.currentRoute
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
  private currentRoute: Route = null
  @Watch('$route')
  private watchRouteChanged(newval: Route, oldval: Route) {
    this.currentRoute = newval
  }

  private get needNavBack() {
    if (!this.currentRoute) {
      return true
    }
    return this.currentRoute.meta.needNavBack
  }
  private get headerStyle() {
    return { height: '8rem' }
  }
  private get contentStyle() {
    if (!this.currentRoute) {
      return {}
    }
    let needFooter = this.currentRoute.meta.needFooter
    if (needFooter) {
      return { height: 'calc(100% - 13rem)' }
    } else {
      return { height: 'calc(100% - 8rem)' }
    }
  }
  private get bottomBarStyle() {
    if (!this.currentRoute) {
      return {}
    }
    let needFooter = this.currentRoute.meta.needFooter
    if (needFooter) {
      return { height: '5rem', display: 'flex' }
    } else {
      return { height: '0rem', display: 'none' }
    }
  }
  private get activeItemIndex(): number {
    if (!this.currentRoute) {
      return 0
    }
    if (this.currentRoute.path.indexOf('/index/firstPage') > -1) {
      return 0
    } else if (this.currentRoute.path.indexOf('/index/flowmeter') > -1) {
      return 1
    } else if (this.currentRoute.path.indexOf('/index/alarmInformation') > -1) {
      return 2
    } else if (this.currentRoute.path.indexOf('/index/position') > -1) {
      return 3
    } else if (this.currentRoute.path.indexOf('/index/equipmentAccount') > -1) {
      return 4
    }
  }

  private get firstPageBarIcon(): any {
    window.console.log('firstPageBarIcon:', this.activeItemIndex)
    if (this.activeItemIndex === 0) {
      return firstPageBarIcon_solid
    } else {
      return firstPageBarIcon_normal
    }
  }
  private get flowmeterBarIcon(): any {
    if (this.activeItemIndex === 1) {
      return flowmeterBarIcon_solid
    } else {
      return flowmeterBarIcon_normal
    }
  }
  private get alarmInfoBarIcon(): any {
    if (this.activeItemIndex === 2) {
      return alarmInfoBarIcon_solid
    } else {
      return alarmInfoBarIcon_normal
    }
  }
  private get positionBarIcon(): any {
    if (this.activeItemIndex === 3) {
      return positionBarIcon_solid
    } else {
      return positionBarIcon_normal
    }
  }
  private get equipmentBarIcon(): any {
    if (this.activeItemIndex === 4) {
      return equipmentBarIcon_solid
    } else {
      return equipmentBarIcon_normal
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
